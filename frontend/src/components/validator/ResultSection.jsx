import React, { useState, useMemo } from "react";
import {
  Sun, Eye, AlignCenter, Maximize2, RefreshCw,
  Palette, ScanFace, CheckCircle2, AlertTriangle,
  ShieldAlert, BarChart2, User, Upload, FileText
} from "lucide-react";
import SuggestionsModal from "./SuggestionsModal";
import "../../styles/validator/ResultSection.css";

const metricIcons = {
  Brightness:              <Sun size={13} />,
  Clarity:                 <Eye size={13} />,
  "Face Detection":        <ScanFace size={13} />,
  "Face Centering":        <AlignCenter size={13} />,
  "Framing Coverage":      <Maximize2 size={13} />,
  "Pose Alignment":        <RefreshCw size={13} />,
  "Background Uniformity": <Palette size={13} />,
};

const getStatusIcon = (score) => {
  if (score >= 70) return <CheckCircle2 className="rs-status pass" size={13} />;
  if (score >= 40) return <AlertTriangle className="rs-status warn" size={13} />;
  return <ShieldAlert className="rs-status fail" size={13} />;
};

const getFillClass = (score) => {
  if (score >= 70) return "rs-fill-good";
  if (score >= 40) return "rs-fill-warn";
  return "rs-fill-poor";
};

const getRatingMeta = (score) => {
  if (score >= 70) return { cls: "rs-banner-good",    icon: <CheckCircle2 size={20} color="#fff" /> };
  if (score >= 40) return { cls: "rs-banner-average", icon: <AlertTriangle size={20} color="#fff" /> };
  return             { cls: "rs-banner-poor",    icon: <ShieldAlert   size={20} color="#fff" /> };
};

const toMarkdown = (raw = "") => {
  if (!raw) return "";
  const normalized = raw
    .replace(/\.\s+(\d+)\.\s+/g, "\n$1. ")
    .replace(/\n{3,}/g, "\n\n");
  const lines = normalized.split(/\r?\n/);
  const out = [];
  for (let line of lines) {
    const t = line.trim();
    if (!t) { out.push(""); continue; }
    if (/^suggestions (for|to) improve/i.test(t)) continue;
    const numbered = t.match(/^(\d+)\.\s*([^:]+):\s*(.*)$/);
    if (numbered) {
      const [, , title, rest] = numbered;
      out.push(`### ${title.trim()}`);
      if (rest.trim()) {
        const bullets = rest.split(/ - /).map(b => b.trim()).filter(Boolean);
        bullets.forEach(b => out.push(`- ${b}`));
      }
      continue;
    }
    if (/^[-*]\s+/.test(t)) {
      const text = t.replace(/^[-*]\s+/, "").trim();
      t.split(/ - /).map(b => b.trim()).filter(Boolean)
        .forEach(b => out.push(`- ${b}`));
      continue;
    }
    if (t.includes(" - ")) {
      const parts = t.split(/ - /).map(b => b.trim()).filter(Boolean);
      if (parts.length > 1) {
        out.push(parts[0]);
        parts.slice(1).forEach(b => out.push(`- ${b}`));
        continue;
      }
    }
    out.push(t);
  }
  return out.join("\n");
};

const ResultSection = ({ result, imageUrl, onReset }) => {
  const [showModal, setShowModal] = useState(false);

  const markdownSuggestions = useMemo(
    () => toMarkdown(result?.suggestions),
    [result?.suggestions]
  );

  if (!result) {
    return <div className="rs-no-result">No result data available.</div>;
  }

  const { cls: bannerCls, icon: bannerIcon } = getRatingMeta(result.overallScore);

  return (
    <>
      <div className="rs-page">

        {/* ── Banner ── */}
        <div className={`rs-banner ${bannerCls}`}>
          <div className="rs-banner-left">
            <div className="rs-banner-icon">{bannerIcon}</div>
            <div className="rs-banner-text">
              <div className="rs-banner-title">{result.rating}</div>
              <div className="rs-banner-sub">{result.analysisSummary}</div>
            </div>
          </div>
          <div className="rs-banner-score">
            <span className="rs-score-num">{result.overallScore}%</span>
            <span className="rs-score-lbl">SCORE</span>
          </div>
        </div>

        {/* ── Cards row ── */}
        <div className="rs-row-top">

          {/* Photo card */}
          <div className="rs-card rs-photo-card">
            <div className="rs-card-title">
              <span className="rs-card-icon"><User size={13} /></span>
              Your Photo
            </div>
            <div className="rs-photo-frame">
              {imageUrl
                ? <img src={imageUrl} alt="Profile" className="rs-photo-img" />
                : <span className="rs-no-photo">No image uploaded</span>}
            </div>
          </div>

          {/* Metrics card — buttons live INSIDE here */}
          <div className="rs-card rs-metrics-card">
            <div className="rs-card-title">
              <span className="rs-card-icon"><BarChart2 size={13} /></span>
              Analysis Breakdown
            </div>

            {/* Metrics grid */}
            <div className="rs-metrics-grid">
              {result.metrics?.map((m, i) => (
                <div key={i} className="rs-metric">
                  <div className="rs-metric-row">
                    <span className="rs-metric-icon">
                      {metricIcons[m.name] || <Sun size={13} />}
                    </span>
                    <span className="rs-metric-name">{m.name}</span>
                    <span className="rs-metric-score">{m.score}%</span>
                    {getStatusIcon(m.score)}
                  </div>
                  <div className="rs-track">
                    <div
                      className={`rs-fill ${getFillClass(m.score)}`}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                  <div className="rs-metric-detail">{m.details}</div>
                </div>
              ))}
            </div>

            {/* Priority tags */}
            {result.improvementPriority?.length > 0 && (
              <div className="rs-priority-row">
                <span className="rs-priority-label">Focus areas:</span>
                {result.improvementPriority.map((a, i) => (
                  <span key={i} className="rs-priority-tag">{a}</span>
                ))}
              </div>
            )}

            {/* ── Buttons inside the card ── */}
            <div className="rs-card-footer">
              <button
                type="button"
                className="rs-btn rs-btn-outline"
                onClick={() => setShowModal(true)}
              >
                <FileText size={14} />
                View Suggestions
              </button>
              <button
                type="button"
                className="rs-btn rs-btn-solid"
                onClick={onReset}
              >
                <Upload size={14} />
                Analyze Another Photo
              </button>
            </div>

          </div>
        </div>
      </div>

      <SuggestionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        markdown={markdownSuggestions}
        title="Improvement Suggestions"
      />
    </>
  );
};

export default ResultSection;
