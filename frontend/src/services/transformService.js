import { apiClient } from './apiClient'

export async function transformService(payload) {
  return apiClient('/api/transform', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}