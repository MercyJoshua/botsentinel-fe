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
} from "lucide-react";
import { demoDatasets, manualFields, schemaPreview } from "@/data/analyze";
import { AnalysisMode, type TrafficFlow } from "@/lib/type";
import { useAnalysis, PRESET_FLOWS } from "@/contexts/analysis-context";
import styles from "./analyze-workspace.module.css";

export function AnalyzeWorkspace() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.Upload);
  const [specsOpen, setSpecsOpen] = useState(false);
  const { runAnalysis, isAnalyzing, error } = useAnalysis();

  const chooseFile = () => fileInput.current?.click();
  const onFile = (file?: File) => setSelectedFile(file?.name ?? null);

  const handleRunInference = async (datasetName?: string) => {
    const name = datasetName ?? selectedFile ?? "Mirai Botnet Traffic (.csv)";
    const presetKey = name.toLowerCase().includes("normal")
      ? "benign_tls"
      : name.toLowerCase().includes("mixed")
      ? "dns_tunnel"
      : "mirai_botnet";

    const flowData = PRESET_FLOWS[presetKey].flow;
    await runAnalysis(flowData, name);
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

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <section className="analyze-grid">
        <div className="ingestion-column">
          <section className="analyze-card upload-card">
            <input
              ref={fileInput}
              type="file"
              accept=".csv,.pcap,.json"
              hidden
              onChange={(event) => onFile(event.target.files?.[0])}
            />

            {mode === AnalysisMode.Upload ? (
              <div
                className="drop-zone"
                onClick={chooseFile}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  onFile(event.dataTransfer.files[0]);
                }}
              >
                <div className="upload-cloud">
                  <UploadCloud size={24} aria-hidden="true" />
                </div>
                <h2>{selectedFile ?? "Drop your traffic trace here or browse files"}</h2>
                <p>
                  Supports <b>.CSV, .PCAP, and .JSON</b> flow dumps up to 50MB.
                  <br />
                  Compliant with CICIDS2017 &amp; Bot-IoT network schemas.
                </p>
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
                      setSelectedFile("Live_TAP_Stream_01.pcap");
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
              setSelectedFile(name);
              handleRunInference(name);
            }}
            isAnalyzing={isAnalyzing}
          />
        </div>

        <aside className="analyze-aside">
          <SchemaPreview />
          <InferenceCard
            selectedFile={selectedFile}
            isAnalyzing={isAnalyzing}
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
                Compatible with CICIDS2017, Bot-IoT, and UNSW-NB15 taxonomy standards for
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
    duration: "0.042",
    protocol: "tcp",
    source_port: "54128",
    destination_port: "80",
    direction: "outbound",
    connection_state: "SF",
    total_packets: "4280",
    total_bytes: "285400",
    source_bytes: "285400",
  });

  const submit = async () => {
    const request = Object.fromEntries(
      Object.entries(flow).filter(([, value]) => value?.trim())
    ) as TrafficFlow;

    await runAnalysis(request, `Custom Flow (${flow.protocol?.toUpperCase() ?? "TCP"}:${flow.destination_port ?? "80"})`);
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
        <b>CICIDS2017</b>
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
        <span>MinMax automatic feature normalization applied</span>
      </div>
    </section>
  );
}

function InferenceCard({
  selectedFile,
  isAnalyzing,
  onAnalyze,
}: {
  selectedFile: string | null;
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
          <b className="truncate">{selectedFile ?? "Mirai Botnet Traffic (.csv)"}</b>
          <small>{selectedFile ? "Staged for inference" : "4,280 packet flows staged"}</small>
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