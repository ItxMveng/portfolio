import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types';

export function useBlogPosts(adminMode = false) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (!adminMode) query = query.eq('published', true);
    const { data } = await query;
    setPosts(data ?? []);
    setLoading(false);
  }, [adminMode]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views'>) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({ ...post, views: 0 })
      .select()
      .single();
    if (!error && data) setPosts((prev) => [data, ...prev]);
    return { data, error };
  };

  const update = async (id: string, updates: Partial<BlogPost>) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) setPosts((prev) => prev.map((p) => (p.id === id ? data : p)));
    return { data, error };
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) setPosts((prev) => prev.filter((p) => p.id !== id));
    return { error };
  };

  const incrementViews = async (id: string) => {
    await supabase.rpc('increment_views', { post_id: id });
  };

  return { posts, loading, create, update, remove, refetch: fetch, incrementViews };
}
