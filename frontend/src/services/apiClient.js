export async function apiClient(path, options = {}) {
  const response = await fetch(path, options)
  if (!response.ok) {
    throw new Error('API request failed')
  }
  return response.json()
}