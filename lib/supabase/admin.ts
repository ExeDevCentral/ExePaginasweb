import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://bksonxnxshxinqffswqc.supabase.co'

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceRoleKey && process.env.NODE_ENV !== 'test') {
  console.warn(
    '[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY no está configurada. Las operaciones privilegiadas fallarán.'
  )
}

/**
 * Cliente de Supabase con privilegios de Administrador (Service Role).
 * EXCLUSIVO PARA EL SERVIDOR. NUNCA DEBE SER USADO EN COMPONENTES DEL CLIENTE.
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
