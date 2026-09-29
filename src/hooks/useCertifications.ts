import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Certification } from '../types';

export function useCertifications(adminMode = false) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    let query = supabase
      .from('certifications')
      .select('*')
      .order('display_order', { ascending: true });

    if (!adminMode) {
      query = query.eq('active', true);
    }

    const { data } = await query;
    setCertifications(data ?? []);
    setLoading(false);
  }, [adminMode]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (certification: Omit<Certification, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('certifications')
      .insert(certification)
      .select()
      .single();

    if (!error && data) {
      setCertifications((prev) => [...prev, data]);
    }

    return { data, error };
  };

  const update = async (id: string, updates: Partial<Certification>) => {
    const { data, error } = await supabase
      .from('certifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setCertifications((prev) => prev.map((item) => (item.id === id ? data : item)));
    }

    return { data, error };
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (!error) {
      setCertifications((prev) => prev.filter((item) => item.id !== id));
    }
    return { error };
  };

  return { certifications, loading, create, update, remove, refetch: fetch };
}
