import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET handler
export async function GET(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const reportId = context?.params?.reportId;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let report;

    if (session.user.role === "ADMIN") {
      report = await prisma.report.findUnique({
        where: { reportId },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      });
    } else {
      report = await prisma.report.findFirst({
        where: {
          reportId,
          userId: session.user.id,
        },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      });
    }

    if (!report) {
      return NextResponse.json(
        { error: "Report not found or not accessible" },
        { status: 404 }
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("GET /reportId error:", error);
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}

// POST handler
export async function POST(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const reportId = context?.params?.reportId;

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await req.json();

    const report = await prisma.report.findUnique({
      where: { reportId },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const updated = await prisma.report.update({
      where: { reportId },
      data: { status },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /reportId error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
