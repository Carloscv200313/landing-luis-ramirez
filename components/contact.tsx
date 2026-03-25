"use client"

import type React from "react"
import { useState } from "react"

interface ContactProps {
  language: "es" | "en"
}

const contactEmail = "2016luis1992@gmail.com"

const translations = {
  es: {
    heading: "Contacto",
    subheading: "Si estás listo para crecer, invertir o llevar tu mentalidad y resultados al siguiente nivel, conversemos.",
    email: "Email",
    focus: "Enfoque",
    audience: "A quién ayudo",
    send: "Enviar mensaje",
    success: "Tu mensaje fue preparado. Solo falta enviarlo desde tu correo.",
    namePlaceholder: "Tu nombre",
    emailPlaceholder: "Tu email",
    messagePlaceholder: "Quiero invertir, colaborar o conocer más sobre tu enfoque...",
    subjectPrefix: "Nuevo mensaje de",
    focusValue: "Inversiones, alianzas y crecimiento",
    audienceValue: "Latinos, dueños de negocio e inversionistas",
  },
  en: {
    heading: "Contact",
    subheading: "If you are ready to grow, invest, or take your mindset and results to the next level, let's talk.",
    email: "Email",
    focus: "Focus",
    audience: "Who I help",
    send: "Send Message",
    success: "Your message is ready. You just need to send it from your email client.",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    messagePlaceholder: "I want to invest, collaborate, or learn more about your approach...",
    subjectPrefix: "New message from",
    focusValue: "Investments, partnerships, and growth",
    audienceValue: "Business owners, and investors",
  },
}

export default function Contact({ language }: ContactProps) {
  const t = translations[language]
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(`${t.subjectPrefix} ${formData.name}`)}&body=${encodeURIComponent(`From: ${formData.email}\n\n${formData.message}`)}`
    window.location.href = mailtoLink

    setSubmitted(true)
    setFormData({ name: "", email: "", message: "" })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section id="contact" className="bg-background py-24 md:py-36">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 animate-fade-in-up">
          <h2 className="mb-4 text-charcoal">{t.heading}</h2>
          <p className="max-w-2xl text-lg leading-relaxed text-taupe">{t.subheading}</p>
          <div className="mt-4 line-accent"></div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <small className="mb-2 block font-medium text-charcoal/70">{t.email}</small>
              <p className="text-charcoal">{contactEmail}</p>
            </div>
            <div>
              <small className="mb-2 block font-medium text-charcoal/70">{t.focus}</small>
              <p className="text-charcoal">{t.focusValue}</p>
            </div>
            <div>
              <small className="mb-2 block font-medium text-charcoal/70">{t.audience}</small>
              <p className="text-charcoal">{t.audienceValue}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
            {submitted && (
              <div className="rounded border border-gold/20 bg-gold/10 p-4 text-sm text-charcoal">
                {t.success}
              </div>
            )}
            <div>
              <input
                type="text"
                placeholder={t.namePlaceholder}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full border border-taupe/30 bg-warm-white px-4 py-3 text-charcoal placeholder-charcoal/50 transition-colors focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full border border-taupe/30 bg-warm-white px-4 py-3 text-charcoal placeholder-charcoal/50 transition-colors focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <textarea
                placeholder={t.messagePlaceholder}
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="w-full resize-none border border-taupe/30 bg-warm-white px-4 py-3 text-charcoal placeholder-charcoal/50 transition-colors focus:border-gold focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-charcoal py-3 font-medium text-warm-white transition-colors duration-300 hover:bg-charcoal/90"
            >
              {t.send}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
