import type { Funnel, FunnelId } from '@/data/funnels'
import { SITE_ORIGIN } from '@/lib/site'

const WEBSITE_ID = `${SITE_ORIGIN}/#website`

export type FunnelJsonLdInput = {
  id: FunnelId
  funnel: Funnel
  pageUrl: string
  pageTitle: string
  pageDescription: string
}

/**
 * WebPage + HowTo alineados al contenido visible del embudo (pasos del formulario).
 */
export function buildFunnelJsonLd(input: FunnelJsonLdInput): Record<string, unknown> {
  const { funnel, pageUrl, pageTitle, pageDescription } = input
  let rawSteps = funnel.steps
    .filter(s => !['ai', 'review', 'download'].includes(s.id))
    .slice(0, 8)
  if (rawSteps.length === 0) {
    rawSteps = funnel.steps.slice(0, 5)
  }
  const stepEntities = rawSteps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.desc,
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: 'HazloAsíYa',
        url: SITE_ORIGIN,
        inLanguage: 'es-US',
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        description: pageDescription,
        inLanguage: 'es-US',
        isPartOf: { '@id': WEBSITE_ID },
      },
      {
        '@type': 'HowTo',
        '@id': `${pageUrl}#howto`,
        name: `Preparar ${funnel.name}: pasos del cuestionario`,
        description: funnel.desc,
        totalTime: 'PT5M',
        step: stepEntities,
      },
    ],
  }
}
