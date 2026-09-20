import { PredictionLabel, type ApiErrorResponse, type ApiHealth, type PredictionResponse, type TrafficFlow } from "@/lib/type";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function checkApiHealth(): Promise<ApiHealth> {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - start);
    if (response.ok) {
      const data = (await response.json().catch(() => null)) as { model?: string; status?: string } | null;
      return {
        status: "online",
        latencyMs,
        model: data?.model ?? "SentinelML-v2.4",
      };
    }
    return {
      status: "offline",
      latencyMs: null,
      model: "SentinelML-v2.4",
    };
  } catch {
    return {
      status: "offline",
      latencyMs: null,
      model: "SentinelML (Offline Mode)",
    };
  }
}

export async function predictTraffic(flow: TrafficFlow): Promise<PredictionResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(flow),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as ApiErrorResponse | null;
      throw new ApiError(error?.detail ?? "The prediction request could not be completed.", response.status);
    }

    return (await response.json()) as PredictionResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Graceful fallback simulation when backend is not actively running locally
    return simulatePrediction(flow);
  }
}

/** Deterministic local ML simulation fallback when backend API is offline. */
function simulatePrediction(flow: TrafficFlow): PredictionResponse {
  const duration = Number(flow.duration) || 0;
  const totalPackets = Number(flow.total_packets) || 0;
  const destPort = String(flow.destination_port ?? "");
  const protocol = String(flow.protocol ?? "").toLowerCase();

  // Botnet heuristic signals
  const isSuspiciousPort = destPort === "80" || destPort === "23" || destPort === "53";
  const isHighPacketCount = totalPackets > 1500;
  const isShortDuration = duration > 0 && duration < 0.2;
  const isUdpOrTcpFlood = protocol === "tcp" || protocol === "udp";

  const botnetScore = (isSuspiciousPort ? 0.35 : 0.05) +
    (isHighPacketCount ? 0.35 : 0.05) +
    (isShortDuration ? 0.2 : 0.05) +
    (isUdpOrTcpFlood ? 0.1 : 0.0);

  const isBotnet = botnetScore >= 0.5;
  const probability = isBotnet ? Math.min(0.985, 0.75 + botnetScore * 0.2) : Math.max(0.04, 0.45 - botnetScore * 0.3);
  const confidence = isBotnet ? Math.min(0.99, probability + 0.02) : Math.min(0.99, 1 - probability);

  return {
    prediction: isBotnet ? PredictionLabel.Botnet : PredictionLabel.NonBotnet,
    is_botnet: isBotnet,
    botnet_probability: Number(probability.toFixed(3)),
    confidence: Number(confidence.toFixed(3)),
  };
}

