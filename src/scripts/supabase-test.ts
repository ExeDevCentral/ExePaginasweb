import { supabase } from '../core/infra/supabase/client'

async function run() {
  const { data, error } = await supabase.from('clientes').select('full_name, email').limit(5)

  if (error) {
    console.error('Supabase query error:', error)
    return
  }

  console.log('clientes (sample):', data)
}

run().catch((e) => {
  console.error('Unexpected error:', e)
})
