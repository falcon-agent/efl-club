import { createClient } from '@/utils/supabase/server'
import { createTopic, deleteTopic, createPosition, deletePosition } from '@/app/actions/admin-volunteer'

export const dynamic = 'force-dynamic'

export default async function AdminVolunteerPage() {
  const supabase = await createClient()

  // Fetch all volunteer topics and their associated positions
  const { data: topics } = await supabase
    .from('volunteer_topics')
    .select('*, volunteer_positions(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight sm:text-4xl mb-2">
          Volunteer Settings
        </h1>
        <p className="text-lg text-stone-500 font-medium">
          Create broad Volunteer Topics and add specific open Positions to each topic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD TOPIC FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8 sticky top-8">
            <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </div>
              Create New Topic
            </h3>
            
            <form action={createTopic} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Topic Name *</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="e.g. Garden Maintenance"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Icon Style</label>
                <select 
                  name="icon" 
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-stone-700"
                >
                  <option value="Star">Star (General)</option>
                  <option value="Leaf">Leaf (Outdoors)</option>
                  <option value="Heart">Heart (Community)</option>
                  <option value="Briefcase">Briefcase (Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  rows={3}
                  placeholder="Briefly explain what volunteers do here..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-stone-900 text-stone-50 font-bold hover:bg-black transition-colors shadow-lg shadow-stone-200"
              >
                Create Topic
              </button>
            </form>
          </div>
        </div>

        {/* TOPICS & POSITIONS LIST */}
        <div className="lg:col-span-2 space-y-6">
          {topics && topics.length > 0 ? (
            topics.map(topic => (
              <div key={topic.id} className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden relative">
                
                {/* Topic Header */}
                <div className="p-6 md:p-8 bg-stone-50/50 border-b border-stone-100">
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="text-2xl font-extrabold text-stone-900">{topic.title}</h4>
                     <form action={deleteTopic.bind(null, topic.id)}>
                        <button type="submit" className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg text-sm font-bold transition-colors">
                          Delete Topic
                        </button>
                     </form>
                  </div>
                  <p className="text-stone-500 leading-relaxed font-medium">
                    {topic.description || "No description provided."}
                  </p>
                </div>

                {/* Positions Content */}
                <div className="p-6 md:p-8 bg-white">
                  <h5 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Open Positions</h5>
                  
                  {/* List Positions */}
                  <ul className="space-y-2 mb-6">
                    {topic.volunteer_positions && topic.volunteer_positions.length > 0 ? (
                      topic.volunteer_positions.map((pos: {id: string; name: string}) => (
                        <li key={pos.id} className="flex justify-between items-center bg-stone-50 rounded-xl px-4 py-3 border border-stone-100">
                          <span className="font-bold text-stone-800">{pos.name}</span>
                          <form action={deletePosition.bind(null, pos.id)}>
                            <button type="submit" className="text-stone-400 hover:text-red-600 p-1 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </form>
                        </li>
                      ))
                    ) : (
                      <div className="text-sm text-stone-400 italic p-3 text-center border-2 border-dashed border-stone-100 rounded-xl">
                        No positions added yet.
                      </div>
                    )}
                  </ul>

                  {/* Add Position Form inline */}
                  <form action={createPosition} className="flex gap-2">
                    <input type="hidden" name="topic_id" value={topic.id} />
                    <input 
                      type="text" 
                      name="name" 
                      required
                      placeholder="e.g. Traffic Coordinator" 
                      className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                    <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-sky-500/20">
                      Add Position
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-stone-200 p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-2">No Volunteer Topics</h4>
              <p className="text-stone-500 font-medium">Create your first Volunteer Topic to start recruiting.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
