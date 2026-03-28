'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function rsvpForEvent(formData: FormData) {
  const eventId = formData.get('eventId') as string
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login?message=You must be signed in to RSVP for events.')
  }

  const { error } = await supabase
    .from('event_rsvps')
    .insert({
      event_id: eventId,
      user_id: user.id,
      status: 'pending_payment'
    })

  if (error && error.code !== '23505') { // Ignore unique constraint violation if they already RSVP'd
    console.error('RSVP Error:', error)
  }

  return redirect(`/events/payment-instructions?eventId=${eventId}`)
}
