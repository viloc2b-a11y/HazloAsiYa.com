import type { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/guias/'],
        disallow: [
          '/form/',
          '/result/',
          '/api/',
          '/*?preview=',
          '/*?mode=',
          '/*?session=',
        ],
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  }
}
