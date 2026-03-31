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
    testimonialTab: "Testimonio",
    galleryTab: "Imagen",
    testimonialTitle: "Enviar testimonio",
    testimonialCopy: "Cuéntanos cómo fue tu experiencia, qué valor encontraste o qué te dejó la conversación.",
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
    successTestimonial: "Gracias. Tu testimonio fue recibido y quedo pendiente de aprobacion.",
    successImage: "Gracias. Tu imagen fue recibida y quedo pendiente de aprobacion.",
    genericError: "No pudimos enviar tu aporte en este momento. Intenta nuevamente.",
    namePlaceholder: "Tu nombre",
    rolePlaceholder: "Ej. Inversionista, agente, emprendedor",
    quotePlaceholder: "Escribe aqui tu experiencia con Luis Ramirez.",
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
    testimonialTab: "Testimonial",
    galleryTab: "Image",
    testimonialTitle: "Submit a testimonial",
    testimonialCopy: "Tell us what your experience was like, what value you found, or what the conversation gave you.",
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
    successTestimonial: "Thanks. Your testimonial was received and is pending approval.",
    successImage: "Thanks. Your image was received and is pending approval.",
    genericError: "We could not submit your contribution right now. Please try again.",
    namePlaceholder: "Your name",
    rolePlaceholder: "Ex. Investor, agent, entrepreneur",
    quotePlaceholder: "Write your experience with Luis Ramirez here.",
    submittedByPlaceholder: "Your name",
    boardTitlePlaceholder: "Ex. Space with vision",
    imageHint: "JPG, PNG, or WEBP. Maximum 6 MB.",
    close: "Close",
  },
}

function FieldLabel({ label }: { label: string }) {
  return <label className="mb-2 block text-sm font-semibold text-charcoal">{label}</label>
}

export default function CommunityContribute({ language, defaultMode, triggerLabel }: CommunityContributeProps) {
  const t = translations[language]
  const [isOpen, setIsOpen] = useState(false)
  const [activeMode, setActiveMode] = useState<"testimonial" | "gallery">(defaultMode)
  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormState>(emptyTestimonial)
  const [galleryForm, setGalleryForm] = useState<GalleryFormState>(emptyGallery)
  const [testimonialState, setTestimonialState] = useState({ loading: false, message: "", error: "" })
  const [galleryState, setGalleryState] = useState({ loading: false, message: "", error: "" })

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const openModal = () => {
    setActiveMode(defaultMode)
    setIsOpen(true)
  }

  const closeModal = () => setIsOpen(false)

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
      setTestimonialState({ loading: false, message: t.successTestimonial, error: "" })
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
      setGalleryState({ loading: false, message: t.successImage, error: "" })
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
              <h3 className="mb-3 text-charcoal">{t.heading}</h3>
              <p className="text-base leading-relaxed text-charcoal/72">{t.subheading}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 border-b border-taupe/15 pb-5">
              <button
                type="button"
                onClick={() => setActiveMode("testimonial")}
                className={`inline-flex min-h-11 items-center justify-center px-5 text-sm font-semibold transition-colors duration-300 ${
                  activeMode === "testimonial"
                    ? "bg-charcoal text-warm-white"
                    : "border border-charcoal/15 bg-warm-white text-charcoal hover:border-gold hover:text-gold"
                }`}
              >
                {t.testimonialTab}
              </button>
              <button
                type="button"
                onClick={() => setActiveMode("gallery")}
                className={`inline-flex min-h-11 items-center justify-center px-5 text-sm font-semibold transition-colors duration-300 ${
                  activeMode === "gallery"
                    ? "bg-charcoal text-warm-white"
                    : "border border-charcoal/15 bg-warm-white text-charcoal hover:border-gold hover:text-gold"
                }`}
              >
                {t.galleryTab}
              </button>
            </div>

            {activeMode === "testimonial" ? (
              <form onSubmit={submitTestimonial} className="mt-8">
                <div className="mb-6">
                  <h4 className="mb-3 text-charcoal">{t.testimonialTitle}</h4>
                  <p className="text-charcoal/70">{t.testimonialCopy}</p>
                </div>

                <div className="space-y-5">
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

                {testimonialState.message ? (
                  <div className="mt-6 border border-[#d7cfb2] bg-[#fbf7ea] px-4 py-3 text-sm text-[#6b5832]">
                    {testimonialState.message}
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
                <div className="mb-6">
                  <h4 className="mb-3 text-charcoal">{t.imageTitle}</h4>
                  <p className="text-charcoal/70">{t.imageCopy}</p>
                </div>

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

                {galleryState.message ? (
                  <div className="mt-6 border border-[#d7cfb2] bg-[#fbf7ea] px-4 py-3 text-sm text-[#6b5832]">
                    {galleryState.message}
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
      ) : null}
    </>
  )
}
