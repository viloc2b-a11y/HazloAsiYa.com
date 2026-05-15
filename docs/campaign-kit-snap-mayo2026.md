# Campaign brief — Kit SNAP "Verano sin filas" (mayo–junio 2026)

> Strategy doc in English for fast review; all audience-facing copy is in Spanish, ready to ship.

---

## 1. Campaign overview

**Name**: *Verano sin filas* — Kit SNAP

**One-line summary**: A 6-week, paid + organic push driving Hispanic families to the `/snap/` funnel as the school year ends, converting first to a free eligibility check + email capture, then to the **Kit SNAP** ($X — see `data/checkout-prices.json`).

**Why now**: SNAP demand spikes mid-May to July as school meals end and families look for replacement food assistance. Search volume for "como aplicar a SNAP en español" and "documentos para SNAP" rises ~30–60% in this window historically (Google Trends, US-Hispanic interest). The Fase 1 Kit SNAP is the only SKU on the site that perfectly intersects this demand.

**Window**: 2026-05-16 → 2026-06-27 (6 weeks, ending the Saturday before July 4).

### Primary objective (SMART)
Generate **75–125 Kit SNAP purchases** at the Fase 1 price by 2026-06-27, equating to roughly **$1,100–$1,900 in tracked revenue** on **~$1,000 paid spend** (target ROAS 1.1–1.9x, with the email-list value as additional upside).

### Secondary objectives
- **1,500–2,500 new email subscribers** to Mailchimp (TRAMITE merge field = `SNAP`).
- **3,000–5,000 sessions** on `/snap/` from new sources (GA4 `cta_click` + `result_view` for funnel = `snap`).
- **3–5 partner contacts** opened with nonprofits or consulados (feeds the `/para-organizaciones/` pipeline; no quota — relationship-building only).

---

## 2. Target audience

### Primary segment — "Mamás puente"
Hispanic mothers, ages 25–45, household income ≤ 130% of federal poverty level (~$32k for family of 3, $40k for family of 4 — see `program-limits.json` for current values), with **at least one school-age child**, living in CA / TX / FL / NY / NJ / IL. Spanish dominant or bilingual. Smartphone-first, often shared device. Trust circle: comadres, parroquia, escuela, WhatsApp grupos.

**Pain points**:
- "No sé si califico — y tengo miedo de que cuente como carga pública."
- "Las páginas oficiales están en inglés / mal traducidas — no entiendo qué papeles necesito."
- "No tengo tiempo para hacer cola; trabajo dos turnos."
- Distrust after past denials or contradictory advice from family/community.

**Buying stage**: mostly **consideration** — they know SNAP exists, are researching whether they qualify, and need a low-risk first step before committing.

### Secondary segment — "Primera vez"
Recently arrived families (US < 5 years) who have *never* applied. Adds an awareness layer; they need education before consideration. Reach through partners (consulados, iglesias), not paid.

### Where they spend time
- **WhatsApp** (forwarded content within family/community groups — strongest amplifier)
- **Facebook** (community groups: "Madres en [ciudad]", "Hispanos en [estado]", Marketplace adjacency)
- **Instagram + Reels** (younger end of segment)
- **TikTok** (rapidly growing for this demo; tutoriales perform)
- **YouTube** (searches like "como llenar solicitud SNAP")
- **Univision / Telemundo digital** (top-of-funnel awareness, harder to attribute)
- **Offline**: parroquias, escuelas (last-day-of-school flyers), clínicas comunitarias

---

## 3. Key messages

### Core message
**"Lleva tu solicitud SNAP de duda a aprobada — sin filas, en español de verdad."**

### Supporting messages

