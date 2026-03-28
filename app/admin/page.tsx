import { createClient } from '@/utils/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  // Fetch some quick stats
  const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true })
  const { count: topicsCount } = await supabase.from('volunteer_topics').select('*', { count: 'exact', head: true })
  const { count: newslettersCount } = await supabase.from('newsletters').select('*', { count: 'exact', head: true })

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight sm:text-4xl mb-2">
          Admin Dashboard
        </h1>
        <p className="text-lg text-stone-500 font-medium">
          Manage the official Estates of Fort Lauderdale website content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Events Stat Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Live Events</p>
            <p className="text-4xl font-extrabold text-stone-900">{eventsCount ?? 0}</p>
          </div>
          <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        </div>

        {/* Volunteer Stat Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Volunteer Topics</p>
            <p className="text-4xl font-extrabold text-stone-900">{topicsCount ?? 0}</p>
          </div>
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </div>
        </div>

        {/* Newsletters Stat Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Newsletters</p>
            <p className="text-4xl font-extrabold text-stone-900">{newslettersCount ?? 0}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
          </div>
        </div>
      </div>

      {/* Quick Quick Guide */}
      <div className="mt-12 bg-stone-900 rounded-3xl p-8 text-stone-100">
        <h2 className="text-2xl font-bold mb-4">Welcome to your Master Control Panel</h2>
        <p className="text-stone-300 leading-relaxed max-w-3xl mb-6">
          Use the sidebar on the left to navigate through the different modules. Any changes you make here will instantly update across the public facing website for all residents.
        </p>
        <ul className="space-y-3 text-stone-400">
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-sky-500"></div>
            <strong>Events Manager:</strong> Upload flyers and schedule upcoming resident events.
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-sky-500"></div>
            <strong>Volunteer Topics:</strong> Customize the volunteer sign-up cards and available positions.
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-sky-500"></div>
            <strong>Newsletters:</strong> Upload the official monthly PDF document to the database.
          </li>
        </ul>
      </div>
    </div>
  )
}
