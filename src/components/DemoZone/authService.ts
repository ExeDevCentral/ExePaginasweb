import { supabase } from '../../core/infra/supabase/client'

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })
  if (error) console.error('Error Google Auth:', error.message)
}

export const signInWithFacebook = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: window.location.origin,
    },
  })
  if (error) console.error('Error Facebook Auth:', error.message)
}

export const signOut = () => supabase.auth.signOut()