/**
 * Nutritionist API helpers
 * Import these in NutritionistAI.jsx and NutritionistPatients.jsx
 */

const BASE = "http://localhost:5000";

/**
 * Send a message as nutritionist about a specific patient.
 * The backend loads full patient MemPalace context automatically.
 */
export async function nutritionistChat(
  message,
  patientId,
  nutritionistId = "nutri_demo",
) {
  const res = await fetch(`${BASE}/api/nutritionist/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      patient_id: patientId,
      nutritionist_id: nutritionistId,
    }),
  });
  const data = await res.json();
  return {
    response: data.response || "No response.",
    patientContextLoaded: data.patient_context_loaded || false,
  };
}

/**
 * Get list of all patients with their MemPalace summary.
 * Use this to populate the patient list in NutritionistPatients.jsx
 */
export async function getPatients() {
  const res = await fetch(`${BASE}/api/nutritionist/patients`);
  const data = await res.json();
  return data.patients || [];
}

/**
 * Get full patient context (profile + history + clinical notes).
 * Use this when nutritionist opens a patient's detail view.
 */
export async function getPatientDetail(patientId) {
  const res = await fetch(`${BASE}/api/nutritionist/patient/${patientId}`);
  const data = await res.json();
  return data;
}

/**
 * Save a clinical note about a patient.
 * Call this when nutritionist approves a plan or writes an observation.
 */
export async function saveClinicalNote(
  patientId,
  note,
  nutritionistId = "nutri_demo",
) {
  const res = await fetch(`${BASE}/api/nutritionist/note`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patient_id: patientId,
      note,
      nutritionist_id: nutritionistId,
    }),
  });
  return await res.json();
}

/**
 * Send a regular user chat message (existing endpoint).
 * Used in patient-side AskAI.jsx
 */
export async function userChat(message, userId, stakeholderType = "user") {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      user_id: userId,
      stakeholder_type: stakeholderType,
    }),
  });
  const data = await res.json();
  return data.response || "No response.";
}
