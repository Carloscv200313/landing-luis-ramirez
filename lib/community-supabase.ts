import "server-only"

import { createHash } from "crypto"

const testimonialTable = "testimonial_submissions"
const galleryTable = "gallery_submissions"

export type ApprovedTestimonial = {
  id: string
  name: string
  role: string
  quote: string
  avatarUrl: string | null
  rating: number
}

export type ModerationTestimonial = ApprovedTestimonial & {
  createdAt: string
  status: "pending" | "approved" | "rejected"
}

export type ApprovedGalleryImage = {
  id: string
  title: string
  imageUrl: string
  submittedBy: string | null
  cloudinaryPublicId: string | null
}

export type ModerationGalleryImage = ApprovedGalleryImage & {
  createdAt: string
  status: "pending" | "approved" | "rejected"
}

export type TestimonialSubmissionInput = {
  name: string
  role: string
  quote: string
  rating: number
}

export type GallerySubmissionInput = {
  title: string
  submittedBy: string
  imageUrl: string
  cloudinaryPublicId: string
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return {
    url,
    serviceRoleKey,
    configured: Boolean(url && serviceRoleKey),
  }
}

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const folder = process.env.CLOUDINARY_FOLDER || "luis-community"

  return {
    cloudName,
    apiKey,
    apiSecret,
    folder,
    configured: Boolean(cloudName && apiKey && apiSecret),
  }
}

function getHeaders(serviceRoleKey: string, contentType = "application/json") {
  return {
    Authorization: `Bearer ${serviceRoleKey}`,
    apikey: serviceRoleKey,
    "Content-Type": contentType,
  }
}

function ensureConfigured() {
  const config = getSupabaseConfig()

  if (!config.url || !config.serviceRoleKey) {
    throw new Error("Falta configurar Supabase. Agrega SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.")
  }

  return {
    url: config.url,
    serviceRoleKey: config.serviceRoleKey,
  } as {
    url: string
    serviceRoleKey: string
  }
}

function ensureCloudinaryConfigured() {
  const config = getCloudinaryConfig()

  if (!config.cloudName || !config.apiKey || !config.apiSecret) {
    throw new Error(
      "Falta configurar Cloudinary. Agrega CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.",
    )
  }

  return {
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    apiSecret: config.apiSecret,
    folder: config.folder,
  } as {
    cloudName: string
    apiKey: string
    apiSecret: string
    folder: string
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function isCommunityConfigured() {
  return getSupabaseConfig().configured
}

export function isGallerySubmissionConfigured() {
  return getSupabaseConfig().configured && getCloudinaryConfig().configured
}

async function fetchTestimonialsByStatus(
  status: "pending" | "approved" | "rejected",
): Promise<ModerationTestimonial[]> {
  const config = getSupabaseConfig()

  if (!config.configured || !config.url || !config.serviceRoleKey) {
    return []
  }

  const response = await fetch(
    `${config.url}/rest/v1/${testimonialTable}?select=id,name,role,quote,avatar_url,rating,status,created_at&status=eq.${status}&order=created_at.asc`,
    {
      headers: getHeaders(config.serviceRoleKey),
      cache: "no-store",
    },
  )

  if (!response.ok) {
    return []
  }

  const payload = (await response.json()) as Array<{
    id: string
    name: string
    role: string
    quote: string
    avatar_url: string | null
    rating: number | null
    status: "pending" | "approved" | "rejected"
    created_at: string
  }>

  return payload.map((item) => ({
    id: item.id,
    name: item.name,
    role: item.role,
    quote: item.quote,
    avatarUrl: item.avatar_url,
    rating: item.rating ?? 5,
    status: item.status,
    createdAt: item.created_at,
  }))
}

export async function fetchApprovedTestimonials(): Promise<ApprovedTestimonial[]> {
  const payload = await fetchTestimonialsByStatus("approved")
  return payload.map((item) => ({
    id: item.id,
    name: item.name,
    role: item.role,
    quote: item.quote,
    avatarUrl: item.avatarUrl,
    rating: item.rating,
  }))
}

export async function fetchPendingTestimonials(): Promise<ModerationTestimonial[]> {
  return fetchTestimonialsByStatus("pending")
}

async function fetchGalleryByStatus(
  status: "pending" | "approved" | "rejected",
): Promise<ModerationGalleryImage[]> {
  const config = getSupabaseConfig()

  if (!config.configured || !config.url || !config.serviceRoleKey) {
    return []
  }

  const response = await fetch(
    `${config.url}/rest/v1/${galleryTable}?select=id,title,image_url,submitted_by,cloudinary_public_id,status,created_at&status=eq.${status}&order=created_at.asc`,
    {
      headers: getHeaders(config.serviceRoleKey),
      cache: "no-store",
    },
  )

  if (!response.ok) {
    return []
  }

  const payload = (await response.json()) as Array<{
    id: string
    title: string
    image_url: string
    submitted_by: string | null
    cloudinary_public_id: string | null
    status: "pending" | "approved" | "rejected"
    created_at: string
  }>

  return payload.map((item) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.image_url,
    submittedBy: item.submitted_by,
    cloudinaryPublicId: item.cloudinary_public_id,
    status: item.status,
    createdAt: item.created_at,
  }))
}

export async function fetchApprovedGalleryImages(): Promise<ApprovedGalleryImage[]> {
  const payload = await fetchGalleryByStatus("approved")
  return payload.map((item) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl,
    submittedBy: item.submittedBy,
    cloudinaryPublicId: item.cloudinaryPublicId,
  }))
}

