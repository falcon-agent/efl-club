'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function rsvpForEvent(formData: FormData) {
  const eventId = formData.get('eventId') as string
  const guestName = formData.get('guestName') as string
  const guestPhone = formData.get('guestPhone') as string
  const isMember = formData.get('isMember') === 'true'
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Prepare insert data
  const rsvpData: any = {
    event_id: eventId,
    status: 'pending_payment'
  }

  if (user) {
    rsvpData.user_id = user.id
    // If user is logged in, we should check their profile to see if they are a member
    // But for now, we can also trust the 'isMember' flag if we want, 
    // or better yet, fetch it from the profile.
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    rsvpData.is_member = profile?.role === 'member'
  } else {
    // Guest flow
    if (!guestName || !guestPhone) {
      throw new Error('Name and Phone are required for guest RSVP')
    }
    rsvpData.guest_name = guestName
    rsvpData.guest_phone = guestPhone
    rsvpData.is_member = isMember
  }

  const { data: rsvp, error } = await supabase
    .from('event_rsvps')
    .insert(rsvpData)
    .select()
    .single()

  if (error && error.code !== '23505') {
    console.error('RSVP Error:', error)
    throw new Error('Failed to RSVP')
  }

  // Redirect to payment instructions, passing rsvpId for guests/members to identify their specific record
  const rsvpId = rsvp?.id || ''
  return redirect(`/events/payment-instructions?eventId=${eventId}${rsvpId ? `&rsvpId=${rsvpId}` : ''}`)
}
