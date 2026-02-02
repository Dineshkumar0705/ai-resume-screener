export default function UploadJD({ value, onChange }) {
  const charCount = value.length;
  const recommendedMin = 50;
  const isLow = charCount > 0 && charCount < recommendedMin;

  return (
    <div className="upload-section jd-section">
      {/* ---------- Label ---------- */}
      <label className="upload-label">
        Job Description
        <span className="hint">
          Recommended minimum {recommendedMin} characters
        </span>
      </label>

      {/* ---------- Textarea ---------- */}
      <textarea
        className={`jd-textarea ${isLow ? "low" : ""}`}
        placeholder="Paste the job description here…  
Include role responsibilities, required skills, tools, experience level, and expectations."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Job Description"
      />

      {/* ---------- Footer ---------- */}
      <div className="jd-footer">
        <span
          className={`char-count ${
            isLow ? "warn" : "ok"
          }`}
        >
          {charCount} characters
        </span>

        {isLow && (
          <span className="jd-warning">
            Add more detail for better AI accuracy
          </span>
        )}

        {!isLow && charCount >= recommendedMin && (
          <span className="jd-good">
            ✓ Good level of detail
          </span>
        )}
      </div>
    </div>
  );
}