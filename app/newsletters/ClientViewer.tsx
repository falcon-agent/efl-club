'use client'

import { useState, useEffect } from 'react'

const MONTHS = [
  { val: 1, name: 'January' }, { val: 2, name: 'February' }, 
  { val: 3, name: 'March' }, { val: 4, name: 'April' },
  { val: 5, name: 'May' }, { val: 6, name: 'June' },
  { val: 7, name: 'July' }, { val: 8, name: 'August' },
  { val: 9, name: 'September' }, { val: 10, name: 'October' },
  { val: 11, name: 'November' }, { val: 12, name: 'December' }
]

export default function ClientViewer({ newsletters }: { newsletters: any[] }) {
  const [selectedNewsletter, setSelectedNewsletter] = useState(newsletters[0] || null)

  useEffect(() => {
    if (newsletters.length > 0 && !selectedNewsletter) {
      setSelectedNewsletter(newsletters[0])
    }
  }, [newsletters, selectedNewsletter])

  if (!newsletters || newsletters.length === 0) {
    return (
      <div className="bg-white rounded-3xl border-2 border-dashed border-stone-200 p-12 text-center flex flex-col items-center max-w-2xl mx-auto mt-10">
        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 mb-4">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <h4 className="text-xl font-bold text-stone-900 mb-2">No Newsletters Published</h4>
        <p className="text-stone-500 font-medium">There are currently no newsletters available. Check back soon!</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8 max-w-2xl mx-auto">
        <label className="block text-sm font-bold text-stone-700 mb-2" htmlFor="newsletterSelect">Select Edition</label>
        <div className="relative">
          <select 
            id="newsletterSelect" 
            className="w-full rounded-2xl px-5 py-4 bg-white border border-stone-200 focus:ring-2 focus:ring-sky-500 outline-none appearance-none font-bold text-stone-900 shadow-sm transition-shadow"
            value={selectedNewsletter?.id || ''}
            onChange={(e) => setSelectedNewsletter(newsletters.find(n => n.id === e.target.value))}
          >
            {newsletters.map(nl => (
              <option key={nl.id} value={nl.id}>
                {nl.title} ({MONTHS.find(m => m.val === nl.month)?.name} {nl.year})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-stone-500">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {selectedNewsletter && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] h-[80vh] flex flex-col mx-auto max-w-4xl max-h-[800px]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-xl text-stone-900 flex items-center gap-3 truncate">
              <span className="bg-sky-100 text-sky-700 p-2 rounded-lg text-lg shrink-0">📄</span>
              <span className="truncate">{selectedNewsletter.title}</span> 
              <span className="text-stone-500 text-sm font-semibold ml-2 hidden sm:inline-block px-3 py-1 bg-stone-100 rounded-full shrink-0">
                {MONTHS.find(m => m.val === selectedNewsletter.month)?.name} {selectedNewsletter.year}
              </span>
            </h3>
            <a href={selectedNewsletter.pdf_url} target="_blank" rel="noopener noreferrer" className="bg-sky-600 text-white hover:bg-sky-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              <span className="hidden sm:inline">Download PDF</span>
            </a>
          </div>
          <div className="w-full flex-1 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 relative">
            <iframe 
              src={`${selectedNewsletter.pdf_url}#view=FitH`}
              className="absolute inset-0 w-full h-full"
              title={selectedNewsletter.title}
            />
          </div>
        </div>
      )}
    </>
  )
}
