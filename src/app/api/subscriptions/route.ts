import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      gwalaId,
      city,
      area,
      addressLine,
      landmark,
      mapLatitude,
      mapLongitude,
      plan,
      litresPerDay,
      deliveryDays,
      startDate,
      paymentMethod,
    } = body;

    // Server-side validation
    if (!customerId || !gwalaId || !city || !area || !addressLine) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (!litresPerDay || litresPerDay < 1 || litresPerDay > 20) {
      return NextResponse.json({ success: false, error: "Invalid litres per day (1-20L)" }, { status: 400 });
    }

    if (!Array.isArray(deliveryDays) || deliveryDays.length === 0) {
      return NextResponse.json({ success: false, error: "Select at least one delivery day" }, { status: 400 });
    }

    // 1. Re-validate verified gwala and price from server DB
    const gwala = await prisma.gwalaProfile.findUnique({
      where: { userId: gwalaId },
    });

    if (!gwala || gwala.status !== "verified") {
      return NextResponse.json({ success: false, error: "Selected gwala is not verified or unavailable" }, { status: 400 });
    }

    // 2. Server-side price calculation
    const pricePerLitre = gwala.price;
    const daysInMonth = plan === "monthly" ? 30 : 7;
    const totalLitres = litresPerDay * (plan === "monthly" ? (deliveryDays.length / 7) * 30 : deliveryDays.length);
    const estimatedTotal = Math.round(totalLitres * pricePerLitre);

    // 3. Create Subscription
    const subscription = await prisma.subscription.create({
      data: {
        customerId,
        gwalaId,
        city,
        area,
        addressLine,
        landmark: landmark || null,
        mapLatitude: mapLatitude ? parseFloat(mapLatitude) : null,
        mapLongitude: mapLongitude ? parseFloat(mapLongitude) : null,
        plan,
        litresPerDay: parseInt(litresPerDay, 10),
        deliveryDays: JSON.stringify(deliveryDays),
        startDate: new Date(startDate || Date.now()),
        pricing: pricePerLitre,
        paymentMethod,
        paymentStatus: "pending",
        lifecycleStatus: "active",
      },
    });

    // 4. Create initial delivery record for today/start date
    await prisma.deliveryRecord.create({
      data: {
        subscriptionId: subscription.id,
        date: new Date(startDate || Date.now()),
        status: "scheduled",
        notes: `Scheduled ${litresPerDay}L delivery`,
      },
    });

    // 5. Create Payment Record with Receipt Code
    const receiptCode = `KD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const payment = await prisma.paymentRecord.create({
      data: {
        subscriptionId: subscription.id,
        amount: estimatedTotal,
        method: paymentMethod,
        status: "pending",
        receiptCode,
      },
    });

    // 6. Create Gwala Notification
    await prisma.marketplaceNotification.create({
      data: {
        recipientId: gwalaId,
        recipientType: "gwala",
        kind: "new_subscription",
        title: "New Subscription Request",
        body: `New request for ${litresPerDay}L/day in ${area}, ${city}. Receipt: ${receiptCode}`,
      },
    });

    return NextResponse.json({
      success: true,
      subscription,
      payment,
      receiptCode,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to create subscription" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json({ success: false, error: "Customer ID required" }, { status: 400 });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { customerId },
      include: {
        gwalaProfile: {
          select: { displayName: true, phone: true, ratingAverage: true },
        },
        deliveryRecords: {
          orderBy: { date: "desc" },
          take: 5,
        },
        paymentRecords: {
          orderBy: { receiptCode: "desc" },
          take: 5,
        },
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({ success: true, subscriptions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, action, cancelReason } = body;

    if (!subscriptionId || !action) {
      return NextResponse.json({ success: false, error: "Subscription ID and action required" }, { status: 400 });
    }

    let updated;
    if (action === "pause") {
      updated = await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { lifecycleStatus: "paused" },
      });
    } else if (action === "resume") {
      updated = await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { lifecycleStatus: "active" },
      });
    } else if (action === "cancel") {
      updated = await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { lifecycleStatus: "cancelled", cancelReason: cancelReason || "Customer requested cancellation" },
      });
    }

    return NextResponse.json({ success: true, subscription: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to update subscription" }, { status: 500 });
  }
}
