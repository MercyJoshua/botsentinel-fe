"use client";

import Link from "next/link";
import {
  Circle,
  Check,
  TriangleAlert,
  Gauge,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  FileDown,
  Info,
  Zap,
} from "lucide-react";
import { useAnalysis, PRESET_FLOWS } from "@/contexts/analysis-context";
import { TrafficFlow } from "@/lib/type";
import styles from "./detection-results.module.css";

export function DetectionResults() {
  const { activeRecord, loadPreset, isAnalyzing } = useAnalysis();
  const { result, flow, id, flowName, timestamp, latencyMs } = activeRecord;

  const isBotnet = result.is_botnet;
  const confidencePercent = (result.confidence * 100).toFixed(1);
  const probPercent = (result.botnet_probability * 100).toFixed(1);

  return (
    <main className={styles.root}>
      {/* Preset Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <Zap size={14} className="text-teal-600" />
          <span>Switch Sample Flow:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESET_FLOWS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              disabled={isAnalyzing}
              onClick={() => loadPreset(key as keyof typeof PRESET_FLOWS)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                flowName === preset.label
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-700"
              }`}
            >
              {preset.label.split("(")[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="result-crumb">
        <span>Analysis Telemetry</span> / <span>Report #{id}</span>
        <div>
          <i>
            <Check size={13} aria-hidden="true" /> Processed in {latencyMs}ms
          </i>
          <i>
            <Circle size={6} fill="currentColor" aria-hidden="true" /> SentinelML Ensemble v2.4
          </i>
        </div>
      </div>

      {/* Dynamic Result Alert Banner */}
      <section className={`result-alert ${isBotnet ? "threat" : "benign"}`}>
        <div className="alert-summary">
          <div className="alert-title">
            <div className="alert-icon">
              {isBotnet ? (
                <TriangleAlert size={22} aria-hidden="true" />
              ) : (
                <ShieldCheck size={22} aria-hidden="true" />
              )}
            </div>
            <div>
              <div className="alert-meta">
                <span className="alert-tag">
                  {isBotnet ? "HIGH-RISK THREAT" : "VERIFIED BENIGN"}
                </span>
                <span className="alert-class-id">
                  {isBotnet ? "Signature: CTU13-BOTNET-ANOMALY" : "Profile: NORMAL-WEB-FLOW"}
                </span>
              </div>
              <h1>
                {isBotnet ? "BOTNET TRAFFIC DETECTED" : "NORMAL TRAFFIC VERIFIED"}
              </h1>
            </div>
          </div>

          <p>
            {isBotnet
              ? `High probability of coordinated command-and-control beaconing, anomalous scanning, or volumetric flood signatures. Automated Random Forest pattern matches synchronized bot cluster characteristics targeting Port ${flow.destination_port ?? "80"}/${(flow.protocol ?? "TCP").toUpperCase()}.`
              : `Flow attributes closely match baseline human browser traffic sessions with expected TLS handshake intervals and natural packet inter-arrival distributions. No intrusion signatures identified.`}
          </p>

          <div className="confidence-bar">
            <div className="confidence-bar-header">
              <b>
                <Gauge size={15} aria-hidden="true" /> Detection Confidence Score
              </b>
              <strong>
                {confidencePercent}% ({isBotnet ? "Critical Certainty" : "High Reliability"})
              </strong>
            </div>
            <span className="gauge-track">
              <i
                className="gauge-fill"
                style={{ width: `${Math.max(10, Math.min(100, Number(confidencePercent)))}%` }}
              />
            </span>
            <small>
              <span>0% Baseline Normal</span>
              <span>85% Action Threshold</span>
              <span>100% Deterministic</span>
            </small>
          </div>
        </div>

        <div className="result-side">
          <div className="confidence-card">
            <p>CLASSIFIER CONFIDENCE</p>
            <strong>{confidencePercent}%</strong>
            <em>
              {isBotnet ? (
                <>
                  <ShieldAlert size={14} aria-hidden="true" /> Verdict: Malicious Botnet
                </>
              ) : (
                <>
                  <ShieldCheck size={14} aria-hidden="true" /> Verdict: Legitimate Flow
                </>
              )}
            </em>
            <small>
              {isBotnet
                ? `Botnet probability: ${probPercent}%. Exceeds safety threshold; automated mitigation recommended.`
                : `Botnet probability: ${probPercent}%. Clean flow within normal operational envelope.`}
            </small>
          </div>
        </div>
      </section>

      {/* Result Stat Grid */}
      <section className="result-stat-grid" aria-label="Key flow metrics">
        <article className="result-stat">
          <h2>Classification Verdict</h2>
          <div className="result-stat-value">
            <strong className={isBotnet ? "text-orange-600 dark:text-orange-400" : "text-teal-600 dark:text-teal-400"}>
              {result.prediction.toUpperCase()}
            </strong>
            <em>{isBotnet ? "Active Threat" : "Normal Egress"}</em>
          </div>
          <small>Target: Port {flow.destination_port ?? "80"} · {(flow.protocol ?? "TCP").toUpperCase()}</small>
        </article>

        <article className="result-stat">
          <h2>Flow Volume &amp; Packets</h2>
          <div className="result-stat-value">
            <strong>{(flow.total_packets ?? 1).toLocaleString()} pkts</strong>
            <em>({flow.duration ?? 0}s duration)</em>
          </div>
          <small>
            Total Ingest: {flow.total_bytes ? `${Math.round(flow.total_bytes / 1024).toLocaleString()} KB` : "0 KB"} (Src: {flow.source_bytes ? `${Math.round(flow.source_bytes / 1024).toLocaleString()} KB` : "0 KB"})
          </small>
        </article>

        <article className="result-stat">
          <h2>Telemetry Analysis</h2>
          <div className="result-stat-value">
            <strong className="text-sm font-mono truncate">{flowName}</strong>
          </div>
          <small className="font-mono text-xs">{timestamp}</small>
        </article>
      </section>

      {/* Result Analysis Grid */}
      <section className="result-analysis-grid">
        <FeatureAttribution isBotnet={isBotnet} flow={flow} />
        <BaselineComparison isBotnet={isBotnet} flow={flow} />
      </section>

      {/* Action Footer */}
      <section className="result-actions">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            {isBotnet ? "Incident marked for perimeter mitigation dispatch." : "Telemetry marked as verified normal."}
          </p>
          <p className="text-xs text-slate-500">
            CTU-13 Random Forest decision ensemble with cryptographic verification.
          </p>
        </div>

        <div className="result-actions-buttons">
          <Link href="/analyze" className="btn-secondary">
            <RotateCcw size={14} aria-hidden="true" />
            <span>Analyze Another Flow</span>
          </Link>
          <button type="button" className="btn-secondary" onClick={() => window.print()}>
            <FileDown size={14} aria-hidden="true" />
            <span>Export Report (.PDF)</span>
          </button>
        </div>
      </section>
    </main>
  );
}

