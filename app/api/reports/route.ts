import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { ReportType } from "@prisma/client";
export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isAdmin = session.user.role === "ADMIN";

    const reports = await prisma.report.findMany({
      where: isAdmin ? {} : { userId: session.user.id }, // 👈 fetch all if admin
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
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${randomUUID()}-${imageFile.name}`;
      const filepath = path.join(process.cwd(), "public", "uploads", filename);

      await writeFile(filepath, buffer);

      imageUrl = `/uploads/${filename}`;
    }

    const report = await prisma.report.create({
      data: {
        title,
        description,
        type: type as ReportType,
        location,
        image: imageUrl,
        reportId: `RPT-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: session.user.id, // ✅ always associate with user
        anonymous, // ✅ flag to hide identity
      },
    });
    

    return NextResponse.json({
      success: true,
      reportId: report.reportId,
    });
  } catch (error) {
    console.error("Report POST Error:", error);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}