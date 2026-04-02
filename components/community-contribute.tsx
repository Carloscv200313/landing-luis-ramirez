"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface CommunityContributeProps {
  language: "es" | "en"
  defaultMode: "testimonial" | "gallery"
  triggerLabel: string
}

type TestimonialFormState = {
  name: string
  role: string
  quote: string
  rating: number
}

type GalleryFormState = {
  title: string
  submittedBy: string
  image: File | null
}

const emptyTestimonial: TestimonialFormState = {
  name: "",
  role: "",
  quote: "",
  rating: 5,
}

const emptyGallery: GalleryFormState = {
  title: "",
  submittedBy: "",
  image: null,
}

const translations = {
  es: {
    moderation: "Revision manual antes de publicar",
    heading: "Comparte tu experiencia",
    subheading:
      "Puedes dejar un testimonio o enviar una imagen inspirada en tu camino. Todo entra primero a revision antes de publicarse.",
    testimonialTitle: "Enviar testimonio",
    testimonialCopy: "Cuéntanos cómo fue tu experiencia, qué valor encontraste o qué te dejó la conversación.",
    rating: "Calificacion",
    name: "Nombre",
    role: "Rol o etapa",
    quote: "Tu testimonio",
    imageTitle: "Enviar imagen",
    imageCopy: "Comparte una foto con vibra real estate, crecimiento o estilo de vida que conecte con esta comunidad.",
    imageLabel: "Imagen",
    submittedBy: "Tu nombre",
    boardTitle: "Titulo breve",
    sendTestimonial: "Enviar testimonio",
    sendImage: "Enviar imagen",
    sending: "Enviando...",
    successTitle: "Gracias",
    successTestimonial: "Gracias. Tu testimonio fue recibido y quedo pendiente de aprobacion.",
    successImage: "Gracias. Tu imagen fue recibida y quedo pendiente de aprobacion.",
    successButton: "Perfecto",
    genericError: "No pudimos enviar tu aporte en este momento. Intenta nuevamente.",
    namePlaceholder: "Tu nombre",
    rolePlaceholder: "Ej. Inversionista, agente, emprendedor",
    quotePlaceholder: "Escribe aqui tu experiencia con Luis Ramirez.",
    ratingLabel: "Selecciona cuantas estrellas le das a tu experiencia.",
    submittedByPlaceholder: "Tu nombre",
    boardTitlePlaceholder: "Ej. Espacio con vision",
    imageHint: "JPG, PNG o WEBP. Maximo 6 MB.",
    close: "Cerrar",
  },
  en: {
    moderation: "Manual review before publishing",
    heading: "Share your experience",
    subheading:
      "You can leave a testimonial or submit an image inspired by your journey. Everything is reviewed before being published.",
    testimonialTitle: "Submit a testimonial",
    testimonialCopy: "Tell us what your experience was like, what value you found, or what the conversation gave you.",
    rating: "Rating",
    name: "Name",
    role: "Role or stage",
    quote: "Your testimonial",
    imageTitle: "Submit an image",
    imageCopy: "Share a photo with a real estate, growth, or lifestyle vibe that fits this community.",
    imageLabel: "Image",
    submittedBy: "Your name",
    boardTitle: "Short title",
    sendTestimonial: "Send testimonial",
    sendImage: "Send image",
    sending: "Sending...",
    successTitle: "Thank you",
    successTestimonial: "Thanks. Your testimonial was received and is pending approval.",
    successImage: "Thanks. Your image was received and is pending approval.",
    successButton: "Perfect",
    genericError: "We could not submit your contribution right now. Please try again.",
    namePlaceholder: "Your name",
    rolePlaceholder: "Ex. Investor, agent, entrepreneur",
    quotePlaceholder: "Write your experience with Luis Ramirez here.",
    ratingLabel: "Select how many stars you want to give your experience.",
    submittedByPlaceholder: "Your name",
    boardTitlePlaceholder: "Ex. Space with vision",
    imageHint: "JPG, PNG, or WEBP. Maximum 6 MB.",
    close: "Close",
  },
}

function FieldLabel({ label }: { label: string }) {
  return <label className="mb-2 block text-sm font-semibold text-charcoal">{label}</label>
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-6 w-6 ${filled ? "text-[#c8a24b]" : "text-[#d7d0c4]"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 0 0 .951-.69l1.07-3.292Z" />
    </svg>
  )
}

