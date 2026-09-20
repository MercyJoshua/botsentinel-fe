"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Circle,
  Square,
  ShieldCheck,
  ArrowRight,
  ArrowLeftRight,
  TrendingUp,
  Zap,
  Activity,
  Layers,
} from "lucide-react";
import { overviewMetrics, recentAnalyses, threatVectors } from "@/data/overview";

function MiniIcon({ children }: { children: React.ReactNode }) {
  return <span className="mini-icon">{children}</span>;
}

export function OverviewDashboard() {
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h" | "7d">("24h");

  return (
    <main className="dashboard">
      <section className="hero-card">
        <div className="eyebrow">
          <Circle size={8} fill="currentColor" aria-hidden="true" />
          <span>NEURAL TELEMETRY CLASSIFIER</span>
          <span>SentinelML v2.4.1</span>
        </div>
        <h1>BotSentinel</h1>
        <p className="hero-tagline">Real-Time Botnet Traffic Detection &amp; Flow Classification</p>
        <p className="hero-copy">
          Autonomous ML telemetry engine isolating distributed SYN-floods, C2 beacons,
          and credential-stuffing flows from legitimate user sessions.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            <Zap size={12} /> Sub-15ms Ingestion
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            <ShieldCheck size={12} /> Zero False-Positive Guard
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            <Layers size={12} /> XGBoost + Neural Embedding
          </span>
        </div>

        <div className="hero-actions">
          <Link href="/analyze" className="primary-button">
            <span>Start Traffic Inspection</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Activity className="text-teal-600 dark:text-teal-400" size={14} aria-hidden="true" />
            Ingestion Gateway Active · 11 Attributes Monitored
          </span>
        </div>
      </section>

      <section className="metric-grid" aria-label="Network overview">
        {overviewMetrics.map((metric) => (
          <article
            className={`metric-card ${"alert" in metric && metric.alert ? "warning-card" : ""}`}
            key={metric.label}
          >
            <div className="metric-label">
              <span>{metric.label}</span>
              <MiniIcon>{metric.icon}</MiniIcon>
            </div>
            <strong>{metric.value}</strong>
            {"progress" in metric && metric.progress ? (
              <div>
                <div className="progress-label">
                  <span>Isolation Ratio</span>
                  <span>1:9.7 packets</span>
                </div>
                <div className="progress">
                  <i />
                </div>
              </div>
            ) : (
              <small className={"tone" in metric ? metric.tone : undefined}>
                {"detail" in metric && metric.detail}
                {metric.label === "AVG. CONFIDENCE" && (
                  <span className="confidence-detail">σ = 0.018</span>
                )}
              </small>
            )}
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel traffic-panel">
          <div className="panel-heading">
            <div>
              <h2>
                Traffic Telemetry Stream
                <span className="live-pill">
                  <Circle size={6} fill="currentColor" aria-hidden="true" /> Live
                </span>
              </h2>
              <p>
                <Circle className="teal-dot inline-block mr-1" size={8} fill="currentColor" aria-hidden="true" />
                Normal Baseline Traffic &nbsp;
                <Circle className="orange-dot inline-block ml-2 mr-1" size={8} fill="currentColor" aria-hidden="true" />
                Flagged Botnet Anomalies
              </p>
            </div>
            <div className="time-range" role="group" aria-label="Time Range Filter">
              {(["1h", "6h", "24h", "7d"] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  className={timeRange === range ? "selected" : ""}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <TrafficChart timeRange={timeRange} />

          <div className="chart-summary">
            <div>
              <MiniIcon>
                <TrendingUp size={16} aria-hidden="true" />
              </MiniIcon>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Peak Anomaly Rate</span>
                <b>{timeRange === "1h" ? "184 req/sec" : timeRange === "6h" ? "296 req/sec" : "342 req/sec"}</b>
              </div>
            </div>
            <div>
              <MiniIcon>
                <ArrowLeftRight size={16} aria-hidden="true" />
              </MiniIcon>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Pipeline Throughput</span>
                <b>1.2 GB/sec</b>
              </div>
            </div>
          </div>
        </article>

        <aside className="side-stack">
          <RecentAnalyses />
          <ThreatDistribution />
        </aside>
      </section>

      <section className="cta-card">
        <div>
          <h2>Ready to inspect custom PCAP captures or live packet headers?</h2>
          <p>
            Upload capture traces or test raw flow vectors against the ML classifier instantly.
          </p>
        </div>
        <div>
          <Link href="/analyze" className="primary-button compact">
            Launch Ingestion Suite <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function TrafficChart({ timeRange }: { timeRange: string }) {
  return (
    <div className="chart-wrap">
      <div className="spike-label label-one">
        {timeRange === "1h" ? "184 req/s" : "342 req/s · Mirai Burst"}
      </div>
      <div className="spike-label label-two">
        {timeRange === "1h" ? "112 req/s" : "298 req/s · C2 Beacon"}
      </div>
      <svg
        viewBox="0 0 650 205"
        preserveAspectRatio="none"
        role="img"
        aria-label="Traffic timeline chart"
      >
        <defs>
          <linearGradient id="traffic-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0d9488" stopOpacity=".22" />
            <stop offset="1" stopColor="#0d9488" stopOpacity=".01" />
          </linearGradient>
        </defs>
        <path className="gridline" d="M0 45H650M0 102H650M0 160H650" />
        <path
          d="M0 158 C42 149 72 127 106 133 S157 149 189 132 S242 105 278 111 S329 126 363 111 S420 89 454 91 S509 82 547 68 S602 45 650 35 L650 188 L0 188Z"
          fill="url(#traffic-fill)"
        />
        <path
          className="baseline"
          d="M0 158 C42 149 72 127 106 133 S157 149 189 132 S242 105 278 111 S329 126 363 111 S420 89 454 91 S509 82 547 68 S602 45 650 35"
        />
        <path className="spikes" d="M213 158 L251 66 L274 158 M477 158 L491 20 L510 158" />
        <circle cx="251" cy="66" r="4.5" className="spike-point" />
        <circle cx="491" cy="20" r="4.5" className="spike-point" />
      </svg>
      <div className="chart-axis">
        <span>- {timeRange}</span>
        <span>- {timeRange === "24h" ? "18h" : "45m"}</span>
        <span>- {timeRange === "24h" ? "12h" : "30m"}</span>
        <span>- {timeRange === "24h" ? "6h" : "15m"}</span>
        <span>Now</span>
      </div>
    </div>
  );
}

function RecentAnalyses() {
  return (
    <article className="panel recent-panel">
      <div className="panel-title-row">
        <h2>
          <span>Recent Classifications</span>
          <Circle className="teal-dot" size={8} fill="currentColor" aria-hidden="true" />
        </h2>
        <Link href="/results">View Reports</Link>
      </div>
      <div className="analysis-list">
        {recentAnalyses.map(([flow, detail, state, kind]) => (
          <div className="analysis-row" key={flow}>
            <Circle
              className={kind === "alert" ? "orange-dot" : "teal-dot"}
              size={8}
              fill="currentColor"
              aria-hidden="true"
            />
            <div>
              <b>{flow}</b>
              <small>{detail}</small>
            </div>
            <em className={kind}>{state}</em>
          </div>
        ))}
      </div>
    </article>
  );
}

function ThreatDistribution() {
  return (
    <article className="panel distribution-panel">
      <h2>Threat Distribution</h2>
      <p>Classification split across active inspection window</p>

      <div className="distribution-row">
        <Square className="teal-dot" size={8} fill="currentColor" aria-hidden="true" />
        <b>Normal Traffic: 89.7%</b>
        <small>11,197 flows</small>
      </div>
      <div className="wide-bar">
        <div className="teal-bar h-full rounded-full" />
      </div>

      <div className="distribution-row">
        <Square className="orange-dot" size={8} fill="currentColor" aria-hidden="true" />
        <b>Botnet Traffic: 10.3%</b>
        <small>1,284 flows</small>
      </div>
      <div className="wide-bar">
        <div className="orange-bar h-full rounded-full" />
      </div>

      <h3>IDENTIFIED THREAT VECTORS</h3>
      <div className="vector-grid">
        {threatVectors.map(([value, label]) => (
          <div key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}