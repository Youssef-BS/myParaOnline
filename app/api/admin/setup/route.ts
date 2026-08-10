import { NextRequest, NextResponse } from 'next/server'
import { createServerClient_ } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const supabase = await createServerClient_()
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (signInError || !data.user) {
    return NextResponse.json({ error: signInError?.message || 'Invalid email or password' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { error: profileError } = await admin
    .from('user_profiles')
    .upsert({ id: data.user.id, is_admin: true }, { onConflict: 'id' })

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
