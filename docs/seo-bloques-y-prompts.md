# SEO y conversión: bloques estándar + prompts por sección

Evita un solo “prompt global” por página: homogeneiza tono, diluye intención y puede bajar conversión. Edita **un bloque a la vez** con el prompt que corresponda.

## Dónde vive el copy en código

| Bloque        | Archivo / uso |
|---------------|----------------|
| **META** (title, description, og) | `data/funnel-landing.ts` → `FUNNEL_SEO` |
| **HERO** (H1, subtítulo, CTAs)   | `data/funnel-landing.ts` → `FUNNEL_HERO` |
| **Editorial** (H2, párrafos, FAQ) | `components/funnels/*EditorialSection.tsx` (un archivo por trámite o tema) |
| **Qué es / quién califica** (informacional) | Mismo archivo: primer bloque largo tras el hero; ver §3b |
| **Documentos necesarios** (reducir fricción) | Mismo archivo: sección H2 + listas por categoría; ver §3c |

La metadata **no** debe copiarse literal al H1: el H1 sigue la intención **conversión**; el title la intención **búsqueda**.

---

## 1. HERO (conversión + claridad)

```
ROLE: Conversion-focused landing optimizer

TASK:
Rewrite the HERO section for a Spanish-speaking audience in the US looking to complete [TRAMITE].

GOAL:
- Clear what the user gets
- Reduce confusion
- Increase click on CTA

RULES:
- Simple Spanish (8th grade level)
- No fluff
- No generic marketing language
- Do NOT copy the SEO page title verbatim into the headline

OUTPUT:
- Headline (max 12 words)
- Subheadline (max 20 words)
- CTA hero (max 8 words)
- CTA card secondary (max 8 words)

CONTEXT:
User wants to complete: [TRAMITE]
```

**Implementación:** pegar salida en `FUNNEL_HERO[tramite]` en `data/funnel-landing.ts`. No tocar `FUNNEL_SEO` en el mismo paso.

---

## 2. META (SERP + compartir)

```
ROLE: SEO metadata writer for Spanish US Hispanic queries

TASK:
Write ONLY title and meta description for [TRAMITE] on HazloAsíYa.

GOAL:
- Primary query in title where natural
- Description with benefit + “gratis”/evaluación if applicable

RULES:
- Title ≤ 60 characters (incl. brand)
- Description ≤ 155 characters
- Do not reuse the hero headline word-for-word

OUTPUT:
- title
- description
- ogTitle (shorter social headline optional)
```

**Implementación:** `FUNNEL_SEO[tramite]` en `data/funnel-landing.ts`.

---

## 3. EDITORIAL (información + confianza)

```
ROLE: Educational content editor (YMYL-aware)

TASK:
Rewrite ONE editorial section (one H2 + 2–4 short paragraphs) for [TRAMITE].

GOAL:
- Answer one specific intent (e.g. documents, steps, eligibility nuance)
- Cite official source in prose (HHSC, IRS, USCIS, TEA…)

RULES:
- No duplicate another funnel’s section verbatim
- No legal/fiscal guarantees; point to official site
- Spanish, concrete verbs

OUTPUT:
- H2 title
- Body (plain text, no HTML)
```

**Implementación:** el bloque correspondiente dentro del `*EditorialSection.tsx` del trámite. Un prompt = un H2, no toda la página.

---

## 3b. EDITORIAL — Qué es y quién califica (intención informacional)

Usar como **primer bloque editorial** cuando quieras rankear consultas tipo “qué es X”, “quién califica para X”. No sustituye al hero (conversión); complementa al bajar el scroll.

```
ROLE: SEO content writer

TASK:
Write a section that explains clearly what [TRAMITE] is and who qualifies.

GOAL:
- Rank for informational intent
- Keep user reading

INCLUDE:
- Definition
- Who qualifies
- Basic context in the US

RULES:
- Spanish
- Simple, clear, structured
- No filler
- Use bullet points if helpful

OUTPUT:
- H2
- 2–3 short paragraphs
- 3–5 bullet points

CONTEXT:
Program or procedure: [TRAMITE]
Official sources to align with (optional): [AGENCIA / URL]
```

**Implementación:** convertir la salida a JSX en el `*EditorialSection.tsx` del trámite (primer `<h2>` + `<p>` + `<ul>`). Un trámite = un prompt de este tipo; evita repetir el mismo H2 en otro funnel.

---

## 3c. EDITORIAL — Documentos necesarios (guía práctica)

Usar cuando la intención de búsqueda sea “qué documentos llevar”, “qué piden para…”. Baja incertidumbre y refuerza el cuestionario/plan.

```
ROLE: Practical guide creator

TASK:
List and explain the documents needed for [TRAMITE].

GOAL:
- Reduce user uncertainty
- Increase conversion

INCLUDE:
- Identity
- Income
- Address
- Variations

RULES:
- Be specific
- Use real examples
- Avoid generic statements

OUTPUT:
- H2
- Categorized bullet lists
- Short explanations per item

CONTEXT:
Procedure: [TRAMITE]
State or locality if it changes the list: [EJ. Texas / Houston]
Official checklist URL (optional): [URL]
```

**Implementación:** en `*EditorialSection.tsx`, añadir un `<section>` con `<h2>`, subencabezados por categoría (Identidad, Ingresos, Domicilio, Variaciones / casos especiales) y `<ul>` con **un ejemplo concreto por viñeta** (p. ej. “nómina de 2 semanas”, “recibo de luz a nombre del arrendador”). Si ya existe una guía larga en `/guias/`, enlazar al final: “Lista ampliada →”.

---

## 4. FAQ (schema + usuarios)

```
ROLE: FAQ editor for FAQPage schema

TASK:
Add or rewrite 3 questions for [TRAMITE] that match real searches, not generic “¿Qué es…?” only.

RULES:
- Each answer 2–4 sentences, factual
- No copy-paste from another program’s FAQ

OUTPUT:
- Q1 / A1, Q2 / A2, Q3 / A3
```

**Implementación:** array `faqItems` en el mismo `*EditorialSection.tsx`.

---

## Validación después de cada bloque

1. **SEO:** `npm run validate` (longitudes, etc.)
2. **Conversión:** ¿El hero promete un resultado concreto en 5 min? ¿El CTA promete la siguiente acción?
3. **Diferenciación:** comparar con otro trámite — si dos H2 o FAQs son intercambiables, reescribir uno.

---

## Trámites con hero + SEO separados hoy

`FUNNEL_HERO` y `FUNNEL_SEO` definidos para: `snap`, `medicaid`, `itin`, `wic`, `escuela`, `daca`, `taxes`, `rent`. El resto de funnels usa `action` / `desc` de `data/funnels.ts` hasta que añadas entradas aquí.
