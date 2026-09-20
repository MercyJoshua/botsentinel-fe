export const confidenceRows = [
  ["Flow Duration", "12,345 µs (+38% anomaly)", "Mean Normal: 8,940 µs", "High persistence C2 beacon", "orange"],
  ["Packet Length Mean", "421.5 B (+45% botnet correlation)", "Standard Human Web Mean: 780.2 B", "Uniform payload signature", "orange"],
  ["Total Backward Packets", "8 pkts (Asymmetric SYN scan)", "Normal Session: 42 pkts", "Near-zero ACKs received", "amber"],
  ["Destination Port", "Port 80 / TCP (Targeted web endpoint)", "Protocol: Plaintext HTTP", "Targeted Denial vector", "teal"],
] as const;

export const comparisonRows = [["Inter-Arrival Time", "2.1 ms", "142.8 ms", "1.9 ms"], ["SYN-to-ACK Ratio", "18.4 : 1", "1.02 : 1", "19.1 : 1"], ["Entropy (Shannon)", "3.12", "7.84", "3.05"], ["User-Agent Jitter", "0.00 (static)", "High Random", "0.00"]] as const;
