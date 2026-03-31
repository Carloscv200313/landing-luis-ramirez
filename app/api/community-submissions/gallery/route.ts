import { NextResponse } from "next/server"
import { z } from "zod"
import { insertGallerySubmission, isCommunityConfigured, uploadGalleryImage } from "@/lib/community-supabase"

const MAX_IMAGE_SIZE = 6 * 1024 * 1024
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"]

const gallerySchema = z.object({
  title: z.string().min(2).max(140),
  submittedBy: z.string().min(2).max(120),
})

export async function POST(request: Request) {
  try {
    if (!isCommunityConfigured()) {
      return NextResponse.json(
        {
          error:
            "La galeria comunitaria ya esta lista, pero falta configurar Supabase en el servidor para recibir imagenes.",
        },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const image = formData.get("image")

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Adjunta una imagen valida antes de enviarla." }, { status: 400 })
    }

    if (!allowedMimeTypes.includes(image.type)) {
      return NextResponse.json({ error: "Solo aceptamos imagenes JPG, PNG o WEBP." }, { status: 400 })
    }

    if (image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "La imagen supera el limite de 6 MB." }, { status: 400 })
    }

    const data = gallerySchema.parse({
      title: formData.get("title"),
      submittedBy: formData.get("submittedBy"),
    })

    const imageUrl = await uploadGalleryImage(image, data.submittedBy, data.title)
    await insertGallerySubmission({
      ...data,
      imageUrl,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Completa el titulo, tu nombre y una imagen valida antes de enviarla.",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No pudimos guardar tu imagen en este momento.",
      },
      { status: 500 },
    )
  }
}
