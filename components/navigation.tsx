"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

interface NavigationProps {
  language: "es" | "en"
  onLanguageChange: (lang: "es" | "en") => void
}

const translations = {
  es: {
    biography: "Sobre mí",
    concerts: "Diferencial",
    gallery: "Presencia",
    contact: "Contacto",
  },
  en: {
    biography: "About",
    concerts: "Edge",
    gallery: "Presence",
    contact: "Contact",
  },
}

export default function Navigation({ language, onLanguageChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHeroSection, setIsHeroSection] = useState(true)
  const t = translations[language]

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero")
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom
        setIsHeroSection(heroBottom > 100)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinkColor = isHeroSection ? "text-white" : "text-charcoal"
  const logoColor = isHeroSection ? "text-white" : "text-charcoal"
  const menuButtonColor = isHeroSection ? "text-white" : "text-charcoal"
  const languageButtonActiveColor = "text-gold"
  const languageButtonInactiveColor = isHeroSection
    ? "text-white/60 hover:text-white"
    : "text-charcoal/60 hover:text-charcoal"
  const navBgColor = isHeroSection ? "bg-transparent" : "bg-cream/95"
  const borderColor = isHeroSection ? "border-white/10" : "border-taupe/20"
  const mobileMenuBg = "bg-[#faf8f5]"
  const mobileLinkColor = "text-[#1a1815]"
  const mobilePanelBorder = "border-taupe/15"

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <nav className={`fixed z-50 w-full border-b ${borderColor} ${navBgColor} backdrop-blur-sm transition-all duration-300`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className={`${logoColor} font-serif text-2xl font-normal tracking-wide transition-colors duration-300`}>
              L. Ramirez
            </div>

            <div className="hidden items-center gap-8 md:flex">
              <a href="#biography" className={`text-sm ${navLinkColor} hover:text-gold transition-colors duration-300`}>
                {t.biography}
              </a>
              <a href="#concerts" className={`text-sm ${navLinkColor} hover:text-gold transition-colors duration-300`}>
                {t.concerts}
              </a>
              <a href="#gallery" className={`text-sm ${navLinkColor} hover:text-gold transition-colors duration-300`}>
                {t.gallery}
              </a>
              <a href="#contact" className={`text-sm ${navLinkColor} hover:text-gold transition-colors duration-300`}>
                {t.contact}
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {(["es", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    className={`text-xs font-medium transition-colors duration-300 ${language === lang ? languageButtonActiveColor : languageButtonInactiveColor
                      }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`transition-colors duration-300 md:hidden ${menuButtonColor}`}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-charcoal/35 transition-opacity duration-300 md:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={closeMenu}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-[82vw] max-w-sm flex-col border-l ${mobilePanelBorder} ${mobileMenuBg} px-6 pb-8 pt-16 shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition-transform duration-300 md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ backgroundColor: "#faf8f5" }}
      >
        <button
          onClick={closeMenu}
          className={`absolute right-4 top-5 transition-colors duration-300 ${mobileLinkColor}`}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        <div className="space-y-4">
          <a
            href="#biography"
            onClick={closeMenu}
            className={`block py-2 text-lg ${mobileLinkColor} hover:text-gold transition-colors duration-300`}
          >
            {t.biography}
          </a>
          <a
            href="#concerts"
            onClick={closeMenu}
            className={`block py-2 text-lg ${mobileLinkColor} hover:text-gold transition-colors duration-300`}
          >
            {t.concerts}
          </a>
          <a
            href="#gallery"
            onClick={closeMenu}
            className={`block py-2 text-lg ${mobileLinkColor} hover:text-gold transition-colors duration-300`}
          >
            {t.gallery}
          </a>
          <a
            href="#contact"
            onClick={closeMenu}
            className={`block py-2 text-lg ${mobileLinkColor} hover:text-gold transition-colors duration-300`}
          >
            {t.contact}
          </a>
        </div>

        <div className={`mt-10 border-t pt-6 ${mobilePanelBorder}`}>
          <p className="mb-4 text-xs uppercase tracking-[0.24em] text-charcoal/50">
            Language
          </p>
          <div className="flex gap-3">
            {(["es", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`min-w-14 border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${language === lang
                  ? "border-gold bg-gold text-charcoal"
                  : "border-charcoal/15 text-charcoal/70 hover:border-charcoal/30 hover:text-charcoal"
                  }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
