import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICES } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { productId, funnelId } = await req.json()

    if (!PRICES[productId]) {
      return NextResponse.json({ error: 'Producto inválido' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: PRICES[productId],
      currency: 'usd',
      metadata: {
        productId,
        funnelId: funnelId || 'general',
        userId: user?.id || 'anonymous',
        userEmail: user?.email || '',
      },
      description: `HazloAsíYa — ${productId} — ${funnelId}`,
    })

    // Log checkout_started event
    if (user) {
      await supabase.from('events').insert({
        user_id: user.id,
        event: 'checkout_started',
        funnel: funnelId,
        data: { productId, amount: PRICES[productId] },
      })
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: unknown) {
    console.error('Checkout error:', err)
    const message = err instanceof Error ? err.message : 'Error al procesar'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
