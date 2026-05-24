import { createClient } from '@supabase/supabase-js';

const dbUrl = import.meta.env.VITE_SUPABASE_URL;
const dbAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!dbUrl || !dbAnonKey) {
  console.warn(
    'DB URL o anon key no encontradas en las variables de entorno. Las consultas a la base de datos fallarán.'
  );
}

// Backward compatible export: el resto del código espera `supabase`
// Si las variables no existen, usamos placeholders que pasen la validación de la librería
export const supabase = createClient(
  dbUrl || 'https://placeholder.supabase.co', 
  dbAnonKey || 'placeholder-key'
);
