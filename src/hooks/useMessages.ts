import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Message } from '../types';

export function useMessages(adminMode = false) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(adminMode);

  useEffect(() => {
    if (!adminMode) {
      setLoading(false);
      return;
    }

    supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setMessages(data ?? []);
        setLoading(false);
      });
  }, [adminMode]);

  const send = async (msg: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) => {
    const { error } = await supabase.from('messages').insert(msg);
    return { data: error ? null : msg, error };
  };

  const markRead = async (id: string) => {
    await supabase.from('messages').update({ read: true }).eq('id', id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  return { messages, loading, send, markRead };
}
