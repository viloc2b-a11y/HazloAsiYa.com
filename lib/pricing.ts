/**
 * Pricing constants derived from `data/checkout-prices.json`.
 *
 * Single source of truth for UI copy and PDF rendering. The Square Payment
 * Link amounts are independently sourced from the same JSON inside
 * `functions/api/checkout.ts`. Never hardcode a dollar amount in a component;
 * import from here instead so price changes flow through automatically.
 */
import checkoutPricesData from '../data/checkout-prices.json'

export function usdFromCents(cents: number, suffix = ''): string {
  const n = cents / 100
  const whole = Number.isInteger(n) ? String(n) : n.toFixed(2)
  return `$${whole}${suffix}`
}

const p = checkoutPricesData.products

export const PRICE_MAIN = usdFromCents(p.main.priceCents)
export const PRICE_ANNUAL = usdFromCents(p.annual.priceCents)
export const PRICE_ANNUAL_YEAR = usdFromCents(p.annual.priceCents, '/año')
export const PRICE_ASSISTED = usdFromCents(p.assisted.priceCents)
export const PRICE_REVISION_EXPRESS = usdFromCents(p.revisionExpress.priceCents)
export const PRICE_KIT_SNAP = usdFromCents(p.kitSnap.priceCents)
export const PRICE_KIT_ITIN = usdFromCents(p.kitItin.priceCents)

export const PRICE_ANNUAL_DELTA = usdFromCents(
  p.annual.priceCents - p.main.priceCents,
)

export const LABEL_MAIN = p.main.label
export const LABEL_ANNUAL = p.annual.label
export const LABEL_ASSISTED = p.assisted.label

export const PRODUCT_PRICE_CENTS = {
  main: p.main.priceCents,
  annual: p.annual.priceCents,
  assisted: p.assisted.priceCents,
  revisionExpress: p.revisionExpress.priceCents,
  kitSnap: p.kitSnap.priceCents,
  kitItin: p.kitItin.priceCents,
} as const
