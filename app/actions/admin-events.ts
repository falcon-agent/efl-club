'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Ensures the caller is an active admin before performing destructive actions
 */
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

export async function deleteEvent(eventId: string) {
  if (!(await verifyAdmin())) throw new Error("Unauthorized")

  const supabase = await createClient()
  await supabase.from('events').delete().eq('id', eventId)
  revalidatePath('/admin/events')
  revalidatePath('/events')
  revalidatePath('/')
}

export async function createEvent(formData: FormData) {
  if (!(await verifyAdmin())) throw new Error("Unauthorized")

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const dateStr = formData.get('date') as string
  const price = formData.get('price') as string
  const file = formData.get('flyer') as File | null

  if (!title || !dateStr) {
    throw new Error('Title and Date are required')
  }

  const supabase = await createClient()
  let imageUrl = null

  // 1. Upload Flyer to Storage if provided
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `events/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('community-media')
      .upload(filePath, file)

    if (uploadError) {
      console.error("Flyer Upload Error:", uploadError)
      throw new Error("Failed to upload flyer image")
    }

    // Get public URL
    const { data } = supabase.storage.from('community-media').getPublicUrl(filePath)
    imageUrl = data.publicUrl
  }

  // 2. Insert Event into Database
  const { error: insertError } = await supabase.from('events').insert({
    title,
    description,
    date: new Date(dateStr).toISOString(),
    price: price ? parseFloat(price) : 0,
    image_url: imageUrl
  })

  if (insertError) {
    console.error("Event Insert Error:", insertError)
    throw new Error("Failed to create event")
  }

  revalidatePath('/admin/events')
  revalidatePath('/events')
  revalidatePath('/')
  
  redirect('/admin/events')
}
