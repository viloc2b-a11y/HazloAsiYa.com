'use client'

import Link from 'next/link'
import { useEffect, useRef, type ComponentProps } from 'react'
import { gtagEvent, getAnalyticsDevice } from '@/lib/gtag'

export function FunnelScrollDepth({ funnelId }: { funnelId: string }) {
  const sent = useRef(false)

  useEffect(() => {
    if (!funnelId) return

    const handleScroll = () => {
      if (sent.current) return
      const scrolled = window.scrollY + window.innerHeight
      const height = document.body.scrollHeight
      if (height <= 0) return
      if (scrolled / height > 0.7) {
        sent.current = true
        gtagEvent('scroll_70', { funnel: funnelId })
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [funnelId])

  return null
}

type FinalCtaLinkProps = ComponentProps<typeof Link> & { funnelId: string }

export function FunnelFinalCtaLink({ funnelId, onClick, ...props }: FinalCtaLinkProps) {
  const clickFired = useRef(false)

  return (
    <Link
      {...props}
      onClick={(e) => {
        if (clickFired.current) return
        clickFired.current = true
        gtagEvent('cta_click', {
          funnel: funnelId,
          location: 'final_cta',
          variant: 'v3',
          device: getAnalyticsDevice(),
        })
        onClick?.(e)
      }}
    />
  )
}
