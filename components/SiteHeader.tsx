import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/actions/auth'

export default async function SiteHeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    isAdmin = data?.is_admin === true
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md border-stone-100 shadow-sm">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-8 mx-auto xl:max-w-7xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-sky-50 rounded-2xl p-2 group-hover:bg-sky-100 transition-colors">
            <Image src="/logo.png" alt="EFL Club Logo" width={40} height={40} className="object-contain" priority />
          </div>
          <span className="font-extrabold text-xl hidden sm:inline-block tracking-tight text-stone-900">EFL Community Club</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-bold text-stone-500">
          <Link href="/events" className="transition-colors hover:text-sky-600">Events</Link>
          <Link href="/volunteer" className="transition-colors hover:text-sky-600 hidden sm:inline-block">Volunteer</Link>
          <Link href="/newsletters" className="transition-colors hover:text-sky-600 hidden md:inline-block">Newsletters</Link>
          {user && (
            <>
              {isAdmin && (
                <Link href="/admin" className="transition-colors hover:-translate-y-0.5 transform flex items-center gap-1.5 font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full shadow-sm">
                  <svg className="w-4 h-4 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  Admin
                </Link>
              )}
              <Link href="/portal" className="transition-colors hover:text-sky-700 font-extrabold text-sky-600">Portal</Link>
              <Link href="/resources" className="transition-colors hover:text-sky-600">Resources</Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <form action={logout}>
              <button className="text-sm font-bold text-stone-500 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors">
                Sign Out
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-bold text-stone-500 hover:text-stone-900 hidden sm:inline-block px-4 py-2">Sign In</Link>
              <Link href="/signup" className="text-sm font-bold bg-sky-600 text-white px-5 py-2.5 rounded-xl hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all hover:-translate-y-0.5">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
