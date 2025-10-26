import { NextResponse } from "next/server";
import {
  getFullConfig,
  saveFullConfig,
  getErrorMessage,
  validateFullConfig,
  type FullGameConfig,
} from "@/lib/config-store";

export async function GET() {
  try {
    const value = await getFullConfig();
    return NextResponse.json(value, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<FullGameConfig>;
    const v = validateFullConfig(body);
    if (!v.ok) {
      return NextResponse.json({ error: v.message }, { status: 400 });
    }

    await saveFullConfig(v.value);
    return NextResponse.json(v.value, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

// POST alias for PUT (admin panel compatibility)
export async function POST(request: Request) {
  return PUT(request);
}