| Message | Proof point |
|---|---|
| **"Sabes en 3 minutos si calificas — sin dar tus datos al gobierno."** | The eligibility funnel runs client-side; only the email goes to Mailchimp after explicit consent. Tie to `lib/cookie-consent.ts` + privacy page. |
| **"Te decimos exactamente qué documentos necesitas y dónde aplicar en tu estado."** | Existing guía `documentos-para-snap.md`; city pages for LA / NYC / Miami / San Antonio already routed. |
| **"Plantillas y guía paso a paso — listas para imprimir."** | Kit SNAP contents (Fase 1 module). Show actual screenshot. |
| **"Aplicar a SNAP no es carga pública para la mayoría de las familias."** | Cite USCIS public-charge guidance (verified link). Critical objection — must be addressed in creative ≥3 times. |
| **"Hecho por y para hispanos — no traducción robotizada."** | Editorial: a real Spanish voice, not translated English. Show team or community testimonial. |

### Message hierarchy
1. **Why should I care?** — Tus hijos pierden comidas escolares este mes.
2. **What's the solution?** — Un plan en español, en minutos, sin riesgo.
3. **Why HazloAsíYa?** — Porque entendemos el miedo y hablamos tu idioma.
4. **What should I do?** — Empieza el cuestionario gratis.

### Channel-tone notes
- **Paid social** — emotional + visual (mother + child + food); 7-second hook.
- **Email** — conversational, "tú" form, story-driven.
- **SEO blog** — practical, scannable, schema-marked-up FAQ blocks.
- **Partner outreach** — formal "usted", brief, value-led ("aliviamos 30 min de tu intake").

---

## 4. Channel strategy

With a **$500–$2,000** budget, paid spend goes where attribution is cleanest and audience targeting is sharpest. Everything else is owned/earned.

| Channel | Tier | Why it fits | Format | Effort | Suggested spend |
|---|---|---|---|---|---|
| **Meta (Facebook + Instagram) ads** | Paid | Tightest geo + interest targeting for US Hispanic; existing creative formats; pixel can feed retargeting | Reels (15s), carousel (5 cards), image | Medium | **$800–$1,000** |
| **TikTok Spark Ads** | Paid | Fastest-growing channel for the demo; cheap CPMs; tutorial format converts | Native vertical video (30–45s) | Medium | **$100–$200** |
| **Owned blog / SEO** | Owned | Existing guías rank already; campaign-window posts capture seasonal search | 2 new posts + 4 refreshes | Medium | $0 |
| **Email (Mailchimp)** | Owned | Existing list; warm conversion path | 5-email nurture + 1 launch broadcast | Low | $0 |
| **WhatsApp shareables** | Owned/Earned | Highest community-trust amplifier; designed to be forwarded | 2 single-image carousels + 1 PDF preview | Low | $0 |
| **YouTube partnerships** | Paid (micro) | Small Hispanic creators (3–30k subs) cost $50–$150 per shout in this niche | 1–2 sponsored mentions | Medium | **$100–$200** |
| **Partner outreach (nonprofits, consulados)** | Earned | Long-cycle but compounding; ties to `/para-organizaciones/` | 1:1 outreach + co-branded landing | High | $0 (time) |
| **TikTok organic** | Owned | Test ground for paid creative; cheap iteration | 6–10 short videos | Medium | $0 |
| **Reserves / testing** | — | Reactive creative or scaling winners | — | — | **$50–$100** |

**Total paid**: ~$1,050–$1,500 + ~$50–$100 contingency.

### Why these and not others
- **Google Search ads** — skipped at this budget. CPCs for "snap espanol" are ~$3–$8 and you'd burn through $500 in 100 clicks without enough volume to optimize. SEO is the right Google play here.
- **Display / programmatic** — skipped. Brand-build only at this budget would be wasted.
- **Events / sponsorships** — out of scope financially.
- **Influencer (larger creators)** — out of scope financially; micro on YouTube only.

---

## 5. Content calendar

6 weeks. Soft launch on day 1 (organic only) → full paid rollout by day 4 to leave creative-production runway.

