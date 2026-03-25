"use client"

import { useState } from "react"

interface GalleryProps {
  language: "es" | "en"
}

const translations = {
  es: {
    heading: "Presencia",
    subheading: "La presencia también se construye en escenario, relaciones, liderazgo y comunidad.",
    close: "Cerrar",
    previous: "Anterior",
    next: "Siguiente",
  },
  en: {
    heading: "Presence",
    subheading: "Presence is also built on stage, through relationships, leadership, and community.",
    close: "Close",
    previous: "Previous",
    next: "Next",
  },
}

const galleryItems = [
  {
    id: 1,
    image: "/presentaciones/Luis-azul-conferencia.jpg",
    title: { es: "Liderazgo", en: "Leadership" },
    objectPosition: "center center",
    layoutClass: "md:col-span-2 lg:col-span-7",
    aspectClass: "aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: 2,
    image: "/presentaciones/Luis-real-state.jpeg",
    title: { es: "Alianzas", en: "Partnerships" },
    objectPosition: "center top",
    layoutClass: "lg:col-span-5",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: 3,
    image: "/presentaciones/Luis-estado.jpg",
    title: { es: "Speaker", en: "Speaker" },
    objectPosition: "center top",
    layoutClass: "lg:col-span-4",
    aspectClass: "aspect-[3/4] md:aspect-[4/5]",
  },
  {
    id: 4,
    image: "/presentaciones/luis-empleados-conferencia.jpg",
    title: { es: "Comunidad", en: "Community" },
    objectPosition: "center center",
    layoutClass: "md:col-span-2 lg:col-span-8",
    aspectClass: "aspect-[16/10] md:aspect-[16/9]",
  },
]

export default function Gallery({ language }: GalleryProps) {
  const t = translations[language]
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedItem = galleryItems.find((item) => item.id === selectedId)
  const selectedIndex = galleryItems.findIndex((item) => item.id === selectedId)

  const goToNext = () => {
    if (selectedId !== null) {
      const nextIndex = (selectedIndex + 1) % galleryItems.length
      setSelectedId(galleryItems[nextIndex].id)
    }
  }

  const goToPrev = () => {
    if (selectedId !== null) {
      const prevIndex = (selectedIndex - 1 + galleryItems.length) % galleryItems.length
      setSelectedId(galleryItems[prevIndex].id)
    }
  }

  return (
    <section id="gallery" className="bg-warm-white py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="mb-4 text-charcoal">{t.heading}</h2>
          <p className="max-w-2xl text-lg leading-relaxed text-charcoal/75">{t.subheading}</p>
          <div className="line-accent"></div>
        </div>

        <div className="grid items-start grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`group self-start cursor-pointer overflow-hidden border border-taupe/15 bg-charcoal/5 ${item.layoutClass}`}
            >
              <div className={`relative overflow-hidden ${item.aspectClass}`}>
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title[language]}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ objectPosition: item.objectPosition }}
                />
              </div>
              <div className="border-t border-taupe/10 p-4">
                <small className="font-medium uppercase tracking-[0.2em] text-charcoal/70">{item.title[language]}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={() => setSelectedId(null)}>
          <div className="relative flex h-full w-full items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedItem.image || "/placeholder.svg"}
              alt={selectedItem.title[language]}
              className="max-h-full max-w-full object-contain"
            />

            <button
              onClick={() => setSelectedId(null)}
              className="absolute right-6 top-6 text-white transition-colors hover:text-gold"
              aria-label={t.close}
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={goToPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white transition-colors hover:text-gold"
              aria-label={t.previous}
            >
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white transition-colors hover:text-gold"
              aria-label={t.next}
            >
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white">
              {selectedIndex + 1} / {galleryItems.length}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
