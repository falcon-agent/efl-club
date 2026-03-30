'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  return profile?.is_admin === true
}

export async function deleteNewsletter(id: string, fileUrl: string) {
  if (!(await verifyAdmin())) throw new Error("Unauthorized")

  const supabase = await createClient()

  // Extract path from public URL to delete from storage as well
  const path = fileUrl.split('community-media/').pop()
  if (path) {
    await supabase.storage.from('community-media').remove([path])
  }

  // Delete DB record
  await supabase.from('newsletters').delete().eq('id', id)
  
  revalidatePath('/admin/newsletters')
  revalidatePath('/newsletters')
}

export async function uploadNewsletter(title: string, month: number, year: number, pdfUrl: string) {
  try {
    if (!(await verifyAdmin())) return { error: "Unauthorized" }

    if (!title || !month || !year || !pdfUrl) {
      return { error: 'All fields are required.' }
    }

    const supabase = await createClient()

    // Insert or Update DB record
    const { error: insertError } = await supabase.from('newsletters').insert({
      title,
      month,
      year,
      pdf_url: pdfUrl
    })

    if (insertError) {
       if (insertError.code === '23505') {
          return { error: "A newsletter for this Month and Year already exists. Please delete it first." }
       }
       return { error: "Failed to save newsletter record to database." }
    }

    revalidatePath('/admin/newsletters')
    revalidatePath('/newsletters')
    
    return { success: true }
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" }
  }
}
