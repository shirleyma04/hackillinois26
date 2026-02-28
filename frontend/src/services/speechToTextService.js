import { apiClient } from './apiClient'

export async function speechToTextService(payload) {
  return apiClient('/api/stt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}