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
  const mobileMenuBg = isHeroSection ? "bg-charcoal/95 backdrop-blur-sm" : "bg-cream/95"
  const mobileLinkColor = isHeroSection ? "text-white" : "text-charcoal"

  return (
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
                  className={`text-xs font-medium transition-colors duration-300 ${
                    language === lang ? languageButtonActiveColor : languageButtonInactiveColor
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className={`transition-colors duration-300 md:hidden ${menuButtonColor}`}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className={`space-y-3 border-t pb-4 md:hidden ${borderColor} ${mobileMenuBg} transition-all duration-300`}>
            <a href="#biography" className={`block py-2 text-sm ${mobileLinkColor} hover:text-gold transition-colors duration-300`}>
              {t.biography}
            </a>
            <a href="#concerts" className={`block py-2 text-sm ${mobileLinkColor} hover:text-gold transition-colors duration-300`}>
              {t.concerts}
            </a>
            <a href="#gallery" className={`block py-2 text-sm ${mobileLinkColor} hover:text-gold transition-colors duration-300`}>
              {t.gallery}
            </a>
            <a href="#contact" className={`block py-2 text-sm ${mobileLinkColor} hover:text-gold transition-colors duration-300`}>
              {t.contact}
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
