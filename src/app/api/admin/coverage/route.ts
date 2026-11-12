import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      include: {
        serviceAreas: true,
      },
      orderBy: { name: "asc" },
    });

    const waitlists = await prisma.areaWaitlist.findMany({
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json({ success: true, cities, waitlists });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to fetch coverage" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, cityName, areaName, cityId } = body;

    if (type === "add_city" && cityName) {
      const city = await prisma.city.create({
        data: {
          name: cityName,
          province: "Punjab",
          isActive: true,
        },
      });
      return NextResponse.json({ success: true, city });
    }

    if (type === "add_area" && areaName && cityId) {
      const area = await prisma.serviceArea.create({
        data: {
          cityId,
          name: areaName,
          isActive: true,
        },
      });
      return NextResponse.json({ success: true, area });
    }

    return NextResponse.json({ success: false, error: "Invalid type or parameters" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to modify coverage" }, { status: 500 });
  }
}
