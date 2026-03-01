import { apiClient } from "./apiClient";

export async function textGenerateService(payload) {
  return apiClient("/api/text/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
