import { NextResponse } from "next/server";
import { getAppRouterSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getAppRouterSession();

    if (!session.isLoggedIn || !session.isAdmin) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      username: session.username
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("Admin check error:", error);
    return NextResponse.json(
      { error: "Oturum kontrolü başarısız" },
      { status: 500 }
    );
  }
}