export default function CommunityContribute({ language, defaultMode, triggerLabel }: CommunityContributeProps) {
  const t = translations[language]
  const [isOpen, setIsOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormState>(emptyTestimonial)
  const [galleryForm, setGalleryForm] = useState<GalleryFormState>(emptyGallery)
  const [testimonialState, setTestimonialState] = useState({ loading: false, message: "", error: "" })
  const [galleryState, setGalleryState] = useState({ loading: false, message: "", error: "" })
  const [hoveredRating, setHoveredRating] = useState(0)

  useEffect(() => {
    if (!isOpen && !successMessage) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, successMessage])

  useEffect(() => {
    if (!successMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage(null)
    }, 2400)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [successMessage])

  const openModal = () => {
    setHoveredRating(0)
    setTestimonialState({ loading: false, message: "", error: "" })
    setGalleryState({ loading: false, message: "", error: "" })
    setIsOpen(true)
  }

  const closeModal = () => {
    setHoveredRating(0)
    setIsOpen(false)
  }

  const submitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()
    setTestimonialState({ loading: true, message: "", error: "" })

    try {
      const response = await fetch("/api/community-submissions/testimonial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testimonialForm),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t.genericError)
      }

      setTestimonialForm(emptyTestimonial)
      setHoveredRating(0)
      setTestimonialState({ loading: false, message: "", error: "" })
      setIsOpen(false)
      setSuccessMessage(t.successTestimonial)
    } catch (error) {
      setTestimonialState({
        loading: false,
        message: "",
        error: error instanceof Error ? error.message : t.genericError,
      })
    }
  }

  const submitGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    setGalleryState({ loading: true, message: "", error: "" })

    try {
      const payload = new FormData()
      payload.append("title", galleryForm.title)
      payload.append("submittedBy", galleryForm.submittedBy)

      if (galleryForm.image) {
        payload.append("image", galleryForm.image)
      }

      const response = await fetch("/api/community-submissions/gallery", {
        method: "POST",
        body: payload,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t.genericError)
      }

      setGalleryForm(emptyGallery)
      setGalleryState({ loading: false, message: "", error: "" })
      setIsOpen(false)
      setSuccessMessage(t.successImage)
    } catch (error) {
      setGalleryState({
        loading: false,
        message: "",
        error: error instanceof Error ? error.message : t.genericError,
      })
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex min-h-12 items-center justify-center border border-charcoal/15 bg-warm-white px-6 py-3 text-sm font-semibold text-charcoal transition-colors duration-300 hover:border-gold hover:text-gold"
      >
        {triggerLabel}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/50 px-4 py-6" onClick={closeModal}>
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-taupe/15 bg-[#faf8f5] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label={t.close}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center text-charcoal/70 transition-colors hover:text-charcoal"
            >
              <X size={22} />
            </button>

            <div className="max-w-2xl pr-10">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-charcoal/55">{t.moderation}</p>
              <h3 className="mb-3 text-charcoal">
                {defaultMode === "testimonial" ? t.testimonialTitle : t.imageTitle}
              </h3>
              <p className="text-base leading-relaxed text-charcoal/72">
                {defaultMode === "testimonial" ? t.testimonialCopy : t.imageCopy}
              </p>
            </div>

            <div className="mt-8 border-t border-taupe/15 pt-8">
              {defaultMode === "testimonial" ? (
              <form onSubmit={submitTestimonial} className="mt-8">
                <div className="space-y-5">
                  <div>
                    <FieldLabel label={t.rating} />
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const value = index + 1
                        const activeRating = hoveredRating || testimonialForm.rating

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setTestimonialForm((current) => ({ ...current, rating: value }))}
                            onMouseEnter={() => setHoveredRating(value)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="rounded-sm transition-transform hover:scale-105 focus:outline-none"
                            aria-label={`${value} star${value === 1 ? "" : "s"}`}
                          >
                            <StarIcon filled={value <= activeRating} />
                          </button>
                        )
                      })}
                    </div>
                    <small className="mt-2 block text-charcoal/55">{t.ratingLabel}</small>
                  </div>

                  <div>
                    <FieldLabel label={t.name} />
                    <input
                      type="text"
                      value={testimonialForm.name}
                      onChange={(e) => setTestimonialForm((current) => ({ ...current, name: e.target.value }))}
                      placeholder={t.namePlaceholder}
                      required
                      className="w-full border-0 border-b border-taupe/35 bg-transparent px-0 py-3 text-charcoal placeholder-charcoal/45 transition-colors focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <FieldLabel label={t.role} />
                    <input
                      type="text"
                      value={testimonialForm.role}
                      onChange={(e) => setTestimonialForm((current) => ({ ...current, role: e.target.value }))}
                      placeholder={t.rolePlaceholder}
                      required
                      className="w-full border-0 border-b border-taupe/35 bg-transparent px-0 py-3 text-charcoal placeholder-charcoal/45 transition-colors focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <FieldLabel label={t.quote} />
                    <textarea
                      rows={6}
                      value={testimonialForm.quote}
                      onChange={(e) => setTestimonialForm((current) => ({ ...current, quote: e.target.value }))}
                      placeholder={t.quotePlaceholder}
                      required
                      className="w-full resize-none border border-taupe/30 bg-transparent px-4 py-4 text-charcoal placeholder-charcoal/45 transition-colors focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                {testimonialState.error ? (
                  <div className="mt-6 border border-[#d6b2b2] bg-[#fff4f4] px-4 py-3 text-sm text-[#7e3636]">
                    {testimonialState.error}
                  </div>
                ) : null}

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={testimonialState.loading}
                    className="inline-flex min-h-12 items-center justify-center bg-charcoal px-8 py-3 text-sm font-semibold text-warm-white transition-colors duration-300 hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {testimonialState.loading ? t.sending : t.sendTestimonial}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={submitGallery} className="mt-8">
                <div className="space-y-5">
                  <div>
                    <FieldLabel label={t.boardTitle} />
                    <input
                      type="text"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm((current) => ({ ...current, title: e.target.value }))}
                      placeholder={t.boardTitlePlaceholder}
                      required
                      className="w-full border-0 border-b border-taupe/35 bg-transparent px-0 py-3 text-charcoal placeholder-charcoal/45 transition-colors focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <FieldLabel label={t.submittedBy} />
                    <input
                      type="text"
                      value={galleryForm.submittedBy}
                      onChange={(e) => setGalleryForm((current) => ({ ...current, submittedBy: e.target.value }))}
                      placeholder={t.submittedByPlaceholder}
                      required
                      className="w-full border-0 border-b border-taupe/35 bg-transparent px-0 py-3 text-charcoal placeholder-charcoal/45 transition-colors focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <FieldLabel label={t.imageLabel} />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) =>
                        setGalleryForm((current) => ({
                          ...current,
                          image: e.target.files?.[0] ?? null,
                        }))
                      }
                      required
                      className="block w-full text-sm text-charcoal file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-3 file:text-sm file:font-semibold file:text-warm-white hover:file:bg-charcoal/90"
                    />
                    <small className="mt-3 block text-charcoal/55">{t.imageHint}</small>
                  </div>
                </div>

                {galleryState.error ? (
                  <div className="mt-6 border border-[#d6b2b2] bg-[#fff4f4] px-4 py-3 text-sm text-[#7e3636]">
                    {galleryState.error}
                  </div>
                ) : null}

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={galleryState.loading}
                    className="inline-flex min-h-12 items-center justify-center bg-charcoal px-8 py-3 text-sm font-semibold text-warm-white transition-colors duration-300 hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {galleryState.loading ? t.sending : t.sendImage}
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>
        </div>
      ) : null}

      {successMessage ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-charcoal/45 px-4" onClick={() => setSuccessMessage(null)}>
          <div
            className="w-full max-w-md border border-taupe/15 bg-[#faf8f5] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-[#c8a24b]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-3 text-charcoal">{t.successTitle}</h3>
            <p className="text-charcoal/80">{successMessage}</p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="inline-flex min-h-11 items-center justify-center bg-charcoal px-6 py-3 text-sm font-semibold text-warm-white transition-colors duration-300 hover:bg-charcoal/90"
              >
                {t.successButton}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
