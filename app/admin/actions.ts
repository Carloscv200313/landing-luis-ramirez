"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import {
  approveGallerySubmission,
  approveTestimonialSubmission,
  deleteGallerySubmission,
  deleteTestimonialSubmission,
} from "@/lib/community-supabase"
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  verifyAdminCredentials,
} from "@/lib/admin-auth"

function getStringValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim()
}

export async function loginAdminAction(formData: FormData) {
  const username = getStringValue(formData, "username")
  const password = getStringValue(formData, "password")

  if (!verifyAdminCredentials(username, password)) {
    redirect("/admin/login?error=invalid")
  }

  await createAdminSession()
  redirect("/admin")
}

export async function logoutAdminAction() {
  await clearAdminSession()
  redirect("/admin/login")
}

export async function moderateSubmissionAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  const type = getStringValue(formData, "type")
  const action = getStringValue(formData, "action")
  const id = getStringValue(formData, "id")

  if (!id) {
    redirect("/admin?error=missing-id")
  }

  if (type === "testimonial") {
    if (action === "approve") {
      await approveTestimonialSubmission(id)
    }

    if (action === "delete") {
      await deleteTestimonialSubmission(id)
    }
  }

  if (type === "gallery") {
    if (action === "approve") {
      await approveGallerySubmission(id)
    }

    if (action === "delete") {
      await deleteGallerySubmission(id)
    }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  redirect("/admin")
}
