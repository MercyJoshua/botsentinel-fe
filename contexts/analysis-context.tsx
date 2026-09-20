"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { predictTraffic } from "@/lib/api";
import { PredictionLabel, type AnalysisRecord, type PredictionResponse, type TrafficFlow } from "@/lib/type";

export const PRESET_FLOWS: Record<string, { label: string; flow: TrafficFlow; expectedVerdict: PredictionLabel }> = {
  mirai_botnet: {
    label: "Mirai Botnet SYN-Flood (Port 80)",
    expectedVerdict: PredictionLabel.Botnet,
    flow: {
      duration: 0.042,
      protocol: "tcp",
      source_port: 54128,
      direction: "outbound",
      destination_port: 80,
      connection_state: "SF",
      source_tos: 0,
      destination_tos: 0,
      total_packets: 4280,
      total_bytes: 285400,
      source_bytes: 285400,
    },
  },
  benign_tls: {
    label: "Legitimate User HTTPS Session (Port 443)",
    expectedVerdict: PredictionLabel.NonBotnet,
    flow: {
      duration: 14.85,
      protocol: "tcp",
      source_port: 52190,
      direction: "inbound",
      destination_port: 443,
      connection_state: "SF",
      source_tos: 0,
      destination_tos: 0,
      total_packets: 84,
      total_bytes: 42100,
      source_bytes: 18400,
    },
  },
  dns_tunnel: {
    label: "Anomalous DNS Exfiltration Probe (Port 53)",
    expectedVerdict: PredictionLabel.Botnet,
    flow: {
      duration: 0.12,
      protocol: "udp",
      source_port: 49152,
      direction: "outbound",
      destination_port: 53,
      connection_state: "OTH",
      source_tos: 0,
      destination_tos: 0,
      total_packets: 1940,
      total_bytes: 165000,
      source_bytes: 165000,
    },
  },
};

const DEFAULT_RECORD: AnalysisRecord = {
  id: "BS-2026-001284",
  flowName: "Mirai Botnet SYN-Flood (Port 80)",
  flow: PRESET_FLOWS.mirai_botnet.flow,
  result: {
    prediction: PredictionLabel.Botnet,
    is_botnet: true,
    botnet_probability: 0.947,
    confidence: 0.947,
  },
  timestamp: "Oct 24, 2026 · 14:32:08 UTC",
  latencyMs: 14.2,
};

interface AnalysisContextType {
  activeRecord: AnalysisRecord;
  isAnalyzing: boolean;
  error: string | null;
  runAnalysis: (flow: TrafficFlow, flowName?: string) => Promise<AnalysisRecord>;
  loadPreset: (key: keyof typeof PRESET_FLOWS) => Promise<AnalysisRecord>;
  resetToDefault: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | null>(null);

const STORAGE_KEY = "botsentinel_active_analysis";

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [activeRecord, setActiveRecord] = useState<AnalysisRecord>(DEFAULT_RECORD);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AnalysisRecord;
        if (parsed?.id && parsed?.result) {
          setActiveRecord(parsed);
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }, []);

  const saveRecord = (record: AnalysisRecord) => {
    setActiveRecord(record);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Storage error safeguard
    }
  };

  const runAnalysis = async (flow: TrafficFlow, flowName?: string): Promise<AnalysisRecord> => {
    setIsAnalyzing(true);
    setError(null);
    const startTime = performance.now();

    try {
      const result = await predictTraffic(flow);
      const latencyMs = Math.max(1, Math.round((performance.now() - startTime) * 10) / 10);
      const recordId = `BS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const newRecord: AnalysisRecord = {
        id: recordId,
        flowName: flowName ?? `Custom Flow (${flow.protocol?.toUpperCase() ?? "TCP"}:${flow.destination_port ?? "80"})`,
        flow,
        result,
        timestamp: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        }).format(new Date()) + " UTC",
        latencyMs,
      };

      saveRecord(newRecord);
      return newRecord;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Inference analysis failed.";
      setError(msg);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPreset = async (key: keyof typeof PRESET_FLOWS): Promise<AnalysisRecord> => {
    const preset = PRESET_FLOWS[key];
    if (!preset) return activeRecord;
    return runAnalysis(preset.flow, preset.label);
  };

  const resetToDefault = () => {
    saveRecord(DEFAULT_RECORD);
    setError(null);
  };

  return (
    <AnalysisContext.Provider
      value={{
        activeRecord,
        isAnalyzing,
        error,
        runAnalysis,
        loadPreset,
        resetToDefault,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
