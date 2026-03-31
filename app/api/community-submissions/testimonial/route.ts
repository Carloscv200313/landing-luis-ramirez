import { NextResponse } from "next/server"
import { z } from "zod"
import { insertTestimonialSubmission, isCommunityConfigured } from "@/lib/community-supabase"

const testimonialSubmissionSchema = z.object({
  name: z.string().min(2).max(120),
  role: z.string().min(2).max(120),
  quote: z.string().min(20).max(700),
})

export async function POST(request: Request) {
  try {
    if (!isCommunityConfigured()) {
      return NextResponse.json(
        {
          error:
            "La seccion comunitaria ya esta lista, pero falta configurar Supabase en el servidor para recibir testimonios.",
        },
        { status: 500 },
      )
    }

    const rawBody = await request.json()
    const data = testimonialSubmissionSchema.parse(rawBody)

    await insertTestimonialSubmission(data)

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Completa tu nombre, tu rol y un testimonio mas claro antes de enviarlo.",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No pudimos guardar tu testimonio en este momento.",
      },
      { status: 500 },
    )
  }
}
