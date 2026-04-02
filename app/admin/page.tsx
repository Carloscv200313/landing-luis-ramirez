import { redirect } from "next/navigation"
import type { Metadata } from "next"
import {
  fetchApprovedGalleryImages,
  fetchApprovedTestimonials,
  fetchPendingGalleryImages,
  fetchPendingTestimonials,
} from "@/lib/community-supabase"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { logoutAdminAction, moderateSubmissionAction } from "@/app/admin/actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Moderacion | Luis Ramirez",
  robots: {
    index: false,
    follow: false,
  },
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1 text-[#c8a24b]">
      {Array.from({ length: count }).map((_, index) => (
        <svg key={index} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 0 0 .951-.69l1.07-3.292Z" />
        </svg>
      ))}
    </div>
  )
}

function ActionButtons({
  id,
  type,
  showApprove,
}: {
  id: string
  type: "testimonial" | "gallery"
  showApprove?: boolean
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {showApprove ? (
        <form action={moderateSubmissionAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="action" value="approve" />
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center bg-charcoal px-5 py-3 text-sm font-semibold text-warm-white transition-colors hover:bg-charcoal/90"
          >
            Aprobar
          </button>
        </form>
      ) : null}

      <form action={moderateSubmissionAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="action" value="delete" />
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center border border-[#d6b2b2] bg-[#fff4f4] px-5 py-3 text-sm font-semibold text-[#7e3636] transition-colors hover:bg-[#fdeaea]"
        >
          {showApprove ? "Eliminar" : "Eliminar del sitio"}
        </button>
      </form>
    </div>
  )
}

type AdminSection = "pending-testimonials" | "pending-gallery" | "approved-testimonials" | "approved-gallery"

function SidebarLink({
  href,
  label,
  count,
  active,
}: {
  href: string
  label: string
  count: number
  active?: boolean
}) {
  return (
    <a
      href={href}
      className={`flex items-center justify-between border px-4 py-3 text-sm transition-colors ${
        active
          ? "border-taupe/15 bg-background text-charcoal"
          : "border-transparent text-charcoal/75 hover:border-taupe/15 hover:bg-background hover:text-charcoal"
      }`}
    >
      <span>{label}</span>
      <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-charcoal/8 px-2 py-1 text-xs font-semibold text-charcoal">
        {count}
      </span>
    </a>
  )
}

function EmptyState({ text }: { text: string }) {
  return <div className="border border-dashed border-taupe/20 bg-warm-white px-6 py-10 text-charcoal/60">{text}</div>
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ section?: string }>
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  const params = searchParams ? await searchParams : {}
  const allowedSections: AdminSection[] = [
    "pending-testimonials",
    "pending-gallery",
    "approved-testimonials",
    "approved-gallery",
  ]
  const currentSection = allowedSections.includes(params?.section as AdminSection)
    ? (params?.section as AdminSection)
    : "pending-testimonials"

  const [pendingTestimonials, pendingGallery, approvedTestimonials, approvedGallery] = await Promise.all([
    fetchPendingTestimonials(),
    fetchPendingGalleryImages(),
    fetchApprovedTestimonials(),
    fetchApprovedGalleryImages(),
  ])

  return (
    <main className="min-h-screen bg-[#f7f3ee] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 border border-taupe/15 bg-warm-white p-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-charcoal/55">Moderacion privada</p>
            <h1 className="mb-3 text-charcoal">Revision de contenido enviado</h1>
            <p className="max-w-3xl text-charcoal/70">
              Aqui decides que testimonios e imagenes si se publican en la landing. Todo lo aprobado pasa al sitio. Todo lo rechazado se elimina.
            </p>
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center border border-charcoal/15 bg-background px-5 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-gold hover:text-gold"
            >
              Cerrar sesion
            </button>
          </form>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="border border-taupe/15 bg-warm-white p-4">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-charcoal/50">Secciones</p>
              <nav className="space-y-2">
                <SidebarLink
                  href="/admin?section=pending-testimonials"
                  label="Testimonios pendientes"
                  count={pendingTestimonials.length}
                  active={currentSection === "pending-testimonials"}
                />
                <SidebarLink
                  href="/admin?section=pending-gallery"
                  label="Imagenes pendientes"
                  count={pendingGallery.length}
                  active={currentSection === "pending-gallery"}
                />
                <SidebarLink
                  href="/admin?section=approved-testimonials"
                  label="Testimonios publicados"
                  count={approvedTestimonials.length}
                  active={currentSection === "approved-testimonials"}
                />
                <SidebarLink
                  href="/admin?section=approved-gallery"
                  label="Imagenes publicadas"
                  count={approvedGallery.length}
                  active={currentSection === "approved-gallery"}
                />
              </nav>
            </div>
          </aside>

          <div>
            {currentSection === "pending-testimonials" ? (
              <section>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h2 className="text-charcoal">Testimonios pendientes</h2>
                  <p className="mt-2 text-charcoal/65">{pendingTestimonials.length} por revisar</p>
                </div>
              </div>

              {pendingTestimonials.length === 0 ? (
                <EmptyState text="No hay testimonios pendientes en este momento." />
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  {pendingTestimonials.map((item) => (
                    <article key={item.id} className="border border-taupe/15 bg-warm-white p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-charcoal">{item.name}</p>
                          <small className="text-charcoal/60">{item.role}</small>
                        </div>
                        <Stars count={item.rating} />
                      </div>
                      <p className="mt-5 text-lg leading-relaxed text-charcoal/85">“{item.quote}”</p>
                      <p className="mt-5 text-sm text-charcoal/50">
                        Enviado: {new Date(item.createdAt).toLocaleString("es-PE")}
                      </p>
                      <ActionButtons id={item.id} type="testimonial" showApprove />
                    </article>
                  ))}
                </div>
              )}
              </section>
            ) : null}

            {currentSection === "pending-gallery" ? (
              <section>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h2 className="text-charcoal">Imagenes pendientes</h2>
                  <p className="mt-2 text-charcoal/65">{pendingGallery.length} por revisar</p>
                </div>
              </div>

              {pendingGallery.length === 0 ? (
                <EmptyState text="No hay imagenes pendientes en este momento." />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {pendingGallery.map((item) => (
                    <article key={item.id} className="overflow-hidden border border-taupe/15 bg-warm-white">
                      <img src={item.imageUrl} alt={item.title} className="aspect-[4/5] w-full object-cover" />
                      <div className="p-5">
                        <p className="font-semibold text-charcoal">{item.title}</p>
                        {item.submittedBy ? <p className="mt-1 text-sm text-charcoal/60">{item.submittedBy}</p> : null}
                        <p className="mt-4 text-sm text-charcoal/50">
                          Enviada: {new Date(item.createdAt).toLocaleString("es-PE")}
                        </p>
                        <ActionButtons id={item.id} type="gallery" showApprove />
                      </div>
                    </article>
                  ))}
                </div>
              )}
              </section>
            ) : null}

            {currentSection === "approved-testimonials" ? (
              <section>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h2 className="text-charcoal">Testimonios publicados</h2>
                  <p className="mt-2 text-charcoal/65">{approvedTestimonials.length} en el sitio</p>
                </div>
              </div>

              {approvedTestimonials.length === 0 ? (
                <EmptyState text="Todavia no hay testimonios publicados." />
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  {approvedTestimonials.map((item) => (
                    <article key={item.id} className="border border-taupe/15 bg-warm-white p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-charcoal">{item.name}</p>
                          <small className="text-charcoal/60">{item.role}</small>
                        </div>
                        <Stars count={item.rating} />
                      </div>
                      <p className="mt-5 text-lg leading-relaxed text-charcoal/85">“{item.quote}”</p>
                      <ActionButtons id={item.id} type="testimonial" />
                    </article>
                  ))}
                </div>
              )}
              </section>
            ) : null}

            {currentSection === "approved-gallery" ? (
              <section>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h2 className="text-charcoal">Imagenes publicadas</h2>
                  <p className="mt-2 text-charcoal/65">{approvedGallery.length} en el sitio</p>
                </div>
              </div>

              {approvedGallery.length === 0 ? (
                <EmptyState text="Todavia no hay imagenes publicadas." />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {approvedGallery.map((item) => (
                    <article key={item.id} className="overflow-hidden border border-taupe/15 bg-warm-white">
                      <img src={item.imageUrl} alt={item.title} className="aspect-[4/5] w-full object-cover" />
                      <div className="p-5">
                        <p className="font-semibold text-charcoal">{item.title}</p>
                        {item.submittedBy ? <p className="mt-1 text-sm text-charcoal/60">{item.submittedBy}</p> : null}
                        <ActionButtons id={item.id} type="gallery" />
                      </div>
                    </article>
                  ))}
                </div>
              )}
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
