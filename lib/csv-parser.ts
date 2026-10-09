import { TrafficFlow } from "./type";

export interface ParsedDatasetResult {
  fileName: string;
  totalRows: number;
  validFlows: number;
  flows: TrafficFlow[];
  primaryFlow: TrafficFlow;
  summary: {
    totalPackets: number;
    totalBytes: number;
    dominantProtocol: string;
    targetPorts: number[];
  };
}

const COLUMN_ALIASES: Record<keyof TrafficFlow, string[]> = {
  duration: ["duration", "dur", "flow_duration", "flow duration", "duration_sec", "dur_sec"],
  protocol: ["protocol", "proto", "ip_proto", "pr"],
  source_port: ["source_port", "sport", "src_port", "srcport", "sourceport", "src port"],
  direction: ["direction", "dir", "flow_direction"],
  destination_port: ["destination_port", "dport", "dst_port", "dstport", "destinationport", "dst port"],
  connection_state: ["connection_state", "state", "conn_state", "state_"],
  source_tos: ["source_tos", "stos", "src_tos", "srctos"],
  destination_tos: ["destination_tos", "dtos", "dst_tos", "dsttos"],
  total_packets: ["total_packets", "totpkts", "tot_pkts", "total_pkts", "packets", "pkts", "total packets"],
  total_bytes: ["total_bytes", "totbytes", "tot_bytes", "total_bytes", "bytes", "total bytes"],
  source_bytes: ["source_bytes", "srcbytes", "src_bytes", "source_bytes", "sbytes", "source bytes"],
};

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim().replace(/^"(.*)"$/, "$1"));
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"(.*)"$/, "$1"));
  return result;
}

export function parseCsvText(csvText: string, fileName = "Uploaded_Traffic.csv"): ParsedDatasetResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new Error("CSV file must contain at least a header row and one data row.");
  }

  const rawHeaders = parseCsvLine(lines[0]);
  const headerMap = new Map<keyof TrafficFlow, number>();

  rawHeaders.forEach((rawCol, idx) => {
    const cleanCol = normalizeHeader(rawCol);
    for (const [key, aliases] of Object.entries(COLUMN_ALIASES) as [keyof TrafficFlow, string[]][]) {
      if (aliases.some((alias) => normalizeHeader(alias) === cleanCol)) {
        if (!headerMap.has(key)) {
          headerMap.set(key, idx);
        }
      }
    }
  });

  const flows: TrafficFlow[] = [];
  let totalPacketsSum = 0;
  let totalBytesSum = 0;
  const protocolCounts = new Map<string, number>();
  const portSet = new Set<number>();

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length <= 1) continue;

    const getValue = (key: keyof TrafficFlow): string | undefined => {
      const idx = headerMap.get(key);
      if (idx !== undefined && idx < values.length) {
        return values[idx];
      }
      return undefined;
    };

    const numVal = (key: keyof TrafficFlow, defaultVal = 0): number => {
      const raw = getValue(key);
      if (!raw) return defaultVal;
      const parsed = parseFloat(raw);
      return isNaN(parsed) ? defaultVal : parsed;
    };

    const rawSPort = getValue("source_port") ?? "1024";
    const rawDPort = getValue("destination_port") ?? "80";
    const proto = (getValue("protocol") ?? "tcp").toLowerCase();
    const dir = getValue("direction") ?? "->";
    const state = getValue("connection_state") ?? "CON";
    const dur = numVal("duration", 0.0);
    const totPkts = Math.max(1, Math.round(numVal("total_packets", 1)));
    const totBytes = Math.max(0, Math.round(numVal("total_bytes", 0)));
    const srcBytes = Math.max(0, Math.round(numVal("source_bytes", 0)));
    const sTos = numVal("source_tos", 0);
    const dTos = numVal("destination_tos", 0);

    const flow: TrafficFlow = {
      duration: dur,
      protocol: proto,
      source_port: rawSPort,
      direction: dir,
      destination_port: rawDPort,
      connection_state: state,
      source_tos: sTos,
      destination_tos: dTos,
      total_packets: totPkts,
      total_bytes: totBytes,
      source_bytes: srcBytes,
    };

    flows.push(flow);
    totalPacketsSum += totPkts;
    totalBytesSum += totBytes;
    protocolCounts.set(proto, (protocolCounts.get(proto) ?? 0) + 1);

    const dportNum = parseInt(rawDPort.toString(), 10);
    if (!isNaN(dportNum)) portSet.add(dportNum);
  }

  if (flows.length === 0) {
    throw new Error("No valid traffic flows could be extracted from this CSV.");
  }

  // Find dominant protocol
  let dominantProto = "tcp";
  let maxProtoCount = 0;
  for (const [proto, count] of protocolCounts.entries()) {
    if (count > maxProtoCount) {
      maxProtoCount = count;
      dominantProto = proto;
    }
  }

  // Choose the primary flow (highest packet count or first flow)
  const primaryFlow = [...flows].sort((a, b) => (b.total_packets ?? 0) - (a.total_packets ?? 0))[0] ?? flows[0];

  return {
    fileName,
    totalRows: lines.length - 1,
    validFlows: flows.length,
    flows,
    primaryFlow,
    summary: {
      totalPackets: totalPacketsSum,
      totalBytes: totalBytesSum,
      dominantProtocol: dominantProto.toUpperCase(),
      targetPorts: Array.from(portSet).slice(0, 5),
    },
  };
}

export async function parseCsvFile(file: File): Promise<ParsedDatasetResult> {
  const text = await file.text();
  return parseCsvText(text, file.name);
}
