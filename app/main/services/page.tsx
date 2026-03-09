import { createServerSupabaseClient } from '@/lib/supabase';
import ServicesContent from './ServicesContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Services' };

export default async function ServicesPage() {
  const supabase = createServerSupabaseClient();
  const { data: services } = await supabase.from('services').select('*').order('sort_order');
  return <ServicesContent services={services || []} />;
}
