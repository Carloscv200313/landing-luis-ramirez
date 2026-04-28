"use client"

import { useEffect, useState } from "react"
import CommunityContribute from "@/components/community-contribute"

interface PinterestGalleryProps {
  language: "es" | "en"
}

type CommunityBoardItem = {
  id: string
  title: string
  imageUrl: string
  submittedBy: string | null
}

const translations = {
  es: {
    heading: "Inspiracion",
    subheading:
      "Una mezcla de comunidad, oportunidades y resultados. Aqui ves como las conexiones correctas llevan a negocios reales.",
    cta: "Subir una imagen",
    emptyTitle: "Comparte tu momento",
    emptyCopy: "Esta galeria se construye con la comunidad. Sube tu foto y, una vez aprobada, podra formar parte de este espacio.",
  },
  en: {
    heading: "Inspiration",
    subheading:
      "A visual board of spaces, properties, and references connected to growth, investing, and lifestyle vision.",
    cta: "Upload an image",
    emptyTitle: "There are no published images yet",
    emptyCopy: "This section will display only the approved photos uploaded from the website.",
  },
}

export default function PinterestGallery({ language }: PinterestGalleryProps) {
  const t = translations[language]
  const [communityItems, setCommunityItems] = useState<CommunityBoardItem[]>([])

  useEffect(() => {
    let cancelled = false

    async function loadCommunityImages() {
      try {
        const response = await fetch("/api/community-content", { cache: "no-store" })

        if (!response.ok) {
          return
        }

        const payload = (await response.json()) as {
          gallery?: CommunityBoardItem[]
        }

        if (!cancelled) {
          setCommunityItems(payload.gallery ?? [])
        }
      } catch {
        // Keep the editorial board if the community feed is unavailable.
      }
    }

    void loadCommunityImages()

    return () => {
      cancelled = true
    }
  }, [])

  const allBoardItems = communityItems.map((item) => ({
      key: item.id,
      image: item.imageUrl,
      title: item.title,
      submittedBy: item.submittedBy,
    }))

  return (
    <section className="bg-background py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="mb-4 text-charcoal">{t.heading}</h2>
            <p className="text-lg leading-relaxed text-charcoal/75">{t.subheading}</p>
            <div className="mt-4 line-accent"></div>
          </div>

          <CommunityContribute language={language} defaultMode="gallery" triggerLabel={t.cta} />
        </div>

        {allBoardItems.length === 0 ? (
          <div className="border border-dashed border-taupe/20 bg-warm-white px-6 py-12 text-center">
            <h3 className="mb-3 text-charcoal">{t.emptyTitle}</h3>
            <p className="mx-auto max-w-2xl text-charcoal/65">{t.emptyCopy}</p>
          </div>
        ) : (
          <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
            {allBoardItems.map((item) => (
              <article key={item.key} className="mb-6 break-inside-avoid overflow-hidden border border-taupe/15 bg-warm-white">
                <img src={item.image} alt={item.title} className="h-auto w-full object-cover" />
                <div className="p-4">
                  <small className="font-medium uppercase tracking-[0.18em] text-charcoal/70">{item.title}</small>
                  {item.submittedBy ? <p className="mt-2 text-sm text-charcoal/55">{item.submittedBy}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
