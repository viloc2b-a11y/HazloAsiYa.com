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
| **Paso a paso** (simple, ≤6 pasos) | Mismo archivo: §3d — sin lenguaje legal ni pasos largos |
| **Errores** (urgencia + confianza) | Mismo archivo: §3e — real, no alarmista; 5 viñetas |
| **CTA de avance** (tarjeta, post-valor) | `app/[funnel]/page.tsx` “Primary CTA”; ver §3f |
| **CTA final** (cierre, acción) | §3g — sin repetir hero; pie de página o post-editorial |
| **Interlinking** (bonus) | §5 — anclas + destinos; evita páginas huérfanas |

La metadata **no** debe copiarse literal al H1: el H1 sigue la intención **conversión**; el title la intención **búsqueda**.

### Regla de oro

👉 Si **todo** el contenido suena igual → está mal aplicado.  
👉 Si **cada sección cumple un rol** distinto (informar, listar papeles, pasos, errores, cerrar) → sube SEO y conversión.

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

## 3d. EDITORIAL — Paso a paso (el proceso se siente simple)

Ideal para “cómo hacer X”, “pasos para solicitar…”. Va **después** de documentos (§3c) cuando tenga sentido: primero *qué juntar*, luego *en qué orden hacerlo*.

**Particularidades**

- Debe hacer **sentir el proceso simple** (un paso = una cosa a la vez).
- **Reduce fricción mental**: el usuario imagina el camino sin saltos.

**Qué evitar**

- Pasos **largos** (un solo `<li>` no debe ser un párrafo).
- **Lenguaje legal** o administrativo rígido (“deberá”, “conforme a la normativa”, “a efectos de”).
- **Más de 6 pasos**; si hace falta más, divide en otra sección o enlaza a guía larga.

```
ROLE: Process simplifier

TASK:
Explain step-by-step how to complete [TRAMITE] in the US.

GOAL:
- Make process feel easy
- Increase confidence

RULES:
- Max 6 steps
- Each step = 1–2 lines
- Simple language

OUTPUT:
- H2
- Numbered list

CONTEXT:
Procedure: [TRAMITE]
Channel if relevant (online / in-person / both): [CANAL]
Where users usually start: [EJ. portal, oficina, cita]
```

**Implementación:** en `*EditorialSection.tsx`, `<section>` con `<h2>` y `<ol className="list-decimal …">` con **como máximo 6** `<li>`. Cada ítem: **1–2 líneas**, verbo al inicio, dónde/cuándo si aplica. Tono: “Abre…”, “Sube…”, “Si te llaman…”. No duplicar el mismo orden en otro trámite con palabras casi idénticas.

---

## 3e. EDITORIAL — Errores (palanca de conversión)

Sirve para intención “por qué me rechazan”, “errores al aplicar”. Aquí **sí** puedes generar **urgencia** con consecuencias creíbles — el usuario entiende *qué pierde si no corrige* — sin caer en pánico vendido.

**Particularidades**

- La urgencia viene de lo **concreto**: “si no haces X, suele pasar Y” (retraso, devolución del caso, cita perdida).
- Frases tipo **“si no haces esto, te rechazan / te lo regresan”** solo cuando reflejen un patrón **real** en ese trámite (no en todos por igual).

**Qué evitar**

- **Miedo exagerado** (“te van a deportar”, “multa enorme”) sin base.
- **Errores genéricos** que valen para cualquier trámite (“no leer bien”) sin decir *qué* leer en *este* portal o formulario.
- Misma lista de 5 viñetas en otro funnel cambiando solo el H2.

```
ROLE: Risk awareness writer

TASK:
List common mistakes people make when applying for [TRAMITE].

GOAL:
- Create urgency
- Build trust

RULES:
- Real mistakes
- Short explanations

OUTPUT:
- H2
- 5 bullet points

CONTEXT:
Procedure: [TRAMITE]
Typical rejection or delay causes (optional): [EJ. foto borrosa, no contestar la entrevista]
```

**Implementación:** `<section>` con `<h2>` y `<ul>` con **exactamente 5** `<li>`. Cada viñeta: **error** (negrita o frase corta) + **1–2 líneas** (consecuencia típica + remedio en una frase). Confianza = no prometer lo que la agencia no promete; YMYL: cierre con “confirma en [fuente oficial]”. Prohibido: alarmismo, culpa al usuario, garantías de resultado.

