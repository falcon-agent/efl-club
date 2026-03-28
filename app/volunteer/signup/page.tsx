import { submitGoogleSheetVolunteer } from '@/app/actions/volunteer'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function VolunteerSignup({ searchParams }: { searchParams: Promise<{ topicId?: string, topicName?: string, success?: string }> }) {
  const { topicId, topicName, success } = await searchParams;
  
  const supabase = await createClient()

  // Fetch topic and its positions
  const { data: topicData } = await supabase
    .from('volunteer_topics')
    .select('title, volunteer_positions(name)')
    .eq('id', topicId)
    .single()

  if (!topicId || !topicData) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
        <Link href="/volunteer" className="text-sky-600 hover:underline font-bold">Return to Volunteer Opportunities</Link>
      </div>
    )
  }

  const positions = topicData.volunteer_positions || [];
  const displayTitle = topicData.title || topicName;

  if (success) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <div className="bg-emerald-50 text-emerald-800 p-12 rounded-3xl border border-emerald-200 shadow-sm transition-all">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-extrabold mb-4">You're Signed Up!</h1>
          <p className="text-lg mb-8 font-medium">Thank you for volunteering for <strong>{displayTitle}</strong>. Your details have been recorded in the EFL Volunteering Signup sheet, and the committee lead will contact you soon.</p>
          <Link href="/volunteer" className="inline-flex bg-emerald-600 text-white font-extrabold py-4 px-8 rounded-xl shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all">
            Explore More Opportunities
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <Link href="/volunteer" className="inline-flex items-center text-sm font-bold text-stone-500 hover:text-stone-900 mb-8 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Options
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 mb-4">{displayTitle}</h1>
          <p className="text-lg text-stone-600 mb-8 font-medium">
            Review the available positions below and fill out the form to secure your spot.
          </p>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hidden md:block">
            <h3 className="font-extrabold text-xl mb-6 text-stone-900 border-b pb-4">Positions List</h3>
            <ul className="space-y-4 font-medium">
              {positions.length > 0 ? positions.map((pos: any, idx: number) => (
                <li key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-stone-800">
                    <span className="w-5 h-5 rounded-full border-2 border-stone-200"></span>
                    {pos.name}
                  </span>
                </li>
              )) : (
                 <li className="text-stone-400 italic">No specific positions listed. General volunteers needed!</li>
              )}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-100 shadow-xl relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 to-emerald-500"></div>
          
          <h2 className="text-2xl font-extrabold mb-6 text-stone-900">Sign Up Form</h2>
          <form action={submitGoogleSheetVolunteer} className="space-y-6">
            <input type="hidden" name="topicId" value={topicId} />
            <input type="hidden" name="topicName" value={displayTitle} />
            
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2" htmlFor="fullName">Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                id="fullName" 
                required
                className="w-full rounded-2xl px-5 py-4 bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-sky-500 outline-none transition-shadow font-medium"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                required
                className="w-full rounded-2xl px-5 py-4 bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-sky-500 outline-none transition-shadow font-medium"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2" htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                id="phone" 
                required
                className="w-full rounded-2xl px-5 py-4 bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-sky-500 outline-none transition-shadow font-medium"
                placeholder="(555) 123-4567"
              />
            </div>

            {positions.length > 0 ? (
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2" htmlFor="position">Select Position</label>
                <div className="relative">
                  <select 
                    name="position" 
                    id="position" 
                    required
                    defaultValue=""
                    className="w-full rounded-2xl px-5 py-4 bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-sky-500 outline-none appearance-none font-bold text-stone-900 transition-shadow"
                  >
                    <option value="" disabled>Choose an open position...</option>
                    {positions.map((pos: any, idx: number) => (
                      <option key={idx} value={pos.name}>{pos.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-stone-500 font-medium">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            ) : (
                <input type="hidden" name="position" value="General Volunteer" />
            )}

            <button 
              type="submit" 
              className="w-full bg-sky-600 text-white font-extrabold py-5 px-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all hover:bg-sky-700 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] mt-4 text-lg"
            >
              Confirm Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
