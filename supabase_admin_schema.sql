-- Add Admin Flag to Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create Newsletters Table
CREATE TABLE IF NOT EXISTS public.newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(month, year)
);

ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles can view newsletters" ON public.newsletters FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage newsletters" ON public.newsletters FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create Volunteer Topics Table
CREATE TABLE IF NOT EXISTS public.volunteer_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon_or_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.volunteer_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles can view volunteer topics" ON public.volunteer_topics FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage volunteer topics" ON public.volunteer_topics FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create Volunteer Positions Table
CREATE TABLE IF NOT EXISTS public.volunteer_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.volunteer_topics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.volunteer_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles can view volunteer positions" ON public.volunteer_positions FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage volunteer positions" ON public.volunteer_positions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Ensure Events Table Exists and has image_url
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  price NUMERIC,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Public profiles can view events'
    ) THEN
        CREATE POLICY "Public profiles can view events" ON public.events FOR SELECT TO public USING (true);
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Admins can manage events'
    ) THEN
        CREATE POLICY "Admins can manage events" ON public.events FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
        );
    END IF;
END $$;

-- Create Storage Bucket "community-media"
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-media', 'community-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for "community-media"
CREATE POLICY "Public access to community-media" 
ON storage.objects FOR SELECT TO public 
USING (bucket_id = 'community-media');

CREATE POLICY "Admin manage to community-media" 
ON storage.objects FOR ALL TO authenticated 
USING (bucket_id = 'community-media' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
