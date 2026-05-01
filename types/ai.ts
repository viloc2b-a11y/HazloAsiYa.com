/** Nivel de elegibilidad orientativo (no decisión oficial). */
export type EligibilityLevel = 'likely' | 'possible' | 'unlikely'

/** Salida JSON estándar de los system prompts (16 programas). */
export interface AIOutput {
  eligibility: EligibilityLevel
  summary: string
  missing_documents: string[]
  steps: string[]
  common_errors: string[]
  official_links: string[]
  disclaimer: string
}

export type QuestionnaireFieldType =
  | 'text'
  | 'number'
  | 'currency'
  | 'boolean'
  | 'enum'
  | 'multiselect'
  | 'date'

/** Metadatos de campos ideales por programa (referencia producto / futuro wizard). */
export interface QuestionnaireField {
  id: string
  label: string
  type: QuestionnaireFieldType
  options?: string[]
  hint?: string
  required: boolean
}

/** Formato consumido por la UI / PDF (mapeado desde `AIOutput`). */
export interface GeneratedResult {
  eligible: boolean
  headline: string
  subheadline: string
  haveItems: string[]
  missingItems: string[]
  steps: string[]
}
