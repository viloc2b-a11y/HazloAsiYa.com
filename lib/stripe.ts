import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  appInfo: { name: 'HazloAsíYa', version: '1.0.0' },
})

export const PRICES: Record<string, number> = {
  main:     1900,   // $19.00
  annual:   4900,   // $49.00
  assisted: 8900,   // $89.00
}
