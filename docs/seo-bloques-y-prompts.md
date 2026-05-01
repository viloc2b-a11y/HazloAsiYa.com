# SEO y conversión: bloques estándar + prompts por sección

Evita un solo “prompt global” por página: homogeneiza tono, diluye intención y puede bajar conversión. Edita **un bloque a la vez** con el prompt que corresponda.

## Dónde vive el copy en código

| Bloque        | Archivo / uso |
|---------------|----------------|
| **META** (title, description, og) | `data/funnel-landing.ts` → `FUNNEL_SEO` |
| **HERO** (H1, subtítulo, CTAs)   | `data/funnel-landing.ts` → `FUNNEL_HERO` |
| **Editorial** (H2, párrafos, FAQ) | `components/funnels/*EditorialSection.tsx` (un archivo por trámite o tema) |
| **Qué es / quién califica** (informacional + alta intención) | Mismo archivo: primer bloque largo tras el hero; ver §3b |
| **Documentos** (alto impacto en conversión) | Mismo archivo: §3c — concreto, con ejemplos; evitar listas vagas |
| **Pasos del trámite** (proceso simple) | Mismo archivo: H2 + lista ordenada; ver §3d |
| **Errores comunes** (riesgo / confianza) | Mismo archivo: H2 + viñetas; ver §3e |
| **CTA de avance** (tarjeta central) | `app/[funnel]/page.tsx` bloque “Primary CTA”; ver §3f |

La metadata **no** debe copiarse literal al H1: el H1 sigue la intención **conversión**; el title la intención **búsqueda**.

---

## 1. HERO (conversión + claridad)

```
ROLE: Conversion-focused UX writer

TASK:
Write a HERO section for a Spanish-speaking user in the US trying to complete [TRAMITE].

GOAL:
- Immediate clarity
- Reduce confusion
- Drive click to CTA

RULES:
- Extremely simple Spanish
- No fluff
- No long sentences
- Do NOT copy the SEO page title verbatim into the headline

OUTPUT:
- Headline (max 10 words)
- Subheadline (max 18 words)
- CTA (max 6 words)

CONTEXT:
User is unsure how the process works and fears making mistakes.

Procedure: [TRAMITE]
```

**Implementación:** mapear a `FUNNEL_HERO[tramite]` en `data/funnel-landing.ts`: `headline`, `subhead`, `ctaHero`. Cumple conteo en español (palabras, no caracteres). El botón de la **tarjeta blanca** (“Primary CTA”) sigue en `ctaCard` — mismo tono, sin alargar; si quieres un prompt aparte para esa tarjeta, usa **§3f**. No tocar `FUNNEL_SEO` en el mismo paso.

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

## 3b. EDITORIAL — Qué es y quién califica (consultas de alta intención)

Usar como **primer bloque editorial** para captar búsquedas tipo “qué es X”, “quién califica para X”, “requisitos X Texas”. No sustituye al hero (§1); el H2 puede incluir la keyword, el hero no debe ser un calco del title.

```
ROLE: SEO content writer (high intent queries)

TASK:
Explain what [TRAMITE] is and who qualifies in the US.

GOAL:
- Capture search traffic
- Keep user engaged

INCLUDE:
- Simple definition
- Who qualifies
- Basic criteria

RULES:
- Spanish
- Clear, structured
- No filler

OUTPUT:
- H2
- 2 short paragraphs
- 4 bullet points

CONTEXT:
Procedure: [TRAMITE]
State / locality if criteria change (optional): [EJ. Texas]
Official source to align facts (optional): [AGENCIA / URL]
```

**Implementación:** JSX en `*EditorialSection.tsx`: un `<h2>`, dos `<p>` breves, `<ul>` con **exactamente 4** `<li>` (criterio por viñeta, sin párrafos genéricos intercambiables entre trámites). Variar el texto del H2 entre funnels para no duplicar plantillas detectables.

---

## 3c. EDITORIAL — Documentos (sección más importante para conversión)

**Por qué importa:** la gente abandona cuando no sabe qué traer. Esta sección **reduce ansiedad** → suele **subir conversión** al cuestionario o al plan.

**Particularidades**

- Debe sonar **concreta y real** (nombres de comprobantes, no categorías vacías).
- Cada categoría debe dejar claro *un* ejemplo que el lector pueda buscar en su casa.

**Qué evitar**

- Frases como “pueden variar” **sin** un ejemplo de qué variaría y cuándo.
- Listas vagas (“identificación”, “comprobantes”) sin **un** ejemplo por línea.
- Misma lista copiada en otro trámite cambiando solo el título.

