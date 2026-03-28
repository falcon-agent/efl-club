import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const ICON_MAP: Record<string, string> = {
  'Star': '🌟',
  'Leaf': '🌿',
  'Heart': '❤️',
  'Briefcase': '💼',
  'Hands': '🤝'
}

export default async function Volunteer() {
  const supabase = await createClient()

  // Fetch topics from Supabase
  const { data: topics } = await supabase
    .from('volunteer_topics')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 mb-4">Volunteer Opportunities</h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto font-medium">
          Our community thrives because of members like you. Choose an area below to see open positions and sign up!
        </p>
      </div>

      {topics && topics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-3xl p-8 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-2 justify-between min-h-[350px]">
              <div>
                <div className="text-5xl mb-6 bg-stone-50 w-20 h-20 mx-auto flex items-center justify-center rounded-3xl shadow-inner">
                  {ICON_MAP[topic.icon_or_image] || '🤝'}
                </div>
                <h3 className="font-extrabold text-2xl mb-3 text-stone-900">{topic.title}</h3>
                <p className="text-stone-500 mb-8 leading-relaxed font-medium">
                  {topic.description || "Join this committee to help our community thrive."}
                </p>
              </div>
              <Link 
                href={`/volunteer/signup?topicId=${topic.id}&topicName=${encodeURIComponent(topic.title)}`} 
                className="w-full bg-stone-900 text-stone-50 font-bold py-4 px-4 rounded-2xl shadow-md transition-all hover:bg-black hover:-translate-y-1 focus:ring-2 focus:ring-stone-900 outline-none"
              >
                Sign up to Help
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">🤝</div>
          <h3 className="mt-4 text-lg font-bold text-stone-900">Volunteer Topics Unlisted</h3>
          <p className="mt-2 text-stone-500 font-medium max-w-md mx-auto">There are currently no specific volunteer committees listed, but we always appreciate extra hands!</p>
        </div>
      )}
    </div>
  )
}
