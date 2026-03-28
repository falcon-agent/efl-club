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

export async function createTopic(formData: FormData) {
  if (!(await verifyAdmin())) throw new Error("Unauthorized")
    
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const icon = formData.get('icon') as string

  if (!title) return

  const supabase = await createClient()
  await supabase.from('volunteer_topics').insert({
    title,
    description,
    icon_or_image: icon || 'Hands' // default icon notion
  })

  revalidatePath('/admin/volunteer')
  revalidatePath('/volunteer')
  revalidatePath('/')
}

export async function deleteTopic(topicId: string) {
  if (!(await verifyAdmin())) throw new Error("Unauthorized")

  const supabase = await createClient()
  // Cascade delete handles positions automatically
  await supabase.from('volunteer_topics').delete().eq('id', topicId)
  
  revalidatePath('/admin/volunteer')
  revalidatePath('/volunteer')
  revalidatePath('/')
}

export async function createPosition(formData: FormData) {
  if (!(await verifyAdmin())) throw new Error("Unauthorized")

  const topic_id = formData.get('topic_id') as string
  const name = formData.get('name') as string

  if (!topic_id || !name) return

  const supabase = await createClient()
  await supabase.from('volunteer_positions').insert({
    topic_id,
    name
  })

  revalidatePath('/admin/volunteer')
  revalidatePath('/volunteer')
  revalidatePath('/')
}

export async function deletePosition(positionId: string) {
  if (!(await verifyAdmin())) throw new Error("Unauthorized")

  const supabase = await createClient()
  await supabase.from('volunteer_positions').delete().eq('id', positionId)
  
  revalidatePath('/admin/volunteer')
  revalidatePath('/volunteer')
  revalidatePath('/')
}
