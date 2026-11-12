import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereCondition = status ? { status } : {};

    const gwalas = await prisma.gwalaProfile.findMany({
      where: whereCondition,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        gwalaDocuments: true,
      },
      orderBy: { userId: "desc" },
    });

    return NextResponse.json({ success: true, gwalas });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to fetch gwalas" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { gwalaId, action, notes, featured } = body;

    if (!gwalaId || !action) {
      return NextResponse.json({ success: false, error: "Gwala ID and action required" }, { status: 400 });
    }

    let updated;
    if (action === "approve") {
      updated = await prisma.gwalaProfile.update({
        where: { userId: gwalaId },
        data: { status: "verified", notes: notes || "Approved by administrator" },
      });
      // Link default service area if needed
      const serviceArea = await prisma.serviceArea.findFirst({
        where: { name: updated.primaryArea },
      });
      if (serviceArea) {
        await prisma.gwalaServiceArea.upsert({
          where: { id: `${gwalaId}_${serviceArea.id}` },
          create: {
            id: `${gwalaId}_${serviceArea.id}`,
            gwalaId: updated.userId,
            serviceAreaId: serviceArea.id,
            city: updated.city,
            area: updated.primaryArea,
            slots: 20,
            isActive: true,
          },
          update: { isActive: true },
        });
      }
    } else if (action === "reject") {
      updated = await prisma.gwalaProfile.update({
        where: { userId: gwalaId },
        data: { status: "rejected", notes: notes || "Rejected during document review" },
      });
    } else if (action === "suspend") {
      updated = await prisma.gwalaProfile.update({
        where: { userId: gwalaId },
        data: { status: "suspended", notes: notes || "Suspended due to policy violation or low quality" },
      });
    } else if (action === "toggle_featured") {
      updated = await prisma.gwalaProfile.update({
        where: { userId: gwalaId },
        data: { featured: Boolean(featured) },
      });
    }

    return NextResponse.json({ success: true, gwala: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to update gwala" }, { status: 500 });
  }
}
