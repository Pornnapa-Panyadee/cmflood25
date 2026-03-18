import "server-only"

import { createHmac, timingSafeEqual } from "crypto"

const SESSION_COOKIE_NAME = "cmflood_session"
const SESSION_DURATION_SECONDS = 60 * 60 * 12

function getAuthConfig() {
  const username = process.env.LOGIN_USER?.trim() || process.env.NEXT_PUBLIC_LOGIN_USER?.trim()
  const passwordHash = process.env.LOGIN_HASH?.trim() || process.env.NEXT_PUBLIC_LOGIN_HASH?.trim()
  const sessionSecret = process.env.SESSION_SECRET?.trim()

  if (!username || !passwordHash || !sessionSecret) {
    throw new Error("Missing auth environment variables")
  }

  return { username, passwordHash, sessionSecret }
}

function createSignature(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex")
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME
}

export function getSessionMaxAge() {
  return SESSION_DURATION_SECONDS
}

export function isValidLogin(username: string, passwordHash: string) {
  const config = getAuthConfig()
  return username === config.username && passwordHash === config.passwordHash
}

export function createSessionValue(username: string) {
  const config = getAuthConfig()
  const payload = `${username}:${Date.now()}`
  const signature = createSignature(payload, config.sessionSecret)
  return `${payload}.${signature}`
}

export function verifySessionValue(sessionValue?: string | null) {
  if (!sessionValue) return false

  const config = getAuthConfig()
  const parts = sessionValue.split(".")

  if (parts.length !== 2) return false

  const [payload, signature] = parts
  const expectedSignature = createSignature(payload, config.sessionSecret)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (actualBuffer.length !== expectedBuffer.length) return false

  return timingSafeEqual(actualBuffer, expectedBuffer)
}
