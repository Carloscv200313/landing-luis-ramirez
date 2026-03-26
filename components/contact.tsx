"use client"

import type React from "react"
import { useState } from "react"

interface ContactProps {
  language: "es" | "en"
}

type ContactFormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  interest: string
  message: string
}

const emptyForm: ContactFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  interest: "",
  message: "",
}

const translations = {
  es: {
    heading: "Contacto",
    subheading:
      "Si quieres invertir, colaborar o conocer mejor mi enfoque, dejame tus datos y conversemos pronto.",
    eyebrow: "Hablemos",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo",
    phone: "Telefono",
    interest: "En que te puedo ayudar?",
    message: "Mensaje",
    selectPlaceholder: "Seleccionar",
    firstNamePlaceholder: "Tu nombre",
    lastNamePlaceholder: "Tu apellido",
    emailPlaceholder: "tu@email.com",
    phonePlaceholder: "Tu numero de telefono",
    messagePlaceholder: "Cuentame brevemente que estas buscando, en que etapa estas o como te gustaria trabajar conmigo.",
    send: "Enviar mensaje",
    sending: "Enviando...",
    interests: [
      "Quiero invertir",
      "Quiero escalar mi negocio",
      "Quiero aprender mas sobre real estate",
      "Quiero colaborar contigo",
      "Otro",
    ],
    sideTitle: "Contacto directo",
    sideCopy:
      "Este espacio es para conversaciones serias, alianzas e ideas con potencial real. Si tu mensaje tiene direccion, te responderemos.",
    replyTime: "Respuesta estimada",
    replyTimeValue: "24 a 48 horas",
    focus: "Enfoque",
    focusValue: "Inversion, crecimiento y oportunidades",
    successTitle: "Mensaje recibido",
    successMessage:
      "Gracias por escribirnos. Pronto nos pondremos en contacto contigo para continuar la conversacion.",
    successButton: "Perfecto",
    genericError: "No pudimos enviar tu mensaje en este momento. Intenta nuevamente en unos minutos.",
  },
  en: {
    heading: "Contact",
    subheading:
      "If you want to invest, collaborate, or understand my approach better, leave your details and let's talk soon.",
    eyebrow: "Let's talk",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    interest: "How can I help you?",
    message: "Message",
    selectPlaceholder: "Select",
    firstNamePlaceholder: "Your first name",
    lastNamePlaceholder: "Your last name",
    emailPlaceholder: "you@email.com",
    phonePlaceholder: "Your phone number",
    messagePlaceholder: "Briefly tell me what you are looking for, what stage you are in, or how you would like to work with me.",
    send: "Send message",
    sending: "Sending...",
    interests: [
      "I want to invest",
      "I want to scale my business",
      "I want to learn more about real estate",
      "I want to collaborate with you",
      "Other",
    ],
    sideTitle: "Direct contact",
    sideCopy:
      "This space is for serious conversations, partnerships, and ideas with real potential. If your message has direction, we will reply.",
    replyTime: "Estimated reply",
    replyTimeValue: "24 to 48 hours",
    focus: "Focus",
    focusValue: "Investment, growth, and opportunities",
    successTitle: "Message received",
    successMessage:
      "Thanks for reaching out. We will contact you soon to continue the conversation.",
    successButton: "Great",
    genericError: "We could not send your message right now. Please try again in a few minutes.",
  },
}

function FieldLabel({ label }: { label: string }) {
  return <label className="mb-2 block text-sm font-semibold text-charcoal">{label}</label>
}

export default function Contact({ language }: ContactProps) {
  const t = translations[language]
  const [formData, setFormData] = useState<ContactFormState>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleChange = (field: keyof ContactFormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t.genericError)
      }

      setFormData(emptyForm)
      setShowSuccessModal(true)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t.genericError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section id="contact" className="bg-background py-24 md:py-36">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 animate-fade-in-up">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-charcoal/55">{t.eyebrow}</p>
            <h2 className="mb-4 text-charcoal">{t.heading}</h2>
            <p className="max-w-3xl text-lg leading-relaxed text-taupe">{t.subheading}</p>
            <div className="mt-4 line-accent"></div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="animate-fade-in-up border border-taupe/15 bg-charcoal px-8 py-10 text-warm-white">
              <h3 className="mb-4 text-warm-white">{t.sideTitle}</h3>
              <p className="mb-8 text-warm-white/75">{t.sideCopy}</p>

              <div className="space-y-6">
                <div>
                  <small className="mb-2 block uppercase tracking-[0.22em] text-warm-white/45">{t.replyTime}</small>
                  <p>{t.replyTimeValue}</p>
                </div>
                <div>
                  <small className="mb-2 block uppercase tracking-[0.22em] text-warm-white/45">{t.focus}</small>
                  <p>{t.focusValue}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="animate-fade-in-up border border-taupe/15 bg-warm-white p-6 md:p-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel label={t.firstName} />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder={t.firstNamePlaceholder}
                    required
                    className="w-full border-0 border-b border-taupe/35 bg-transparent px-0 py-3 text-charcoal placeholder-charcoal/45 transition-colors focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <FieldLabel label={t.lastName} />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder={t.lastNamePlaceholder}
                    required
                    className="w-full border-0 border-b border-taupe/35 bg-transparent px-0 py-3 text-charcoal placeholder-charcoal/45 transition-colors focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <FieldLabel label={t.email} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder={t.emailPlaceholder}
                    required
                    className="w-full border-0 border-b border-taupe/35 bg-transparent px-0 py-3 text-charcoal placeholder-charcoal/45 transition-colors focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <FieldLabel label={t.phone} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder={t.phonePlaceholder}
                    required
                    className="w-full border-0 border-b border-taupe/35 bg-transparent px-0 py-3 text-charcoal placeholder-charcoal/45 transition-colors focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel label={t.interest} />
                  <select
                    value={formData.interest}
                    onChange={(e) => handleChange("interest", e.target.value)}
                    required
                    className="w-full border-0 border-b border-taupe/35 bg-transparent px-0 py-3 text-charcoal transition-colors focus:border-gold focus:outline-none"
                  >
                    <option value="">{t.selectPlaceholder}</option>
                    {t.interests.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <FieldLabel label={t.message} />
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder={t.messagePlaceholder}
                    required
                    className="w-full resize-none border border-taupe/30 bg-transparent px-4 py-4 text-charcoal placeholder-charcoal/45 transition-colors focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              {errorMessage ? (
                <div className="mt-6 border border-[#d6b2b2] bg-[#fff4f4] px-4 py-3 text-sm text-[#7e3636]">
                  {errorMessage}
                </div>
              ) : null}

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 items-center justify-center bg-charcoal px-8 py-3 text-sm font-semibold text-warm-white transition-colors duration-300 hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? t.sending : t.send}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {showSuccessModal ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/50 px-4">
          <div className="w-full max-w-md border border-taupe/15 bg-warm-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-3 text-charcoal">{t.successTitle}</h3>
            <p className="mb-6 text-charcoal/80">{t.successMessage}</p>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="inline-flex min-h-11 items-center justify-center bg-charcoal px-6 py-3 text-sm font-semibold text-warm-white transition-colors duration-300 hover:bg-charcoal/90"
            >
              {t.successButton}
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
