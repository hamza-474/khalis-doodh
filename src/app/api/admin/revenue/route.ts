import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let config = await prisma.revenueConfig.findFirst();
    if (!config) {
      config = await prisma.revenueConfig.create({
        data: {
          commissionRate: 5.0,
          customerServiceFee: 50.0,
          gwalaPlanPrice: 1500.0,
          deliveryConvenienceFee: 30.0,
        },
      });
    }

    // Real financial calculation formulas
    const totalPayments = await prisma.paymentRecord.aggregate({
      _sum: { amount: true },
    });
    const grossMilkValue = totalPayments._sum.amount || 0;

    const activeSubscriptions = await prisma.subscription.count({
      where: { lifecycleStatus: "active" },
    });

    const verifiedGwalas = await prisma.gwalaProfile.count({
      where: { status: "verified" },
    });

    const platformCommission = (grossMilkValue * config.commissionRate) / 100;
    const customerServiceFees = activeSubscriptions * config.customerServiceFee;
    const vendorPlanRevenue = verifiedGwalas * config.gwalaPlanPrice;
    const grossRevenue = platformCommission + customerServiceFees + vendorPlanRevenue;

    return NextResponse.json({
      success: true,
      config,
      metrics: {
        grossMilkValue,
        platformCommission,
        customerServiceFees,
        vendorPlanRevenue,
        grossRevenue,
        activeSubscriptions,
        verifiedGwalas,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { commissionRate, customerServiceFee, gwalaPlanPrice, deliveryConvenienceFee } = body;

    let config = await prisma.revenueConfig.findFirst();
    if (!config) {
      config = await prisma.revenueConfig.create({
        data: { commissionRate, customerServiceFee, gwalaPlanPrice, deliveryConvenienceFee },
      });
    } else {
      config = await prisma.revenueConfig.update({
        where: { id: config.id },
        data: {
          ...(commissionRate !== undefined && { commissionRate }),
          ...(customerServiceFee !== undefined && { customerServiceFee }),
          ...(gwalaPlanPrice !== undefined && { gwalaPlanPrice }),
          ...(deliveryConvenienceFee !== undefined && { deliveryConvenienceFee }),
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        actorId: "admin",
        action: "UPDATE_REVENUE_CONFIG",
        entityType: "revenue_config",
        entityId: config.id,
        details: `Commission: ${config.commissionRate}%, Customer Fee: PKR ${config.customerServiceFee}, Gwala Plan: PKR ${config.gwalaPlanPrice}`,
      },
    });

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
