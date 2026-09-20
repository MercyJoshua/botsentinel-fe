export enum AnalysisMode {
  Upload = "upload",
  Manual = "manual",
}

export enum DemoDatasetTag {
  Attack = "ATTACK",
  Benign = "BENIGN",
  Hybrid = "HYBRID",
}

export enum PredictionLabel {
  Botnet = "Botnet",
  NonBotnet = "Non-Botnet",
}

export enum Theme {
  Light = "light",
  Dark = "dark",
}

/** Mirrors the TrafficFlow Pydantic schema accepted by POST /predict. */
export interface TrafficFlow {
  duration?: number;
  protocol?: string;
  source_port?: string | number;
  direction?: string;
  destination_port?: string | number;
  connection_state?: string;
  source_tos?: number;
  destination_tos?: number;
  total_packets?: number;
  total_bytes?: number;
  source_bytes?: number;
}

/** Mirrors the PredictionResponse Pydantic schema returned by POST /predict. */
export interface PredictionResponse {
  prediction: PredictionLabel;
  is_botnet: boolean;
  botnet_probability: number;
  confidence: number;
}

export interface ApiErrorResponse {
  detail?: string;
}

export interface DemoDataset {
  name: string;
  detail: string;
  tag: DemoDatasetTag;
  icon: string;
}

export interface ManualField {
  key: keyof TrafficFlow;
  label: string;
  inputMode?: "decimal" | "numeric" | "text";
  placeholder: string;
  type?: "number" | "text";
}

export interface AnalysisRecord {
  id: string;
  flowName: string;
  flow: TrafficFlow;
  result: PredictionResponse;
  timestamp: string;
  latencyMs: number;
}

export interface ApiHealth {
  status: "online" | "offline" | "checking";
  latencyMs: number | null;
  model: string;
}

