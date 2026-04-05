import { createClient } from '@/utils/supabase/server'
import { createEvent, deleteEvent } from '@/app/actions/admin-events'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AdminEventsPage() {
  const supabase = await createClient()
  
  // Fetch active events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight sm:text-4xl mb-2">
            Events Manager
          </h1>
          <p className="text-lg text-stone-500 font-medium">
            Schedule new community events and upload promotional flyers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CREATE EVENT FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8 sticky top-8">
            <h3 className="text-xl font-bold text-stone-900 mb-6">Create New Event</h3>
            <form action={createEvent} className="space-y-5">
              
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Event Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="e.g. Summer Pool Party"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Date & Time *</label>
                <input 
                  type="datetime-local" 
                  name="date" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-stone-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Member Price ($)</label>
                  <input 
                    type="number" 
                    name="price_member" 
                    step="0.01"
                    placeholder="e.g. 10.00"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Guest Price ($)</label>
                  <input 
                    type="number" 
                    name="price_non_member" 
                    step="0.01"
                    placeholder="e.g. 15.00"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Upload Flyer (Image)</label>
                <input 
                  type="file" 
                  name="flyer" 
                  accept="image/png, image/jpeg, image/webp"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition-all cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Details & Description</label>
                <textarea 
                  name="description" 
                  rows={4}
                  placeholder="What is this event about?"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-stone-900 text-stone-50 font-bold hover:bg-black transition-colors"
              >
                Publish Event
              </button>

            </form>
          </div>
        </div>

        {/* EVENTS LIST */}
        <div className="lg:col-span-2 space-y-4">
          {events && events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden flex flex-col sm:flex-row">
                
                {/* Event Image / Flyer */}
                <div className="w-full sm:w-48 h-48 sm:h-auto bg-stone-100 relative shrink-0">
                  {event.image_url ? (
                    <Image src={event.image_url} alt={event.title} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <span className="text-xs font-semibold uppercase tracking-widest">No Flyer</span>
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-extrabold text-stone-900 truncate pr-4">{event.title}</h4>
                      <div className="flex flex-col items-end">
                        <div className="flex gap-2">
                          {event.price_member > 0 ? (
                            <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-100 uppercase tracking-tight">Member: ${event.price_member}</span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tight">Member: Free</span>
                          )}
                          {event.price_non_member > 0 ? (
                            <span className="bg-stone-50 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-stone-100 uppercase tracking-tight">Guest: ${event.price_non_member}</span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tight">Guest: Free</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sky-600 font-bold text-sm mb-3">
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                    <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed">
                      {event.description || "No description provided."}
                    </p>
                  </div>
                  
                  {/* Danger Zone */}
                  <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
                    <form action={deleteEvent.bind(null, event.id)}>
                      <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-bold transition-colors">
                        Delete Event
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-stone-200 p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-2">No Scheduled Events</h4>
              <p className="text-stone-500 font-medium">Use the form to create your first community event.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
