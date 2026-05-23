import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../infra/supabase/client';

export type AppUser = {
  id: string;
  email: string | null;
};

export type Role = 'admin' | 'client' | 'unknown';

export function useAuthRole(adminEmails: readonly string[]) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [role, setRole] = useState<Role>('unknown');
  const [loading, setLoading] = useState(true);

  const adminEmailsNormalized = useMemo(
    () => adminEmails.map((e) => e.trim().toLowerCase()),
    [adminEmails]
  );

  const computeRole = (email: string | null | undefined): Role => {
    const e = (email ?? '').trim().toLowerCase();
    if (!e) return 'unknown';
    return adminEmailsNormalized.includes(e) ? 'admin' : 'client';
  };

  useEffect(() => {
    let isMounted = true;
    let didResolveInitialSession = false;

    async function init() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const s = sessionData.session;
        const u = s?.user;
        const nextUser = u ? { id: u.id, email: u.email ?? null } : null;
        const nextRole = u ? computeRole(u.email) : 'unknown';

        if (isMounted) {
          setUser(nextUser);
          setRole(nextRole);
        }
      } catch {
        if (isMounted) {
          setRole('unknown');
          setUser(null);
        }
      } finally {
        didResolveInitialSession = true;
        if (isMounted) setLoading(false);
      }
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      const nextUser = u ? { id: u.id, email: u.email ?? null } : null;
      const nextRole = u ? computeRole(u.email) : 'unknown';

      if (isMounted) {
        setUser(nextUser);
        setRole(nextRole);
        // Evita doble setLoading(false) antes/después del init.
        if (!didResolveInitialSession) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      sub?.subscription?.unsubscribe();
    };
  }, [adminEmailsNormalized]);


  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // For OAuth, Supabase handles redirect; this is just a common setting.
        redirectTo: window.location.origin,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, role, loading, signInWithGoogle, signOut };
}

