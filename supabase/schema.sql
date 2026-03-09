-- ============================================================
-- VEROLA STUDIOS - SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    CASE WHEN NEW.email = 'sinkalamercyton24@gmail.com' THEN 'admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  icon TEXT NOT NULL DEFAULT 'Layers',
  features TEXT[] DEFAULT '{}',
  price_range TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECTS (Portfolio Items)
-- ============================================================
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL CHECK (category IN ('design', 'video', 'photography', 'branding', 'web')),
  cover_image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  client TEXT,
  tags TEXT[] DEFAULT '{}',
  project_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
CREATE TABLE public.team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_role TEXT,
  client_company TEXT,
  client_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_featured BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE TABLE public.site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTACT SUBMISSIONS
-- ============================================================
CREATE TABLE public.contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- SERVICES policies
CREATE POLICY "Services are publicly readable" ON public.services FOR SELECT USING (true);
CREATE POLICY "Only admins can insert services" ON public.services FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update services" ON public.services FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete services" ON public.services FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- PROJECTS policies
CREATE POLICY "Projects are publicly readable" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Only admins can insert projects" ON public.projects FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update projects" ON public.projects FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete projects" ON public.projects FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- TEAM MEMBERS policies
CREATE POLICY "Team members are publicly readable" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Only admins can manage team members" ON public.team_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- TESTIMONIALS policies
CREATE POLICY "Testimonials are publicly readable" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Only admins can manage testimonials" ON public.testimonials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- SITE SETTINGS policies
CREATE POLICY "Site settings are publicly readable" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can manage site settings" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- CONTACT SUBMISSIONS policies
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read submissions" ON public.contact_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update submissions" ON public.contact_submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO public.services (title, slug, description, short_description, icon, features, is_featured, sort_order) VALUES
(
  'Brand Identity Design',
  'brand-identity',
  'We craft distinctive brand identities that tell your story and resonate deeply with your audience. From logo design to comprehensive brand guidelines, we build the visual language of your business.',
  'Complete brand systems that leave lasting impressions.',
  'Palette',
  ARRAY['Logo Design & Variations', 'Brand Guidelines Document', 'Color Palette & Typography', 'Business Card & Stationery', 'Brand Voice & Messaging', 'Social Media Kit'],
  TRUE,
  1
),
(
  'UI/UX Design',
  'ui-ux-design',
  'User-centered design that transforms complex experiences into intuitive journeys. We design digital products that users love and businesses depend on.',
  'Interfaces that delight users and drive conversions.',
  'Monitor',
  ARRAY['User Research & Personas', 'Wireframing & Prototyping', 'Visual Interface Design', 'Interaction Design', 'Usability Testing', 'Design System Creation'],
  TRUE,
  2
),
(
  'Video Production',
  'video-production',
  'From concept to final cut, we produce compelling video content that captivates audiences. Corporate films, brand stories, social content — we do it all.',
  'Cinematic storytelling that moves people.',
  'Film',
  ARRAY['Concept Development', 'Script & Storyboarding', 'Professional Filming', 'Color Grading', 'Motion Graphics', 'Sound Design & Mixing'],
  TRUE,
  3
),
(
  'Photography',
  'photography',
  'Professional photography that captures the essence of your brand, product, or moment. From commercial shoots to editorial campaigns.',
  'Images that stop scrolling and start conversations.',
  'Camera',
  ARRAY['Commercial Photography', 'Product Photography', 'Corporate Portraits', 'Event Coverage', 'Photo Editing & Retouching', 'Licensing & Usage Rights'],
  TRUE,
  4
),
(
  'Motion Graphics',
  'motion-graphics',
  'Animated graphics and visual effects that bring your brand to life. From social media animations to full broadcast packages.',
  'Animation that amplifies your message.',
  'Zap',
  ARRAY['Logo Animation', 'Explainer Videos', 'Social Media Animations', 'Broadcast Graphics', '2D & 3D Animation', 'After Effects Templates'],
  FALSE,
  5
),
(
  'Web Design & Development',
  'web-design-development',
  'Beautiful, fast, and conversion-optimized websites built with modern technologies. We design and develop digital experiences that work.',
  'Websites that convert visitors into clients.',
  'Globe',
  ARRAY['Custom Web Design', 'Responsive Development', 'CMS Integration', 'E-commerce Solutions', 'SEO Optimization', 'Performance & Analytics'],
  FALSE,
  6
);