| Week | Dates | Theme | Content piece | Channel | Status |
|---|---|---|---|---|---|
| **W0 (prep)** | May 14–15 | Setup | Pixel + UTM convention finalized; Mailchimp segment `snap_2026q2` created; landing copy refresh on `/snap/`; verify VerificationBadge dates | Internal | Must finish before launch |
| **W1** | May 16–22 | Soft launch — "Termina el ciclo escolar, empieza el alivio" | Email broadcast to warm list (subject: *"En junio se acaban las comidas escolares — aquí está tu plan"*) | Email | |
| | | | Organic IG carousel + Reel: *"3 minutos, 3 papeles, 3 pasos"* | IG | |
| | | | Blog refresh: `documentos-para-snap.md` (add 2026 limits + city section) | Blog/SEO | |
| | | | Pixel warmup: $20/day Meta retargeting ad to past `/snap/` visitors | Meta | |
| **W2** | May 23–29 | Full paid launch — "Sabes en 3 minutos si calificas" | 4 Meta ad creatives live (2 video, 1 carousel, 1 image) | Meta | $200 budget |
| | | | First TikTok organic posts (3 videos: hook, demo, testimonio) | TikTok | |
| | | | Email #2: *"¿Sabes qué papeles llevar? Lista para imprimir"* | Email | |
| | | | Blog post: *"Cómo aplicar a SNAP en [Texas / Florida / California] sin equivocarte"* | Blog | |
| **W3** | May 30 – Jun 5 | Trust + objection — "No es carga pública" | Meta ad creative refresh (top performer iterates; killing bottom 2) | Meta | $250 budget |
| | | | TikTok Spark Ads activated on top organic | TikTok | $50 |
| | | | Email #3: *"Lo que tu tía te dijo sobre carga pública (y por qué se equivocó)"* | Email | |
| | | | YouTube partnership #1 goes live | YouTube | $100 |
| | | | WhatsApp PDF: *"Tu plan SNAP en una hoja"* (designed to forward) | WhatsApp | |
| **W4** | Jun 6–12 | Mid-campaign push — last call before summer | Email #4: *"Faltan 3 semanas para que se cierre nuestro lanzamiento del Kit SNAP"* | Email | |
| | | | Meta retargeting layer: anyone who finished cuestionario but didn't buy → discount nudge or testimony | Meta | $250 |
| | | | Blog: *"Errores más comunes al solicitar SNAP en español"* | Blog | |
| | | | Partner outreach batch (10 nonprofits in CA/TX/FL/NY) | Partner | |
| **W5** | Jun 13–19 | Social proof — testimonios | TikTok organic: real Spanish-speaking users (with consent) | TikTok | |
| | | | YouTube partnership #2 | YouTube | $100 |
| | | | Meta: testimony-format ad creative replaces oldest creative | Meta | $200 |
| | | | Email #5: *"María de Houston aplicó en 11 minutos — esta es su historia"* | Email | |
| **W6** | Jun 20–27 | Close — urgency + retro | "Last weekend" Meta push (urgency, but soft — no fake scarcity) | Meta | $150 |
| | | | Email #6: *"Si hoy no aplicas, julio te va a costar"* | Email | |
| | | | TikTok organic: behind-the-scenes / team thanks | TikTok | |
| | | | Internal: pull GA4 + Mailchimp + Square data → performance report | Internal | |

### Production lead times to respect
- Meta ad creative: **2–3 days** per batch (script → asset → review). Start W1 creative on May 14.
- TikTok organic: 1 day (record + edit on phone).
- Blog post: 3–5 days.
- Email: 1–2 days.
- WhatsApp PDF: 1 day.

### Build-in flexibility
20% of slots stay open for reactive content (e.g., if a USCIS or USDA SNAP announcement drops, we move fast).

---

## 6. Content pieces needed

### Must-have

