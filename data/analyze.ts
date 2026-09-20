import { DemoDatasetTag, type DemoDataset, type ManualField } from "@/lib/type";

export const demoDatasets: DemoDataset[] = [
  { name: "Mirai Botnet Traffic (.csv)", detail: "SYN Flood / C2 Telnet Brute-force, 4,280 frames", tag: DemoDatasetTag.Attack, icon: "!" },
  { name: "Normal HTTP Browsing (.csv)", detail: "Dual-stack TLS 1.3 / HTTP/2 web egress, 8,912 frames", tag: DemoDatasetTag.Benign, icon: "o" },
  { name: "Mixed Flow Test Batch (.csv)", detail: "Simulated DNS tunnel infiltration + CDN cache hits", tag: DemoDatasetTag.Hybrid, icon: "+" },
];

export const schemaPreview = [
  ["Duration", "float ≥ 0"], ["Protocol", "string ≤ 20 chars"], ["Source / destination port", "string | number"],
  ["Direction", "string ≤ 10 chars"], ["Connection state", "string ≤ 20 chars"], ["Packet and byte counts", "float ≥ 0"],
] as const;

export const manualFields: ManualField[] = [
  { key: "duration", label: "Duration", inputMode: "decimal", placeholder: "0.0", type: "number" },
  { key: "protocol", label: "Protocol", inputMode: "text", placeholder: "tcp" },
  { key: "source_port", label: "Source port", inputMode: "numeric", placeholder: "443" },
  { key: "direction", label: "Direction", inputMode: "text", placeholder: "outbound" },
  { key: "destination_port", label: "Destination port", inputMode: "numeric", placeholder: "80" },
  { key: "connection_state", label: "Connection state", inputMode: "text", placeholder: "SF" },
  { key: "source_tos", label: "Source ToS", inputMode: "decimal", placeholder: "0", type: "number" },
  { key: "destination_tos", label: "Destination ToS", inputMode: "decimal", placeholder: "0", type: "number" },
  { key: "total_packets", label: "Total packets", inputMode: "decimal", placeholder: "0", type: "number" },
  { key: "total_bytes", label: "Total bytes", inputMode: "decimal", placeholder: "0", type: "number" },
  { key: "source_bytes", label: "Source bytes", inputMode: "decimal", placeholder: "0", type: "number" },
];
