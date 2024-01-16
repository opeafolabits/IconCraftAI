import User from "@/models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  const { name, email } = await request.json();

  await User.create({ name, email });
  return NextResponse.json({ message: "User registered" }, { status: 200 });
}
