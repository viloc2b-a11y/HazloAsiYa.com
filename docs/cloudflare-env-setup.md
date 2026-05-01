# Cloudflare Pages — Environment Variables (Producción)

Configurar en **Cloudflare Pages → Settings → Environment variables → Production**.

> Importante:
> - Las variables `NEXT_PUBLIC_*` son **públicas** (quedan embebidas en el HTML/JS del cliente).
> - `MAILCHIMP_API_KEY` y `SQUARE_ACCESS_TOKEN` son **solo servidor** (Cloudflare Pages Functions). No deben usarse en componentes del cliente.

## Lista exacta

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://hazloasiya.com` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-3BQ19DQ308` |
| `MAILCHIMP_API_KEY` | `[nueva key rotada]` |
| `MAILCHIMP_AUDIENCE_ID` | `0331f44a68` |
| `MAILCHIMP_SERVER` | `us2` |
| `SQUARE_ACCESS_TOKEN` | `[desde Square Dashboard]` |
| `SQUARE_LOCATION_ID` | `[desde Square Dashboard]` |
| `NEXT_PUBLIC_SQUARE_APP_ID` | `[desde Square Dashboard]` |
| `NEXT_PUBLIC_SQUARE_LINK_REVISION_EXPRESS` | `[URL Payment Link]` |
| `NEXT_PUBLIC_SQUARE_LINK_KIT_SNAP` | `[URL Payment Link]` |
| `NEXT_PUBLIC_SQUARE_LINK_KIT_ITIN` | `[URL Payment Link]` |
| `NEXT_PUBLIC_AB_UPSELL_ACTIVE` | `false` |
| `NODE_VERSION` | `20` |

## Preview (opcional)

Si quieres que los deploys de **Preview** funcionen igual (por ejemplo para probar `/api/subscribe-email` en ramas), copia las mismas variables en el entorno **Preview**.

