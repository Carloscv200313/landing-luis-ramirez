import "server-only"

import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

const ADMIN_SESSION_COOKIE = "luis_admin_session"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12

function getAdminConfig() {
  return {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.ADMIN_SESSION_SECRET,
  }
}

function ensureAdminConfig() {
  const config = getAdminConfig()

  if (!config.username || !config.password || !config.sessionSecret) {
    throw new Error(
      "Falta configurar el acceso admin. Agrega ADMIN_USERNAME, ADMIN_PASSWORD y ADMIN_SESSION_SECRET.",
    )
  }

  return config as {
    username: string
    password: string
    sessionSecret: string
  }
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

function signValue(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url")
}

function createToken(username: string, secret: string) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    }),
  ).toString("base64url")

  const signature = signValue(payload, secret)
  return `${payload}.${signature}`
}

function parseToken(token: string | undefined | null) {
  if (!token) {
    return null
  }

  const [payload, signature] = token.split(".")

  if (!payload || !signature) {
    return null
  }

  const { username, sessionSecret } = ensureAdminConfig()
  const expectedSignature = signValue(payload, sessionSecret)

  if (!safeEqual(signature, expectedSignature)) {
    return null
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: string
      exp?: number
    }

    if (!parsed.username || !parsed.exp) {
      return null
    }

    if (parsed.exp < Date.now()) {
      return null
    }

    if (!safeEqual(parsed.username, username)) {
      return null
    }

    return {
      username: parsed.username,
      exp: parsed.exp,
    }
  } catch {
    return null
  }
}

export function isAdminAuthConfigured() {
  const config = getAdminConfig()
  return Boolean(config.username && config.password && config.sessionSecret)
}

export function verifyAdminCredentials(inputUsername: string, inputPassword: string) {
  const { username, password } = ensureAdminConfig()
  return safeEqual(inputUsername, username) && safeEqual(inputPassword, password)
}

export async function createAdminSession() {
  const cookieStore = await cookies()
  const { username, sessionSecret } = ensureAdminConfig()

  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: createToken(username, sessionSecret),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  return parseToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminSession())
}
