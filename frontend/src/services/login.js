import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/login'
const storageKey = 'presentware-user'
const expiredEventName = 'presentware:auth-expired'

const getTokenExpiration = token => {
  const payload = token.split('.')[1]
  if (!payload) {
    return null
  }

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const binaryPayload = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
    const payloadBytes = Uint8Array.from(binaryPayload, character =>
      character.charCodeAt(0)
    )
    const decodedPayload = JSON.parse(new TextDecoder().decode(payloadBytes))
    return Number.isFinite(decodedPayload.exp) ? decodedPayload.exp * 1000 : null
  } catch {
    return null
  }
}

const clearSession = () => {
  localStorage.removeItem(storageKey)
}

const getSession = () => {
  const storedSession = localStorage.getItem(storageKey)
  if (!storedSession) {
    return null
  }

  let session
  try {
    session = JSON.parse(storedSession)
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error
    }
    clearSession()
    return null
  }

  if (
    !session ||
    typeof session.token !== 'string' ||
    !session.user ||
    typeof session.user !== 'object' ||
    !Number.isFinite(session.expiresAt) ||
    session.expiresAt <= Date.now()
  ) {
    clearSession()
    return null
  }

  return session
}

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  const { token, ...user } = response.data
  const expiresAt = typeof token === 'string' ? getTokenExpiration(token) : null

  if (!expiresAt || expiresAt <= Date.now()) {
    throw new Error('Login response did not contain a valid, active token')
  }

  localStorage.setItem(storageKey, JSON.stringify({ token, user, expiresAt }))
  return { ...user, token }
}

const getLoggedInUser = () => {
  const session = getSession()
  return session ? { ...session.user, token: session.token } : null
}

const getToken = () => getSession()?.token ?? null

const getExpiration = () => getSession()?.expiresAt ?? null

const updateLoggedInUser = updatedUser => {
  const session = getSession()
  if (!session) {
    throw new Error('Cannot update user without an active session')
  }

  const user = { ...session.user, ...updatedUser }
  localStorage.setItem(
    storageKey,
    JSON.stringify({ ...session, user })
  )
  return { ...user, token: session.token }
}

axios.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response?.status === 401 &&
      error.config?.url !== baseUrl &&
      getSession()
    ) {
      clearSession()
      window.dispatchEvent(new Event(expiredEventName))
    }
    return Promise.reject(error)
  }
)

export default {
  login,
  logout: clearSession,
  getLoggedInUser,
  getToken,
  getExpiration,
  updateLoggedInUser,
  expiredEventName,
}