import React, { useState } from 'react';
import { toast } from 'sonner';
import UploadSection from "../../components/validator/UploadSection";
import AnalyzingSection from "../../components/validator/AnalyzingSection";
import ResultSection from "../../components/validator/ResultSection";
import photoValidatorService from "../../services/photoValidatorService";
import "../../styles/validator/Validator.css";

const ProfileValidatorPage = () => {
  const [step, setStep] = useState("upload");
  const [result, setResult] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleUpload = async (file) => {
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
    setStep("analyzing");
    toast.loading("Analyzing your photo...");

    try {
      const validationResult = await photoValidatorService.validatePhoto(file);
      setResult(validationResult);
      setStep("result");
      toast.dismiss();
      toast.success("Photo analysis complete!");
    } catch (error) {
      console.error("Error validating the photo:", error);
      setStep("upload");
      setImageUrl(null);
      toast.dismiss();

      // Match same error handling pattern as login
      let errorMessage = "There was an issue with the validation. Please try again.";
      if (error.response) {
        const status = error.response.status;
        const data   = error.response.data;
        if (status === 400)      errorMessage = data?.message || "Invalid photo. Please upload a valid image.";
        else if (status === 401) errorMessage = "Session expired. Please log in again.";
        else if (status === 403) errorMessage = "You are not authorized to use this feature.";
        else if (status === 413) errorMessage = "Photo is too large. Please upload a smaller image.";
        else if (status === 429) errorMessage = "Too many requests. Please wait and try again.";
        else if (status >= 500)  errorMessage = "Server error. Please try again later.";
        else                     errorMessage = data?.message || `Error: ${status}`;
      } else if (error.message === "Network Error") {
        errorMessage = "No connection. Please check your internet.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setResult(null);
    setImageUrl(null);
    toast.info("Ready for a new photo upload.");
  };

  return (
    <div className="validator-page">
      {step === "upload"    && <UploadSection onUpload={handleUpload} />}
      {step === "analyzing" && <AnalyzingSection />}
      {step === "result"    && (
        <ResultSection
          result={result}
          imageUrl={imageUrl}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default ProfileValidatorPage;
