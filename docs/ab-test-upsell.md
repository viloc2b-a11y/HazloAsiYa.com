# A/B test — copy del upsell «revisión express»

**Experimento:** `upsell-copy-v1`  
**Flag:** `NEXT_PUBLIC_AB_UPSELL_ACTIVE` — debe ser `true` solo cuando haya tráfico suficiente (orientativo: **200+** usuarios por variante).

## Variantes

| ID | Texto del botón |
|----|-------------------|
| A (control) | Obtener revisión express — $12 |
| B (test) | Revisar mis documentos antes de enviar — $12 |

Disclosure y disclaimer legal son **idénticos** en ambas variantes.

## Métricas en GA4

1. **Primaria:** tasa `upsell_click` / `upsell_shown`, desglosada por dimensión personalizada **`variant`** (`A` vs `B`) y **`experiment`** (`upsell-copy-v1`).
2. **Secundaria:** `checkout_complete` / `upsell_click` (o conversión a checkout), misma segmentación.

### Informe sugerido

- Exploración → Informe en blanco.
- Dimensiones: evento, `variant`, `experiment` (registrar como parámetros de evento personalizados en GA4 si aún no aparecen).
- Segmentos: usuarios que dispararon `upsell_shown` con `experiment = upsell-copy-v1`.

## Criterios

- **Victoria:** diferencia relativa **> 15%** a favor de una variante, con **≥ 200** impresiones (`upsell_shown`) por variante.
- **Parada:** si `quiz_complete` (u otra conversión de embudo base) **cae > 5%** respecto al control en cualquier variante → desactivar el experimento (`NEXT_PUBLIC_AB_UPSELL_ACTIVE=false`) y revisar copy o UX.

## Comportamiento con flag en `false`

- Siempre variante **A**; no se persiste asignación aleatoria nueva para el test.
- Los eventos `upsell_shown` / `upsell_click` **no** incluyen `variant` ni `experiment` en el payload (menos ruido en GA).

## Archivos

- `hooks/useAbVariant.ts`
- `components/monetization/UpsellButton.tsx`
- `components/monetization/ResultPhase1Section.tsx`
