import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Portal() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-10">My Portal</h1>
      
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm sticky top-24 transition-all hover:shadow-md">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-4xl font-bold mb-6 mx-auto lg:mx-0 shadow-sm border border-white dark:border-zinc-800">
              {(profile?.name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <h2 className="font-extrabold text-2xl text-zinc-900 dark:text-zinc-100 mb-2 text-center lg:text-left tracking-tight">{profile?.name || 'Community Member'}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-center lg:text-left font-medium">{user.email}</p>
            
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 shadow-inner">
                <span className={`w-2.5 h-2.5 rounded-full mr-2.5 shadow-sm ${profile?.role === 'member' || profile?.role === 'admin' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                {profile?.role === 'guest' ? 'Pending Verification' : profile?.role}
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-zinc-100 dark:border-zinc-800">
              <Link href="/events" className="flex items-center text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <span className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center mr-3">📅</span>
                View Upcoming Events
              </Link>
              <Link href="/volunteer" className="flex items-center text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <span className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center mr-3">🤝</span>
                Volunteer Sign Up
              </Link>
              <Link href="/resources" className="flex items-center text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <span className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center mr-3">📁</span>
                Access Resources
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-10 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
            <h3 className="font-extrabold text-2xl mb-8 flex items-center text-zinc-900 dark:text-zinc-100">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4 shadow-sm">🎫</span>
              My Upcoming RSVPs
            </h3>
            <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-950/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium mb-2">You don't have any upcoming events.</p>
              <Link href="/events" className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Browse Events
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>

          {profile?.role === 'guest' ? (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-10 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-amber-900 dark:text-amber-500 mb-2">Account Status: Pending</h3>
                <p className="text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
                  Your account is currently being verified against our official resident roster. 
                  Once verified, you'll gain access to member-only resources.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/50 rounded-3xl p-10 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
               <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-emerald-900 dark:text-emerald-500 mb-2">Account Status: Verified</h3>
                <p className="text-emerald-800 dark:text-emerald-400 leading-relaxed font-medium">
                  Your account is verified as an official resident. You have full access to community resources.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
