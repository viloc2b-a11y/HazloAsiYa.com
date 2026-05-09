# Cómo agregar un nuevo estado a HazloAsíYa

Este documento describe el proceso completo para expandir HazloAsíYa a un nuevo estado (ej. Nueva York, Arizona, Illinois).

## El motor de reglas

El archivo `lib/state-rules.ts` es la **fuente única de verdad** para todos los datos estatales:
- Límites de ingreso por programa y tamaño de hogar
- Portales oficiales de aplicación
- Teléfonos de ayuda en español
- Formularios oficiales (IDs del PDF Hub)
- Instrucciones de entrega localizadas

## Pasos para agregar un nuevo estado

### 1. Agregar las reglas en `lib/state-rules.ts`

```typescript
const NEW_YORK: StateRules = {
  stateCode: 'NY',
  stateName: 'Nueva York',
  benefitsPortal: 'mybenefits.ny.gov',
  programs: {
    snap: {
      programName: 'SNAP',
      localName: 'SNAP (Food Stamps)',
      agency: 'OTDA (Office of Temporary and Disability Assistance)',
      applicationPortal: 'https://mybenefits.ny.gov',
      spanishHelpline: '1-800-342-3009',
      incomeLimits: [
        { householdSize: 1, grossMonthlyUsd: 1580 },
        // ... agregar más tamaños
      ],
      officialFormId: 'ldss2921', // ID del formulario en el PDF Hub (si existe)
      deliveryInstructions: 'Aplica en mybenefits.ny.gov o en tu oficina local del DSS.',
      stateNotes: [
        'Nueva York tiene reglas de elegibilidad más amplias que el estándar federal.',
      ],
    },
    // Agregar medicaid, wic, etc.
  },
}
```

### 2. Registrar el estado en el índice

```typescript
// Al final de lib/state-rules.ts
export const STATE_RULES: Record<string, StateRules> = {
  TX: TEXAS,
  CA: CALIFORNIA,
  FL: FLORIDA,
  NY: NEW_YORK, // ← Agregar aquí
}
```

### 3. Actualizar el cuestionario en `lib/ai-prompts.ts`

Agregar la opción en el campo `state_of_residence` de los funnels SNAP, Medicaid y WIC:

```typescript
{
  id: 'state_of_residence',
  label: '¿En qué estado vives?',
  type: 'select',
  options: [
    { value: 'TX', label: 'Texas' },
    { value: 'CA', label: 'California' },
    { value: 'FL', label: 'Florida' },
    { value: 'NY', label: 'Nueva York' }, // ← Agregar aquí
    { value: 'OTHER', label: 'Otro estado' },
  ],
}
```

### 4. Actualizar los prompts de IA en `lib/ai-prompts.ts`

El sistema ya usa `getStateRules()` automáticamente para los estados registrados. Solo necesitas verificar que el prompt del sistema incluya el nuevo estado en la sección de reglas estatales.

### 5. Crear las landing pages SEO

```bash
mkdir -p app/snap/new-york
mkdir -p app/medicaid/new-york
mkdir -p app/wic/new-york
```

Copiar la estructura de `app/snap/california/page.tsx` y adaptar los datos del nuevo estado.

### 6. Agregar el formulario oficial al PDF Hub (si existe)

Si el estado tiene un formulario PDF oficial rellenable:

1. Descargar el PDF oficial y colocarlo en `public/forms/`
2. Inspeccionar los campos AcroForm: `python3 scripts/inspect-pdf-fields.py public/forms/nuevo-formulario.pdf`
3. Crear el mapper en `lib/acroform/nuevo-mapper.ts`
4. Registrar en `lib/acroform/index.ts`, `types/pdf.ts`, `components/pdf/pdf-form-steps.tsx` y `lib/pdf-step-validate.ts`

### 7. Actualizar el sitemap

En `app/sitemap.ts`, agregar las nuevas rutas del estado.

---

## Estados con mayor potencial de expansión

| Estado | Población hispana | Búsquedas SNAP/mes | Prioridad |
|--------|------------------|-------------------|-----------|
| Nueva York | 3.8M | ~85K | 🔴 Alta |
| Illinois | 2.3M | ~52K | 🔴 Alta |
| Arizona | 2.2M | ~48K | 🟡 Media |
| Georgia | 1.0M | ~38K | 🟡 Media |
| Colorado | 1.1M | ~31K | 🟢 Baja |

---

## Notas importantes

- Los límites de ingreso se actualizan anualmente (octubre de cada año). Verificar en `aspe.hhs.gov/poverty-guidelines`.
- Los formularios oficiales pueden cambiar. Verificar la versión vigente antes de publicar.
- Siempre incluir el disclaimer `DISCLAIMER_FORMULARIO_OFICIAL` en las páginas de descarga.
