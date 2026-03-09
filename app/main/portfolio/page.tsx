import { createServerSupabaseClient } from '@/lib/supabase';
import PortfolioContent from './PortfolioContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Portfolio' };

export default async function PortfolioPage() {
  const supabase = createServerSupabaseClient();
  const { data: projects } = await supabase.from('projects').select('*').order('sort_order');
  return <PortfolioContent projects={projects || []} />;
}
