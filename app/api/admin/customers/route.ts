import { NextResponse } from 'next/server'
import { createServerClient_ } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createServerClient_()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('customer_name, customer_email, customer_phone, total, created_at')
    .order('created_at', { ascending: false })

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 })
  }

  const byEmail = new Map<string, {
    email: string
    full_name: string | null
    phone: string | null
    orders_count: number
    total_spent: number
    last_order_at: string
  }>()

  for (const order of orders ?? []) {
    const email = order.customer_email ?? 'unknown'
    const existing = byEmail.get(email)
    if (existing) {
      existing.orders_count += 1
      existing.total_spent += order.total ?? 0
    } else {
      byEmail.set(email, {
        email,
        full_name: order.customer_name ?? null,
        phone: order.customer_phone ?? null,
        orders_count: 1,
        total_spent: order.total ?? 0,
        last_order_at: order.created_at,
      })
    }
  }

  const customers = Array.from(byEmail.values()).sort(
    (a, b) => new Date(b.last_order_at).getTime() - new Date(a.last_order_at).getTime()
  )

  return NextResponse.json({ customers }, { headers: { 'Cache-Control': 'no-store' } })
}
