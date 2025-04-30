import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { randomUUID } from "crypto";
import { ReportType } from "@prisma/client";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isAdmin = session.user.role === "ADMIN";

    const reports = await prisma.report.findMany({
      where: isAdmin ? {} : { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reportId: true,
        title: true,
        status: true,
        type: true,
        description: true,
        location: true,
        createdAt: true,
        anonymous: true,
        image: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const transformedReports = reports.map((report) => ({
      ...report,
      imageUrl: report.image,
    }));

    return NextResponse.json(transformedReports);
  } catch (error) {
    console.error("GET /api/reports error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;
    const location = formData.get("location") as string;
    const anonymous = formData.get("anonymous") === "true";
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${randomUUID()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("report-images") // Corrected bucket name
        .upload(fileName, buffer, {
          contentType: imageFile.type,
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage.from("report-images").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const report = await prisma.report.create({
      data: {
        title,
        description,
        type: type as ReportType,
        location,
        image: imageUrl,
        reportId: `RPT-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: session.user.id,
        anonymous,
      },
    });

    return NextResponse.json({
      success: true,
      reportId: report.reportId,
    });
  } catch (error) {
    console.error("Report POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
