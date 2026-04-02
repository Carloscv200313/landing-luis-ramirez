"use client"

import { useEffect, useState } from "react"
import CommunityContribute from "@/components/community-contribute"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface TestimonialsProps {
  language: "es" | "en"
}

type StaticTestimonial = {
  name: string
  role: {
    es: string
    en: string
  }
  avatar: string
  quote: {
    es: string
    en: string
  }
}

type CommunityTestimonial = {
  id: string
  name: string
  role: string
  quote: string
  avatarUrl: string | null
  rating: number
}

const translations = {
  es: {
    heading: "Testimonios",
    subheading: "Percepcion, confianza y claridad. Asi describen la experiencia de conectar con Luis.",
    cta: "Compartir mi testimonio",
  },
  en: {
    heading: "Testimonials",
    subheading: "Trust, clarity, and real momentum. This is how people describe the experience of connecting with Luis.",
    cta: "Share my testimonial",
  },
}

const testimonials: StaticTestimonial[] = [
  {
    name: "Camila Torres",
    role: {
      es: "Inversionista principiante",
      en: "Beginner investor",
    },
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    quote: {
      es: "Luis explica con claridad, aterriza las ideas y te hace sentir que el siguiente paso si es posible.",
      en: "Luis explains things clearly, makes the strategy practical, and gives you confidence that the next step is actually possible.",
    },
  },
  {
    name: "Daniel Rivas",
    role: {
      es: "Dueno de negocio",
      en: "Business owner",
    },
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    quote: {
      es: "Lo que mas me gusto fue su enfoque. No vende humo: habla de sistemas, ejecucion y decisiones reales.",
      en: "What stood out most was his focus. He does not sell hype. He talks about systems, execution, and real decisions.",
    },
  },
  {
    name: "Valeria Mendoza",
    role: {
      es: "Agente e inversionista",
      en: "Agent and investor",
    },
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    quote: {
      es: "Tiene presencia, criterio y una manera muy directa de ayudarte a ver donde esta la oportunidad.",
      en: "He has presence, judgment, and a very direct way of helping you see where the opportunity really is.",
    },
  },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1 text-gold">
      {Array.from({ length: count }).map((_, index) => (
        <svg key={index} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 0 0 .951-.69l1.07-3.292Z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials({ language }: TestimonialsProps) {
  const t = translations[language]
  const [communityTestimonials, setCommunityTestimonials] = useState<CommunityTestimonial[]>([])

  useEffect(() => {
    let cancelled = false

    async function loadCommunityTestimonials() {
      try {
        const response = await fetch("/api/community-content", { cache: "no-store" })

        if (!response.ok) {
          return
        }

        const payload = (await response.json()) as {
          testimonials?: CommunityTestimonial[]
        }

        if (!cancelled) {
          setCommunityTestimonials(payload.testimonials ?? [])
        }
      } catch {
        // Keep the curated testimonials if the community feed is unavailable.
      }
    }

    void loadCommunityTestimonials()

    return () => {
      cancelled = true
    }
  }, [])

  const allTestimonials = [
    ...testimonials.map((item) => ({
      key: item.name,
      name: item.name,
      role: item.role[language],
      quote: item.quote[language],
      avatarUrl: item.avatar,
      rating: 5,
    })),
    ...communityTestimonials.map((item) => ({
      key: item.id,
      name: item.name,
      role: item.role,
      quote: item.quote,
      avatarUrl: item.avatarUrl,
      rating: item.rating,
    })),
  ]

  return (
    <section className="bg-[#f7f3ee] py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="mb-4 text-charcoal">{t.heading}</h2>
            <p className="text-lg leading-relaxed text-charcoal/75">{t.subheading}</p>
            <div className="mt-4 line-accent"></div>
          </div>

          <CommunityContribute language={language} defaultMode="testimonial" triggerLabel={t.cta} />
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: allTestimonials.length > 3,
          }}
          className="px-1 md:px-3"
        >
          <CarouselContent className="-ml-6">
            {allTestimonials.map((testimonial) => (
              <CarouselItem key={testimonial.key} className="basis-[88%] pl-6 sm:basis-[72%] lg:basis-1/2 xl:basis-1/3">
                <article className="flex h-full min-h-[320px] flex-col border border-taupe/15 bg-warm-white p-7">
                  <Stars count={testimonial.rating} />
                  <p className="mt-5 text-lg leading-relaxed text-charcoal/85">“{testimonial.quote}”</p>

                  <div className="mt-auto flex items-center gap-4 border-t border-taupe/10 pt-5">
                    {testimonial.avatarUrl ? (
                      <img
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-sm font-semibold text-warm-white">
                        {getInitials(testimonial.name)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-charcoal">{testimonial.name}</p>
                      <small className="text-charcoal/60">{testimonial.role}</small>
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex justify-end gap-3 pr-1 md:pr-3">
            <CarouselPrevious className="static translate-y-0 border border-charcoal/15 bg-warm-white text-charcoal hover:border-gold hover:text-gold disabled:opacity-35" />
            <CarouselNext className="static translate-y-0 border border-charcoal/15 bg-warm-white text-charcoal hover:border-gold hover:text-gold disabled:opacity-35" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
