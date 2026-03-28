import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PaymentInstructions({ searchParams }: { searchParams: Promise<{ eventId?: string }> }) {
  const { eventId } = await searchParams;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let eventDetails = null;
  if (eventId) {
    const { data } = await supabase.from('events').select('*').eq('id', eventId).single()
    eventDetails = data
  }

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center max-w-3xl">
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl p-8 sm:p-14 w-full shadow-lg text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">RSVP Confirmed!</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed max-w-lg mx-auto">
          Your spot is reserved. {eventDetails?.price && Number(eventDetails.price) > 0 ? 'Please complete your payment below to finalize registration.' : 'This is a free event! We look forward to seeing you there.'}
        </p>

        {eventDetails?.price && Number(eventDetails.price) > 0 && (
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-left mb-10 shadow-inner">
            <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-6 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mr-3 text-sm">💰</span>
              Payment Options
            </h3>
            
            <div className="space-y-8">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[100px] -z-10"></div>
                <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2">Option 1: Zelle</p>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">Send your payment of <span className="font-bold text-zinc-900 dark:text-white">${eventDetails.price}</span> to <br/><span className="mt-2 font-mono bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 flex inline-block rounded-md border border-blue-200 dark:border-blue-800/30 font-semibold tracking-wide">payments@eflclub.com</span></p>
                {/* Simulated QR Code for Design */}
                <div className="mt-4 aspect-square w-32 bg-white dark:bg-white p-3 rounded-xl border border-zinc-200 shadow-sm mx-auto sm:mx-0 flex justify-center items-center">
                  <svg className="w-full h-full text-zinc-900" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h6v6H4zm2 2v2h2V6zM4 14h6v6H4zm2 2v2h2v-2zM14 4h6v6h-6zm2 2v2h2V6zm-2 10h2v2h-2zm2 0h2v-2h2v2h-2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm-6-4h2v2h-2zm0 4h2v2h-2z" /></svg>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="flex-1">
                  <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2">Option 2: Cash Drop-off</p>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">You can drop off cash directly to the community staff.</p>
                  <div className="space-y-2 text-zinc-900 dark:text-zinc-300 font-medium">
                    <p className="flex items-center gap-2">John Doe: <a href="tel:5551234567" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">(555) 123-4567</a></p>
                    <p className="flex items-center gap-2">Jane Smith: <a href="tel:5559876543" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">(555) 987-6543</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/events" className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-8 text-sm font-bold text-white shadow-md transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
            Back to Events
          </Link>
          <Link href="/portal" className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-8 text-sm font-bold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100">
            View My Portal
          </Link>
        </div>
      </div>
    </div>
  )
}
