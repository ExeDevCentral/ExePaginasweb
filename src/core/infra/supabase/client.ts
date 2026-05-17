import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL o Anon Key no encontradas en las variables de entorno. Las consultas a la base de datos fallarán.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
