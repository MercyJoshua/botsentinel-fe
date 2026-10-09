export const overviewMetrics = [
  { label: "TRAFFIC ANALYSED", value: "300,000+", detail: "CTU-13 NetFlow Benchmark", icon: "◱", tone: "positive" },
  { label: "BOTNET DETECTED", value: "41,509", detail: "Held-out Scenario 9 Eval", icon: "△", tone: "orange", alert: true },
  { label: "DETECTION RATE", value: "97.2%", detail: "Botnet Recall: 97%", icon: "%", progress: true },
  { label: "MODEL ACCURACY", value: "98.0%", detail: "F1-Score: 0.99 · ROC-AUC 0.9997", icon: "♧", tone: "positive" },
] as const;

export const recentAnalyses = [
  ["CTU13-Flow #09-4102", "Port 6667 · Neris IRC C&C Channel", "Botnet (99.2%)", "alert"],
  ["CTU13-Flow #10-8914", "Port 80 · Rbot TCP SYN Probe", "Botnet (98.4%)", "alert"],
  ["CTU13-Flow #13-2201", "Port 443 · Normal HTTPS Session", "Normal (99.5%)", "normal"],
  ["CTU13-Flow #09-3120", "Port 53 · Background DNS Lookup", "Normal (98.9%)", "normal"],
  ["CTU13-Flow #05-1108", "Port 80 · Virut HTTP C&C Beacon", "Botnet (96.8%)", "alert"],
] as const;

export const threatVectors = [
  ["44%", "Neris (IRC / C&C)"],
  ["28%", "Rbot (TCP Scans)"],
  ["18%", "Virut (HTTP C&C)"],
  ["10%", "Menti / Sogou C2"],
] as const;
