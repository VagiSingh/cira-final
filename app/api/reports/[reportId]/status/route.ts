import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Handler for GET request - Fetch report by reportId
export async function GET({ params }: { params: { reportId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const report = await prisma.report.findUnique({
      where: { reportId: params.reportId },
      include: { user: true },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error: unknown) {
    // Type assertion for the error variable
    if (error instanceof Error) {
      console.error("Error fetching report:", error.message);
      return NextResponse.json({ error: "Failed to fetch report", details: error.message }, { status: 500 });
    }
    // If the error is not an instance of Error, log a generic message
    console.error("Unknown error:", error);
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}

// Handler for POST request - Update report status
export async function POST(req: Request, { params }: { params: { reportId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();

  try {
    // Check if the report exists
    const reportExists = await prisma.report.findUnique({
      where: { reportId: params.reportId },
    });

    if (!reportExists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Update the report's status
    const updated = await prisma.report.update({
      where: { reportId: params.reportId },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    // Type assertion for the error variable
    if (error instanceof Error) {
      console.error("Error updating report status:", error.message);
      return NextResponse.json({ error: "Failed to update status", details: error.message }, { status: 500 });
    }
    // If the error is not an instance of Error, log a generic message
    console.error("Unknown error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}