| Asset | Type | Description | Timeline |
|---|---|---|---|
| Updated `/snap/` landing copy | Web | Sharpen hero CTA, add VerificationBadge, add carga-pública FAQ block | W0 |
| Meta ad pack #1 | Creative | 2 Reels + 1 carousel + 1 image, all Spanish | W1 |
| Meta ad pack #2 (refresh) | Creative | 2 new creatives based on W2 data | W3 |
| Meta ad pack #3 (testimony) | Creative | Real user testimonios w/ written consent | W5 |
| TikTok organic videos | Creative | 6–10 vertical videos (hook + demo + objection + testimony) | W1–W6 |
| Email sequence (6 emails) | Email | Mailchimp campaign w/ `snap_2026q2` segment | W0–W6 |
| WhatsApp 1-pager PDF | PDF | "Tu plan SNAP en una hoja" — designed to forward | W3 |
| Blog post #1 | SEO | "Cómo aplicar a SNAP en [tu estado]" with state-targeted variants | W2 |
| Blog post #2 | SEO | "Errores más comunes al solicitar SNAP en español" | W4 |
| Blog refresh: `documentos-para-snap.md` | SEO | Update with 2026 limits + city blocks | W1 |
| Partner outreach email | Email | Template for nonprofits/consulados | W4 |

### Nice-to-have

| Asset | Why | Defer if |
|---|---|---|
| YouTube partnership briefs | Higher reach, lower control | Creator unresponsive past W2 |
| Co-branded landing for partner pilot | Strengthens `/para-organizaciones/` story | No partner signs by W5 |
| Spanish radio spot (community FM) | Reaches offline mothers | Budget hit; skip in Fase 1 |

---

## 7. Success metrics

Tracked through GA4 events already wired in `lib/gtag.ts` (`cta_click`, `result_view`, `scroll_70`), Mailchimp reports, and the Square webhook hitting Supabase (`functions/api/square-webhook.ts`).

### Primary KPI
**Kit SNAP purchases**: 75–125 (target), tracked via Square checkout completion + Supabase row.

### Secondary KPIs

| Metric | Target | Source | Cadence |
|---|---|---|---|
| New email signups (TRAMITE = SNAP) | 1,500–2,500 | Mailchimp audience growth on segment | Weekly |
| `/snap/` sessions from paid + organic | 3,000–5,000 | GA4 (source/medium ≠ direct) | Weekly |
| Funnel completion (cta_click on `/snap/`) | 25–35% of sessions | GA4 `cta_click` for `funnel=snap` | Weekly |
| Funnel → email conversion | ≥ 12% | Mailchimp subs / `result_view` event count | Weekly |
| Email → checkout conversion | ≥ 4–6% | Square purchases / Mailchimp clicks to `/snap/result/` | Bi-weekly |
| Meta CPM | ≤ $8 | Meta Ads Manager | Weekly |
| Meta CTR | ≥ 1.2% | Meta Ads Manager | Weekly |
| Meta CPA (purchase) | ≤ $12 | Meta Ads Manager + Square reconciliation | Weekly |
| ROAS (paid only) | ≥ 1.1x | Square revenue / Meta+TikTok spend | End of campaign |

### Reporting cadence
- **Weekly snapshot** (Mondays): paid spend, top creative, CPM/CTR/CPA, email signups, sessions, conversions. Lives in a Notion or Google Sheet — one page, glanceable.
- **End-of-campaign** (Jun 30): full performance report with creative win/loss analysis + recommendations for Fase 1.5.

> If product analytics historical benchmarks exist (Amplitude / GA4 prior funnel data), pull baseline funnel→email and email→checkout rates and adjust targets to ±20% of those baselines before week 2.

---

## 8. Budget allocation ($500–$2,000)

Planning to the **middle of the band ($1,400)** so we can underspend and end at $1,000 if performance is soft, or stretch to $2,000 if a winner emerges.

