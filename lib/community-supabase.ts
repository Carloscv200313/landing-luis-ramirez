import "server-only"

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

export type ApprovedGalleryImage = {
  id: string
  title: string
  imageUrl: string
  submittedBy: string | null
}

export type TestimonialSubmissionInput = {
  name: string
  role: string
  quote: string
}

export type GallerySubmissionInput = {
  title: string
  submittedBy: string
  imageUrl: string
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const storageBucket = process.env.SUPABASE_STORAGE_BUCKET

  return {
    url,
    serviceRoleKey,
    storageBucket,
    configured: Boolean(url && serviceRoleKey && storageBucket),
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

  if (!config.url || !config.serviceRoleKey || !config.storageBucket) {
    throw new Error(
      "Falta configurar Supabase. Agrega SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY y SUPABASE_STORAGE_BUCKET.",
    )
  }

  return {
    url: config.url,
    serviceRoleKey: config.serviceRoleKey,
    storageBucket: config.storageBucket,
  } as {
    url: string
    serviceRoleKey: string
    storageBucket: string
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

export async function fetchApprovedTestimonials(): Promise<ApprovedTestimonial[]> {
  const config = getSupabaseConfig()

  if (!config.configured || !config.url || !config.serviceRoleKey) {
    return []
  }

  const response = await fetch(
    `${config.url}/rest/v1/${testimonialTable}?select=id,name,role,quote,avatar_url,rating&status=eq.approved&order=created_at.desc`,
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
  }>

  return payload.map((item) => ({
    id: item.id,
    name: item.name,
    role: item.role,
    quote: item.quote,
    avatarUrl: item.avatar_url,
    rating: item.rating ?? 5,
  }))
}

export async function fetchApprovedGalleryImages(): Promise<ApprovedGalleryImage[]> {
  const config = getSupabaseConfig()

  if (!config.configured || !config.url || !config.serviceRoleKey) {
    return []
  }

  const response = await fetch(
    `${config.url}/rest/v1/${galleryTable}?select=id,title,image_url,submitted_by&status=eq.approved&order=created_at.desc`,
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
  }>

  return payload.map((item) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.image_url,
    submittedBy: item.submitted_by,
  }))
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
      rating: 5,
      status: "pending",
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    const payload = await response.text()
    throw new Error(payload || "No se pudo guardar el testimonio.")
  }
}

function getExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase()

  if (fromName && ["jpg", "jpeg", "png", "webp"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName
  }

  if (file.type === "image/png") return "png"
  if (file.type === "image/webp") return "webp"
  return "jpg"
}

export async function uploadGalleryImage(file: File, submittedBy: string, title: string) {
  const { url, serviceRoleKey, storageBucket } = ensureConfigured()
  const extension = getExtension(file)
  const basename = slugify(`${submittedBy || "community"}-${title || "image"}`) || "community-image"
  const objectPath = `community/${Date.now()}-${basename}.${extension}`

  const response = await fetch(`${url}/storage/v1/object/${storageBucket}/${objectPath}`, {
    method: "POST",
    headers: {
      ...getHeaders(serviceRoleKey, file.type || "application/octet-stream"),
      "x-upsert": "false",
    },
    body: Buffer.from(await file.arrayBuffer()),
    cache: "no-store",
  })

  if (!response.ok) {
    const payload = await response.text()
    throw new Error(payload || "No se pudo subir la imagen.")
  }

  return `${url}/storage/v1/object/public/${storageBucket}/${objectPath}`
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
