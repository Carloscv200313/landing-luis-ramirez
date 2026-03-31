import { NextResponse } from "next/server"
import { fetchApprovedGalleryImages, fetchApprovedTestimonials } from "@/lib/community-supabase"

export async function GET() {
  const [testimonials, gallery] = await Promise.all([
    fetchApprovedTestimonials(),
    fetchApprovedGalleryImages(),
  ])

  return NextResponse.json({
    testimonials,
    gallery,
  })
}
