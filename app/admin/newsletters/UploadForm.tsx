'use client'

import { useState } from 'react'
import { uploadNewsletter } from '@/app/actions/admin-newsletters'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

export default function UploadForm({ months }: { months: {val: number, name: string}[] }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isPending, setIsPending] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsPending(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title') as string
      const monthStr = formData.get('month') as string
      const yearStr = formData.get('year') as string
      const file = formData.get('file') as File | null

      if (!title || !monthStr || !yearStr || !file || file.size === 0) {
        setError('All fields are required and file must be valid.')
        setIsPending(false)
        return
      }

      // Check max size: 50MB (bypassing Vercel's 4.5MB limit entirely!)
      if (file.size > 50 * 1024 * 1024) {
        setError('PDF file size must be less than 50MB.')
        setIsPending(false)
        return
      }

      const month = parseInt(monthStr, 10)
      const year = parseInt(yearStr, 10)

      const supabase = createClient()

      // 1. Upload PDF directly to Storage from the Client Browser
      const fileExt = file.name.split('.').pop()
      const fileName = `newsletter_${year}_${month}_${Date.now()}.${fileExt}`
      const filePath = `newsletters/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('community-media')
        .upload(filePath, file)

      if (uploadError) {
        console.error("PDF Upload Error:", uploadError)
        setError(`Storage API rejected the upload: ${uploadError.message}`)
        setIsPending(false)
        return
      }

      // 2. Get Public URL
      const { data } = supabase.storage.from('community-media').getPublicUrl(filePath)
      const pdfUrl = data.publicUrl

      // 3. Trigger Server Action to Insert DB record
      const result = await uploadNewsletter(title, month, year, pdfUrl)

      if (result?.error) {
        setError(result.error)
        setIsPending(false)
        return
      }

      setSuccess(true)
      // Reset form visually
      ;(e.target as HTMLFormElement).reset()

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during client-side upload.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600 font-bold whitespace-pre-wrap">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600 font-bold">Successfully uploaded to archive!</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Uploading PDF...
          </>
        ) : (
          "Upload to Archive"
        )}
      </button>
    </form>
  )
}
