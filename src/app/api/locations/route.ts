import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      where: { isActive: true },
      include: {
        serviceAreas: {
          where: { isActive: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, cities });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
