const BASE_URL = "http://127.0.0.1:8000";

/**
 * Analyze resumes against a job description
 * @param {string} jobDescription
 * @param {File[]} files
 * @returns {Promise<{ total_candidates: number, results: Array }>}
 */
export async function analyzeResumes(jobDescription, files) {
  // ---------------- Validation (Frontend Safety)
  if (!jobDescription || !jobDescription.trim()) {
    throw new Error("Job description is required");
  }

  if (!files || files.length === 0) {
    throw new Error("At least one resume file is required");
  }

  // ---------------- Build FormData
  const formData = new FormData();
  formData.append("job_description", jobDescription.trim());

  files.forEach((file) => {
    formData.append("resumes", file);
  });

  // ---------------- API Call
  let response;
  try {
    response = await fetch(`${BASE_URL}/analyze`, {
      method: "POST",
      body: formData
    });
  } catch (networkError) {
    // ❌ Backend not running / CORS / Network down
    console.error("❌ Network error:", networkError);
    throw new Error(
      "Cannot reach backend. Please make sure the server is running."
    );
  }

  // ---------------- Handle HTTP Errors
  if (!response.ok) {
    let errorMessage = "Failed to analyze resumes";

    try {
      const errorBody = await response.json();
      errorMessage =
        errorBody?.detail ||
        errorBody?.message ||
        JSON.stringify(errorBody);
    } catch {
      // fallback if response is not JSON
      errorMessage = await response.text();
    }

    throw new Error(errorMessage);
  }

  // ---------------- Parse JSON Safely
  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    console.error("❌ JSON parse error:", parseError);
    throw new Error("Invalid response from server");
  }

  // ---------------- Final Safety Check
  if (!data || !Array.isArray(data.results)) {
    console.error("❌ Unexpected API response:", data);
    throw new Error("Unexpected API response format");
  }

  console.log("✅ analyzeResumes success:", data);
  return data;
}