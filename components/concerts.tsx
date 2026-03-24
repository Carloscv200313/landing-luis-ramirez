"use client"

interface ConcertsProps {
  language: "es" | "en"
}

const translations = {
  es: {
    heading: "Lo que me diferencia",
    subheading:
      "No se trata solo de cerrar deals. Se trata de cómo operas cuando el mercado exige criterio, control y consistencia.",
    items: [
      {
        step: "01",
        title: "Disciplina operativa",
        description:
          "Opero con disciplina cuando otros se detienen. Mantengo claridad, estructura y estándares altos incluso bajo presión.",
      },
      {
        step: "02",
        title: "Enfoque estratégico",
        description:
          "Me enfoco cuando otros se distraen. No persigo ruido: construyo sobre lo que funciona y escalo con intención.",
      },
      {
        step: "03",
        title: "Valor antes que ego",
        description:
          "Busco aportar valor antes de buscar resultados. Para mí, el crecimiento sostenible nace de sistemas, relaciones y consistencia.",
      },
    ],
    visionLabel: "Visión",
    vision:
      "Hoy no solo estoy construyendo ingresos. Estoy construyendo un sistema que me dé libertad de tiempo, libertad financiera y control sobre mi vida, mientras sigo creciendo como empresario, padre y líder.",
  },
  en: {
    heading: "What Sets Me Apart",
    subheading:
      "It is not only about closing deals. It is about how you operate when the market demands judgment, control, and consistency.",
    items: [
      {
        step: "01",
        title: "Operational discipline",
        description:
          "I operate with discipline when others stop. I keep clarity, structure, and high standards even under pressure.",
      },
      {
        step: "02",
        title: "Strategic focus",
        description:
          "I stay focused when others get distracted. I do not chase noise: I build on what works and scale with intention.",
      },
      {
        step: "03",
        title: "Value before ego",
        description:
          "I look to create value before chasing results. Sustainable growth comes from systems, relationships, and consistency.",
      },
    ],
    visionLabel: "Vision",
    vision:
      "Today I am not only building income. I am building a system that gives me time freedom, financial freedom, and control over my life, while I continue growing as an entrepreneur, father, and leader.",
  },
}

export default function Concerts({ language }: ConcertsProps) {
  const t = translations[language]

  return (
    <section id="concerts" className="bg-background py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <h2 className="mb-6 text-charcoal">{t.heading}</h2>
          <p className="text-lg leading-relaxed text-charcoal/75">{t.subheading}</p>
          <div className="mt-6 line-accent"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {t.items.map((item) => (
            <div key={item.step} className="border border-taupe/20 bg-warm-white p-8">
              <small className="font-medium uppercase tracking-[0.2em] text-gold">{item.step}</small>
              <h3 className="mb-4 mt-4 text-charcoal">{item.title}</h3>
              <p className="leading-relaxed text-charcoal/75">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 border border-taupe/20 bg-charcoal px-8 py-10 md:px-10">
          <small className="font-medium uppercase tracking-[0.24em] text-gold">{t.visionLabel}</small>
          <p className="mt-5 max-w-4xl text-2xl font-serif leading-relaxed text-warm-white">{t.vision}</p>
        </div>
      </div>
    </section>
  )
}
