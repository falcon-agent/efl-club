import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Resources() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  const isMember = profile?.role === 'member' || profile?.role === 'admin'

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">Member Resources</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Access important documents, community guidelines, and the official POA resident portal.
        </p>
      </div>

      {!isMember ? (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-10 sm:p-16 text-center shadow-sm">
          <div className="text-6xl mb-6">⏳</div>
          <h2 className="text-3xl font-extrabold text-amber-900 dark:text-amber-500 mb-4">Verification Pending</h2>
          <p className="text-amber-800 dark:text-amber-400 max-w-lg mx-auto leading-relaxed mb-10 font-medium">
            Your account is currently pending verification against the official community roster. 
            Once verified as a resident, you will gain access to these secure resources.
          </p>
          <Link href="/portal" className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-8 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-amber-700 hover:shadow-lg">
            Return to Portal
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-10 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col transition-all hover:shadow-md hover:-translate-y-1">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <h3 className="font-extrabold text-2xl mb-4 text-zinc-900 dark:text-zinc-100">Official POA Portal</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed flex-1">
              Visit the official Property Owners Association website to pay dues, submit architectural requests, and access official meeting minutes securely.
            </p>
            <a href="https://example.com/poa" target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg">
              Go to POA Portal
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-10 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col transition-all hover:shadow-md hover:-translate-y-1">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-extrabold text-2xl mb-4 text-zinc-900 dark:text-zinc-100">Community Guidelines</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed flex-1">
              Download the quick-reference guide for community rules, pool hours, trash collection schedules, and RV storage policies.
            </p>
            <button className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-6 py-4 text-sm font-bold text-zinc-900 dark:text-white transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-sm">
              Download PDF
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
