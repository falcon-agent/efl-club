import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full bg-stone-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative w-full py-28 lg:py-40 flex flex-col items-center text-center px-4 overflow-hidden shadow-[inset_0_-10px_30px_rgba(0,0,0,0.05)]">
        {/* Background Image Container (Positively Stacked to avoid falling behind the Body tag) */}
        <div className="absolute inset-0 w-full h-full z-0 bg-stone-200">
          <Image 
            src="/photos/lighthouse-photo.webp" 
            alt="EFL Community Lighthouse" 
            fill 
            className="object-cover opacity-90"
            priority
            unoptimized
          />
          {/* Subtle light overlay to ensure text legibility while letting the photo shine */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
        </div>

        {/* Foreground Content Wrapper (Z-10 to stay above the Background Image) */}
        <div className="relative z-10 flex flex-col items-center w-full">
          <Image src="/logo.png" priority alt="EFL Club Logo" width={160} height={160} className="mb-8 drop-shadow-xl" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-stone-900 drop-shadow-sm">
            Welcome to the <br className="hidden sm:block" /> <span className="text-sky-800">EFL Community Club</span>
          </h1>
          <div className="max-w-[800px] mb-10">
            <p className="text-stone-900 md:text-xl leading-relaxed font-bold bg-white/70 shadow-sm px-6 py-4 rounded-2xl backdrop-blur-md inline-block">
              The official community hub for the Estates of Fort Lauderdale. Stay updated on exclusive events, volunteer opportunities, and access community resources. All are welcome!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/events" className="inline-flex h-12 sm:w-72 lg:w-auto items-center justify-center rounded-xl bg-sky-600 px-8 text-sm font-bold text-white shadow-xl transition-all hover:bg-sky-700 hover:-translate-y-1">
              View Upcoming Events
            </Link>
            <Link href="/signup" className="inline-flex h-12 sm:w-auto w-full items-center justify-center rounded-xl border-2 border-transparent bg-white/90 backdrop-blur px-8 text-sm font-bold text-stone-900 shadow-xl transition-all hover:bg-white hover:-translate-y-1">
              Join the Portal
            </Link>
            <Link href="/newsletters" className="inline-flex h-12 sm:w-auto w-full items-center justify-center rounded-xl border-2 border-stone-200 bg-white/50 backdrop-blur-sm px-8 text-sm font-bold text-stone-700 shadow-lg transition-all hover:bg-white/80 hover:-translate-y-1 sm:hidden">
              View Latest Newsletter
            </Link>
          </div>
          <Link href="/newsletters" className="mt-4 hidden sm:inline-flex h-12 items-center justify-center rounded-xl border-2 border-stone-200 bg-white/50 backdrop-blur-sm px-8 text-sm font-bold text-stone-700 shadow-lg transition-all hover:bg-white/80 hover:-translate-y-1">
              View Latest Newsletter
          </Link>
        </div>
      </section>

      {/* Community Gallery Strip */}
      <section className="w-full py-16 bg-stone-50 dark:bg-zinc-950 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-sm group">
              <Image src="/photos/night-pool-photo.png" alt="Night Pool" sizes="(max-width: 768px) 50vw, 25vw" fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
            </div>
            <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-sm group mt-4 md:mt-8">
               <Image src="/photos/yacuzzi-photo.png" alt="Community Jacuzzi" sizes="(max-width: 768px) 50vw, 25vw" fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
            </div>
            <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-sm group">
               <Image src="/photos/garden-photo.png" alt="Community Gardens" sizes="(max-width: 768px) 50vw, 25vw" fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
            </div>
             <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-sm group mt-4 md:mt-8">
               <Image src="/photos/night-fountain-photo.png" alt="Night Fountain" sizes="(max-width: 768px) 50vw, 25vw" fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
            </div>
          </div>
        </div>
      </section>

      {/* Brochure / About Section */}
      <section className="w-full pb-24 md:pb-32 bg-stone-50 dark:bg-zinc-950 border-b border-stone-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-6 text-stone-900 dark:text-stone-50">About Our Community</h2>
            <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed font-medium">
              A vibrant and welcoming residential neighborhood nestled in the heart of sunny South Florida, built on the values of connection, recreation, and active living.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-2 group overflow-hidden flex flex-col">
              <div className="relative h-56 w-full overflow-hidden bg-stone-100 dark:bg-zinc-800">
                <Image src="/photos/game-field-photo.png" alt="Community Events" sizes="(max-width: 768px) 100vw, 33vw" fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
              </div>
              <div className="p-8 flex-1">
                <h3 className="text-2xl font-bold mb-4 text-stone-900 dark:text-stone-100">Community Events</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-medium">Join us for weekly bingo, seasonal parties, fitness classes, and specialized hobby clubs happening year-round in our clubhouse.</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-2 group overflow-hidden flex flex-col">
              <div className="relative h-56 w-full overflow-hidden bg-stone-100 dark:bg-zinc-800">
                <Image src="/photos/lake-and-fence-photo.png" alt="Get Involved" sizes="(max-width: 768px) 100vw, 33vw" fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
              </div>
              <div className="p-8 flex-1">
                 <h3 className="text-2xl font-bold mb-4 text-stone-900 dark:text-stone-100">Get Involved</h3>
                 <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-medium">Our club thrives on volunteers! Lend a hand in event planning, community beautification, and making our neighborhood a better place.</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-2 group overflow-hidden flex flex-col">
              <div className="relative h-56 w-full overflow-hidden bg-stone-100 dark:bg-zinc-800">
                 <Image src="/photos/lighthouse-photo.png" alt="Member Resources" sizes="(max-width: 768px) 100vw, 33vw" fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
              </div>
              <div className="p-8 flex-1">
                 <h3 className="text-2xl font-bold mb-4 text-stone-900 dark:text-stone-100">Member Resources</h3>
                 <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-medium">Access important POA documents, official meeting minutes, newsletters, and the community guidelines in our secured portal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
