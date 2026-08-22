import { supabase } from '../../core/infra/supabase/client'
import { getAuthRedirectUrl } from '../../core/auth/siteUrl'

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getAuthRedirectUrl('/auth/callback'),
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  if (error) console.error('Error Google Auth:', error.message)
}

export const signInWithFacebook = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: getAuthRedirectUrl('/auth/callback'),
    },
  })
  if (error) console.error('Error Facebook Auth:', error.message)
}

export const signOut = () => supabase.auth.signOut()
