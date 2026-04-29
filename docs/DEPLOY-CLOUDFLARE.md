# Cloudflare Pages — HazloAsíYa (Next.js 14 · static export)

## Resumen

| Campo | Valor |
|--------|--------|
| **Framework preset** | None (comando custom) o Next si lo ofrece tu flujo |
| **Root directory** | `HazloAsiYa.com` (si el repo incluye la carpeta padre) o `.` si el proyecto es solo esta carpeta |
| **Build command** | `npm ci && npm run build` |
| **Output directory** | `out` |

`npm run build` ejecuta `next build` y luego **`pagefind --site out`**, que genera `out/pagefind/` (búsqueda). Sin ese paso, `/buscar/` no tendrá índice.

## Variables de entorno (Production + Preview)

| Nombre | Valor | Notas |
|--------|--------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://www.hazloasiya.com` | Sin barra final. Evita sitemap/robots/canonical con host equivocado en previews. |

Opcional: repetir la misma variable en **Preview** para que los despliegues de rama usen el dominio canónico en metadatos (si preferís URLs “de producción” en previews). Si no, el código usa el default `https://www.hazloasiya.com` en `lib/site.ts`.

## Checks tras el primer deploy

1. Abrir `https://www.hazloasiya.com/buscar/` y comprobar que carga el widget y hay resultados.
2. **Search Console**: propiedad verificada; enviar `https://www.hazloasiya.com/sitemap-index.xml` (o la URL del índice que sirva el sitio).
3. En el HTML de inicio, el JSON-LD `WebSite` debe incluir `SearchAction` con `search_term_string` y `/buscar/`.

## Monorepo

Si Git está en la carpeta **padre** de `HazloAsiYa.com`, en Cloudflare:

- **Root directory** = `HazloAsiYa.com`
- El workflow `.github/workflows/ci-seo.yml` ya contempla `HazloAsiYa.com/package.json`.

## Build local

```bash
cd HazloAsiYa.com
npm ci
npm run build
```

Solo Next (sin Pagefind): `npm run build:next-only` — no usar para producción si quieres búsqueda activa.
