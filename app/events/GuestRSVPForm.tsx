'use client'

import { useState } from 'react'
import { rsvpForEvent } from '@/app/actions/events'

interface GuestRSVPFormProps {
  eventId: string
}

export default function GuestRSVPForm({ eventId }: GuestRSVPFormProps) {
  const [showForm, setShowForm] = useState(false)

  if (!showForm) {
    return (
      <button 
        onClick={() => setShowForm(true)}
        className="w-full inline-flex justify-center items-center rounded-xl bg-blue-600 text-white dark:bg-blue-500 dark:text-zinc-950 px-4 py-3.5 text-sm font-bold shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
      >
        RSVP as Guest
      </button>
    )
  }

  return (
    <form action={rsvpForEvent} className="space-y-4 bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-700/50">
      <input type="hidden" name="eventId" value={eventId} />
      
      <div>
        <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
        <input 
          type="text" 
          name="guestName" 
          required 
          placeholder="Enter your name"
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 ml-1">Phone Number</label>
        <input 
          type="tel" 
          name="guestPhone" 
          required 
          placeholder="(555) 000-0000"
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 ml-1">I am a:</label>
        <div className="grid grid-cols-2 gap-3">
          <label className="relative flex items-center justify-center p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50 dark:has-[:checked]:bg-blue-900/20">
            <input type="radio" name="isMember" value="true" className="sr-only" defaultChecked />
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Club Member</span>
          </label>
          <label className="relative flex items-center justify-center p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50 dark:has-[:checked]:bg-blue-900/20">
            <input type="radio" name="isMember" value="false" className="sr-only" />
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Non-Member</span>
          </label>
        </div>
      </div>

      <div className="pt-2 flex gap-3">
        <button 
          type="button"
          onClick={() => setShowForm(false)}
          className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="flex-[2] px-4 py-3 rounded-xl bg-blue-600 text-white dark:bg-blue-500 dark:text-zinc-950 text-sm font-bold shadow-md hover:bg-blue-700 transition-all"
        >
          Confirm RSVP
        </button>
      </div>
    </form>
  )
}
