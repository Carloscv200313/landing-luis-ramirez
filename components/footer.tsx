"use client"

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

interface FooterProps {
  language: "es" | "en"
}

const translations = {
  es: {
    copyright: "Todos los derechos reservados.",
    followMe: "Conecta",
    descriptor: "Real Estate Investor",
    quickLinks: "Navegación",
    biography: "Sobre mí",
    concerts: "Diferencial",
    gallery: "Presencia",
    contact: "Contacto",
    privacy: "Privacidad",
    terms: "Términos",
  },
  en: {
    copyright: "All rights reserved.",
    followMe: "Connect",
    descriptor: "Real Estate Investor",
    quickLinks: "Quick Links",
    biography: "About",
    concerts: "Edge",
    gallery: "Presence",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
  },
}

export default function Footer({ language }: FooterProps) {
  const t = translations[language]

  return (
    <footer className="bg-charcoal py-12 text-warm-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-warm-white">Luis Ramirez</h3>
            <small className="text-warm-white/70">{t.descriptor}</small>
          </div>

          <div>
            <h3 className="mb-4 text-warm-white">{t.quickLinks}</h3>
            <ul className="space-y-2 text-sm text-warm-white/70">
              <li>
                <a href="#biography" className="transition-colors hover:text-gold">
                  {t.biography}
                </a>
              </li>
              <li>
                <a href="#concerts" className="transition-colors hover:text-gold">
                  {t.concerts}
                </a>
              </li>
              <li>
                <a href="#gallery" className="transition-colors hover:text-gold">
                  {t.gallery}
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors hover:text-gold">
                  {t.contact}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-warm-white">{t.followMe}</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-warm-white/15 text-warm-white/70 transition-colors hover:border-gold hover:text-gold"
                  aria-label={social.label}
                >
                  <SocialIcon label={social.label} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-warm-white/20 pt-8 text-sm text-warm-white/70 md:flex-row">
          <small>&copy; 2026 Luis Ramirez. {t.copyright}</small>
          <div className="mt-4 flex gap-6 md:mt-0">
            <a href="#" className="transition-colors hover:text-warm-white">
              {t.privacy}
            </a>
            <a href="#" className="transition-colors hover:text-warm-white">
              {t.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
