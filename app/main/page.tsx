import { createServerSupabaseClient } from '@/lib/supabase';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import FeaturedWork from '@/components/sections/FeaturedWork';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import MarqueeSection from '@/components/sections/MarqueeSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verola Studios — Creative Agency',
};

export default async function HomePage() {
  const supabase = createServerSupabaseClient();

  const [
    { data: settings },
    { data: services },
    { data: projects },
    { data: testimonials },
  ] = await Promise.all([
    supabase.from('site_settings').select('*').eq('key', 'homepage').single(),
    supabase.from('services').select('*').eq('is_featured', true).order('sort_order'),
    supabase.from('projects').select('*').eq('is_featured', true).order('sort_order'),
    supabase.from('testimonials').select('*').eq('is_featured', true).order('sort_order'),
  ]);

  const heroData = (settings?.value as any) || {};

  return (
    <div>
      <HeroSection data={heroData} />
      <MarqueeSection />
      <ServicesSection services={services || []} />
      <FeaturedWork projects={projects || []} />
      <WhyChooseUs />
      <TestimonialsSection testimonials={testimonials || []} />
    </div>
  );
}
