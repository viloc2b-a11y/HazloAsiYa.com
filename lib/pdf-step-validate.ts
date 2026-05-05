import type { PdfFormId } from '@/types/pdf'

function nonEmpty(v: unknown): boolean {
  return String(v ?? '').trim().length > 0
}

function anyTrue(data: Record<string, unknown>, keys: string[]): boolean {
  return keys.some(k => data[k] === true || data[k] === 'yes' || data[k] === 'on')
}

/** Validación por paso; el último paso suele ser revisión (sin requisitos). */
export function validatePdfStep(formId: PdfFormId, stepIndex: number, data: Record<string, unknown>): string[] {
  const miss: string[] = []
  const req = (keys: string[]) => {
    for (const k of keys) {
      if (!nonEmpty(data[k])) miss.push(k)
    }
  }

  switch (formId) {
    case 'i821d':
      if (stepIndex === 0)
        req(['dacaRequestType', 'lastName', 'firstName', 'dob', 'countryBirth', 'countryCitizenship'])
      if (stepIndex === 1) req(['lastArrival'])
      if (stepIndex === 2) req(['streetAddr', 'city', 'zip'])
      if (stepIndex === 3) req(['firstEntry'])
      return miss
    case 'i765':
      if (stepIndex === 0) req(['lastName', 'firstName', 'dob', 'countryBirth'])
      if (stepIndex === 1) req(['eadCategory'])
      if (stepIndex === 2) req(['streetAddr', 'city', 'zip'])
      return miss
    case 'w7':
      if (stepIndex === 0) req(['firstName', 'lastName', 'dob', 'countryBirth', 'countryCitizenship'])
      if (stepIndex === 1) req(['w7Reason'])
      if (stepIndex === 2) req(['streetAddr', 'city', 'state', 'zip', 'idDocType', 'idDocNumber', 'idDocCountry'])
      return miss
    case 'h1010':
      if (stepIndex === 0 && !anyTrue(data, ['wantSNAP', 'wantMedicaid', 'wantCHIP', 'wantTANF'])) {
        miss.push('benefits')
      }
      if (stepIndex === 1) req(['lastName', 'firstName', 'dob', 'phone'])
      if (stepIndex === 2) req(['streetAddr', 'city', 'county', 'zip'])
      if (stepIndex === 4) req(['householdSize'])
      return miss
    case 'w4':
      if (stepIndex === 0) req(['firstName', 'lastName', 'ssn', 'address'])
      if (stepIndex === 1) req(['filingStatus', 'multiJob'])
      if (stepIndex === 2) {
        if (!nonEmpty(data.childrenUnder17)) miss.push('childrenUnder17')
        if (!nonEmpty(data.otherDependents)) miss.push('otherDependents')
      }
      return miss
    case 'i9':
      if (stepIndex === 0) req(['lastName', 'firstName', 'streetAddr', 'city', 'stateZip', 'dob'])
      if (stepIndex === 1) req(['workStatus'])
      return miss
    case 'dl14a':
      if (stepIndex === 0) req(['dt', 'at'])
      if (stepIndex === 1) req(['ln', 'fn', 'dob', 'sex', 'hft', 'hin', 'wt', 'ssn'])
      if (stepIndex === 2) req(['str', 'cty', 'cnty', 'zip'])
      if (stepIndex === 3) req(['cit', 'med'])
      return miss
    case 'matricula':
      if (stepIndex === 0) req(['cons', 'mt'])
      if (stepIndex === 1) req(['fn', 'ln', 'dob', 'bp', 'curp'])
      if (stepIndex === 2) req(['str', 'cty', 'st', 'zip', 'phone'])
      return miss
    case 'escuela':
      if (stepIndex === 0) req(['sln', 'sfn', 'sdob', 'grd', 'dist', 'scob', 'sg', 'slng'])
      if (stepIndex === 1) req(['fn', 'ln', 'rel', 'phone'])
      if (stepIndex === 2) req(['str', 'cty', 'zip', 'en', 'ep'])
      return miss
    default:
      return miss
  }
}
