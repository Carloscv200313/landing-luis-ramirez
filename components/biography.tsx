"use client"

interface BiographyProps {
  language: "es" | "en"
}

const translations = {
  es: {
    heading: "Sobre mí",
    label: "Mentalidad",
    quote: "El éxito no es suerte. Es un sistema.",
    paragraphs: [
      "No empecé con ventajas, pero sí con una decisión clara: crecer.",
      "A lo largo de mi camino en real estate he cerrado más de 150+ deals trabajando distintas estrategias, entendiendo el mercado y desarrollando criterio para ejecutar con precisión.",
      "Aprendí que este negocio no se trata solo de números. Se trata de enfoque, disciplina y consistencia: la mentalidad correcta para sostener resultados cuando otros se frenan.",
      "Mi enfoque es crear oportunidades reales, construir sistemas que funcionen y abrir camino para otros, especialmente latinos y dueños de negocio que quieren entrar, escalar y operar con una visión más grande.",
    ],
  },
  en: {
    heading: "About Me",
    label: "Mindset",
    quote: "Success is not luck. It's a system.",
    paragraphs: [
      "I did not start with advantages, but I did start with one clear decision: to grow.",
      "Throughout my journey in real estate, I have closed 150+ deals across different strategies, learned how to read the market, and built the judgment required to execute with precision.",
      "I learned early that this business is not only about numbers. It is about focus, discipline, and consistency: the right mindset to keep producing results when others slow down.",
      "My focus is to create real opportunities, build systems that work, and help others step in and scale, especially Latinos and business owners who want to operate with a bigger vision.",
    ],
  },
}

export default function Biography({ language }: BiographyProps) {
  const t = translations[language]

  return (
    <section id="biography" className="px-4 py-24 sm:px-6 md:py-36 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
        <div className="rounded-sm bg-charcoal px-8 py-10 text-warm-white animate-fade-in-up">
          <small className="uppercase tracking-[0.28em] text-warm-white/60">{t.label}</small>
          <p className="mt-5 text-3xl font-serif leading-tight text-pretty">{t.quote}</p>
        </div>

        <div>
          <h2 className="mb-6 text-charcoal text-pretty">{t.heading}</h2>
          <div className="mb-10 line-accent"></div>
          <div className="space-y-6">
            {t.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-lg leading-relaxed text-charcoal/90 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
