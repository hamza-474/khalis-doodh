import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, area, contactDetails, consent } = body;

    if (!city || !area || !contactDetails) {
      return NextResponse.json({ success: false, error: "City, area, and contact details required" }, { status: 400 });
    }

    const waitlist = await prisma.areaWaitlist.create({
      data: {
        city,
        area,
        contactDetails,
        consent: consent !== undefined ? Boolean(consent) : true,
      },
    });

    // Notify admin about new area demand
    await prisma.marketplaceNotification.create({
      data: {
        recipientId: "admin",
        recipientType: "admin",
        kind: "waitlist_demand",
        title: "New Area Demand Request",
        body: `Demand requested for ${area}, ${city} (${contactDetails}).`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! We have added your request to our route expansion waitlist.",
      waitlist,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to submit waitlist" }, { status: 500 });
  }
}
