'use client'

import { useActionState } from 'react'
import { uploadNewsletter } from '@/app/actions/admin-newsletters'
import SubmitButton from '@/components/SubmitButton'

export default function UploadForm({ months }: { months: {val: number, name: string}[] }) {
  const [state, formAction] = useActionState(uploadNewsletter, null)

  return (
    <form action={formAction} className="space-y-5">
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
            {months.map(m => (
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

      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600 font-bold whitespace-pre-wrap">{state.error}</p>
        </div>
      )}
      
      {state?.success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600 font-bold">Successfully uploaded to archive!</p>
        </div>
      )}

      <SubmitButton pendingText="Uploading PDF...">
        Upload to Archive
      </SubmitButton>
    </form>
  )
}
