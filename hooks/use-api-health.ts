"use client";

import { useEffect, useState, useCallback } from "react";
import { checkApiHealth } from "@/lib/api";
import type { ApiHealth } from "@/lib/type";

export function useApiHealth() {
  const [health, setHealth] = useState<ApiHealth>({
    status: "checking",
    latencyMs: null,
    model: "SentinelML-v2.4",
  });

  const check = useCallback(async () => {
    try {
      const res = await checkApiHealth();
      setHealth(res);
    } catch {
      setHealth({
        status: "offline",
        latencyMs: null,
        model: "SentinelML (Offline)",
      });
    }
  }, []);

  useEffect(() => {
    check();
    // Poll every 30 seconds
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [check]);

  return { ...health, refresh: check };
}
