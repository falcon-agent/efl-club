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

export async function uploadNewsletter(formData: FormData) {
  if (!(await verifyAdmin())) throw new Error("Unauthorized")

  const title = formData.get('title') as string
  const monthStr = formData.get('month') as string
  const yearStr = formData.get('year') as string
  const file = formData.get('file') as File | null

  if (!title || !monthStr || !yearStr || !file || file.size === 0) {
    throw new Error('All fields are required and file must be valid.')
  }

  const month = parseInt(monthStr, 10)
  const year = parseInt(yearStr, 10)

  const supabase = await createClient()

  // 1. Upload PDF to Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `newsletter_${year}_${month}_${Date.now()}.${fileExt}`
  const filePath = `newsletters/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('community-media')
    .upload(filePath, file)

  if (uploadError) {
    console.error("PDF Upload Error:", uploadError)
    throw new Error("Failed to upload PDF")
  }

  // 2. Get Public URL
  const { data } = supabase.storage.from('community-media').getPublicUrl(filePath)
  const pdfUrl = data.publicUrl

  // 3. Insert or Update DB record
  // If one for this month/year already exists, the UNIQUE constraint will throw an error
  // so we use upsert or just let it fail and tell user to delete old one.
  const { error: insertError } = await supabase.from('newsletters').insert({
    title,
    month,
    year,
    pdf_url: pdfUrl
  })

  // If there's a unique constraint error (23505), it means they already uploaded one for this month.
  if (insertError) {
     if (insertError.code === '23505') {
        throw new Error("A newsletter for this Month and Year already exists. Please delete it first.")
     }
     throw new Error("Failed to save newsletter record")
  }

  revalidatePath('/admin/newsletters')
  revalidatePath('/newsletters')
}
