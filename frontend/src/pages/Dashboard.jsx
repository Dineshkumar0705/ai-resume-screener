import { useState } from "react";
import CandidateModal from "../components/CandidateModal";
import { analyzeResumes } from "../services/api";
import Loader from "../components/Loader";
import "../styles/dashboard.css";

export default function Dashboard() {
  // ===================== STATE =====================
  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // ===================== HELPERS =====================
  const scoreClass = (score = 0) => {
    if (score >= 70) return "strong";
    if (score >= 40) return "moderate";
    return "weak";
  };

  // ===================== CORE ACTION =====================
  const handleAnalyze = async () => {
    setError("");
    setResults([]);

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one resume (PDF).");
      return;
    }

    try {
      setLoading(true);

      const data = await analyzeResumes(
        jobDescription.trim(),
        files
      );

      if (!data || !Array.isArray(data.results)) {
        throw new Error("Invalid response from backend");
      }

      setResults(data.results);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        err.message ||
          "Failed to analyze resumes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================== UI =====================
  return (
    <div className="app">
      <div className="main-wrapper">

        {/* ================= HEADER ================= */}
        <header className="centered-header">
          <h1 className="app-title">AI Resume Screener</h1>
          <p className="app-subtitle">Recruiter Dashboard</p>
        </header>

        {/* ================= UPLOAD CARD ================= */}
        <section className="upload-card">
          <div className="upload-header">
            <h2 className="upload-title">Analyze Resumes</h2>
            <p className="upload-subtitle">
              Paste job description and upload candidate resumes
            </p>
          </div>

          <textarea
            className="jd-textarea"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <div className="upload-row">
            <label className="file-upload">
              Upload Resumes (PDF)
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) =>
                  setFiles(Array.from(e.target.files))
                }
              />
            </label>

            <button
              className="primary-btn"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Resumes"}
            </button>
          </div>

          {files.length > 0 && (
            <p className="file-info-highlight">
              {files.length} resume(s) selected
            </p>
          )}

          {error && <p className="error">{error}</p>}
        </section>

        {/* ================= LOADER ================= */}
        {loading && (
          <Loader
            text="🌿 AI is analyzing resumes"
            subText="This may take a few seconds"
            fullScreen
          />
        )}

        {/* ================= RESULTS ================= */}
        {results.length > 0 && (
          <section className="results-section">
            <h2 className="results-title">📊 Candidates</h2>

            <div className="table-wrapper">
              <table className="results-table">
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
                      onClick={() => setSelectedCandidate(c)}
                    >
                      {/* Candidate */}
                      <td>
                        <div className="candidate-block">
                          <strong>{c.candidate_name}</strong>
                        </div>
                      </td>

                      {/* Score */}
                      <td>
                        <span
                          className={`score ${scoreClass(
                            c.final_score
                          )}`}
                        >
                          {c.final_score}%
                        </span>
                      </td>

                      {/* Verdict */}
                      <td>
                        <span className="verdict-text">
                          {c.verdict}
                        </span>
                      </td>

                      {/* Strengths (🔥 FIXED) */}
                      <td>
                        <div className="pill-group">
                          {c.strengths?.length ? (
                            c.strengths.map((s) => (
                              <span
                                key={s}
                                className="pill"
                              >
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="pill neutral">
                              Not specified
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Gaps (🔥 FIXED FOREVER) */}
                      <td>
                        <div className="gaps-group">
                          {c.gaps?.length ? (
                            c.gaps.map((g) => (
                              <span
                                key={g}
                                className="pill warning"
                              >
                                {g}
                              </span>
                            ))
                          ) : (
                            <span className="gaps-empty">
                              — No major gaps
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ================= MODAL ================= */}
        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={() =>
              setSelectedCandidate(null)
            }
          />
        )}
      </div>
    </div>
  );
}