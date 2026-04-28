import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://hazloasiya.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/form/', '/result/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}