```
ROLE: Practical checklist creator

TASK:
List the exact documents needed for [TRAMITE] in the US.

GOAL:
- Remove uncertainty
- Help user prepare

INCLUDE:
- Identity
- Income
- Address
- Special cases

RULES:
- Use real examples
- Be specific

OUTPUT:
- H2
- Categorized bullet list
- Short explanation per item

CONTEXT:
Procedure: [TRAMITE]
State or locality if the list changes: [EJ. Texas / Houston]
Official checklist URL (optional): [URL]
```

**Implementación:** en `*EditorialSection.tsx`, `<section>` con `<h2>` y subencabezados **Identidad · Ingresos · Domicilio · Casos especiales** (o equivalente). Cada `<li>`: **ítem** + **explicación corta** + **ejemplo real** (p. ej. “últimas 2 quincenas”, “recibo de luz de menos de 90 días”). Si algo depende del condado o del portal, dilo en una línea y da **dos** ejemplos típicos, no “todo depende”. Enlace a `/guias/…` al final si hay guía larga: “Lista ampliada →”.

---

## 3d. EDITORIAL — Pasos del trámite (proceso sin abrumar)

Ideal para intención “cómo hacer X”, “pasos para solicitar…”. Complementa documentos (§3c); no duplicar el mismo orden en otro funnel con palabras idénticas.

```
ROLE: Process simplifier

TASK:
Explain step-by-step how to complete [TRAMITE] in the US.

GOAL:
- Make process feel easy
- Keep user engaged

RULES:
- Max 6 steps
- Each step = 1–2 lines
- No legal language

OUTPUT:
- H2
- Numbered steps

CONTEXT:
Procedure: [TRAMITE]
Channel if relevant (online / in-person / both): [CANAL]
Where users usually start: [EJ. portal, oficina, cita]
```

**Implementación:** en `*EditorialSection.tsx`, `<section>` con `<h2>` y `<ol>` (`list-decimal`). Cada `<li>`: **una acción clara** (verbo + qué + dónde si aplica). Evitar jerga (“deberá”, “conforme a”); si un paso es obligatorio en la práctica, dilo en plano: “Te piden…” / “Suele tocarte…”.

---

## 3e. EDITORIAL — Errores comunes (reducir riesgo sin alarmismo)

Sirve para intención “por qué me rechazan”, “errores al aplicar”. La urgencia viene de **consecuencias reales** (retraso, devolución de papeles), no de miedo inventado.

```
ROLE: Risk reduction expert

TASK:
List the most common mistakes when applying for [TRAMITE].

GOAL:
- Create urgency
- Increase trust

RULES:
- Realistic mistakes
- No exaggeration

OUTPUT:
- H2
- 4–6 bullet points
- Each with short explanation

CONTEXT:
Procedure: [TRAMITE]
Typical rejection or delay causes in practice (optional notes): [EJ. documentos ilegibles, plazos]
```

**Implementación:** `<section>` con `<h2>` y `<ul>`. Cada viñeta: **error en negrita o frase corta** + una línea de explicación (qué pasa o cómo evitarlo). Prohibido: “siempre te van a negar”, “multas enormes”, “ilegal” sin fundamento. Si aplica YMYL (salud, migración, impuestos), recordar verificar en fuente oficial al final del bloque.

---

## 3f. CTA de avance — tarjeta “Empieza ahora” (después del bloque azul)

Distinto del **HERO (§1)**: aquí el usuario ya vio el valor (“Qué vas a recibir”). Objetivo: **un clic** sin presión falsa.

```
ROLE: Conversion optimizer

TASK:
Write a CTA section that pushes the user to start the process.

GOAL:
- Maximize clicks
- Reduce hesitation

RULES:
- Clear benefit
- Remove fear
- No hype

OUTPUT:
- Short paragraph (2–3 lines)
- CTA button text

CONTEXT:
Procedure: [TRAMITE]
What they get in ~5 min (be specific): [EJ. lista de documentos + primeros pasos]
Objection to neutralize (optional): [EJ. “sin tarjeta”, “sin abogado”]
```

**Implementación:** hoy el copy genérico vive en `app/[funnel]/page.tsx` (bloque *Primary CTA*: titular, párrafo gris, botón usa `hero.ctaCard` de `FUNNEL_HERO`). Para personalizar por trámite sin tocar el hero: añadir campos opcionales en `data/funnel-landing.ts` (p. ej. `ctaCardTitle`, `ctaCardLead`) y leerlos en esa tarjeta; el **párrafo del prompt** puede partir en titular (línea 1) + resto (líneas 2–3). El **texto del botón** debe coincidir con la promesa (misma acción que el hero o un paso siguiente explícito).

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
