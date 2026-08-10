import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client. Bypasses RLS and can confirm user emails.
 * Server-only — never import this from a Client Component.
 */
export const createAdminClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SECRET_KEY!

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
