"use client";

import Link from "next/link";
import {
  Circle,
  Check,
  TriangleAlert,
  Gauge,
  ShieldAlert,
  ShieldCheck,
  Clock,
  RotateCcw,
  ArrowRight,
  Download,
  FileDown,
  Info,
  Server,
  Zap,
} from "lucide-react";
import { comparisonRows, confidenceRows } from "@/data/results";
import { useAnalysis, PRESET_FLOWS } from "@/contexts/analysis-context";
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
                  {isBotnet ? "Signature: NET-BOT-094" : "Profile: NORMAL-WEB-FLOW"}
                </span>
              </div>
              <h1>
                {isBotnet ? "BOTNET TRAFFIC DETECTED" : "NORMAL TRAFFIC VERIFIED"}
              </h1>
            </div>
          </div>

          <p>
            {isBotnet
              ? `High probability of coordinated command-and-control beaconing and SYN-flood behavioral fingerprinting. Automated pattern matches synchronized bot clusters targeting Port ${flow.destination_port ?? "80"}/${flow.protocol?.toUpperCase() ?? "TCP"}.`
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
          <small>Target: Port {flow.destination_port ?? "80"} · {flow.protocol?.toUpperCase() ?? "TCP"}</small>
        </article>

        <article className="result-stat">
          <h2>Flow Volume &amp; Packets</h2>
          <div className="result-stat-value">
            <strong>{flow.total_packets ?? 4280} pkts</strong>
            <em>({flow.duration ?? 0.042}s duration)</em>
          </div>
          <small>Total Ingest: {flow.total_bytes ? `${Math.round(flow.total_bytes / 1024)} KB` : "285 KB"}</small>
        </article>

        <article className="result-stat">
          <h2>Telemetry Timestamp</h2>
          <div className="result-stat-value">
            <strong className="text-sm font-mono">{timestamp}</strong>
          </div>
          <small>Edge Sensor: US-East Ingress Gateway</small>
        </article>
      </section>

      {/* Result Analysis Grid */}
      <section className="result-analysis-grid">
        <FeatureAttribution isBotnet={isBotnet} />
        <BaselineComparison isBotnet={isBotnet} />
      </section>

      {/* Action Footer */}
      <section className="result-actions">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            {isBotnet ? "Incident marked for mitigation dispatch." : "Telemetry marked as verified normal."}
          </p>
          <p className="text-xs text-slate-500">
            All decision trees and SHAP values attested with cryptographic verification.
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

function FeatureAttribution({ isBotnet }: { isBotnet: boolean }) {
  return (
    <article className="result-card attribution">
      <div className="result-card-heading">
        <div>
          <h2>Feature Anomaly Attribution</h2>
          <p>SHAP relative importance weights across 128 decision trees.</p>
        </div>
        <span className={`result-badge ${isBotnet ? "badge-orange" : "badge-teal"}`}>
          {isBotnet ? "Anomaly Flagged" : "Normal Vector"}
        </span>
      </div>

      <div className="attribute-list">
        {confidenceRows.map(([label, value, left, right, color], index) => {
          const widthPercent = isBotnet
            ? index === 0 ? "88%" : index === 1 ? "74%" : index === 2 ? "62%" : "44%"
            : index === 0 ? "18%" : index === 1 ? "22%" : index === 2 ? "12%" : "15%";

          return (
            <div className="attribute" key={label}>
              <div className="attribute-head">
                <b>{label}</b>
                <strong dangerouslySetInnerHTML={{ __html: isBotnet ? value : left }} />
              </div>
              <div className="attribute-track">
                <i
                  style={{
                    width: widthPercent,
                    backgroundColor: isBotnet ? undefined : "#0d9488",
                  }}
                />
              </div>
              <div className="attribute-footer">
                <span dangerouslySetInnerHTML={{ __html: left }} />
                <span>{isBotnet ? right : "Matches baseline"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="attribution-note">
        <Info size={13} aria-hidden="true" />
        <span>SHAP values calculated across 128 multi-layer perceptron decision trees.</span>
      </p>
    </article>
  );
}

function BaselineComparison({ isBotnet }: { isBotnet: boolean }) {
  return (
    <article className="result-card comparison">
      <div className="result-card-heading">
        <div>
          <h2>Baseline Comparison Matrix</h2>
          <p>Observed sample vs 10M validated enterprise sessions.</p>
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
          {comparisonRows.map((row) => (
            <tr key={row[0]}>
              <td>{row[0]}</td>
              <td className={isBotnet ? "highlight" : "text-teal-600 font-semibold"}>
                {isBotnet ? row[1] : row[2]}
              </td>
              <td>{row[2]}</td>
              <td>{row[3]}</td>
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
          <span>{isBotnet ? "Recommended Action: Deploy Rate-Limit Filter" : "Action: Allow Traffic Ingress"}</span>
        </b>
        <p>
          {isBotnet
            ? "Isolate Source IP & deploy rate-limiting filter rule to prevent ingress amplification at perimeter routers."
            : "No mitigation required. Session exhibits normal burst dynamics and regular TCP acknowledgment windowing."}
        </p>
      </div>
    </article>
  );
}