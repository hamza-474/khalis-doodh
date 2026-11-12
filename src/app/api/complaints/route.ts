import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, gwalaId, deliveryId, category, severity, details } = body;

    if (!customerId || !gwalaId || !category || !details) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const complaint = await prisma.complaint.create({
      data: {
        customerId,
        gwalaId,
        deliveryId: deliveryId || null,
        category,
        severity: severity || "standard",
        details,
        status: "open",
      },
    });

    if (severity === "serious") {
      await prisma.marketplaceNotification.create({
        data: {
          recipientId: "admin",
          recipientType: "admin",
          kind: "serious_complaint",
          title: "SERIOUS COMPLAINT FILED",
          body: `Serious complaint in category '${category}' filed against vendor ${gwalaId}. Immediate review required.`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Complaint filed successfully. Our support team will review this shortly.",
      complaint,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to file complaint" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        customer: { select: { name: true, phone: true } },
        gwalaProfile: { select: { displayName: true } },
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ success: true, complaints });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to fetch complaints" }, { status: 500 });
  }
}
