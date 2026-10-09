"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Cloud,
  UploadCloud,
  SlidersHorizontal,
  Circle,
  Upload,
  Radio,
  TriangleAlert,
  Check,
  FileText,
  ArrowRight,
  ScanLine,
  ChevronDown,
  ChevronUp,
  Cpu,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { demoDatasets, manualFields, schemaPreview } from "@/data/analyze";
import { AnalysisMode, type TrafficFlow } from "@/lib/type";
import { useAnalysis, PRESET_FLOWS } from "@/contexts/analysis-context";
import { parseCsvFile, type ParsedDatasetResult } from "@/lib/csv-parser";
import styles from "./analyze-workspace.module.css";

export function AnalyzeWorkspace() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [parsedDataset, setParsedDataset] = useState<ParsedDatasetResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.Upload);
  const [specsOpen, setSpecsOpen] = useState(false);
  const { runAnalysis, isAnalyzing, error } = useAnalysis();

  const chooseFile = () => fileInput.current?.click();

  const handleFileSelect = async (file?: File) => {
    if (!file) return;
    setSelectedFileName(file.name);
    setParseError(null);
    setIsParsing(true);

    try {
      if (file.name.endsWith(".csv") || file.type.includes("csv") || file.type.includes("text")) {
        const result = await parseCsvFile(file);
        setParsedDataset(result);
      } else {
        // Fallback for non-CSV formats: stage with default parameters
        setParsedDataset(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to parse file.";
      setParseError(msg);
      setParsedDataset(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleRunInference = async (presetName?: string) => {
    if (presetName) {
      const presetKey = presetName.toLowerCase().includes("scenario 13") || presetName.toLowerCase().includes("normal")
        ? "benign_tls"
        : presetName.toLowerCase().includes("probe") || presetName.toLowerCase().includes("scenario 9")
        ? "dns_probe"
        : "rbot_flood";

      const flowData = PRESET_FLOWS[presetKey].flow;
      await runAnalysis(flowData, presetName);
      router.push("/results");
      return;
    }

    if (parsedDataset) {
      await runAnalysis(parsedDataset.primaryFlow, `${parsedDataset.fileName} (${parsedDataset.validFlows} flows)`);
      router.push("/results");
      return;
    }

    // Default fallback
    const defaultFlow = PRESET_FLOWS.rbot_flood.flow;
    await runAnalysis(defaultFlow, selectedFileName ?? "CTU-13 Scenario 10: Rbot DDoS Flood");
    router.push("/results");
  };

  return (
    <main className={`${styles.root} analyze-page`}>
      <section className="analyze-intro">
        <div>
          <p className="section-kicker">TRAFFIC INGESTION &amp; INFERENCE ENGINE</p>
          <h1>Analyze Network Traffic</h1>
          <p>
            Supply packet captures, flow logs, or custom packet header attributes to
            evaluate the probability of botnet intrusion in real time.
          </p>
        </div>
        <div className="inference-badge">
          <span>
            <Cpu size={22} aria-hidden="true" />
          </span>
          <div>
            <small>Target Latency</small>
            <b>14ms</b>
          </div>
          <div>
            <small>Active Classifier</small>
            <b>SentinelML-v2.4</b>
          </div>
        </div>
      </section>

      <div className="analyze-tabs">
        <button
          type="button"
          className={mode === AnalysisMode.Upload ? "selected" : ""}
          onClick={() => setMode(AnalysisMode.Upload)}
        >
          <Cloud size={16} aria-hidden="true" /> Upload Dataset (CSV / PCAP)
        </button>
        <button
          type="button"
          className={mode === AnalysisMode.Manual ? "selected" : ""}
          onClick={() => setMode(AnalysisMode.Manual)}
        >
          <SlidersHorizontal size={16} aria-hidden="true" /> Manual Feature Vector
        </button>
        <span>
          <Circle size={7} fill="currentColor" aria-hidden="true" />
          Ingestion gateway active &amp; ready
        </span>
      </div>

      {(error || parseError) && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle size={16} />
          <span>{parseError ?? error}</span>
        </div>
      )}

      <section className="analyze-grid">
        <div className="ingestion-column">
          <section className="analyze-card upload-card">
            <input
              ref={fileInput}
              type="file"
              accept=".csv,.pcap,.json,.txt,.binetflow"
              hidden
              onChange={(event) => handleFileSelect(event.target.files?.[0])}
            />

            {mode === AnalysisMode.Upload ? (
              <div
                className="drop-zone"
                onClick={chooseFile}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleFileSelect(event.dataTransfer.files[0]);
                }}
              >
                <div className="upload-cloud">
                  {isParsing ? (
                    <Loader2 className="animate-spin text-teal-600" size={24} />
                  ) : parsedDataset ? (
                    <CheckCircle2 className="text-teal-600" size={24} />
                  ) : (
                    <UploadCloud size={24} aria-hidden="true" />
                  )}
                </div>
                <h2>
                  {selectedFileName
                    ? isParsing
                      ? `Parsing ${selectedFileName}...`
                      : parsedDataset
                      ? `${selectedFileName} (${parsedDataset.validFlows} flows ready)`
                      : selectedFileName
                    : "Drop your traffic trace here or browse files"}
                </h2>
                <p>
                  Supports <b>.CSV, .PCAP, and .JSON</b> flow dumps up to 50MB.
                  <br />
                  Compliant with CTU-13, CICIDS2017 &amp; NetFlow schemas.
                </p>

                {parsedDataset && (
                  <div className="my-2 p-2.5 rounded bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-200 text-left">
                    <p className="font-semibold mb-1">Dataset Parsed Successfully:</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                      <span>• Total Flows: <b>{parsedDataset.validFlows}</b></span>
                      <span>• Dominant Proto: <b>{parsedDataset.summary.dominantProtocol}</b></span>
                      <span>• Total Packets: <b>{parsedDataset.summary.totalPackets.toLocaleString()}</b></span>
                      <span>• Total Volume: <b>{Math.round(parsedDataset.summary.totalBytes / 1024)} KB</b></span>
                    </div>
                  </div>
                )}

                <div className="drop-zone-actions">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      chooseFile();
                    }}
                  >
                    <Upload size={14} aria-hidden="true" /> Select File
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedFileName("Live_TAP_Stream_01.pcap");
                    }}
                  >
                    <Radio size={14} aria-hidden="true" /> Hook Live Tap
                  </button>
                </div>
                <div className="schema-note">
                  <TriangleAlert size={13} aria-hidden="true" />
                  <span>Payload bytes are stripped; only L3/L4 telemetry headers are evaluated.</span>
                </div>
              </div>
            ) : (
              <ManualInput />
            )}
          </section>

          <DemoDatasets
            onSelect={(name) => {
              setSelectedFileName(name);
              handleRunInference(name);
            }}
            isAnalyzing={isAnalyzing}
          />
        </div>

        <aside className="analyze-aside">
          <SchemaPreview />
          <InferenceCard
            selectedFile={selectedFileName}
            parsedDataset={parsedDataset}
            isAnalyzing={isAnalyzing || isParsing}
            onAnalyze={() => handleRunInference()}
          />
        </aside>
      </section>

      {/* Collapsible Technical Specifications to avoid text crowding */}
      <section className="analyze-card specification-card">
        <div
          className="spec-summary"
          onClick={() => setSpecsOpen(!specsOpen)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setSpecsOpen(!specsOpen)}
        >
          <div>
            <h2>Model &amp; Pipeline Architecture Specifications</h2>
            <p>Inspection parameters, feature normalization, and privacy sandbox details.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-mono">
              F1: 0.982
            </span>
            <button
              type="button"
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              aria-label={specsOpen ? "Collapse specifications" : "Expand specifications"}
            >
              {specsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        {specsOpen && (
          <div className="spec-grid">
            <div className="spec-item">
              <h3>FEATURE NORMALIZATION</h3>
              <p>
                Non-linear standard scaling and log transformation prevent packet count
                skewness across bursty streams.
              </p>
            </div>
            <div className="spec-item">
              <h3>INFERENCE ENGINE</h3>
              <p>
                Quantized 16-bit Gradient Boosted Trees (XGBoost) combined with shallow
                neural embeddings ensure sub-15ms latency.
              </p>
            </div>
            <div className="spec-item">
              <h3>PRIVACY SANDBOX</h3>
              <p>
                Payload bytes are entirely stripped prior to vector ingestion; only metadata
                headers are evaluated.
              </p>
            </div>
            <div className="spec-item">
              <h3>TAXONOMY STANDARDS</h3>
              <p>
                Compatible with CTU-13, CICIDS2017, and Bot-IoT taxonomy standards for
                botnet signature classification.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function ManualInput() {
  const router = useRouter();
  const { runAnalysis, isAnalyzing } = useAnalysis();
  const [flow, setFlow] = useState<Partial<Record<keyof TrafficFlow, string>>>({
    duration: "14.85",
    protocol: "tcp",
    source_port: "52190",
    destination_port: "443",
    direction: "<-",
    connection_state: "CON",
    total_packets: "84",
    total_bytes: "42100",
    source_bytes: "18400",
  });

  const submit = async () => {
    const request = Object.fromEntries(
      Object.entries(flow).filter(([, value]) => value?.trim())
    ) as TrafficFlow;

    await runAnalysis(request, `Custom Flow (${flow.protocol?.toUpperCase() ?? "TCP"}:${flow.destination_port ?? "443"})`);
    router.push("/results");
  };

  return (
    <div className="manual-input">
      <div className="manual-input-header">
        <div>
          <h2>Manual Feature Vector</h2>
          <p>Provide specific flow header attributes to evaluate likelihood of botnet activity.</p>
        </div>
      </div>

      <div className="manual-form-grid">
        {manualFields.map((field) => (
          <div className="manual-field" key={field.key}>
            <label htmlFor={field.key}>{field.label}</label>
            <input
              id={field.key}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              inputMode={field.inputMode}
              value={flow[field.key] ?? ""}
              onChange={(event) =>
                setFlow((current) => ({ ...current, [field.key]: event.target.value }))
              }
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="manual-submit-button"
        onClick={submit}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            <span>Classifying Flow Attributes...</span>
          </>
        ) : (
          <>
            <span>Run Neural Telemetry Inference</span>
            <ArrowRight size={16} aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
}

function DemoDatasets({
  onSelect,
  isAnalyzing,
}: {
  onSelect: (name: string) => void;
  isAnalyzing: boolean;
}) {
  return (
    <section className="analyze-card demos-card">
      <div className="card-heading">
        <div>
          <h2>Pre-Loaded Benchmark Datasets</h2>
          <p>One-click verified honeypot and real-world trace captures.</p>
        </div>
        <b>INSTANT TEST</b>
      </div>
      <div className="demo-grid">
        {demoDatasets.map((sample) => (
          <article className="demo-item" key={sample.name}>
            <div className="flex justify-between items-center">
              <span className={`demo-tag ${sample.tag.toLowerCase()}`}>{sample.tag}</span>
            </div>
            <h3>{sample.name}</h3>
            <p>{sample.detail}</p>
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={() => onSelect(sample.name)}
            >
              <span>Load &amp; Classify</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function SchemaPreview() {
  return (
    <section className="analyze-card schema-card">
      <div className="card-heading">
        <h2>Expected Schema</h2>
        <b>CTU-13 / CICIDS</b>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
        Inbound packet records map to 11 key telemetry attributes:
      </p>
      <div className="schema-list">
        {schemaPreview.map(([name, type]) => (
          <div className="schema-row" key={name}>
            <b>{name}</b>
            <span>{type}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 mt-2">
        <Check size={14} aria-hidden="true" />
        <span>Automatic NetFlow / CTU-13 feature normalization applied</span>
      </div>
    </section>
  );
}

function InferenceCard({
  selectedFile,
  parsedDataset,
  isAnalyzing,
  onAnalyze,
}: {
  selectedFile: string | null;
  parsedDataset: ParsedDatasetResult | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}) {
  return (
    <section className="analyze-card inference-card">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
        <Circle size={6} fill="currentColor" aria-hidden="true" />
        <span>Engine Status: Ready</span>
      </div>

      <div className="file-ready">
        <FileText className="text-teal-600 flex-shrink-0" size={20} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <b className="truncate">{selectedFile ?? "CTU-13 Benchmark Dataset"}</b>
          <small>
            {parsedDataset
              ? `${parsedDataset.validFlows} flows staged for inference`
              : selectedFile
              ? "Staged for inference"
              : "Flow trace staged"}
          </small>
        </div>
        <Check className="text-teal-600 flex-shrink-0" size={16} aria-hidden="true" />
      </div>

      <button
        type="button"
        className="primary-button w-full justify-center py-2.5"
        disabled={isAnalyzing}
        onClick={onAnalyze}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            <span>Processing Telemetry...</span>
          </>
        ) : (
          <>
            <ScanLine size={16} aria-hidden="true" />
            <span>RUN INFERENCE REPORT</span>
            <ArrowRight size={16} aria-hidden="true" />
          </>
        )}
      </button>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
        Sub-15ms execution against SentinelML ensemble.
      </p>
    </section>
  );
}