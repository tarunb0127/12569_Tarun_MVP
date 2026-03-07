import React from 'react';
import {
  CheckCircle2, AlertTriangle, ShieldAlert,
  User, BarChart2, TrendingUp, Upload,
  Sun, Eye, AlignCenter, Maximize2,
  RefreshCw, Palette, ScanFace, Lightbulb
} from 'lucide-react';
import '../../styles/validator/ResultSection.css';

const metricIcons = {
  Brightness:              <Sun size={13} />,
  Clarity:                 <Eye size={13} />,
  'Face Detection':        <ScanFace size={13} />,
  'Face Centering':        <AlignCenter size={13} />,
  'Framing Coverage':      <Maximize2 size={13} />,
  'Pose Alignment':        <RefreshCw size={13} />,
  'Background Uniformity': <Palette size={13} />,
};

const getStatusIcon = (score) => {
  if (score >= 70) return <CheckCircle2 className="rs-status pass" size={13} />;
  if (score >= 40) return <AlertTriangle className="rs-status warn" size={13} />;
  return <ShieldAlert className="rs-status fail" size={13} />;
};

const getFillClass = (score) => {
  if (score >= 70) return 'rs-fill-good';
  if (score >= 40) return 'rs-fill-warn';
  return 'rs-fill-poor';
};

const getRatingMeta = (score) => {
  if (score >= 70) return { cls: 'rs-banner-good',    icon: <CheckCircle2 size={22} color="#fff" /> };
  if (score >= 40) return { cls: 'rs-banner-average', icon: <AlertTriangle size={22} color="#fff" /> };
  return             { cls: 'rs-banner-poor',    icon: <ShieldAlert   size={22} color="#fff" /> };
};

const parseSuggestions = (text = '') => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences
    .map(s => s.trim().replace(/^[\s\-–—•*]+/, '').trim())  // strip leading - – — • *
    .filter(s => s.length > 15);
};


const ResultSection = ({ result, imageUrl, onReset }) => {
  if (!result) return <div className="rs-no-result">No result data available.</div>;

  const { cls: bannerCls, icon: bannerIcon } = getRatingMeta(result.overallScore);
  const suggestionPoints = parseSuggestions(result.suggestions);

  return (
    <div className="rs-page">

      {/* ── Banner ── */}
      <div className={`rs-banner ${bannerCls}`}>
        <div className="rs-banner-left">
          <div className="rs-banner-icon">{bannerIcon}</div>
          <div>
            <div className="rs-banner-title">{result.rating}</div>
            <div className="rs-banner-sub">{result.analysisSummary}</div>
          </div>
        </div>
        <div className="rs-banner-score">
          <span className="rs-score-num">{result.overallScore}%</span>
          <span className="rs-score-lbl">SCORE</span>
        </div>
      </div>

      {/* ── Row 1: Photo + Metrics ── */}
      <div className="rs-row-top">

        {/* Photo */}
        <div className="rs-card rs-photo-card">
          <div className="rs-card-title">
            <span className="rs-card-icon"><User size={13} /></span>
            Your Photo
          </div>
          <div className="rs-photo-frame">
            {imageUrl
              ? <img src={imageUrl} alt="Profile" className="rs-photo-img" />
              : <span className="rs-no-photo">No image</span>}
          </div>
        </div>

        {/* Metrics */}
        <div className="rs-card rs-metrics-card">
          <div className="rs-card-title">
            <span className="rs-card-icon"><BarChart2 size={13} /></span>
            Analysis Breakdown
          </div>
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
        </div>

      </div>

      {/* ── Row 2: Suggestions full-width ── */}
      <div className="rs-card rs-suggestions-card">
        <div className="rs-card-title">
          <span className="rs-card-icon"><TrendingUp size={13} /></span>
          Improvement Suggestions
          {result.improvementPriority?.length > 0 && (
            <div className="rs-priority-row">
              <span className="rs-priority-label">Focus areas:</span>
              {result.improvementPriority.map((a, i) => (
                <span key={i} className="rs-priority-tag">{a}</span>
              ))}
            </div>
          )}
        </div>
        <div className="rs-suggestions-grid">
          {suggestionPoints.map((pt, i) => (
            <div key={i} className="rs-suggestion">
              <span className="rs-suggestion-icon"><Lightbulb size={13} /></span>
              <span className="rs-suggestion-text">{pt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="rs-footer">
        <button className="rs-btn" onClick={onReset}>
          <Upload size={15} />
          Analyze Another Photo
        </button>
      </div>

    </div>
  );
};

export default ResultSection;
