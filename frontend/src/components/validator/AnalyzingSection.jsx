import React, { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import "../../styles/validator/AnalyzingSection.css";

const stages = [
  {
    label: "Image Processing",
    description: "Loading your photo and preparing for analysis...",
    duration: 800,
  },
  {
    label: "Brightness Analysis",
    description: "Checking overall exposure and lighting balance...",
    duration: 1200,
  },
  {
    label: "Clarity Check",
    description: "Inspecting sharpness and blur for crispness...",
    duration: 1200,
  },
  {
    label: "Face Detection",
    description: "Locating faces and verifying clear visibility...",
    duration: 1200,
  },
  {
    label: "Pose Analysis",
    description: "Analyzing face orientation and alignment...",
    duration: 1200,
  },
  {
    label: "Background Check",
    description: "Evaluating background uniformity and distractions...",
    duration: 1200,
  },
  {
    label: "Scoring Complete",
    description: "All technical analysis finished! Calculating final score...",
    duration: 1000,
  },
  {
    label: "Generating Insights",
    description: "AI is generating personalized improvement suggestions...",
    duration: 40000, // 40s to simulate LLM delay start
  },
  {
    label: "Finalizing Report",
    description: "Preparing your complete validation report...",
    duration: 5000,
  },
];

const AnalyzingSection = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [showLLMDots, setShowLLMDots] = useState(false);

  useEffect(() => {
    const advanceStage = () => {
      if (activeStage < stages.length - 1) {
        setActiveStage(activeStage + 1);
      } else {
        // Loop the LLM thinking animation
        setActiveStage(7);
      }
    };

    const timer = setTimeout(advanceStage, stages[activeStage].duration);
    return () => clearTimeout(timer);
  }, [activeStage]);

  // Show LLM thinking dots after scoring complete
  useEffect(() => {
    if (activeStage === 7) {
      setShowLLMDots(true);
    }
  }, [activeStage]);

  const currentStage = stages[activeStage];
  const isLLMStage = activeStage >= 7;

  return (
    <div className="analyzing-section-wrapper">
      <div className="analyzing-section-card">

        {/* Main spinner */}
        <div className="analyzing-main-spinner-wrap">
          <ImSpinner2 className="analyzing-main-spinner" />
        </div>

        {/* Title */}
        <h2 className="analyzing-title">Analyzing your photo</h2>

        {/* Current stage */}
        <div className="analyzing-stage-display">
          <div className="analyzing-stage-pill">
            <span className="analyzing-stage-label">{currentStage.label}</span>
          </div>
          <p className="analyzing-stage-desc">{currentStage.description}</p>
        </div>

        {/* LLM dots animation — only after scoring */}
        {showLLMDots && (
          <div className="analyzing-llm-dots">
            <span className="llm-dot" />
            <span className="llm-dot" />
            <span className="llm-dot" />
          </div>
        )}

        {/* Progress dots — smaller, subtle */}
        <div className="analyzing-progress-dots">
          {stages.slice(0, 6).map((_, index) => (
            <span
              key={index}
              className={`progress-dot ${index <= activeStage ? "progress-dot-active" : ""}`}
            />
          ))}
          <span className="progress-dot-separator" />
          {showLLMDots && (
            <span className="progress-dot progress-dot-llm" />
          )}
        </div>

        {/* Subtle note */}
        <p className="analyzing-status-note">
          {isLLMStage 
            ? "AI is generating personalized suggestions (this may take up to 2 minutes)..."
            : "Usually takes 5-10 seconds for technical analysis"
          }
        </p>

      </div>
    </div>
  );
};

export default AnalyzingSection;
