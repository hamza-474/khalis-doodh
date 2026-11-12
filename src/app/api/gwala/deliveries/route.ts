import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gwalaId = searchParams.get("gwalaId");

    if (!gwalaId) {
      return NextResponse.json({ success: false, error: "Gwala ID required" }, { status: 400 });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { gwalaId, lifecycleStatus: "active" },
      include: {
        customer: { select: { name: true, phone: true } },
        deliveryRecords: {
          orderBy: { date: "desc" },
          take: 3,
        },
      },
    });

    return NextResponse.json({ success: true, subscriptions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to fetch gwala deliveries" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { deliveryId, status, proofStorageKey, notes } = body;

    if (!deliveryId || !status) {
      return NextResponse.json({ success: false, error: "Delivery ID and status required" }, { status: 400 });
    }

    const updateData: any = { status };
    if (status === "out_for_delivery") {
      updateData.outForDelivery = new Date();
    } else if (status === "delivered") {
      updateData.deliveredAt = new Date();
    }
    if (proofStorageKey) updateData.proofStorageKey = proofStorageKey;
    if (notes) updateData.notes = notes;

    const delivery = await prisma.deliveryRecord.update({
      where: { id: deliveryId },
      data: updateData,
      include: {
        subscription: true
      }
    });

    if (status === "missed") {
      // Notify customer about missed delivery and offer credit
      await prisma.marketplaceNotification.create({
        data: {
          recipientId: delivery.subscription.customerId,
          recipientType: "customer",
          kind: "delivery_missed",
          title: "Delivery Missed",
          body: `Your delivery for today was marked as missed by the gwala. A credit has been automatically applied to your account.`,
        }
      });
    }

    return NextResponse.json({ success: true, delivery });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to update delivery status" }, { status: 500 });
  }
}