INSERT INTO public.projects (title, slug, description, short_description, category, cover_image, client, tags, is_featured, sort_order) VALUES
(
  'Luminary Rebrand',
  'luminary-rebrand',
  'A complete brand overhaul for a luxury hospitality brand, creating a visual identity that communicates sophistication and warmth.',
  'Luxury hospitality brand identity system',
  'branding',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  'Luminary Hotels',
  ARRAY['Branding', 'Identity', 'Luxury'],
  TRUE,
  1
),
(
  'Nomad App Design',
  'nomad-app-design',
  'UX/UI design for a remote work platform connecting digital nomads with co-working spaces and communities worldwide.',
  'Remote work platform UI/UX',
  'design',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
  'Nomad Inc.',
  ARRAY['UI/UX', 'App Design', 'Product'],
  TRUE,
  2
),
(
  'Zera Brand Film',
  'zera-brand-film',
  'A cinematic brand film for a sustainable fashion label, capturing the brand''s commitment to ethical production and timeless design.',
  'Sustainable fashion brand documentary',
  'video',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
  'Zera Fashion',
  ARRAY['Video', 'Brand Film', 'Fashion'],
  TRUE,
  3
),
(
  'Arca Product Launch',
  'arca-product-launch',
  'Full product photography suite for a premium furniture brand''s new collection, blending architectural photography with lifestyle imagery.',
  'Premium furniture product photography',
  'photography',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'Arca Furniture',
  ARRAY['Photography', 'Product', 'Commercial'],
  TRUE,
  4
),
(
  'Pulse Music Identity',
  'pulse-music-identity',
  'Complete visual identity for an independent music label, including logo, album artwork templates, and digital assets.',
  'Independent music label brand system',
  'design',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
  'Pulse Records',
  ARRAY['Design', 'Identity', 'Music'],
  FALSE,
  5
),
(
  'Solara Event Coverage',
  'solara-event-coverage',
  'Photography and videography coverage of a major tech conference, producing a 3-minute highlight reel and 200+ edited photographs.',
  'Tech conference photo & video coverage',
  'photography',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'Solara Tech',
  ARRAY['Photography', 'Events', 'Corporate'],
  FALSE,
  6
);

INSERT INTO public.team_members (name, role, bio, avatar_url, social_links, sort_order) VALUES
(
  'Amara Osei',
  'Creative Director & Co-Founder',
  'With over 12 years in design and branding, Amara leads Verola''s creative vision. She''s passionate about crafting stories that connect brands with their audiences on a deeper level.',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
  '{"instagram": "https://instagram.com", "linkedin": "https://linkedin.com", "twitter": "https://twitter.com"}',
  1
),
(
  'Kwame Asante',
  'Head of Video Production',
  'Kwame is a storyteller at heart. His background in documentary filmmaking brings an authentic, cinematic quality to every brand film and commercial he directs.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  '{"instagram": "https://instagram.com", "linkedin": "https://linkedin.com", "vimeo": "https://vimeo.com"}',
  2
),
(
  'Zola Dlamini',
  'Lead Designer & Brand Strategist',
  'Zola bridges the gap between strategy and aesthetics. Her process always starts with the ''why'' before diving into the ''how'', ensuring every design decision has purpose and impact.',
  'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&q=80',
  '{"instagram": "https://instagram.com", "linkedin": "https://linkedin.com", "behance": "https://behance.net"}',
  3
),
(
  'Tendai Mutasa',
  'Photographer & Visual Artist',
  'Tendai has an eye for finding the extraordinary in the ordinary. His photography has been featured in leading publications and his commercial work has helped brands across Africa and Europe.',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&q=80',
  '{"instagram": "https://instagram.com", "website": "https://example.com"}',
  4
);

