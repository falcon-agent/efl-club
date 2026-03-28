import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ReactNode } from 'react'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if profile exists and has is_admin = true
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile || profile.is_admin !== true) {
    redirect('/')
  }

  return (
    <div className="flex flex-col md:flex-row w-full flex-1">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 border-r border-stone-200 dark:border-zinc-800 flex flex-col p-6 shrink-0 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-sky-500 w-3 h-8 rounded-full"></div>
          <h2 className="text-xl font-bold tracking-tight text-stone-100">Admin Control</h2>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/admin" className="px-4 py-3 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-colors font-medium text-sm">
            Dashboard Home
          </Link>
          <Link href="/admin/events" className="px-4 py-3 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-colors font-medium text-sm">
            Events Manager
          </Link>
          <Link href="/admin/volunteer" className="px-4 py-3 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-colors font-medium text-sm">
            Volunteer Topics
          </Link>
          <Link href="/admin/newsletters" className="px-4 py-3 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-colors font-medium text-sm">
            Newsletters
          </Link>
        </nav>

        <div className="pt-6 border-t border-stone-800/50 mt-auto">
          <Link href="/" className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-white transition-colors flex items-center gap-2">
            ← Return to Live Site
          </Link>
        </div>
      </aside>

      {/* Admin Main Content Area */}
      <main className="flex-1 bg-stone-50 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
