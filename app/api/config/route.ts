import { NextResponse } from "next/server";
import {
  DEFAULT_SIMPLE_CONFIG,
  KEY,
  getMemoryStore,
  setMemoryStore,
  hasUpstash,
  upstashPipeline,
  getErrorMessage,
  validateConfig,
  type SimpleConfig,
} from "@/lib/config-store";

export async function GET() {
  try {
    let value: SimpleConfig = DEFAULT_SIMPLE_CONFIG;

    if (hasUpstash()) {
      try {
        const [getResp] = await upstashPipeline([["GET", KEY]]);
        const raw = (getResp?.result ?? null) as string | null;
        if (raw) {
          const parsed = JSON.parse(raw);
          const v = validateConfig(parsed);
          if (v.ok) value = v.value;
        }
      } catch {
        // ignore and serve defaults
      }
    } else {
      // Use in-memory storage
      const stored = getMemoryStore();
      if (stored) {
        value = stored;
      }
    }

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
    const body = (await request.json().catch(() => ({}))) as Partial<SimpleConfig>;
    const v = validateConfig(body);
    if (!v.ok) {
      return NextResponse.json({ error: v.message }, { status: 400 });
    }

    if (hasUpstash()) {
      const value = JSON.stringify(v.value);
      const [setResp] = await upstashPipeline([["SET", KEY, value]]);
      if (setResp?.error) {
        throw new Error(setResp.error);
      }
    } else {
      // Store in memory
      setMemoryStore(v.value);
    }

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
