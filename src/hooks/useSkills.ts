import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Skill } from '../types';

export function useSkills(adminMode = false) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    let query = supabase.from('skills').select('*').order('display_order', { ascending: true });

    if (!adminMode) {
      query = query.eq('active', true);
    }

    const { data } = await query;
    setSkills(data ?? []);
    setLoading(false);
  }, [adminMode]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (skill: Omit<Skill, 'id'>) => {
    const { data, error } = await supabase.from('skills').insert(skill).select().single();
    if (!error && data) {
      setSkills((prev) => [...prev, data]);
    }
    return { data, error };
  };

  const update = async (id: string, updates: Partial<Skill>) => {
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setSkills((prev) => prev.map((skill) => (skill.id === id ? data : skill)));
    }

    return { data, error };
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (!error) {
      setSkills((prev) => prev.filter((skill) => skill.id !== id));
    }
    return { error };
  };

  return { skills, loading, create, update, remove, refetch: fetch };
}
