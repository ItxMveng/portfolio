import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Service } from '../types';

export function useServices(adminMode = false) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from('services').select('*').order('display_order', { ascending: true });
    if (!adminMode) query = query.eq('active', true);
    query.then(({ data }) => {
      setServices(data ?? []);
      setLoading(false);
    });
  }, [adminMode]);

  const update = async (id: string, updates: Partial<Service>) => {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (!error && data) setServices((prev) => prev.map((s) => (s.id === id ? data : s)));
    return { data, error };
  };

  return { services, loading, update };
}
