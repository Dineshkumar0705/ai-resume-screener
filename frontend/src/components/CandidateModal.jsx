import "../styles/dashboard.css";

export default function CandidateModal({ candidate, onClose }) {
  if (!candidate) return null;

  const {
    candidate_name,
    explanation,
    strengths = [],
    gaps = []
  } = candidate;

  const improvementTips = gaps.length
    ? gaps.map(
        (g) =>
          `Build hands-on projects or real-world experience related to ${g}.`
      )
    : ["Continue strengthening your existing skills and practical exposure."];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <header className="modal-header">
          <div>
            <h3 className="modal-title">{candidate_name}</h3>
            <span className="modal-subtitle">
              Detailed Candidate Evaluation
            </span>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </header>

        {/* ================= CONTENT ================= */}
        <div className="modal-content">
          {/* ---------- Assessment ---------- */}
          <section className="modal-section">
            <h4>Overall Assessment</h4>
            <p className="muted-text">{explanation}</p>
          </section>

          {/* ---------- Strengths ---------- */}
          <section className="modal-section">
            <h4>Key Strengths</h4>
            <div className="pill-group">
              {strengths.length > 0 ? (
                strengths.map((s) => (
                  <span key={s} className="pill">
                    {s}
                  </span>
                ))
              ) : (
                <span className="pill neutral">
                  No strong matches identified
                </span>
              )}
            </div>
          </section>

          {/* ---------- Improvements ---------- */}
          <section className="modal-section">
            <h4>Areas to Improve</h4>
            <ul className="improvement-list">
              {improvementTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </section>

          {/* ---------- Email Preview ---------- */}
          <section className="modal-section mail-preview">
            <h4>Email Preview (Future Automation)</h4>

            <div className="email-card">
              <p>
                Dear <strong>{candidate_name}</strong>,
                <br />
                <br />
                Thank you for applying for this role. After reviewing your
                profile, we found that while you have good potential,
                strengthening the following areas would improve alignment with
                this position:
                <br />
                <br />
                <strong>
                  {gaps.length > 0
                    ? gaps.join(", ")
                    : "No major gaps identified"}
                </strong>
                .
                <br />
                <br />
                We encourage you to continue learning, build practical projects,
                and apply again in the future.
                <br />
                <br />
                Regards,
                <br />
                Recruitment Team
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}