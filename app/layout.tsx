import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SiteHeader from '@/components/SiteHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Estates of Fort Lauderdale Community Club',
  description: 'Official website for the Estates of Fort Lauderdale Community Club',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50`}>
        <SiteHeader />
        <main className="flex-1 flex flex-col min-h-[calc(100vh-140px)]">
          {children}
        </main>
        <footer className="border-t py-8 bg-white dark:bg-zinc-950">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row max-w-7xl">
            <p className="text-center text-sm leading-loose text-stone-600 dark:text-stone-400 md:text-left">
              © {new Date().getFullYear()} Estates of Fort Lauderdale Community Club. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
