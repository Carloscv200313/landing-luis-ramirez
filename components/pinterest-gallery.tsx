"use client"

import { useEffect, useState } from "react"
import CommunityContribute from "@/components/community-contribute"

interface PinterestGalleryProps {
  language: "es" | "en"
}

type StaticBoardItem = {
  image: string
  title: {
    es: string
    en: string
  }
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
      "Una seleccion visual de ambientes, propiedades y referencias que conectan con la vision de crecimiento, inversion y estilo.",
    cta: "Subir una imagen",
  },
  en: {
    heading: "Inspiration",
    subheading:
      "A visual board of spaces, properties, and references connected to growth, investing, and lifestyle vision.",
    cta: "Upload an image",
  },
}

const boardItems: StaticBoardItem[] = [
  {
    image:
      "https://images.pexels.com/photos/7031618/pexels-photo-7031618.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: {
      es: "Espacios listos para transformar",
      en: "Spaces ready to transform",
    },
  },
  {
    image:
      "https://images.pexels.com/photos/19608779/pexels-photo-19608779.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: {
      es: "Interiores que venden vision",
      en: "Interiors that sell the vision",
    },
  },
  {
    image:
      "https://images.pexels.com/photos/8089086/pexels-photo-8089086.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: {
      es: "Minimalismo con presencia",
      en: "Minimalism with presence",
    },
  },
  {
    image:
      "https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: {
      es: "Detalles que elevan el valor",
      en: "Details that elevate value",
    },
  },
  {
    image:
      "https://images.pexels.com/photos/20259352/pexels-photo-20259352.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: {
      es: "Diseno que comunica estatus",
      en: "Design that communicates status",
    },
  },
  {
    image:
      "https://images.pexels.com/photos/7587880/pexels-photo-7587880.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: {
      es: "Exterior limpio y aspiracional",
      en: "Clean and aspirational exterior",
    },
  },
  {
    image:
      "https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: {
      es: "Propiedad con llegada visual",
      en: "Property with visual impact",
    },
  },
  {
    image:
      "https://images.pexels.com/photos/18033178/pexels-photo-18033178.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: {
      es: "Workspace con energia de expansion",
      en: "Workspace built for expansion",
    },
  },
]

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

  const allBoardItems = [
    ...boardItems.map((item) => ({
      key: item.image,
      image: item.image,
      title: item.title[language],
      submittedBy: null,
    })),
    ...communityItems.map((item) => ({
      key: item.id,
      image: item.imageUrl,
      title: item.title,
      submittedBy: item.submittedBy,
    })),
  ]

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
      </div>
    </section>
  )
}
