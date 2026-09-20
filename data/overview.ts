export const overviewMetrics = [
  { label: "TRAFFIC ANALYSED", value: "12,481", detail: "↗ +18.4% 24h trend", icon: "◱", tone: "positive" },
  { label: "BOTNET DETECTED", value: "1,284", detail: "● +42.5% spike detected", icon: "△", tone: "orange", alert: true },
  { label: "DETECTION RATE", value: "10.3%", icon: "%", progress: true },
  { label: "AVG. CONFIDENCE", value: "94.7%", detail: "High Certainty", icon: "♧", tone: "positive" },
] as const;

export const recentAnalyses = [
  ["Flow #05-8941", "Port 443 · TLS Session", "Normal (98.2%)", "normal"],
  ["Flow #05-8940", "Port 80 · SYN Flooding", "Botnet (91.7%)", "alert"],
  ["Flow #05-8939", "Port 8080 · API Proxy", "Normal (96.4%)", "normal"],
  ["Flow #05-8938", "Port 53 · DNS Tunneling", "Botnet (95.1%)", "alert"],
  ["Flow #05-8937", "Port 443 · Static Asset", "Normal (99.0%)", "normal"],
] as const;

export const threatVectors = [["41%", "Mirai-like"], ["28%", "HTTP Slowloris"], ["19%", "C2 Beacons"], ["12%", "Brute-Force"]] as const;
