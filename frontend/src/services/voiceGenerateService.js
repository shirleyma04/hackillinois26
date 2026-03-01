import { apiClient } from "./apiClient";

export async function voiceGenerateService(payload) {
  return apiClient("/api/voice/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
