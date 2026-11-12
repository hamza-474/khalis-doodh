import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get("severity");

    const where: any = {};
    if (severity) {
      where.severity = severity;
    }

    const riskCases = await prisma.riskCase.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, riskCases, auditLogs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { riskType, severity, evidenceSummary, internalNotes, owner, affectedVendorId } = body;

    if (!riskType || !evidenceSummary) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const riskCase = await prisma.riskCase.create({
      data: {
        riskType,
        severity: severity || "medium",
        evidenceSummary,
        internalNotes,
        owner: owner || "admin_ops",
        affectedVendorId,
        status: "open",
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: "admin",
        action: "CREATE_RISK_CASE",
        entityType: "risk_case",
        entityId: riskCase.id,
        details: `Created risk case type: ${riskType}, severity: ${severity || "medium"}`,
      },
    });

    return NextResponse.json({ success: true, riskCase });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { riskId, status, resolution, internalNotes } = body;

    if (!riskId) {
      return NextResponse.json({ success: false, error: "Missing riskId" }, { status: 400 });
    }

    const updated = await prisma.riskCase.update({
      where: { id: riskId },
      data: {
        ...(status && { status }),
        ...(resolution && { resolution, reviewedAt: new Date() }),
        ...(internalNotes && { internalNotes }),
      },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        actorId: "admin",
        action: "UPDATE_RISK_CASE",
        entityType: "risk_case",
        entityId: riskId,
        details: `Updated risk case status to ${status || "unchanged"}, resolution: ${resolution || "N/A"}`,
      },
    });

    return NextResponse.json({ success: true, riskCase: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
