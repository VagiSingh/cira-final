

// app/api/sos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { latitude, longitude } = await req.json();

  try {
    await prisma.sOSAlert.create({
      data: {
        latitude,
        longitude,
        location: `Lat: ${latitude}, Long: ${longitude}`, // required field
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SOS POST error:", error);
    return NextResponse.json({ error: "Failed to save SOS alert" }, { status: 500 });
  }
}


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const alerts = await prisma.sOSAlert.findMany({
      where: {
        createdAt: {
          gte: fifteenMinutesAgo,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    console.log("Fetched SOS Alerts:", alerts);  // Check if you get multiple alerts here
    return NextResponse.json(alerts);
  } catch (error) {
    console.error("SOS GET error:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}
