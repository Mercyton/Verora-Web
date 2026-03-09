import { createServerSupabaseClient } from '@/lib/supabase';
import AboutContent from './AboutContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About Us' };

export default async function AboutPage() {
  const supabase = createServerSupabaseClient();
  const [{ data: settings }, { data: team }] = await Promise.all([
    supabase.from('site_settings').select('*').eq('key', 'about').single(),
    supabase.from('team_members').select('*').eq('is_active', true).order('sort_order'),
  ]);
  return <AboutContent data={(settings?.value as any) || {}} team={team || []} />;
}
