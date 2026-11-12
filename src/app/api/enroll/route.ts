import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      cnic,
      city,
      primaryArea,
      routeDetails,
      price,
      cnicFilename,
      areaProofFilename,
    } = body;

    if (!name || !phone || !cnic || !city || !primaryArea || !price) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // SHA-256 hash for CNIC duplicate prevention
    const cnicClean = cnic.replace(/\D/g, "");
    const cnicHash = crypto.createHash("sha256").update(cnicClean).digest("hex");

    // [SAFEGUARD]: Rate Limit Signup Attempts
    // Implementation: In production, use Upstash Redis or memory-cache to rate limit by IP
    // e.g., await redis.incr(ip); if (count > 5) throw RateLimitError;

    // Check duplicate CNIC
    const existingCnic = await prisma.gwalaProfile.findUnique({
      where: { cnicHash },
    });

    if (existingCnic) {
      return NextResponse.json(
        { success: false, error: "A vendor application with this CNIC already exists." },
        { status: 400 }
      );
    }

    // Check duplicate Phone
    const existingPhone = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: "An account with this phone number already exists." },
        { status: 400 }
      );
    }

    // Masked CNIC for display
    const maskedCnic = cnicClean.length >= 13 
      ? `${cnicClean.slice(0, 5)}-*****${cnicClean.slice(10, 12)}-${cnicClean.slice(12)}`
      : cnicClean;

    // 1. Create User with role 'gwala'
    const user = await prisma.user.create({
      data: {
        name,
        email: email || `${phone}@gwala.khalisdoodh.pk`,
        phone,
        role: "gwala",
        preferredLanguage: "ur",
      },
    });

    // 2. Create Gwala Profile (Pending status)
    const gwalaProfile = await prisma.gwalaProfile.create({
      data: {
        userId: user.id,
        displayName: `${name} Dairy`,
        phone,
        cnicHash,
        maskedCnic,
        city,
        primaryArea,
        routeDetails: routeDetails || "Local area route",
        price: parseFloat(price),
        status: "pending", // ALWAYS pending until admin verification
        qualityStatus: "normal",
      },
    });

    // 3. Persist document metadata
    if (cnicFilename) {
      await prisma.gwalaDocument.create({
        data: {
          gwalaId: user.id,
          type: "cnic",
          storageKey: `docs/${user.id}/cnic_${Date.now()}_${cnicFilename}`,
          filename: cnicFilename,
          mimeType: "application/pdf",
          size: 1024 * 350,
        },
      });
    }

    if (areaProofFilename) {
      await prisma.gwalaDocument.create({
        data: {
          gwalaId: user.id,
          type: "area_proof",
          storageKey: `docs/${user.id}/area_${Date.now()}_${areaProofFilename}`,
          filename: areaProofFilename,
          mimeType: "image/jpeg",
          size: 1024 * 500,
        },
      });
    }

    // 4. Notify admin
    await prisma.marketplaceNotification.create({
      data: {
        recipientId: "admin",
        recipientType: "admin",
        kind: "gwala_enrollment",
        title: "New Gwala Enrollment",
        body: `${name} (${phone}) enrolled in ${primaryArea}, ${city}. Pending document review.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! Our team will verify your documents within 24-48 hours.",
      gwalaId: user.id,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to process enrollment" }, { status: 500 });
  }
}
