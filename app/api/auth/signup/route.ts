
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password, confirmPassword, role = "STUDENT" } = await req.json();

  // Validation checks
  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        name,
        email,
        password: hashedPassword,
        role
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;// eslint-disable-line @typescript-eslint/no-unused-vars

    return NextResponse.json(
      { success: true, user: userWithoutPassword },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error instanceof Error ? error.message : error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}