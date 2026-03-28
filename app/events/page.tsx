import { createClient } from '@/utils/supabase/server'
import { rsvpForEvent } from '@/app/actions/events'
import Image from 'next/image'
import Link from 'next/link'

export default async function EventsHub() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch upcoming events from Supabase
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    
  // Also fetch user's RSVPs to show status if logged in
  let userRsvps: any[] = []
  if (user) {
    const { data } = await supabase
      .from('event_rsvps')
      .select('event_id, status')
      .eq('user_id', user.id)
    userRsvps = data || []
  }

  // To properly type and check if a user is attending
  const isRSVPd = (eventId: string) => userRsvps.some(r => r.event_id === eventId)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50 mb-3">Community Events</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Discover what's happening in our community & RSVP.</p>
        </div>
        {!user && (
          <Link href="/login" className="text-sm font-semibold bg-white dark:bg-zinc-800 border dark:border-zinc-700 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-zinc-900 dark:text-white">
            Sign in to RSVP
          </Link>
        )}
      </div>

      {!events || events.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🗓️</div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">No upcoming events right now. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
              {event.image_url ? (
                <div className="aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800 relative">
                  <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-zinc-900 flex items-center justify-center border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-8xl drop-shadow-md pb-4">🎪</span>
                </div>
              )}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100 leading-tight pr-4">{event.title}</h3>
                  <span className="inline-flex items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 text-sm font-bold border border-emerald-100 dark:border-emerald-800/50 whitespace-nowrap">
                    {event.price && Number(event.price) > 0 ? `$${Number(event.price).toFixed(2)}` : 'Free'}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed flex-1">{event.description}</p>
                <div className="mt-auto mb-8 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <svg className="mr-2.5 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
                
                {isRSVPd(event.id) ? (
                  <Link href={`/events/payment-instructions?eventId=${event.id}`} className="w-full inline-flex justify-center items-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 px-4 py-3.5 text-sm font-bold transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700">
                    View Payment Details
                  </Link>
                ) : (
                  <form action={rsvpForEvent} className="w-full">
                    <input type="hidden" name="eventId" value={event.id} />
                    <button type="submit" disabled={!user} className="w-full inline-flex justify-center items-center rounded-xl bg-blue-600 text-white dark:bg-blue-500 dark:text-zinc-950 px-4 py-3.5 text-sm font-bold shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                      {user ? 'RSVP Now' : 'Sign in to RSVP'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
