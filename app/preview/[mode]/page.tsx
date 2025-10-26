"use client";

import { useEffect, useMemo } from "react";

export default function PreviewRouter({
  params,
  searchParams,
}: {
  params: { mode: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const draft = useMemo(() => {
    const v = searchParams?.draft;
    if (Array.isArray(v)) return v[0] === "true" || v[0] === "1";
    return v === "true" || v === "1";
  }, [searchParams]);

  const targetUrl = useMemo(() => {
    const m = params.mode;
    switch (m) {
      case "game":
        return `/eat-grow.html${draft ? "?draft=1" : ""}`;
      case "leaderboard":
        return "/leaderboard";
      case "profile":
        return "/profile";
      case "registration":
        return "/register";
      default:
        return "/";
    }
  }, [params.mode, draft]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace(targetUrl);
    }
  }, [targetUrl]);

  return (
    <div style={{
      display: "grid",
      placeItems: "center",
      height: "100vh",
      color: "#666",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      fontSize: 14,
    }}>
      Önizleme yükleniyor...
    </div>
  );
}
