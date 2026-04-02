import { NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(150),
  phone: z.string().min(6).max(50),
  interest: z.string().min(1).max(180),
  message: z.string().min(10).max(1200),
})

const GHL_BASE_URL = "https://services.leadconnectorhq.com"
const GHL_VERSION = "2021-07-28"

function getContactId(payload: any) {
  return (
    payload?.contact?.id ??
    payload?.contact?._id ??
    payload?.id ??
    payload?.data?.id ??
    payload?.data?.contact?.id ??
    payload?.data?.contactId ??
    null
  )
}

function formatContactNote(data: z.infer<typeof contactSchema>) {
  return [
    "Landing contact inquiry",
    "",
    `Full name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Interest: ${data.interest}`,
    "",
    "Message:",
    data.message,
  ].join("\n")
}

function buildOpportunityName(data: z.infer<typeof contactSchema>) {
  const baseName = `${data.firstName} ${data.lastName}`.trim()
  return `Website Lead - ${baseName}`
}

function getHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Version: GHL_VERSION,
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GHL_API_KEY
    const locationId = process.env.GHL_LOCATION_ID
    const pipelineId = process.env.GHL_OPPORTUNITY_PIPELINE_ID
    const pipelineStageId = process.env.GHL_OPPORTUNITY_STAGE_ID

    if (!apiKey || !locationId) {
      return NextResponse.json(
        {
          error:
            "El formulario ya esta listo, pero falta configurar GHL. Agrega GHL_API_KEY y GHL_LOCATION_ID en las variables de entorno.",
        },
        { status: 500 },
      )
    }

    const rawBody = await request.json()
    const data = contactSchema.parse(rawBody)

    const upsertResponse = await fetch(`${GHL_BASE_URL}/contacts/upsert`, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify({
        locationId,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
      }),
      cache: "no-store",
    })

    const upsertPayload = await upsertResponse.json()

    if (!upsertResponse.ok) {
      return NextResponse.json(
        {
          error: upsertPayload?.message || upsertPayload?.error || "No se pudo crear o actualizar el contacto en GHL.",
        },
        { status: upsertResponse.status },
      )
    }

    const contactId = getContactId(upsertPayload)

    if (!contactId) {
      return NextResponse.json(
        {
          error:
            "GHL respondio sin un contactId reconocible. Revisemos la respuesta real una vez que conectemos tu API key.",
        },
        { status: 502 },
      )
    }

    const noteResponse = await fetch(`${GHL_BASE_URL}/contacts/${contactId}/notes`, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify({
        locationId,
        body: formatContactNote(data),
      }),
      cache: "no-store",
    })

    if (!noteResponse.ok) {
      const notePayload = await noteResponse.json().catch(() => null)

      return NextResponse.json(
        {
          error:
            notePayload?.message ||
            notePayload?.error ||
            "El contacto se creo en GHL, pero no se pudo adjuntar la nota con el mensaje.",
        },
        { status: noteResponse.status },
      )
    }

    if (pipelineId && pipelineStageId) {
      const opportunityResponse = await fetch(`${GHL_BASE_URL}/opportunities/`, {
        method: "POST",
        headers: getHeaders(apiKey),
        body: JSON.stringify({
          locationId,
          contactId,
          pipelineId,
          pipelineStageId,
          name: buildOpportunityName(data),
          source: "website",
          status: "open",
          monetaryValue: 0,
        }),
        cache: "no-store",
      })

      if (!opportunityResponse.ok) {
        const opportunityPayload = await opportunityResponse.json().catch(() => null)

        return NextResponse.json(
          {
            error:
              opportunityPayload?.message ||
              opportunityPayload?.error ||
              "El contacto se creo en GHL, pero no se pudo crear la oportunidad en el pipeline configurado.",
          },
          { status: opportunityResponse.status },
        )
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Por favor completa todos los campos correctamente." }, { status: 400 })
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Ocurrio un error inesperado al enviar la informacion.",
      },
      { status: 500 },
    )
  }
}