| Bucket | Mid-plan | Floor | Stretch | Notes |
|---|---|---|---|---|
| Meta (Facebook + Instagram) ads | $900 | $650 | $1,250 | 60–65% of paid; lowest-CPA channel for this demo |
| TikTok Spark Ads | $150 | $50 | $250 | Only on creatives that earn it organically |
| YouTube micro-partnerships | $200 | $100 | $300 | 1–2 shout-outs from Hispanic creators (3–30k subs) |
| Creative production (stock, music licenses, editing apps, light prop budget) | $100 | $50 | $150 | Most creative is in-house |
| Tooling buffer (Meta Ads Library, Canva Pro month, Buffer/Later) | $50 | $50 | $50 | Cancellable after campaign |
| **Contingency** (10–15%) | **$100** | **$50** | **$200** | Reactive opportunity or overrun cushion |
| **Total** | **$1,500** | **$950** | **$2,200** | |

### Production vs. distribution split
- **Distribution (paid media)**: ~80% — appropriate for a small-budget direct-response campaign where you need media to *prove* the creative.
- **Production**: ~10% — most produced in-house using Canva templates and phone video.
- **Tooling + buffer**: ~10%.

### Optimization rules during the campaign
- After W2, shift any creative with CPA > $15 → off; reallocate to winners.
- After W3, double down on the top channel by allocation (likely Meta).
- After W4, if email signups are on track but purchases lag → push more spend into retargeting + add a kit discount in W5.
- Never set-and-forget — review every Monday.

---

## 9. Risks and mitigations

### Risk 1 — Timeline crunch (HIGH)
Today is 2026-05-14. Launch is 2026-05-16 — **2 days**. Standard ad-pack production needs 2–3 days alone.

**Mitigation**: Treat W1 as a *soft launch* — only organic email + 1 retargeting ad (no new creative) go live on the 16th. Full ad rollout slips to W2 (May 23). Pivot the "launch date" in audience-facing copy to "lanzamiento oficial: lunes 25 de mayo" so we don't promise more than we can ship.

### Risk 2 — "Carga pública" objection (MEDIUM)
A material share of the target audience believes (incorrectly, for SNAP) that applying counts as public charge. This kills conversion silently if not addressed.

**Mitigation**: Bake the objection into ≥3 creative variants, the email sequence (dedicated email in W3), and a homepage FAQ block. Link to authoritative USCIS guidance via the existing `VerificationBadge` pattern.

### Risk 3 — Audience trust on payment (MEDIUM)
Spanish-speaking first-time online buyers may abandon Square checkout if the price feels arbitrary or the trust signals are thin.

**Mitigation**: Add testimonials to `/snap/result/`, ensure the existing `result-trust-action.ts` line is clear, and consider a 7-day money-back guarantee in copy (Fase 1 module already supports this — verify in `docs/modulo-12-monetizacion-fase1.md`).

### Risk 4 — Channel underperformance on TikTok (LOW)
TikTok Spark Ads sometimes lag for this demo if creative doesn't match native style.

**Mitigation**: Spark Ads only get budget *after* an organic video clears 5k views. If no organic hits, reallocate that $150 to Meta in W4.

### Risk 5 — Compliance drift (LOW but serious)
The site is explicitly **"no asesoría legal ni gubernamental"** (README). Ad copy or social claims that imply guaranteed approval or government affiliation would be a legal exposure.

**Mitigation**: Every creative reviewed against `lib/legal-texts.ts` language. No "guaranteed", no government seals, no impersonation of agency branding. Include the disclaimer footnote in long-form content.

---

## 10. Next steps (next 48 hours)

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Confirm objective/focus/geography defaults are acceptable — or re-plan | Vilo | Today (May 14) |
| 2 | Set up Meta Pixel events for `cta_click`, `result_view`, Square purchase | Vilo (or me to draft) | May 15 |
| 3 | Create Mailchimp segment `snap_2026q2` + tag flow | Vilo | May 15 |
| 4 | Update VerificationBadge dates on `/snap/` if any are stale | Vilo | May 15 |
| 5 | Draft email #1 (warm-list broadcast) | Me on request | May 15 |
| 6 | Soft-launch goes live | Vilo | May 16 |
| 7 | Produce Meta ad pack #1 (4 creatives) | Vilo + me on copy | May 19 |
| 8 | Full paid rollout | Vilo | May 23 |

