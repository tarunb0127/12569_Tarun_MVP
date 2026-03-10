import React, { useRef, useState } from 'react';
import { Upload, Zap, FileImage, X } from 'lucide-react';
import '../../styles/validator/UploadSection.css';

const UploadSection = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    fileInputRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (selectedFile) onUpload(selectedFile);
  };

  return (
    <div className="upload-wrapper">
      <div className="instant-badge">
        <Zap size={13} /> Instant Validation
      </div>

      <h1 className="upload-title">Validate Your Profile Photo</h1>
      <p className="upload-subtitle">
        Get instant professional feedback on your photo. Analyze<br />
        brightness, clarity, face detection, and orientation and get AI-Powered insights.
      </p>

      {/* ── Upload Area ── */}
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div className="upload-icon-wrap">
          <Upload size={28} color="#fff" />
        </div>

        <p className="upload-cta">
          <span className="click-text">Click to upload</span> or drag and drop
        </p>
        <p className="file-types">PNG, JPG, WEBP • Max 10MB</p>

        <div className="instant-ready-pill">
          <span className="green-dot" />
          Instant analysis ready
        </div>
      </div>

      {/* ── File Name + Analyze Button ── */}
      {selectedFile && (
        <div className="file-selected-row">
          <FileImage size={16} color="#6366f1" />
          <span className="selected-filename">{selectedFile.name}</span>
          <button className="remove-btn" onClick={handleRemove}>
            <X size={14} />
          </button>

          <button className="analyze-btn" onClick={handleAnalyze}>
            <Zap size={15} />
            Analyze Photo
          </button>
        </div>
      )}

    </div>
  );
};

export default UploadSection;
