import { useState, useEffect } from 'react';
import { SupabaseClient, User } from '@supabase/supabase-js';

interface ClientProfile {
  id: string;
  nombre: string | null;
  email: string | null;
  telefono: string | null;
  created_at: string;
  updated_at: string;
}

interface UseProfileResult {
  profile: ClientProfile | null;
  loading: boolean;
  error: string | null;
}

export function useProfile(supabase: SupabaseClient): UseProfileResult {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async (user: User) => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('clientes')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          throw error;
        }
        setProfile(data as ClientProfile | null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError((err as Error).message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchProfile(session.user);
      else setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) fetchProfile(session.user);
      else {
        setProfile(null);
        setLoading(false);
        setError(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return { profile, loading, error };
}