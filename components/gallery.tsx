"use client"

import { useState } from "react"

interface GalleryProps {
  language: "es" | "en"
}

const translations = {
  es: {
    heading: "Presencia",
    subheading: "La marca personal también se construye con presencia, claridad y visión.",
    close: "Cerrar",
    previous: "Anterior",
    next: "Siguiente",
  },
  en: {
    heading: "Presence",
    subheading: "Personal brand is also built through presence, clarity, and vision.",
    close: "Close",
    previous: "Previous",
    next: "Next",
  },
}

const galleryItems = [
  {
    id: 1,
    image: "/images/luis-beige-sentado.jpg",
    title: { es: "Presencia", en: "Presence" },
    objectPosition: "center top",
  },
  {
    id: 2,
    image: "/images/Luis-negro-pensando.jpg",
    title: { es: "Visión", en: "Vision" },
    objectPosition: "center top",
  },
  {
    id: 3,
    image: "/images/luis-azul-mirandocamara.jpg",
    title: { es: "Confianza", en: "Confidence" },
    objectPosition: "center top",
  },
  {
    id: 4,
    image: "/images/luis-negro-mirandoreloj.jpg",
    title: { es: "Disciplina", en: "Discipline" },
    objectPosition: "center top",
  },
  {
    id: 5,
    image: "/images/luis-beige-parado.jpg",
    title: { es: "Identidad", en: "Identity" },
    objectPosition: "center top",
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`group cursor-pointer overflow-hidden border border-taupe/15 bg-charcoal/5 ${
                index % 3 === 1 ? "lg:translate-y-8" : index % 3 === 2 ? "lg:-translate-y-6" : ""
              }`}
            >
              <div className="relative aspect-[2/3] overflow-hidden">
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