### Stakeholder approvals needed
- Final pricing for Kit SNAP in the campaign window (confirm `data/checkout-prices.json`).
- Legal-text review on any new claim phrasing (use `lib/legal-texts.ts` as the source of truth).
- Decision on offering a 7-day money-back guarantee in copy (yes/no).

### Key decision points
- **End of W2**: Is CPA tracking under $15? If no → kill underperforming creative aggressively.
- **End of W3**: Is the email→purchase rate ≥ 4%? If no → adjust the nurture sequence emphasis (more objection-handling, less storytelling).
- **End of W4**: Is total spend on track for floor / mid / stretch? Decide whether to push budget up or pull back.

---

## Appendix A — Sample audience copy (Spanish, ready to ship)

### Email #1 — Warm-list broadcast (W1, ~May 16)
**Asunto**: En junio se acaban las comidas escolares — aquí está tu plan
**Preheader**: 3 minutos. En español. Sin filas.

> Hola,
>
> Si tienes hijos en la escuela, ya sabes lo que viene: en pocas semanas se termina el ciclo y con él se acaban los desayunos y almuerzos que ayudan a tu familia.
>
> SNAP (antes "estampillas") puede cubrir parte de eso — y muchas familias hispanas califican sin saberlo. Pero las páginas oficiales están en inglés mal traducido, las filas en las oficinas son largas, y entre los rumores de la familia ("eso es carga pública") es fácil quedarse sin hacer nada.
>
> Por eso creamos el **Kit SNAP**: un plan en español, paso a paso, con la lista exacta de documentos que necesitas en tu estado, plantillas listas para imprimir, y respuestas claras a las dudas que más se repiten — incluida la de carga pública.
>
> Empieza con el cuestionario gratis (3 minutos, sin compartir tus datos con el gobierno):
>
> **[Sí, quiero ver si califico →](https://hazloasiya.com/snap/)**
>
> Un abrazo,
> El equipo de HazloAsíYa
>
> *No somos abogados ni representamos al gobierno. Te ayudamos a entender y prepararte.*

### Meta ad — Reel #1 (hook test, W2)
**Hook (0–3s, on-screen text + voice)**:
"¿Sabías que tu vecina ya recibe SNAP y tú no? No es por suerte — es por información."

**Mid (3–15s)**:
"En 3 minutos te decimos si calificas, sin compartir tus datos con el gobierno. Y si calificas, te damos el plan exacto: qué papeles, dónde aplicar, en español."

**CTA (15s)**:
"Hazlo así ya — el enlace está abajo."

### WhatsApp 1-pager headline (W3)
> **Tu plan SNAP en una hoja** 🌽
> Lo que necesitas. En español. Sin filas.
> Reenvíaselo a alguien que lo necesite.

---

## Appendix B — Tracking conventions

To keep GA4 + Square + Mailchimp clean:

| Channel | UTM source | UTM medium | UTM campaign |
|---|---|---|---|
| Meta organic | `facebook` / `instagram` | `social` | `snap_verano2026` |
| Meta paid | `facebook` / `instagram` | `paid` | `snap_verano2026` + `_paid_w{N}` |
| TikTok organic | `tiktok` | `social` | `snap_verano2026` |
| TikTok Spark | `tiktok` | `paid` | `snap_verano2026_spark` |
| Email | `mailchimp` | `email` | `snap_verano2026_e{1..6}` |
| Blog → CTA | `blog` | `organic` | `snap_verano2026` |
| WhatsApp PDF | `whatsapp` | `social` | `snap_verano2026_pdf` |
| YouTube partner | `youtube` | `partner` | `snap_verano2026_yt{name}` |

Add a custom GA4 dimension `funnel_campaign` and set it to the campaign name on every event for clean filtering.

---

*Document owner: Vilo · Generated 2026-05-14 · Status: draft pending objective confirmation*
