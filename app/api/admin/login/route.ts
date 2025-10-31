import { NextResponse } from "next/server";
import { getAppRouterSession } from "@/lib/session";

// Admin password - in production, this should be an environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "snakebase2024";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Create admin session
    const session = await getAppRouterSession();

    session.isLoggedIn = true;
    session.isAdmin = true;
    session.username = "Admin";

    await session.save();

    return NextResponse.json({
      success: true,
      message: "Login successful"
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}