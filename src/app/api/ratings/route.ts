import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deliveryId, customerId, gwalaId, score, comment } = body;

    if (!deliveryId || !customerId || !gwalaId || !score) {
      return NextResponse.json({ success: false, error: "Missing rating data" }, { status: 400 });
    }

    if (score < 1 || score > 5) {
      return NextResponse.json({ success: false, error: "Score must be between 1 and 5 stars" }, { status: 400 });
    }

    // 1. Check if delivery exists and is delivered
    const delivery = await prisma.deliveryRecord.findUnique({
      where: { id: deliveryId },
      include: { deliveryRating: true },
    });

    if (!delivery || delivery.status !== "delivered") {
      return NextResponse.json({ success: false, error: "Rating is only allowed for delivered orders" }, { status: 400 });
    }

    if (delivery.deliveryRating) {
      return NextResponse.json({ success: false, error: "This delivery has already been rated" }, { status: 400 });
    }

    // 2. Create rating record
    const rating = await prisma.deliveryRating.create({
      data: {
        deliveryId,
        customerId,
        gwalaId,
        score: parseInt(score, 10),
        comment: comment || null,
      },
    });

    // 3. Recalculate Gwala Average Rating
    const allRatings = await prisma.deliveryRating.findMany({
      where: { gwalaId },
    });

    const totalCount = allRatings.length;
    const avgScore = allRatings.reduce((acc, curr) => acc + curr.score, 0) / totalCount;

    // Check if average drops below 3.0 to trigger quality flag
    const qualityStatus = avgScore < 3.0 ? "flagged_low_rating" : "normal";

    await prisma.gwalaProfile.update({
      where: { userId: gwalaId },
      data: {
        ratingAverage: Math.round(avgScore * 10) / 10,
        ratingCount: totalCount,
        qualityStatus,
      },
    });

    // If quality flagged, create Admin notification
    if (qualityStatus === "flagged_low_rating") {
      await prisma.marketplaceNotification.create({
        data: {
          recipientId: "admin",
          recipientType: "admin",
          kind: "quality_flag",
          title: "Gwala Quality Flag Triggered",
          body: `Vendor rating average dropped to ${avgScore.toFixed(1)}. Automated review required.`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your rating!",
      rating,
      newAverage: Math.round(avgScore * 10) / 10,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to submit rating" }, { status: 500 });
  }
}
