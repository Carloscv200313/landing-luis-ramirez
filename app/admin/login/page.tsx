import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { isAdminAuthConfigured, isAdminAuthenticated } from "@/lib/admin-auth"
import { loginAdminAction } from "@/app/admin/actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admin Login | Luis Ramirez",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin")
  }

  const params = searchParams ? await searchParams : {}
  const isConfigured = isAdminAuthConfigured()

  return (
    <main className="min-h-screen bg-[#f7f3ee] px-4 py-10">
      <div className="mx-auto max-w-md border border-taupe/15 bg-warm-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-charcoal/55">Acceso privado</p>
        <h1 className="mb-3 text-charcoal">Panel de supervision</h1>
        <p className="mb-8 text-charcoal/70">
          Ingresa con tu usuario y contraseña para revisar, aprobar o eliminar testimonios e imagenes enviados por la comunidad.
        </p>

        {!isConfigured ? (
          <div className="border border-[#d6b2b2] bg-[#fff4f4] px-4 py-3 text-sm text-[#7e3636]">
            Falta configurar `ADMIN_USERNAME`, `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET`.
          </div>
        ) : null}

        {params?.error === "invalid" ? (
          <div className="mb-6 border border-[#d6b2b2] bg-[#fff4f4] px-4 py-3 text-sm text-[#7e3636]">
            Usuario o contraseña incorrectos.
          </div>
        ) : null}

        <form action={loginAdminAction} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-charcoal">Usuario</label>
            <input
              type="text"
              name="username"
              required
              disabled={!isConfigured}
              className="w-full border border-taupe/20 bg-transparent px-4 py-3 text-charcoal transition-colors focus:border-gold focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-charcoal">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              disabled={!isConfigured}
              className="w-full border border-taupe/20 bg-transparent px-4 py-3 text-charcoal transition-colors focus:border-gold focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={!isConfigured}
            className="inline-flex min-h-12 w-full items-center justify-center bg-charcoal px-6 py-3 text-sm font-semibold text-warm-white transition-colors duration-300 hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Entrar al panel
          </button>
        </form>
      </div>
    </main>
  )
}
