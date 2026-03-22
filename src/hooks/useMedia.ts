import { supabase } from '../lib/supabase';

export function useMedia() {
  const upload = async (file: File, folder = 'general'): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      console.error(error);
      return null;
    }
    const { data } = supabase.storage.from('media').getPublicUrl(filename);
    return data.publicUrl;
  };

  const remove = async (url: string) => {
    const path = url.split('/media/')[1];
    if (path) await supabase.storage.from('media').remove([path]);
  };

  return { upload, remove };
}
