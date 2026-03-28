import { createClient } from '@/utils/supabase/server'
import ClientViewer from './ClientViewer'

export const dynamic = 'force-dynamic'

export default async function Newsletters() {
  const supabase = await createClient()

  // Fetch newsletters from Supabase ordered by date descending
  const { data: newsletters } = await supabase
    .from('newsletters')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 mb-4">Newsletter Archive</h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto font-medium">
          Read past editions of our community newsletter directly right here.
        </p>
      </div>

      <ClientViewer newsletters={newsletters || []} />
    </div>
  )
}
