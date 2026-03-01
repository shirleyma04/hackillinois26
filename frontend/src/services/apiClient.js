export async function apiClient(path, options = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  const url = `${baseUrl}${path}`

  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error('API request failed')
  }
  return response.json()
}