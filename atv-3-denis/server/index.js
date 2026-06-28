import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

dotenv.config()

const app = express()
const port = process.env.PORT ?? 3001

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }))
app.use(express.json())

function getCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return applicationDefault()
  }

  return undefined
}

if (!getApps().length) {
  const credential = getCredential()
  initializeApp(credential ? { credential } : undefined)
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'atv-3-auth-api' })
})

app.post('/api/auth/verify', async (request, response) => {
  const token = request.body?.token

  if (!token) {
    return response.status(400).json({ valid: false, message: 'Token nao informado' })
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token)
    return response.json({
      valid: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      provider: decodedToken.firebase?.sign_in_provider,
    })
  } catch (error) {
    return response.status(401).json({
      valid: false,
      message: 'Token invalido ou expirado',
      detail: error instanceof Error ? error.message : 'Erro desconhecido',
    })
  }
})

app.listen(port, () => {
  console.log(`Backend de autenticacao rodando em http://localhost:${port}`)
})
