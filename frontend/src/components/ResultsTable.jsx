import "../styles/dashboard.css";

export default function ResultsTable({ results = [], onSelect }) {
  const scoreClass = (score = 0) => {
    if (score >= 70) return "strong";
    if (score >= 40) return "moderate";
    return "weak";
  };

  if (!results.length) return null;

  return (
    <section className="results-section">
      <h2 className="results-title">📊 Candidates</h2>

      <div className="table-wrapper">
        <table className="results-table">

          {/* 🔥 COLUMN WIDTH CONTROL (AUTHORITATIVE) */}
          <colgroup>
            <col style={{ width: "240px" }} />   {/* Candidate */}
            <col style={{ width: "120px" }} />   {/* Score */}
            <col style={{ width: "180px" }} />   {/* Verdict */}
            <col style={{ width: "35%" }} />     {/* Strengths */}
            <col style={{ width: "45%" }} />     {/* Gaps */}
          </colgroup>

          <thead>
            <tr>
              <th>Candidate</th>
              <th>Score</th>
              <th>Verdict</th>
              <th>Strengths</th>
              <th>Gaps</th>
            </tr>
          </thead>

          <tbody>
            {results.map((c, idx) => (
              <tr
                key={idx}
                className="result-row"
                onClick={() => onSelect?.(c)}
              >
                {/* ================= Candidate ================= */}
                <td className="candidate-cell">
                  <div className="candidate-block">
                    <strong>{c.candidate_name}</strong>
                  </div>
                </td>

                {/* ================= Score ================= */}
                <td className="score-cell">
                  <span className={`score ${scoreClass(c.final_score)}`}>
                    {c.final_score}%
                  </span>
                </td>

                {/* ================= Verdict ================= */}
                <td className="verdict-cell">
                  <span className="verdict-text">
                    {c.verdict}
                  </span>
                </td>

                {/* ================= Strengths ================= */}
                <td className="strengths-cell">
                  <div className="pill-group">
                    {c.strengths && c.strengths.length > 0 ? (
                      c.strengths.map((skill) => (
                        <span key={skill} className="pill">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="pill neutral">Not specified</span>
                    )}
                  </div>
                </td>

                {/* ================= Gaps (FIXED FOREVER) ================= */}
                <td className="gaps-cell">
                  <div className="gaps-group">
                    {c.gaps && c.gaps.length > 0 ? (
                      c.gaps.map((gap) => (
                        <span key={gap} className="pill warning">
                          {gap}
                        </span>
                      ))
                    ) : (
                      <div className="gaps-empty">
                        — No major gaps
                      </div>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}