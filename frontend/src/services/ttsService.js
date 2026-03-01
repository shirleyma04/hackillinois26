import { apiClient } from "./apiClient";

export async function ttsService(payload) {
  return apiClient("/tts/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