export async function fetchPendingGalleryImages(): Promise<ModerationGalleryImage[]> {
  return fetchGalleryByStatus("pending")
}

export async function insertTestimonialSubmission(input: TestimonialSubmissionInput) {
  const { url, serviceRoleKey } = ensureConfigured()

  const response = await fetch(`${url}/rest/v1/${testimonialTable}`, {
    method: "POST",
    headers: {
      ...getHeaders(serviceRoleKey),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: input.name,
      role: input.role,
      quote: input.quote,
      rating: input.rating,
      status: "pending",
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    const payload = await response.text()
    throw new Error(payload || "No se pudo guardar el testimonio.")
  }
}

async function updateSubmissionStatus(table: string, id: string, status: "approved" | "rejected") {
  const { url, serviceRoleKey } = ensureConfigured()

  const response = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      ...getHeaders(serviceRoleKey),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ status }),
    cache: "no-store",
  })

  if (!response.ok) {
    const payload = await response.text()
    throw new Error(payload || "No se pudo actualizar el estado.")
  }
}

async function deleteSubmissionRow(table: string, id: string) {
  const { url, serviceRoleKey } = ensureConfigured()

  const response = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      ...getHeaders(serviceRoleKey),
      Prefer: "return=minimal",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const payload = await response.text()
    throw new Error(payload || "No se pudo eliminar el registro.")
  }
}

function createCloudinarySignature(params: Record<string, string | number>, apiSecret: string) {
  const serialized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  return createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex")
}

export async function uploadGalleryImage(file: File, submittedBy: string, title: string) {
  const { cloudName, apiKey, apiSecret, folder } = ensureCloudinaryConfigured()
  const timestamp = Math.floor(Date.now() / 1000)
  const publicId = `${Date.now()}-${slugify(`${submittedBy}-${title}`) || "community-image"}`
  const signature = createCloudinarySignature(
    {
      folder,
      public_id: publicId,
      timestamp,
    },
    apiSecret,
  )

  const payload = new FormData()
  payload.append("file", new Blob([await file.arrayBuffer()], { type: file.type || "application/octet-stream" }), file.name)
  payload.append("api_key", apiKey)
  payload.append("timestamp", String(timestamp))
  payload.append("folder", folder)
  payload.append("public_id", publicId)
  payload.append("signature", signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: payload,
    cache: "no-store",
  })

  const result = (await response.json().catch(() => null)) as
    | {
        secure_url?: string
        public_id?: string
        error?: { message?: string }
      }
    | null

  if (!response.ok || !result?.secure_url || !result.public_id) {
    throw new Error(result?.error?.message || "No se pudo subir la imagen a Cloudinary.")
  }

  return {
    imageUrl: result.secure_url,
    cloudinaryPublicId: result.public_id,
  }
}

export async function insertGallerySubmission(input: GallerySubmissionInput) {
  const { url, serviceRoleKey } = ensureConfigured()

  const response = await fetch(`${url}/rest/v1/${galleryTable}`, {
    method: "POST",
    headers: {
      ...getHeaders(serviceRoleKey),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      title: input.title,
      image_url: input.imageUrl,
      cloudinary_public_id: input.cloudinaryPublicId,
      submitted_by: input.submittedBy,
      status: "pending",
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    const payload = await response.text()
    throw new Error(payload || "No se pudo guardar la imagen.")
  }
}

export async function approveTestimonialSubmission(id: string) {
  await updateSubmissionStatus(testimonialTable, id, "approved")
}

export async function deleteTestimonialSubmission(id: string) {
  await deleteSubmissionRow(testimonialTable, id)
}

async function getGallerySubmissionById(id: string) {
  const { url, serviceRoleKey } = ensureConfigured()

  const response = await fetch(
    `${url}/rest/v1/${galleryTable}?select=id,cloudinary_public_id&id=eq.${encodeURIComponent(id)}&limit=1`,
    {
      headers: getHeaders(serviceRoleKey),
      cache: "no-store",
    },
  )

  if (!response.ok) {
    const payload = await response.text()
    throw new Error(payload || "No se pudo leer la imagen enviada.")
  }

  const payload = (await response.json()) as Array<{
    id: string
    cloudinary_public_id: string | null
  }>

  return payload[0] ?? null
}

export async function approveGallerySubmission(id: string) {
  await updateSubmissionStatus(galleryTable, id, "approved")
}

export async function deleteGallerySubmission(id: string) {
  const { cloudName, apiKey, apiSecret } = ensureCloudinaryConfigured()
  const submission = await getGallerySubmissionById(id)

  if (submission?.cloudinary_public_id) {
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = createCloudinarySignature(
      {
        invalidate: "true",
        public_id: submission.cloudinary_public_id,
        timestamp,
      },
      apiSecret,
    )

    const payload = new URLSearchParams()
    payload.set("public_id", submission.cloudinary_public_id)
    payload.set("invalidate", "true")
    payload.set("timestamp", String(timestamp))
    payload.set("api_key", apiKey)
    payload.set("signature", signature)

    const destroyResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
      cache: "no-store",
    })

    const destroyPayload = (await destroyResponse.json().catch(() => null)) as
      | {
          result?: string
          error?: { message?: string }
        }
      | null

    if (!destroyResponse.ok) {
      throw new Error(destroyPayload?.error?.message || "No se pudo eliminar la imagen en Cloudinary.")
    }
  }

  await deleteSubmissionRow(galleryTable, id)
}
