import "../styles/dashboard.css";

export default function Loader({
  text = "Analyzing resumes using AI…",
  subText = "This may take a few seconds. Please wait.",
  fullScreen = false
}) {
  return (
    <div
      className={`loader-container ${
        fullScreen ? "loader-fullscreen" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loader-card">
        {/* Spinner */}
        <div className="spinner" />

        {/* Text */}
        <div className="loader-text">
          <p className="loader-main-text">{text}</p>
          {subText && (
            <span className="loader-sub-text">
              {subText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}