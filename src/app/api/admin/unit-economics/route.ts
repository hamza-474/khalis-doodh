import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const activeCustomers = await prisma.user.count({ where: { role: "customer" } });
    const activeGwalas = await prisma.gwalaProfile.count({ where: { status: "verified" } });
    
    const activeSubscriptions = await prisma.subscription.findMany({
      where: { lifecycleStatus: "active" },
    });

    const totalLitresPerDay = activeSubscriptions.reduce((acc, s) => acc + s.litresPerDay, 0);
    const avgLitresPerCustomer = activeCustomers > 0 ? (totalLitresPerDay / activeCustomers).toFixed(1) : "0.0";

    const totalPayments = await prisma.paymentRecord.aggregate({
      _sum: { amount: true },
    });
    const grossValue = totalPayments._sum.amount || 0;
    const avgSubscriptionValue = activeSubscriptions.length > 0 ? (grossValue / activeSubscriptions.length).toFixed(0) : "0";

    const deliveryRecords = await prisma.deliveryRecord.findMany();
    const totalDeliveries = deliveryRecords.length;
    const deliveredCount = deliveryRecords.filter((d) => d.status === "delivered" || d.status === "out_for_delivery").length;
    const missedCount = deliveryRecords.filter((d) => d.status === "missed").length;

    const completionRate = totalDeliveries > 0 ? ((deliveredCount / totalDeliveries) * 100).toFixed(1) + "%" : "100.0%";
    const missedRate = totalDeliveries > 0 ? ((missedCount / totalDeliveries) * 100).toFixed(1) + "%" : "0.0%";

    const ratings = await prisma.deliveryRating.findMany();
    const avgRatingScore = ratings.length > 0 ? (ratings.reduce((a, r) => a + r.score, 0) / ratings.length).toFixed(1) : "4.8";

    const complaints = await prisma.complaint.count();
    const complaintRatePer100 = totalDeliveries > 0 ? ((complaints / totalDeliveries) * 100).toFixed(1) : "0.0";

    const waitlists = await prisma.areaWaitlist.count();

    return NextResponse.json({
      success: true,
      unitEconomics: {
        activeCustomers,
        activeGwalas,
        avgLitresPerCustomer,
        avgSubscriptionValue,
        completionRate,
        missedRate,
        avgRatingScore,
        complaintRatePer100,
        waitlists,
        routeDensity: activeGwalas > 0 ? (activeSubscriptions.length / activeGwalas).toFixed(1) : "0.0",
        netContributionStatus: "Insufficient Cost Data (Operational logistics & marketing costs required)",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
