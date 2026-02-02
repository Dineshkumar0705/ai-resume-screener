import { useState } from "react";
import UploadJD from "./UploadJD";
import UploadResumes from "./UploadResumes";
import Loader from "./Loader";
import "../styles/dashboard.css";

export default function UploadForm({ onAnalyze }) {
  // ================= STATE =================
  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one resume (PDF).");
      return;
    }

    const formData = new FormData();
    formData.append("job_description", jobDescription.trim());
    files.forEach((file) => formData.append("resumes", file));

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.results)) {
        throw new Error("Invalid API response format");
      }

      onAnalyze(data.results);
    } catch (err) {
      console.error("UploadForm error:", err);
      setError(
        "Unable to analyze resumes right now. Please ensure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <section className="upload-section-wrapper">
      <form className="upload-card polished" onSubmit={handleSubmit}>
        {/* ---------- Title ---------- */}
        <div className="upload-header">
          <h2 className="upload-title">Resume Analysis</h2>
          <p className="upload-subtitle">
            Upload job description and resumes to evaluate candidates using AI
          </p>
        </div>

        {/* ---------- Job Description ---------- */}
        <UploadJD value={jobDescription} onChange={setJobDescription} />

        {/* ---------- Resume Upload ---------- */}
        <UploadResumes onFilesChange={setFiles} />

        {/* ---------- File Info ---------- */}
        {files.length > 0 && (
          <p className="file-info-highlight">
            📄 {files.length} resume(s) selected
          </p>
        )}

        {/* ---------- Error ---------- */}
        {error && <p className="error centered">{error}</p>}

        {/* ---------- Action ---------- */}
        <div className="upload-action">
          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Analyzing…" : "Analyze Resumes"}
          </button>
        </div>

        {/* ---------- Loader ---------- */}
        {loading && (
          <Loader
            text="🌿 AI is analyzing resumes"
            subText="This may take a few seconds"
          />
        )}
      </form>
    </section>
  );
}