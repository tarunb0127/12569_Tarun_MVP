// src/components/common/ProfilePhotoValidatorInfo.jsx

import "../../styles/common/ProfilePhotoValidatorInfo.css";

const checks = [
  {
    title: "Face Detection",
    description:
      "The system ensures that a clear human face is detected in the image. Photos without a visible face will not pass validation.",
  },
  {
    title: "Single Person Check",
    description:
      "Professional profile photos should contain only one person. Images with multiple faces are flagged.",
  },
  {
    title: "Brightness Analysis",
    description:
      "The image is analyzed to ensure lighting is balanced and the face is clearly visible.",
  },
  {
    title: "Image Clarity",
    description:
      "Blurry or low-resolution images are detected and flagged as unsuitable for professional use.",
  },
  {
    title: "Face Alignment",
    description:
      "The AI checks if your face is properly centered and aligned for a professional presentation.",
  },
  {
    title: "Background Quality",
    description:
      "Busy or distracting backgrounds may reduce professionalism. The AI evaluates background simplicity.",
  },
];

const ProfilePhotoValidatorInfo = () => {
  return (
    <div className="pv-wrapper">
      <div className="pv-header">
        <h2 className="pv-title">How Our AI Validates Your Profile Photo</h2>
        <p className="pv-subtitle">
          Our AI analyzes your image to determine whether it is suitable for
          professional platforms like LinkedIn, resumes, and company profiles.
        </p>
      </div>

      <div className="pv-grid">
        {checks.map((check, index) => (
          <div className="pv-card" key={index}>
            <h3 className="pv-card-title">{check.title}</h3>
            <p className="pv-card-desc">{check.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePhotoValidatorInfo;
