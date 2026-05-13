# A/B test — copy del upsell «revisión express»

**Experimento:** `upsell-copy-v1`  
**Implementación:** `hooks/useAbVariant.ts`, `ResultPhase1Section.tsx`, `UpsellButton.tsx` (solo cambia el texto del CTA; Disclosure, disclaimer y precio iguales).

## Flag de activación

`NEXT_PUBLIC_AB_UPSELL_ACTIVE=false` por defecto.

- Con **`false`**: todos ven la variante **A** (control). No se crea `localStorage` `haz_ab_upsell-copy-v1`.
- Con **`true`** en Cloudflare Pages (Variables de entorno): asignación 50/50 persistida; no hace falta redeploy si solo cambias el valor del flag.

Activar solo con tráfico real (orientativo: **200–300+** usuarios completando el cuestionario).

---

## Variantes

|        | Copy del botón |
|--------|----------------|
| **A** (control) | Prefijo «Obtener revisión express —» + precio desde `PRICE_REVISION_EXPRESS` (`data/checkout-prices.json` vía `lib/pricing.ts`). Ver `UpsellButton.tsx`. |
| **B** (test)    | Prefijo «Revisar mis documentos antes de enviar —» + mismo precio dinámico. |

Los kits SNAP / ITIN **no** entran en el test.

---

## Métricas del experimento

**Métrica primaria**

- `tasa_click = upsell_click / upsell_shown` (por variante; parámetro personalizado `variant` en GA4).

**Métrica secundaria**

- `tasa_checkout = checkout_start / upsell_click` (por variante).

**Métrica de guardia (no debe bajar)**

- `tasa_cuestionario = quiz_complete / quiz_start`  
  Si baja **> 5%** en cualquier variante → **parar el test** de inmediato.

---

## Cómo leer resultados en GA4

1. GA4 → **Explore** → **Blank exploration**
2. **Dimensiones:** `Event name` y el parámetro personalizado **`variant`** (y `experiment` si lo registras como dimensión personalizada).
3. **Métricas:** Event count
4. **Filtro:** `event_name` in (`upsell_shown`, `upsell_click`, `checkout_start`)
5. Desglosar por **`variant`** → tabla A vs B y tasas derivadas en hoja de cálculo o en la exploración.

---

## Criterio de victoria

- Diferencia entre variantes: **> 15%** en la métrica primaria (orientativo).
- Tamaño de muestra: **> 200** usuarios por variante en `upsell_shown`.
- Duración mínima: **14 días** corridos (captura variación entre días laborables y fin de semana).
- Significancia: **p < 0.05** (calculadoras gratuitas: abtestguide.com, statsig.com, etc.).

---

## Post-experimento

### Si la variante B gana (diferencia > 15%, muestra suficiente)

1. Actualizar el copy por defecto en `UpsellButton` (`REVISION_EXPRESS_CTA`) al texto de B.
2. Eliminar la prop `variant` / lógica A/B (o dejarla como legacy apagada).
3. Apagar: `NEXT_PUBLIC_AB_UPSELL_ACTIVE=false`.
4. Documentar aquí la fecha y las métricas clave.
5. Planificar el siguiente test (ej. precio, posición del bloque).

### Si la A gana o no hay diferencia significativa

1. Mantener copy A.
2. Apagar el experimento (`NEXT_PUBLIC_AB_UPSELL_ACTIVE=false`).
3. Documentar que se probó B y no hubo mejora clara.
4. Elegir un nuevo elemento a testear.

### Si la métrica de guardia cae > 5%

1. Apagar el experimento **de inmediato**.
2. Revisar que el upsell solo se muestre con `eligible === true` y que el copy no confunda.
3. No reactivar hasta entender la causa.

---

## Eventos enviados (resumen)

- `upsell_shown`: `variant`, `experiment`, `tramite`, `placement: result_phase1`
- `upsell_click`: `variant`, `experiment`, `product`, `placement`, `funnel`, `tramite`

Verificación manual adicional: `docs/verify-ga4-consent.md` (consent antes de medir).
