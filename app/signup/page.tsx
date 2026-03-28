import Link from 'next/link'
import { signup } from '@/app/actions/auth'

export default async function Signup({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const { message } = await searchParams;

  return (
    <div className="flex-1 flex flex-col w-full min-h-[calc(100vh-80px)] items-center justify-center px-8">
      <div className="w-full sm:max-w-md p-6 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl shadow-sm">
        <form
          className="flex flex-col w-full gap-2 text-foreground"
          action={signup}
        >
          <h1 className="text-2xl font-bold mb-2 text-center">Join EFL Club</h1>
          <p className="text-sm text-zinc-500 text-center mb-6">Create your community portal account</p>
          
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
            minLength={6}
          />
          <button className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-md px-4 py-2 mb-2 transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200">
            Create Account
          </button>
          <div className="text-sm text-center text-zinc-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-zinc-900 dark:text-white font-medium hover:underline">
              Sign In
            </Link>
          </div>
          
          {message && (
            <p className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-800 text-sm text-center rounded-md">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