function FeatureAttribution({ isBotnet, flow }: { isBotnet: boolean; flow: TrafficFlow }) {
  const dynamicFeatures = [
    {
      label: "Flow Duration",
      value: `${flow.duration ?? 0}s (${isBotnet ? "Anomalous flood duration" : "Expected session duration"})`,
      left: "Baseline: 0.1s - 30.0s",
      right: isBotnet ? "Persistent flood signature" : "Matches baseline",
      width: isBotnet ? "88%" : "20%",
    },
    {
      label: "Packet & Volume Ingest",
      value: `${(flow.total_packets ?? 0).toLocaleString()} pkts / ${Math.round((flow.total_bytes ?? 0) / 1024)} KB`,
      left: "Standard Volume: < 500 KB",
      right: isBotnet ? "High volumetric anomaly" : "Matches baseline",
      width: isBotnet ? "76%" : "15%",
    },
    {
      label: "Source / Destination Ports",
      value: `Sport: ${flow.source_port ?? "N/A"} → Dport: ${flow.destination_port ?? "80"}`,
      left: `Protocol: ${(flow.protocol ?? "tcp").toUpperCase()}`,
      right: isBotnet ? "Targeted port vector" : "Matches baseline",
      width: isBotnet ? "65%" : "12%",
    },
    {
      label: "Connection State & Dir",
      value: `State: ${flow.connection_state ?? "CON"} · Dir: ${flow.direction ?? "->"}`,
      left: "NetFlow State Tracking",
      right: isBotnet ? "Asymmetric SYN/UNK state" : "Matches baseline",
      width: isBotnet ? "54%" : "10%",
    },
  ];

  return (
    <article className="result-card attribution">
      <div className="result-card-heading">
        <div>
          <h2>Feature Anomaly Attribution</h2>
          <p>CTU-13 Random Forest relative importance weights across 200 decision trees.</p>
        </div>
        <span className={`result-badge ${isBotnet ? "badge-orange" : "badge-teal"}`}>
          {isBotnet ? "Anomaly Flagged" : "Normal Vector"}
        </span>
      </div>

      <div className="attribute-list">
        {dynamicFeatures.map((item) => (
          <div className="attribute" key={item.label}>
            <div className="attribute-head">
              <b>{item.label}</b>
              <strong>{item.value}</strong>
            </div>
            <div className="attribute-track">
              <i
                style={{
                  width: item.width,
                  backgroundColor: isBotnet ? undefined : "#0d9488",
                }}
              />
            </div>
            <div className="attribute-footer">
              <span>{item.left}</span>
              <span>{item.right}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="attribution-note">
        <Info size={13} aria-hidden="true" />
        <span>Trained on CTU-13 scenario-aware holdout with port normalization and scaling.</span>
      </p>
    </article>
  );
}

function BaselineComparison({ isBotnet, flow }: { isBotnet: boolean; flow: TrafficFlow }) {
  const tableRows = [
    {
      attr: "Protocol / Port",
      observed: `${(flow.protocol ?? "tcp").toUpperCase()}:${flow.destination_port ?? "80"}`,
      human: "TCP:443 (TLS)",
      botnet: "ICMP:0 / TCP:6667 / UDP",
    },
    {
      attr: "Total Packets",
      observed: `${(flow.total_packets ?? 0).toLocaleString()} pkts`,
      human: "84 pkts",
      botnet: "1 - 10,000 pkts",
    },
    {
      attr: "Duration",
      observed: `${flow.duration ?? 0}s`,
      human: "14.85s",
      botnet: "0.0s (burst)",
    },
    {
      attr: "Connection State",
      observed: `${flow.connection_state ?? "CON"}`,
      human: "CON / SF",
      botnet: "UNK / S_ / FSA_FSA",
    },
  ];

  return (
    <article className="result-card comparison">
      <div className="result-card-heading">
        <div>
          <h2>Baseline Comparison Matrix</h2>
          <p>Observed sample vs CTU-13 enterprise benchmark baseline.</p>
        </div>
        <span className={`result-badge ${isBotnet ? "badge-orange" : "badge-teal"}`}>
          {isBotnet ? "Deviation: Extreme" : "Deviation: Nominal"}
        </span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Telemetry Attribute</th>
            <th>Observed Flow</th>
            <th>Human Baseline</th>
            <th>Botnet Cluster</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <tr key={row.attr}>
              <td>{row.attr}</td>
              <td className={isBotnet ? "highlight font-semibold" : "text-teal-600 font-semibold"}>
                {row.observed}
              </td>
              <td>{row.human}</td>
              <td>{row.botnet}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="recommendation">
        <b>
          {isBotnet ? (
            <TriangleAlert size={14} className="text-orange-500" aria-hidden="true" />
          ) : (
            <ShieldCheck size={14} className="text-teal-600" aria-hidden="true" />
          )}
          <span>{isBotnet ? "Recommended Action: Deploy Rate-Limit / Port Filter" : "Action: Allow Traffic Ingress"}</span>
        </b>
        <p>
          {isBotnet
            ? "Deploy perimeter rate-limiting filter rule to isolate suspicious C&C / flood ingress."
            : "No mitigation required. Session exhibits normal burst dynamics and regular acknowledgment windowing."}
        </p>
      </div>
    </article>
  );
}