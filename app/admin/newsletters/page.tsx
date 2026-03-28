import { createClient } from '@/utils/supabase/server'
import { uploadNewsletter, deleteNewsletter } from '@/app/actions/admin-newsletters'

export const dynamic = 'force-dynamic'

const MONTHS = [
  { val: 1, name: 'January' }, { val: 2, name: 'February' }, 
  { val: 3, name: 'March' }, { val: 4, name: 'April' },
  { val: 5, name: 'May' }, { val: 6, name: 'June' },
  { val: 7, name: 'July' }, { val: 8, name: 'August' },
  { val: 9, name: 'September' }, { val: 10, name: 'October' },
  { val: 11, name: 'November' }, { val: 12, name: 'December' }
]

export default async function AdminNewslettersPage() {
  const supabase = await createClient()

  // Fetch newsletters ordered by Year desc, Month desc
  const { data: newsletters } = await supabase
    .from('newsletters')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight sm:text-4xl mb-2">
          Newsletter Archive
        </h1>
        <p className="text-lg text-stone-500 font-medium">
          Upload and manage the official monthly community newsletters (PDF).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* UPLOAD NEWSLETTER FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8 sticky top-8">
            <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              </div>
              Upload Publication
            </h3>
            
            <form action={uploadNewsletter} className="space-y-5">
              
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="e.g. Summer Edition 2026"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Month *</label>
                  <select 
                    name="month" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-stone-700"
                  >
                    {MONTHS.map(m => (
                      <option key={m.val} value={m.val}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Year *</label>
                  <input 
                    type="number" 
                    name="year" 
                    required 
                    defaultValue={new Date().getFullYear()}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">PDF File *</label>
                <input 
                  type="file" 
                  name="file" 
                  accept="application/pdf"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition-all cursor-pointer"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                 <p className="text-xs text-amber-700 font-medium leading-relaxed">
                   <strong>Note:</strong> You can only have one newsletter per Month/Year combination. If you need to replace an existing one, delete it from the list first.
                 </p>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-stone-900 text-stone-50 font-bold hover:bg-black transition-colors shadow-lg shadow-stone-200 flex items-center justify-center gap-2"
              >
                Upload to Archive
              </button>
            </form>
          </div>
        </div>

        {/* NEWSLETTERS LIST */}
        <div className="lg:col-span-2">
          {newsletters && newsletters.length > 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-extrabold text-stone-500 uppercase tracking-widest">Period</th>
                      <th className="px-6 py-4 text-xs font-extrabold text-stone-500 uppercase tracking-widest">Title</th>
                      <th className="px-6 py-4 text-xs font-extrabold text-stone-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {newsletters.map(nl => (
                      <tr key={nl.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="inline-flex flex-col">
                            <span className="font-bold text-stone-900 text-sm">{MONTHS.find(m => m.val === nl.month)?.name} {nl.year}</span>
                            <span className="text-xs text-stone-400 font-medium">Uploaded {new Date(nl.created_at).toLocaleDateString()}</span>
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                             </div>
                             <span className="font-semibold text-stone-700">{nl.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a href={nl.pdf_url} target="_blank" rel="noopener noreferrer" className="p-2 text-stone-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="View PDF">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </a>
                            <form action={deleteNewsletter.bind(null, nl.id, nl.pdf_url)}>
                              <button type="submit" className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-stone-200 p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-2">No Newsletters Found</h4>
              <p className="text-stone-500 font-medium">Upload your first monthly PDF to start the archive.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