INSERT INTO public.testimonials (client_name, client_role, client_company, content, rating, is_featured, sort_order) VALUES
(
  'Sarah Mitchell',
  'CEO',
  'Luminary Hotels',
  'Verola Studios completely transformed our brand. What they created wasn''t just a logo—it was a whole new identity that our team fell in love with and our customers immediately connected to. The process was seamless.',
  5,
  TRUE,
  1
),
(
  'David Kimani',
  'Product Manager',
  'Nomad Inc.',
  'The UI/UX work from Verola was outstanding. They took our complicated feature list and turned it into an interface so intuitive our beta users thought we''d been live for years. Truly exceptional team.',
  5,
  TRUE,
  2
),
(
  'Priya Nair',
  'Marketing Director',
  'Zera Fashion',
  'Our brand film exceeded every expectation we had. Verola captured exactly what Zera stands for—the quality of production, the storytelling, the emotion. It''s been our single best marketing asset.',
  5,
  TRUE,
  3
),
(
  'James Okonkwo',
  'Founder',
  'Arca Furniture',
  'Working with Verola is a true collaboration. They listened, pushed back when needed, and delivered photography that made our furniture look like art. Sales from our new collection are up 40%.',
  5,
  TRUE,
  4
);

INSERT INTO public.site_settings (key, value, description) VALUES
(
  'homepage',
  '{
    "hero_headline": "We Build Brands That",
    "hero_headline_accent": "Cannot Be Ignored.",
    "hero_subtext": "Verola Studios is a full-service creative agency crafting compelling visual identities, immersive video productions, and digital experiences for brands that dare to stand out.",
    "stats": [
      {"value": "120+", "label": "Projects Delivered"},
      {"value": "8+", "label": "Years of Excellence"},
      {"value": "40+", "label": "Global Clients"},
      {"value": "15", "label": "Industry Awards"}
    ]
  }',
  'Homepage content and hero settings'
),
(
  'about',
  '{
    "vision": "To become the most recognized creative force shaping how African and global brands communicate their stories.",
    "mission": "We partner with ambitious brands to create visually stunning, strategically sound creative work that drives real business results.",
    "values": [
      {"title": "Creative Boldness", "description": "We challenge conventions and push creative boundaries to find solutions that surprise and delight."},
      {"title": "Strategic Thinking", "description": "Every creative decision is rooted in strategy. We design with purpose, not just aesthetics."},
      {"title": "Deep Collaboration", "description": "We believe the best work emerges from true partnership with our clients, built on trust and transparency."},
      {"title": "Relentless Quality", "description": "We hold ourselves to the highest standards. Good enough is never good enough at Verola."}
    ],
    "process_steps": [
      {"step": "01", "title": "Discovery", "description": "We immerse ourselves in your world—your brand, audience, competitors, and ambitions. Deep listening is where great work begins."},
      {"step": "02", "title": "Strategy", "description": "We define the creative brief: the positioning, the tone, the key messages. Strategy is the map that guides every creative decision."},
      {"step": "03", "title": "Creation", "description": "Our team translates strategy into stunning creative work. Multiple concepts, refined and refined again until it''s right."},
      {"step": "04", "title": "Delivery", "description": "We hand over polished final assets with full documentation, ensuring you can use your new brand with complete confidence."}
    ]
  }',
  'About page content'
),
(
  'contact',
  '{
    "email": "hello@verolastudios.com",
    "phone": "+1 (555) 234-5678",
    "address": "12 Creative Quarter, Design District",
    "social_links": {
      "instagram": "https://instagram.com/verolastudios",
      "twitter": "https://twitter.com/verolastudios",
      "linkedin": "https://linkedin.com/company/verolastudios",
      "behance": "https://behance.net/verolastudios"
    }
  }',
  'Contact information and social links'
);
