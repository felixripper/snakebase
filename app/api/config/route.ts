import { NextResponse } from "next/server";

type SimpleConfig = {
  backgroundColor: string;
  snakeColor: string;
  foodColor: string;
  snakeSpeed: number;
  pointsPerFood: number;
  interfaceTitle: string;
};

const DEFAULT_SIMPLE_CONFIG: SimpleConfig = {
  backgroundColor: "#0052FF",
  snakeColor: "#dfb4b4",
  foodColor: "#e1ff00",
  snakeSpeed: 6,
  pointsPerFood: 30,
  interfaceTitle: "Eat & Grow",
};

const KEY = "game_config_v1";

// In-memory fallback when Redis is not available
let memoryStore: SimpleConfig | null = null;

function hasUpstash(): boolean {
  return Boolean(process.env.UPSTASH_REST_URL && process.env.UPSTASH_REST_TOKEN);
}

function env() {
  const url = process.env.UPSTASH_REST_URL;
  const token = process.env.UPSTASH_REST_TOKEN;
  if (!url || !token) {
    throw new Error("Missing UPSTASH_REST_URL or UPSTASH_REST_TOKEN");
  }
  return { url, token };
}

type UpstashResponse = { result: unknown; error?: string };

async function upstashPipeline(cmds: string[][]): Promise<UpstashResponse[]> {
  const { url, token } = env();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstash error: ${res.status} ${text}`);
  }
  return (await res.json()) as UpstashResponse[];
}

function getErrorMessage(error: unknown, fallback = "Internal Server Error") {
  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }
  if (typeof error === "string" && error) {
    return error;
  }
  return fallback;
}

function validateConfig(input: Partial<SimpleConfig>): { ok: true; value: SimpleConfig } | { ok: false; message: string } {
  const colorRe = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  const cfg: SimpleConfig = { ...DEFAULT_SIMPLE_CONFIG, ...input };

  if (!colorRe.test(cfg.backgroundColor)) return { ok: false, message: "Invalid backgroundColor" };
  if (!colorRe.test(cfg.snakeColor)) return { ok: false, message: "Invalid snakeColor" };
  if (!colorRe.test(cfg.foodColor)) return { ok: false, message: "Invalid foodColor" };

  if (!Number.isFinite(cfg.snakeSpeed) || cfg.snakeSpeed < 1 || cfg.snakeSpeed > 30) {
    return { ok: false, message: "snakeSpeed must be between 1 and 30" };
  }
  if (!Number.isFinite(cfg.pointsPerFood) || cfg.pointsPerFood < 1 || cfg.pointsPerFood > 5000) {
    return { ok: false, message: "pointsPerFood must be between 1 and 5000" };
  }
  cfg.interfaceTitle = String(cfg.interfaceTitle ?? "").slice(0, 40) || DEFAULT_SIMPLE_CONFIG.interfaceTitle;

  return { ok: true, value: cfg };
}

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
      if (memoryStore) {
        value = memoryStore;
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
      memoryStore = v.value;
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
