import { DemoDatasetTag, type DemoDataset, type ManualField } from "@/lib/type";

export const demoDatasets: DemoDataset[] = [
  {
    name: "CTU-13 Scenario 10: Rbot DDoS Flood",
    detail: "High-volume ICMP/UDP flood anomaly with zero inter-arrival variation",
    tag: DemoDatasetTag.Attack,
    icon: "!",
  },
  {
    name: "CTU-13 Scenario 9: Botnet C&C Probe (Port 53)",
    detail: "Anomalous beaconing bursts and high-entropy DNS command probes",
    tag: DemoDatasetTag.Attack,
    icon: "!",
  },
  {
    name: "CTU-13 Scenario 13: Normal User Web Session",
    detail: "Legitimate campus egress, verified normal TLS/DNS background traffic",
    tag: DemoDatasetTag.Benign,
    icon: "o",
  },
];

export const schemaPreview = [
  ["duration", "Dur (seconds float ≥ 0)"],
  ["protocol", "Proto (tcp, udp, icmp)"],
  ["source_port / destination_port", "Sport / Dport (int or hex 0x...)"],
  ["direction", "Dir (->, <-, <->, ?>)"],
  ["connection_state", "State (CON, S_, FSA_FSA, etc.)"],
  ["packet & byte counts", "TotPkts, TotBytes, SrcBytes"],
] as const;

export const manualFields: ManualField[] = [
  { key: "duration", label: "Duration (Dur)", inputMode: "decimal", placeholder: "14.85", type: "number" },
  { key: "protocol", label: "Protocol (Proto)", inputMode: "text", placeholder: "tcp" },
  { key: "source_port", label: "Source Port (Sport)", inputMode: "numeric", placeholder: "52190" },
  { key: "direction", label: "Direction (Dir)", inputMode: "text", placeholder: "->" },
  { key: "destination_port", label: "Destination Port (Dport)", inputMode: "numeric", placeholder: "443" },
  { key: "connection_state", label: "State (CON / S_ / FSA)", inputMode: "text", placeholder: "CON" },
  { key: "source_tos", label: "Source ToS (sTos)", inputMode: "decimal", placeholder: "0", type: "number" },
  { key: "destination_tos", label: "Destination ToS (dTos)", inputMode: "decimal", placeholder: "0", type: "number" },
  { key: "total_packets", label: "Total Packets (TotPkts)", inputMode: "decimal", placeholder: "84", type: "number" },
  { key: "total_bytes", label: "Total Bytes (TotBytes)", inputMode: "decimal", placeholder: "42100", type: "number" },
  { key: "source_bytes", label: "Source Bytes (SrcBytes)", inputMode: "decimal", placeholder: "18400", type: "number" },
];
