import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Project } from '../types';

export function useProjects(adminMode = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    let query = supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    if (!adminMode) query = query.eq('published', true);
    const { data } = await query;
    setProjects(data ?? []);
    setLoading(false);
  }, [adminMode]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase.from('projects').insert(project).select().single();
    if (!error && data) setProjects((prev) => [...prev, data]);
    return { data, error };
  };

  const update = async (id: string, updates: Partial<Project>) => {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
    return { data, error };
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) setProjects((prev) => prev.filter((p) => p.id !== id));
    return { error };
  };

  return { projects, loading, create, update, remove, refetch: fetch };
}
