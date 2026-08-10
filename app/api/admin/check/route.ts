import { createServerClient_ } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerClient_()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ isAdmin: false }, { status: 401 })
  }

  // Get user profile to check admin status
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('[v0] Error checking admin:', error)
    return NextResponse.json({ isAdmin: false, error: 'admin_check_failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }

  return NextResponse.json(
    { isAdmin: profile?.is_admin === true },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
