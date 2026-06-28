const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export async function validateTokenOnBackend(token: string) {
  const response = await fetch(`${API_URL}/api/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })

  if (!response.ok) {
    throw new Error('Token invalido no backend')
  }

  return response.json()
}
