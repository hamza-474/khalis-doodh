import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const area = searchParams.get("area");

    if (!city || !area) {
      return NextResponse.json(
        { success: false, error: "City and area parameters are required" },
        { status: 400 }
      );
    }

    // Only query verified gwalas matching exact city and primary area or active service area link
    const gwalas = await prisma.gwalaProfile.findMany({
      where: {
        status: "verified",
        city: { equals: city },
        primaryArea: { equals: area },
      },
      include: {
        user: {
          select: { name: true, preferredLanguage: true },
        },
      },
      orderBy: [{ featured: "desc" }, { ratingAverage: "desc" }],
    });

    return NextResponse.json({ success: true, gwalas });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch gwalas" },
      { status: 500 }
    );
  }
}
