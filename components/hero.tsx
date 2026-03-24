"use client"

import Image from "next/image"

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/luisramirez.fp?igsh=am9rZTZyZjRvcWkx",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1AzwBjqEhj/",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@luisramirezrei?lang=en&is_from_webapp=1&sender_device=mobile&sender_web_id=7620919939725624852",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@LuisRamirezWholesaling",
  },
]

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.949 0-3.204.013-3.583.072-4.949.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 0 0 12 5.838zm0 10.162A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    )
  }

  if (label === "Facebook") {
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.01 10.125 11.927v-8.438H7.078v-3.49h3.047V9.412c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.49 0-1.956.93-1.956 1.887v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.083 24 18.092 24 12.073z" />
      </svg>
    )
  }

  if (label === "TikTok") {
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.725h-3.317v13.372a2.939 2.939 0 1 1-2.94-2.94c.346 0 .679.06.989.168V9.191a6.255 6.255 0 0 0-.989-.08A6.257 6.257 0 1 0 15.82 15.37V8.587a8.088 8.088 0 0 0 4.725 1.522V6.686a4.849 4.849 0 0 1-.956 0z" />
      </svg>
    )
  }

  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a2.999 2.999 0 0 0-2.11-2.12C19.522 3.545 12 3.545 12 3.545s-7.522 0-9.388.521a2.999 2.999 0 0 0-2.11 2.12A31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .502 5.814 2.999 2.999 0 0 0 2.11 2.12c1.866.521 9.388.521 9.388.521s7.522 0 9.388-.521a2.999 2.999 0 0 0 2.11-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

interface HeroProps {
  language: "es" | "en"
}

const translations = {
  es: {
    eyebrow: "Real Estate Investor",
    title: "Luis Ramirez",
    subtitle: "150+ transacciones cerradas. Múltiples estrategias. Una mentalidad clara.",
    description:
      "Construyo oportunidades, sistemas y libertad para mí y para otros. Mi enfoque combina ejecución, disciplina y visión de largo plazo.",
    primaryCta: "Conversemos",
    secondaryCta: "Conoce mi enfoque",
  },
  en: {
    eyebrow: "Real Estate Investor",
    title: "Luis Ramirez",
    subtitle: "150+ deals closed. Multiple strategies. One clear mindset.",
    description:
      "I build opportunities, systems, and freedom for myself and for others. My approach blends execution, discipline, and long-term vision.",
    primaryCta: "Let's talk",
    secondaryCta: "See my approach",
  },
}

export default function Hero({ language }: HeroProps) {
  const t = translations[language]

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[#7a7577]">
        <Image
          src="/images/luis-hero.jpg"
          alt="Luis Ramirez portrait"
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-[42%_top] sm:object-[50%_top] md:object-[60%_top]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/65 via-charcoal/40 to-charcoal/15"></div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 pb-20 pt-28 sm:px-6 md:pb-24 md:pt-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.32em] text-white/75 animate-fade-in-up">
            {t.eyebrow}
          </p>
          <h1 className="mb-6 text-white animate-fade-in-up">{t.title}</h1>
          <h3 className="mb-8 font-light text-white animate-fade-in-up animation-delay-100">{t.subtitle}</h3>
          <div className="mb-10 line-accent animate-fade-in-up animation-delay-200"></div>
          <p className="mb-16 max-w-2xl font-light text-white animate-fade-in-up animation-delay-300">{t.description}</p>

          <div className="mb-16 flex flex-col gap-4 sm:flex-row animate-fade-in-up animation-delay-400">
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center border border-[#c9a961] bg-[#c9a961] px-6 py-3 text-sm font-semibold text-[#1a1815] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-colors duration-300 hover:bg-[#d4b671]"
            >
              {t.primaryCta}
            </a>
            <a
              href="#biography"
              className="inline-flex min-h-12 items-center justify-center border border-white/45 bg-black/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-300 hover:bg-black/25"
            >
              {t.secondaryCta}
            </a>
          </div>

          <div className="flex flex-wrap gap-3 animate-fade-in-up animation-delay-400">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors duration-300 hover:border-gold hover:text-gold"
                aria-label={social.label}
              >
                <SocialIcon label={social.label} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
