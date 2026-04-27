import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { sendPurchaseConfirmation } from '@/lib/resend'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const { productId, funnelId, userId, userEmail } = pi.metadata

    const supabase = createAdminClient()

    // 1. Update user plan
    if (userId && userId !== 'anonymous') {
      const planMap: Record<string, string> = {
        main:     'paid_guide',
        annual:   'annual',
        assisted: 'assisted',
      }
      const newPlan = planMap[productId] || 'paid_guide'
      const expiresAt = productId === 'annual'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : null

      await supabase.from('users')
        .update({ plan: newPlan, plan_expires_at: expiresAt })
        .eq('id', userId)

      // 2. Save purchase
      await supabase.from('purchases').insert({
        user_id:                userId,
        product_id:             productId,
        funnel:                 funnelId,
        amount:                 pi.amount,
        stripe_payment_intent:  pi.id,
      })

      // 3. Track event
      await supabase.from('events').insert({
        user_id: userId,
        event:   'purchase_completed',
        funnel:  funnelId,
        data:    { productId, amount: pi.amount, stripeId: pi.id },
      })
    }

    // 4. Send confirmation email
    if (userEmail) {
      const { data: userData } = await supabase
        .from('users').select('name').eq('id', userId).single()

      const productNames: Record<string, string> = {
        main:     'Guía Completa por Trámite — $19',
        annual:   'Acceso Anual 16 Trámites — $49',
        assisted: 'Revisión Asistida por Especialista — $89',
      }

      await sendPurchaseConfirmation({
        to:          userEmail,
        name:        userData?.name || userEmail.split('@')[0],
        funnel:      funnelId,
        productName: productNames[productId] || productId,
      })
    }
  }

  return NextResponse.json({ received: true })
}
