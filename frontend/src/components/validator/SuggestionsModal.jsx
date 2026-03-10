import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { X, FileText } from "lucide-react";
import "../../styles/validator/SuggestionsModal.css";

/**
 * Robust parser:
 * - Handles "1. Title: bullet - bullet - bullet"
 * - Handles inline "2. NextTitle:" appearing mid-sentence
 * - Produces clean ### headings + bullet lists
 */
const parseToMarkdown = (raw = "") => {
  if (!raw) return "";

  // First, split on numbered section markers that appear anywhere in the string
  // e.g. "...photo. 2. Background Uniformity: Use a tripod..."
  const normalized = raw
    .replace(/\.\s+(\d+)\.\s+/g, "\n$1. ")   // mid-sentence "2. Title" → new line
    .replace(/\n{3,}/g, "\n\n");               // collapse excess blank lines

  const lines = normalized.split(/\r?\n/);
  const out = [];

  for (let line of lines) {
    const t = line.trim();
    if (!t) { out.push(""); continue; }

    // Drop generic opener lines
    if (/^suggestions (for|to) improve/i.test(t)) continue;

    // "1. Title: rest..." → ### Title + bullets from rest
    const numbered = t.match(/^(\d+)\.\s*([^:]+):\s*(.*)$/);
    if (numbered) {
      const [, , title, rest] = numbered;
      out.push(`### ${title.trim()}`);
      if (rest.trim()) {
        // Split rest by " - " into individual bullets
        const bullets = rest.split(/ - /).map(b => b.trim()).filter(Boolean);
        bullets.forEach(b => out.push(`- ${b}`));
      }
      continue;
    }

    // "- text - text - text" → multiple bullets
    if (/^[-*]\s+/.test(t)) {
      const text = t.replace(/^[-*]\s+/, "").trim();
      const bullets = text.split(/ - /).map(b => b.trim()).filter(Boolean);
      bullets.forEach(b => out.push(`- ${b}`));
      continue;
    }

    // Plain line with inline " - " separators → bullets
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

const SuggestionsModal = ({
  isOpen,
  onClose,
  markdown = "",
  title = "Improvement Suggestions",
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const parsed = parseToMarkdown(markdown);

  return (
    <div className="sgm-backdrop" onClick={onClose}>
      <div className="sgm-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sgm-header">
          <div className="sgm-title">
            <div className="sgm-title-icon">
              <FileText size={15} />
            </div>
            {title}
          </div>
          <button type="button" className="sgm-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <p className="sgm-subtitle">AI-generated improvement suggestions</p>

        <div className="sgm-divider" />

        {/* Body */}
        <div className="sgm-body">
          <div className="sgm-markdown">
            <ReactMarkdown>{parsed}</ReactMarkdown>
          </div>
        </div>

        <div className="sgm-divider" />

        {/* Footer */}
        <div className="sgm-footer">
          <button type="button" className="sgm-ok-btn" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default SuggestionsModal;
