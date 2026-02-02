import { useState } from "react";

export default function UploadResumes({ onFilesChange }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const MAX_SIZE_MB = 5;

  const handleChange = (e) => {
    setError("");
    const selectedFiles = Array.from(e.target.files);

    const validFiles = [];
    const rejectedFiles = [];

    selectedFiles.forEach((file) => {
      if (file.type !== "application/pdf") {
        rejectedFiles.push(`${file.name} (Not a PDF)`);
      } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        rejectedFiles.push(`${file.name} (Exceeds ${MAX_SIZE_MB}MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (rejectedFiles.length > 0) {
      setError(
        `Some files were skipped: ${rejectedFiles.join(", ")}`
      );
    }

    setFiles(validFiles);
    onFilesChange(validFiles);
  };

  return (
    <div className="upload-section resumes-section">
      {/* ---------- Label ---------- */}
      <label className="upload-label">
        Upload Resumes
        <span className="hint">
          PDF only · Max {MAX_SIZE_MB}MB per file
        </span>
      </label>

      {/* ---------- Drop Zone ---------- */}
      <label className="file-drop">
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleChange}
          aria-label="Upload resumes"
        />
        <div className="file-drop-content">
          <span className="file-icon">📄</span>
          <span className="file-main-text">
            Click to upload or drag & drop
          </span>
          <span className="file-sub-text">
            Upload one or more PDF resumes
          </span>
        </div>
      </label>

      {/* ---------- Error ---------- */}
      {error && <p className="error">{error}</p>}

      {/* ---------- File List ---------- */}
      {files.length > 0 && (
        <ul className="file-list">
          {files.map((file, idx) => (
            <li key={idx} className="file-item">
              <span className="file-name">{file.name}</span>
              <span className="file-size">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* ---------- Empty Hint ---------- */}
      {files.length === 0 && !error && (
        <p className="file-hint">
          No resumes uploaded yet
        </p>
      )}
    </div>
  );
}