---

## 3f. CTA de avance — tarjeta “Empieza ahora” (después del bloque azul)

**No es el cierre final:** empuja el **primer clic** al formulario cuando ya vio “Qué vas a recibir”. El **cierre fuerte** va en **§3g** (después de leer documentos / pasos / errores).

Distinto del **HERO (§1)**: mismo trámite, **otro momento** del recorrido — no copies el mismo párrafo.

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

## 3g. CTA final (dinero / cierre)

**Momento:** el usuario **ya leyó** la página; no re-explicas el trámite. **Cierras** con una fricción menos y un botón **directo**.

**Particularidades**

- **Cerrar**, no enseñar de nuevo: cero repetición del hero ni del primer párrafo de §3f.
- **Quitar la última duda** (tiempo, costo $0 empezar, sin tarjeta, “en 5 minutos ves qué te falta”).
- Tono **firme y corto**; beneficio claro en una idea.

**Qué evitar**

- **Repetir el hero** (mismo titular o misma promesa palabra por palabra).
- **CTA débil** (“Haz clic aquí”, “Más información”) sin verbo de acción ni resultado.

```
ROLE: Conversion closer

TASK:
Write a final CTA section for users ready to start [TRAMITE].

GOAL:
- Push action
- Reduce hesitation

RULES:
- Clear benefit
- No hype
- Direct

OUTPUT:
- 2–3 line paragraph
- CTA button text

CONTEXT:
Procedure: [TRAMITE]
One lingering doubt to kill (optional): [EJ. “¿y si no tengo todos los papeles?”]
```

**Implementación:** hoy no hay bloque dedicado “solo cierre” en todas las landings: candidatos — (a) última sección dentro de `*EditorialSection.tsx` antes del FAQ, o (b) componente debajo del editorial y encima de *Next steps* en `app/[funnel]/page.tsx`. Campos opcionales en `funnel-landing.ts`: `ctaCloseLead`, `ctaCloseButton`. El botón debe llevar al **mismo** `/[tramite]/form` o al siguiente paso único.

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

## 5. BONUS — Interlinking interno

**Particularidades:** refuerza **SEO** (clusters, anchor semántico) y **navegación**; reduce páginas aisladas sin enlaces entrantes.

**Qué controlar:** al publicar o revisar una landing, ejecutar este bloque **aparte** del copy editorial — no mezclar con un prompt de H2.

```
ROLE: SEO internal linking strategist

TASK:
Suggest internal links for a page about [TRAMITE].

GOAL:
- Strengthen SEO structure
- Improve navigation

OUTPUT:
- 4–6 internal links
- Anchor text suggestion

CONTEXT:
Current URL: [RUTA]
Related hubs or geo pages: [EJ. /snap/texas/, /guias/documentos-para-snap/]
```

**Implementación:** añadir enlaces contextuales en el strip superior del `*EditorialSection.tsx`, en párrafos del cuerpo, o en bloque “Recursos relacionados”. Anclas **descriptivas** (no “clic aquí”). Prioridad: hub temático (`/guias/`), geo (`/snap/texas/`), trámite hermano (SNAP ↔ Medicaid), guía profunda. Revisar también `app/guias/page.tsx` y home “Disponible en Texas” para simetría.

---

## Validación después de cada bloque

1. **SEO:** `npm run validate` (longitudes, etc.)
2. **Conversión:** ¿El hero promete un resultado concreto en 5 min? ¿§3f y §3g **no** repiten el mismo texto? ¿El botón nombra la acción?
3. **Diferenciación:** comparar con otro trámite — si dos H2 o FAQs son intercambiables, reescribir uno.
4. **Interlinking (bonus):** ¿Hay 4–6 enlaces internos razonables desde esta URL hacia hub, geo o guía relacionada?

---

## Trámites con hero + SEO separados hoy

`FUNNEL_HERO` y `FUNNEL_SEO` definidos para: `snap`, `medicaid`, `itin`, `wic`, `escuela`, `daca`, `taxes`, `rent`. El resto de funnels usa `action` / `desc` de `data/funnels.ts` hasta que añadas entradas aquí.
