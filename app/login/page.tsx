import Link from 'next/link'
import { login } from '@/app/actions/auth'

export default async function Login({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const { message } = await searchParams;

  return (
    <div className="flex-1 flex flex-col w-full min-h-[calc(100vh-80px)] items-center justify-center px-8">
      <div className="w-full sm:max-w-md p-6 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl shadow-sm">
        <form
          className="flex flex-col w-full gap-2 text-foreground"
          action={login}
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In to EFL Club</h1>
          
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border dark:border-zinc-800 focus:ring-2 focus:ring-zinc-500 outline-none mb-4"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border dark:border-zinc-800 focus:ring-2 focus:ring-zinc-500 outline-none mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <button className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-md px-4 py-2 mb-2 transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200">
            Sign In
          </button>
          <div className="text-sm text-center text-zinc-500 mt-4">
            Don't have an account?{' '}
            <Link href="/signup" className="text-zinc-900 dark:text-white font-medium hover:underline">
              Sign Up
            </Link>
          </div>
          
          {message && (
            <p className="mt-4 p-3 bg-red-50 text-red-900 dark:bg-red-900/10 dark:text-red-400 text-sm text-center rounded-md border border-red-200 dark:border-red-900/50">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
