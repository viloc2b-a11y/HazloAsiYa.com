'use client'

import type { PdfFormId } from '@/types/pdf'

type Props = {
  formId: PdfFormId
  stepIndex: number
  formData: Record<string, unknown>
  onChange: (fieldId: string, value: unknown) => void
  errors: Record<string, string>
  onAskAssist: (fieldId: string) => void
}

function T(p: {
  id: string
  label: string
  value: unknown
  onChange: Props['onChange']
  err?: string
  type?: string
  ph?: string
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-stone-600">{p.label}</span>
      <input
        type={p.type || 'text'}
        className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 ${
          p.err ? 'border-red-400' : 'border-stone-200'
        }`}
        value={String(p.value ?? '')}
        onChange={e => p.onChange(p.id, e.target.value)}
        placeholder={p.ph}
      />
      {p.err && <span className="text-xs text-red-600 mt-0.5 block">{p.err}</span>}
    </label>
  )
}

function C(p: { id: string; label: string; checked: boolean; onChange: Props['onChange'] }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={p.checked} onChange={e => p.onChange(p.id, e.target.checked)} className="rounded border-stone-300" />
      <span className="text-sm text-stone-800">{p.label}</span>
    </label>
  )
}

function R(p: { name: string; value: string; label: string; current: unknown; onChange: Props['onChange'] }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name={p.name}
        checked={String(p.current) === p.value}
        onChange={() => p.onChange(p.name, p.value)}
        className="border-stone-300"
      />
      <span className="text-sm text-stone-800">{p.label}</span>
    </label>
  )
}

function AssistBtn({ onAskAssist, id }: { onAskAssist: Props['onAskAssist']; id: string }) {
  return (
    <button type="button" onClick={() => onAskAssist(id)} className="text-xs text-teal-700 font-semibold hover:underline">
      ¿Ayuda?
    </button>
  )
}

export default function PdfFormSteps({ formId, stepIndex, formData, onChange, errors, onAskAssist }: Props) {
  const e = (id: string) => errors[id]
  const v = (id: string) => formData[id]

  if (formId === 'i821d') {
    if (stepIndex === 0)
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-4 space-y-3">
            <div className="text-xs font-bold text-stone-700">Tipo de solicitud (Formulario I-821D)</div>
            <p className="text-xs text-stone-600">
              Esto marca el PDF oficial como solicitud inicial o renovación. Confirma con tus documentos o un representante acreditado.
            </p>
            <div className="space-y-2">
              <R
                name="dacaRequestType"
                value="initial"
                label="Primera solicitud DACA (initial)"
                current={v('dacaRequestType')}
                onChange={onChange}
              />
              <R
                name="dacaRequestType"
                value="renewal"
                label="Renovación DACA"
                current={v('dacaRequestType')}
                onChange={onChange}
              />
            </div>
            {e('dacaRequestType') && <p className="text-xs text-red-600">Selecciona una opción.</p>}
          </div>
          <div className="flex justify-end">
            <AssistBtn onAskAssist={onAskAssist} id="nombre" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <T id="lastName" label="Apellido" value={v('lastName')} onChange={onChange} err={e('lastName')} />
            <T id="firstName" label="Nombre" value={v('firstName')} onChange={onChange} err={e('firstName')} />
            <T id="middleName" label="Segundo nombre (opcional)" value={v('middleName')} onChange={onChange} />
            <T id="dob" label="Fecha de nacimiento (mm/dd/aaaa)" value={v('dob')} onChange={onChange} err={e('dob')} />
            <T id="countryBirth" label="País de nacimiento" value={v('countryBirth')} onChange={onChange} err={e('countryBirth')} />
            <T id="countryCitizenship" label="País de ciudadanía" value={v('countryCitizenship')} onChange={onChange} err={e('countryCitizenship')} />
            <T id="aNumber" label="Número A (si tienes)" value={v('aNumber')} onChange={onChange} ph="A123456789" />
            <T id="uscisAccount" label="Cuenta en línea USCIS (si tienes)" value={v('uscisAccount')} onChange={onChange} />
          </div>
        </div>
      )
    if (stepIndex === 1)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="lastArrival" label="Fecha de última entrada a EE.UU." value={v('lastArrival')} onChange={onChange} err={e('lastArrival')} />
          <T id="i94" label="Número I-94 (si aplica)" value={v('i94')} onChange={onChange} />
          <T id="passportNumber" label="Pasaporte — número" value={v('passportNumber')} onChange={onChange} />
          <T id="passportCountry" label="Pasaporte — país emisor" value={v('passportCountry')} onChange={onChange} />
          <T id="passportExpiry" label="Pasaporte — vencimiento" value={v('passportExpiry')} onChange={onChange} />
        </div>
      )
    if (stepIndex === 2)
      return (
        <div className="grid gap-3">
          <T id="streetAddr" label="Calle y número" value={v('streetAddr')} onChange={onChange} err={e('streetAddr')} />
          <div className="grid sm:grid-cols-3 gap-3">
            <T id="city" label="Ciudad" value={v('city')} onChange={onChange} err={e('city')} />
            <T id="zip" label="ZIP" value={v('zip')} onChange={onChange} err={e('zip')} />
          </div>
        </div>
      )
    if (stepIndex === 3)
      return (
        <div className="space-y-3">
          <T id="firstEntry" label="Primera fecha que entraste a EE.UU." value={v('firstEntry')} onChange={onChange} err={e('firstEntry')} />
          <p className="text-xs text-stone-600">El PDF incluye la casilla de residencia continua desde el 15/06/2007 según corresponda a tu caso.</p>
        </div>
      )
    if (stepIndex === 4)
      return (
        <div className="space-y-2">
          <C id="inSchool" label="Actualmente en escuela" checked={v('inSchool') === 'yes'} onChange={(id, x) => onChange(id, x ? 'yes' : 'no')} />
          <C id="graduated" label="Graduado de prepa o GED/HiSET" checked={v('graduated') === 'yes'} onChange={(id, x) => onChange(id, x ? 'yes' : 'no')} />
          <C id="employed" label="Empleado o militar" checked={v('employed') === 'yes'} onChange={(id, x) => onChange(id, x ? 'yes' : 'no')} />
        </div>
      )
    return (
      <p className="text-sm text-stone-600">
        Revisa tus respuestas. Al generar el PDF verás el aviso legal. Firma a mano donde indique el formulario oficial.
      </p>
    )
  }

  if (formId === 'i765') {
    if (stepIndex === 0)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="lastName" label="Apellido" value={v('lastName')} onChange={onChange} err={e('lastName')} />
          <T id="firstName" label="Nombre" value={v('firstName')} onChange={onChange} err={e('firstName')} />
          <T id="middleName" label="Segundo nombre" value={v('middleName')} onChange={onChange} />
          <T id="dob" label="Fecha de nacimiento" value={v('dob')} onChange={onChange} err={e('dob')} />
          <T id="countryBirth" label="País de nacimiento" value={v('countryBirth')} onChange={onChange} err={e('countryBirth')} />
          <T id="aNumber" label="Número A (si aplica)" value={v('aNumber')} onChange={onChange} />
          <T id="uscisAccount" label="Cuenta USCIS en línea" value={v('uscisAccount')} onChange={onChange} />
          <T id="ssn" label="SSN (si tienes)" value={v('ssn')} onChange={onChange} />
        </div>
      )
    if (stepIndex === 1)
      return (
        <div className="space-y-2">
          <T
            id="eadCategory"
            label="Categoría de elegibilidad (ej. (c)(33) DACA — confirma en las instrucciones USCIS)"
            value={v('eadCategory')}
            onChange={onChange}
            err={e('eadCategory')}
          />
        </div>
      )
    if (stepIndex === 2)
      return (
        <div className="grid gap-3">
          <T id="streetAddr" label="Dirección" value={v('streetAddr')} onChange={onChange} err={e('streetAddr')} />
          <div className="grid sm:grid-cols-3 gap-3">
            <T id="city" label="Ciudad" value={v('city')} onChange={onChange} err={e('city')} />
            <T id="state" label="Estado" value={v('state')} onChange={onChange} ph="TX" err={e('state')} />
            <T id="zip" label="ZIP" value={v('zip')} onChange={onChange} err={e('zip')} />
          </div>
        </div>
      )
    if (stepIndex === 3)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="priorEmployer" label="Empleador anterior (opcional)" value={v('priorEmployer')} onChange={onChange} />
          <T id="jobTitle" label="Puesto (opcional)" value={v('jobTitle')} onChange={onChange} />
        </div>
      )
    return (
      <p className="text-sm text-stone-600">Revisa y genera el PDF. Este borrador no sustituye asesoría legal.</p>
    )
  }

  if (formId === 'w7') {
    if (stepIndex === 0)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="firstName" label="Nombre" value={v('firstName')} onChange={onChange} err={e('firstName')} />
          <T id="middleName" label="Segundo nombre" value={v('middleName')} onChange={onChange} />
          <T id="lastName" label="Apellidos" value={v('lastName')} onChange={onChange} err={e('lastName')} />
          <T id="dob" label="Fecha de nacimiento" value={v('dob')} onChange={onChange} err={e('dob')} />
          <T id="countryBirth" label="País de nacimiento" value={v('countryBirth')} onChange={onChange} err={e('countryBirth')} />
          <T id="countryCitizenship" label="País de ciudadanía" value={v('countryCitizenship')} onChange={onChange} err={e('countryCitizenship')} />
          <T id="nameAtBirth" label="Nombre al nacimiento (si es distinto)" value={v('nameAtBirth')} onChange={onChange} />
        </div>
      )
    if (stepIndex === 1)
      return (
        <div className="space-y-2">
          <T
            id="w7Reason"
            label="Razón para el W-7 (resume según instrucciones IRS: impuestos, dependiente, etc.)"
            value={v('w7Reason')}
            onChange={onChange}
            err={e('w7Reason')}
          />
        </div>
      )
    if (stepIndex === 2)
      return (
        <div className="space-y-4">
          <div className="grid gap-3">
            <T id="streetAddr" label="Dirección postal en EE.UU." value={v('streetAddr')} onChange={onChange} err={e('streetAddr')} />
            <div className="grid sm:grid-cols-3 gap-3">
              <T id="city" label="Ciudad" value={v('city')} onChange={onChange} err={e('city')} />
              <T id="state" label="Estado" value={v('state')} onChange={onChange} err={e('state')} />
              <T id="zip" label="ZIP" value={v('zip')} onChange={onChange} err={e('zip')} />
            </div>
            <T id="foreignAddress" label="Domicilio en el extranjero (si no tienes dirección en EE.UU.)" value={v('foreignAddress')} onChange={onChange} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <T id="foreignTaxId" label="Identificación fiscal extranjera (si aplica)" value={v('foreignTaxId')} onChange={onChange} />
            <T id="visaInfo" label="Tipo/número de visa US (si aplica)" value={v('visaInfo')} onChange={onChange} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <T id="idDocType" label="Documento de identidad — tipo (ej. pasaporte)" value={v('idDocType')} onChange={onChange} err={e('idDocType')} />
            <T id="idDocNumber" label="Documento — número" value={v('idDocNumber')} onChange={onChange} err={e('idDocNumber')} />
            <T id="idDocCountry" label="Documento — país emisor" value={v('idDocCountry')} onChange={onChange} err={e('idDocCountry')} />
          </div>
        </div>
      )
    return <p className="text-sm text-stone-600">Revisa tus datos antes de descargar el PDF educativo.</p>
  }

  if (formId === 'h1010') {
    if (stepIndex === 0)
      return (
        <div className="space-y-3">
          <p className="text-xs text-stone-600">Selecciona al menos un beneficio.</p>
          {e('benefits') && <p className="text-xs text-red-600">Marca al menos una opción.</p>}
          <C id="wantSNAP" label="SNAP (cupones de comida)" checked={!!v('wantSNAP')} onChange={onChange} />
          <C id="wantMedicaid" label="Medicaid" checked={!!v('wantMedicaid')} onChange={onChange} />
          <C id="wantCHIP" label="CHIP" checked={!!v('wantCHIP')} onChange={onChange} />
          <C id="wantTANF" label="TANF" checked={!!v('wantTANF')} onChange={onChange} />
          <R name="emergency" value="yes" label="Solicito procesamiento expedited (emergencia)" current={v('emergency')} onChange={onChange} />
          <R name="emergency" value="no" label="No aplica emergencia" current={v('emergency')} onChange={onChange} />
        </div>
      )
    if (stepIndex === 1)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="lastName" label="Apellido" value={v('lastName')} onChange={onChange} err={e('lastName')} />
          <T id="firstName" label="Nombre" value={v('firstName')} onChange={onChange} err={e('firstName')} />
          <T id="middleName" label="Segundo nombre" value={v('middleName')} onChange={onChange} />
          <T id="dob" label="Fecha de nacimiento" value={v('dob')} onChange={onChange} err={e('dob')} />
          <T id="ssn" label="SSN (si tienes)" value={v('ssn')} onChange={onChange} />
          <T id="gender" label="Sexo registrado" value={v('gender')} onChange={onChange} />
          <T id="phone" label="Teléfono" value={v('phone')} onChange={onChange} err={e('phone')} type="tel" />
          <T id="email" label="Correo" value={v('email')} onChange={onChange} type="email" />
        </div>
      )
    if (stepIndex === 2)
      return (
        <div className="grid gap-3">
          <T id="streetAddr" label="Dirección" value={v('streetAddr')} onChange={onChange} err={e('streetAddr')} />
          <div className="grid sm:grid-cols-3 gap-3">
            <T id="city" label="Ciudad" value={v('city')} onChange={onChange} err={e('city')} />
            <T id="county" label="Condado" value={v('county')} onChange={onChange} err={e('county')} />
            <T id="zip" label="ZIP" value={v('zip')} onChange={onChange} err={e('zip')} />
          </div>
        </div>
      )
    if (stepIndex === 3)
      return (
        <div className="space-y-3">
          <p className="text-xs text-stone-600">Agrega otras personas del hogar (opcional). Se reflejarán en el PDF.</p>
          <HouseholdMembersEditor value={v('members')} onChange={onChange} />
        </div>
      )
    if (stepIndex === 4)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="householdSize" label="Tamaño del hogar (número)" value={v('householdSize')} onChange={onChange} err={e('householdSize')} />
          <R name="hasEmployment" value="yes" label="Hay empleo en el hogar" current={v('hasEmployment')} onChange={onChange} />
          <R name="hasEmployment" value="no" label="Sin empleo reportado" current={v('hasEmployment')} onChange={onChange} />
          <T id="employmentIncome" label="Ingreso bruto mensual del empleo" value={v('employmentIncome')} onChange={onChange} ph="$" />
          <T id="rent" label="Renta / hipoteca mensual" value={v('rent')} onChange={onChange} ph="$" />
          <T id="utilities" label="Servicios (luz, gas, etc.)" value={v('utilities')} onChange={onChange} ph="$" />
          <T id="medical" label="Gastos médicos" value={v('medical')} onChange={onChange} ph="$" />
          <T id="childcare" label="Cuidado de niños" value={v('childcare')} onChange={onChange} ph="$" />
        </div>
      )
    return <p className="text-sm text-stone-600">Confirma la información antes de generar el PDF.</p>
  }

  if (formId === 'w4') {
    if (stepIndex === 0)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="firstName" label="Nombre y inicial del medio" value={v('firstName')} onChange={onChange} err={e('firstName')} />
          <T id="lastName" label="Apellido" value={v('lastName')} onChange={onChange} err={e('lastName')} />
          <T id="ssn" label="SSN" value={v('ssn')} onChange={onChange} err={e('ssn')} />
          <T id="address" label="Dirección completa" value={v('address')} onChange={onChange} err={e('address')} />
        </div>
      )
    if (stepIndex === 1)
      return (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-bold text-stone-600 mb-2">Estado civil para efectos del W-4</div>
            <div className="space-y-2">
              <R name="filingStatus" value="single" label="Soltero / casado presentando por separado" current={v('filingStatus')} onChange={onChange} />
              <R name="filingStatus" value="married" label="Casado que presenta conjunto" current={v('filingStatus')} onChange={onChange} />
              <R name="filingStatus" value="hoh" label="Cabeza de familia" current={v('filingStatus')} onChange={onChange} />
            </div>
            {e('filingStatus') && <p className="text-xs text-red-600 mt-1">Selecciona una opción.</p>}
          </div>
          <div>
            <div className="text-xs font-bold text-stone-600 mb-2">Múltiples empleos</div>
            <R name="multiJob" value="checkbox" label="Solo 2 empleos, pagos similares (casilla)" current={v('multiJob')} onChange={onChange} />
            <R name="multiJob" value="worksheet" label="Usé la hoja de trabajo" current={v('multiJob')} onChange={onChange} />
            <R name="multiJob" value="no" label="No aplica — un solo empleo" current={v('multiJob')} onChange={onChange} />
            {e('multiJob') && <p className="text-xs text-red-600 mt-1">Selecciona una opción.</p>}
          </div>
        </div>
      )
    if (stepIndex === 2)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="childrenUnder17" label="Hijos calificados menores de 17" value={v('childrenUnder17')} onChange={onChange} err={e('childrenUnder17')} ph="0" />
          <T id="otherDependents" label="Otros dependientes" value={v('otherDependents')} onChange={onChange} err={e('otherDependents')} ph="0" />
          <T id="otherIncome" label="4(a) Otros ingresos" value={v('otherIncome')} onChange={onChange} ph="$0" />
          <T id="deductions" label="4(b) Deducciones" value={v('deductions')} onChange={onChange} ph="$0" />
          <T id="extraWithholding" label="4(c) Retención adicional" value={v('extraWithholding')} onChange={onChange} ph="$0" />
          <div className="sm:col-span-2 space-y-2">
            <R name="exempt" value="yes" label="Exento (EXEMPT) — solo si aplica según instrucciones" current={v('exempt')} onChange={onChange} />
            <R name="exempt" value="no" label="No exento" current={v('exempt')} onChange={onChange} />
          </div>
        </div>
      )
    return <p className="text-sm text-stone-600">Entrega el W-4 a tu empleador, no al IRS.</p>
  }

  if (formId === 'i9') {
    if (stepIndex === 0)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="lastName" label="Apellido" value={v('lastName')} onChange={onChange} err={e('lastName')} />
          <T id="firstName" label="Nombre" value={v('firstName')} onChange={onChange} err={e('firstName')} />
          <T id="middleName" label="Inicial del segundo nombre" value={v('middleName')} onChange={onChange} />
          <T id="otherLastName" label="Otros apellidos usados" value={v('otherLastName')} onChange={onChange} />
          <T id="streetAddr" label="Dirección" value={v('streetAddr')} onChange={onChange} err={e('streetAddr')} />
          <T id="city" label="Ciudad" value={v('city')} onChange={onChange} err={e('city')} />
          <T id="stateZip" label="Estado y ZIP" value={v('stateZip')} onChange={onChange} err={e('stateZip')} ph="TX 77001" />
          <T id="dob" label="Fecha de nacimiento" value={v('dob')} onChange={onChange} err={e('dob')} />
          <T id="ssn" label="SSN" value={v('ssn')} onChange={onChange} />
          <T id="email" label="Correo" value={v('email')} onChange={onChange} type="email" />
          <T id="phone" label="Teléfono" value={v('phone')} onChange={onChange} type="tel" />
        </div>
      )
    if (stepIndex === 1)
      return (
        <div className="space-y-3">
          <div className="text-xs font-bold text-stone-600">Estatus (marca uno)</div>
          <R name="workStatus" value="citizen" label="Ciudadano de EE.UU." current={v('workStatus')} onChange={onChange} />
          <R name="workStatus" value="national" label="Nacional no ciudadano" current={v('workStatus')} onChange={onChange} />
          <R name="workStatus" value="pr" label="Residente permanente" current={v('workStatus')} onChange={onChange} />
          <R name="workStatus" value="alien" label="Extranjero autorizado para trabajar" current={v('workStatus')} onChange={onChange} />
          {e('workStatus') && <p className="text-xs text-red-600">Selecciona tu estatus.</p>}
          {String(v('workStatus')) === 'pr' && (
            <T id="aNumber" label="Número A / USCIS" value={v('aNumber')} onChange={onChange} />
          )}
          {String(v('workStatus')) === 'alien' && (
            <div className="grid sm:grid-cols-2 gap-3">
              <T id="authExpiry" label="Vencimiento de autorización" value={v('authExpiry')} onChange={onChange} />
              <T id="i94" label="I-94" value={v('i94')} onChange={onChange} />
              <T id="uscisNum" label="USCIS / A-Number" value={v('uscisNum')} onChange={onChange} />
              <T id="foreignPassport" label="Pasaporte extranjero + país" value={v('foreignPassport')} onChange={onChange} />
            </div>
          )}
        </div>
      )
    if (stepIndex === 2)
      return (
        <div className="space-y-2 text-sm text-stone-700">
          <p>Lista A o Lista B+C: anota qué llevarás al empleador. El PDF marca la sección 2 para el empleador.</p>
          <T id="docPlan" label="Notas (documentos que presentarás)" value={v('docPlan')} onChange={onChange} />
        </div>
      )
    return <p className="text-sm text-stone-600">Revisa la Sección 1; el empleador completa la Sección 2.</p>
  }

  if (formId === 'dl14a') {
    if (stepIndex === 0)
      return (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-bold text-stone-600 mb-2">Tipo</div>
            <R name="dt" value="dl" label="Licencia de conducir" current={v('dt')} onChange={onChange} />
            <R name="dt" value="id" label="Tarjeta de identificación" current={v('dt')} onChange={onChange} />
            {e('dt') && <p className="text-xs text-red-600">Selecciona una opción.</p>}
          </div>
          <div>
            <div className="text-xs font-bold text-stone-600 mb-2">Trámite</div>
            {(['orig', 'ren', 'rep', 'chg'] as const).map(k => (
              <R
                key={k}
                name="at"
                value={k}
                label={{ orig: 'Original', ren: 'Renovación', rep: 'Reposición', chg: 'Cambio de datos/dirección' }[k]}
                current={v('at')}
                onChange={onChange}
              />
            ))}
            {e('at') && <p className="text-xs text-red-600">Selecciona el tipo de trámite.</p>}
          </div>
        </div>
      )
    if (stepIndex === 1)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="ln" label="Apellido" value={v('ln')} onChange={onChange} err={e('ln')} />
          <T id="fn" label="Nombre" value={v('fn')} onChange={onChange} err={e('fn')} />
          <T id="mn" label="Segundo nombre" value={v('mn')} onChange={onChange} />
          <T id="sfx" label="Sufijo" value={v('sfx')} onChange={onChange} />
          <T id="maiden" label="Apellido de soltera (si aplica)" value={v('maiden')} onChange={onChange} />
          <T id="ssn" label="SSN" value={v('ssn')} onChange={onChange} err={e('ssn')} />
          <T id="dob" label="Fecha de nacimiento" value={v('dob')} onChange={onChange} err={e('dob')} />
          <div>
            <div className="text-xs font-bold text-stone-600 mb-2">Sexo</div>
            <R name="sex" value="M" label="M" current={v('sex')} onChange={onChange} />
            <R name="sex" value="F" label="F" current={v('sex')} onChange={onChange} />
            {e('sex') && <p className="text-xs text-red-600">Selecciona.</p>}
          </div>
          <T id="hft" label="Estatura — pies" value={v('hft')} onChange={onChange} err={e('hft')} />
          <T id="hin" label="Estatura — pulgadas" value={v('hin')} onChange={onChange} err={e('hin')} />
          <T id="wt" label="Peso (lb)" value={v('wt')} onChange={onChange} err={e('wt')} />
        </div>
      )
    if (stepIndex === 2)
      return (
        <div className="grid gap-3">
          <T id="str" label="Dirección en Texas" value={v('str')} onChange={onChange} err={e('str')} />
          <div className="grid sm:grid-cols-3 gap-3">
            <T id="cty" label="Ciudad" value={v('cty')} onChange={onChange} err={e('cty')} />
            <T id="cnty" label="Condado" value={v('cnty')} onChange={onChange} err={e('cnty')} />
            <T id="zip" label="ZIP" value={v('zip')} onChange={onChange} err={e('zip')} />
          </div>
        </div>
      )
    if (stepIndex === 3)
      return (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-bold text-stone-600 mb-2">Ciudadanía</div>
            <R name="cit" value="y" label="Ciudadano EE.UU." current={v('cit')} onChange={onChange} />
            <R name="cit" value="n" label="No ciudadano con presencia legal" current={v('cit')} onChange={onChange} />
            {e('cit') && <p className="text-xs text-red-600">Selecciona.</p>}
          </div>
          <div>
            <div className="text-xs font-bold text-stone-600 mb-2">Condición médica (conductores)</div>
            <R name="med" value="n" label="Sin condición que afecte manejar" current={v('med')} onChange={onChange} />
            <R name="med" value="y" label="Sí — revisar con DPS" current={v('med')} onChange={onChange} />
            {e('med') && <p className="text-xs text-red-600">Selecciona.</p>}
          </div>
          <div className="text-xs font-bold text-stone-600">Documentos que llevarás (marca los que aplican)</div>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <C id="dp" label="Pasaporte US" checked={!!v('dp')} onChange={onChange} />
            <C id="db_" label="Acta de nacimiento certificada US" checked={!!v('db_')} onChange={onChange} />
            <C id="dgc" label="Green Card (I-551)" checked={!!v('dgc')} onChange={onChange} />
            <C id="dead" label="EAD" checked={!!v('dead')} onChange={onChange} />
            <C id="di94" label="Pasaporte extranjero + I-94 + autorización" checked={!!v('di94')} onChange={onChange} />
            <C id="dss" label="Tarjeta del Seguro Social" checked={!!v('dss')} onChange={onChange} />
            <C id="dw2" label="W-2 / 1099 con SSN" checked={!!v('dw2')} onChange={onChange} />
            <C id="dut" label="Recibo de servicios (domicilio TX)" checked={!!v('dut')} onChange={onChange} />
            <C id="dls" label="Contrato de renta / hipoteca" checked={!!v('dls')} onChange={onChange} />
            <C id="dbk" label="Estado de cuenta bancario" checked={!!v('dbk')} onChange={onChange} />
          </div>
        </div>
      )
    return <p className="text-sm text-stone-600">Cita en txdpsscheduler.com. Lleva originales.</p>
  }

  if (formId === 'matricula') {
    if (stepIndex === 0)
      return (
        <div className="space-y-3">
          <div>
            <div className="text-xs font-bold text-stone-600 mb-2">Consulado</div>
            <R name="cons" value="hou" label="Houston" current={v('cons')} onChange={onChange} />
            <R name="cons" value="aus" label="Austin / Round Rock" current={v('cons')} onChange={onChange} />
            <R name="cons" value="dal" label="Dallas" current={v('cons')} onChange={onChange} />
            {e('cons') && <p className="text-xs text-red-600">Selecciona consulado.</p>}
          </div>
          <div>
            <div className="text-xs font-bold text-stone-600 mb-2">Tipo de trámite</div>
            <R name="mt" value="nueva" label="Nueva" current={v('mt')} onChange={onChange} />
            <R name="mt" value="ren" label="Renovación" current={v('mt')} onChange={onChange} />
            <R name="mt" value="rep" label="Reposición" current={v('mt')} onChange={onChange} />
            {e('mt') && <p className="text-xs text-red-600">Selecciona el trámite.</p>}
          </div>
        </div>
      )
    if (stepIndex === 1)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="fn" label="Nombre(s)" value={v('fn')} onChange={onChange} err={e('fn')} />
          <T id="mn" label="Segundo nombre" value={v('mn')} onChange={onChange} />
          <T id="ln" label="Apellido paterno" value={v('ln')} onChange={onChange} err={e('ln')} />
          <T id="ln2" label="Apellido materno" value={v('ln2')} onChange={onChange} />
          <T id="dob" label="Fecha de nacimiento" value={v('dob')} onChange={onChange} err={e('dob')} />
          <T id="bp" label="Lugar de nacimiento" value={v('bp')} onChange={onChange} err={e('bp')} />
          <T id="curp" label="CURP" value={v('curp')} onChange={onChange} err={e('curp')} />
        </div>
      )
    if (stepIndex === 2)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="str" label="Dirección en EE.UU." value={v('str')} onChange={onChange} err={e('str')} />
          <T id="cty" label="Ciudad" value={v('cty')} onChange={onChange} err={e('cty')} />
          <T id="st" label="Estado" value={v('st')} onChange={onChange} err={e('st')} ph="TX" />
          <T id="zip" label="ZIP" value={v('zip')} onChange={onChange} err={e('zip')} />
          <T id="phone" label="Teléfono" value={v('phone')} onChange={onChange} err={e('phone')} type="tel" />
          <T id="email" label="Correo" value={v('email')} onChange={onChange} type="email" />
        </div>
      )
    if (stepIndex === 3)
      return (
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <C id="m_acta" label="Acta de nacimiento MX" checked={!!v('m_acta')} onChange={onChange} />
          <C id="m_pas" label="Pasaporte MX" checked={!!v('m_pas')} onChange={onChange} />
          <C id="m_nat" label="Carta de naturalización" checked={!!v('m_nat')} onChange={onChange} />
          <C id="m_ine" label="INE/IFE" checked={!!v('m_ine')} onChange={onChange} />
          <C id="m_lic" label="Licencia" checked={!!v('m_lic')} onChange={onChange} />
          <C id="m_uti" label="Recibo de servicios" checked={!!v('m_uti')} onChange={onChange} />
          <C id="m_rent" label="Contrato de renta" checked={!!v('m_rent')} onChange={onChange} />
          <C id="m_bank" label="Estado de cuenta" checked={!!v('m_bank')} onChange={onChange} />
        </div>
      )
    return <p className="text-sm text-stone-600">Verifica requisitos en mexitel.sre.gob.mx.</p>
  }

  if (formId === 'escuela') {
    if (stepIndex === 0)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="sln" label="Apellido del estudiante" value={v('sln')} onChange={onChange} err={e('sln')} />
          <T id="sfn" label="Nombre del estudiante" value={v('sfn')} onChange={onChange} err={e('sfn')} />
          <T id="smn" label="Segundo nombre" value={v('smn')} onChange={onChange} />
          <T id="sdob" label="Fecha de nacimiento" value={v('sdob')} onChange={onChange} err={e('sdob')} />
          <T id="grd" label="Grado" value={v('grd')} onChange={onChange} err={e('grd')} ph="K, 1, 2…" />
          <T id="dist" label="Distrito escolar" value={v('dist')} onChange={onChange} err={e('dist')} ph="HISD, KISD…" />
          <T id="scob" label="País de nacimiento" value={v('scob')} onChange={onChange} err={e('scob')} />
          <div>
            <div className="text-xs font-bold text-stone-600 mb-2">Género</div>
            <R name="sg" value="F" label="F" current={v('sg')} onChange={onChange} />
            <R name="sg" value="M" label="M" current={v('sg')} onChange={onChange} />
            <R name="sg" value="X" label="X / otro" current={v('sg')} onChange={onChange} />
            {e('sg') && <p className="text-xs text-red-600">Selecciona.</p>}
          </div>
          <div>
            <div className="text-xs font-bold text-stone-600 mb-2">Idioma principal</div>
            <R name="slng" value="es" label="Español" current={v('slng')} onChange={onChange} />
            <R name="slng" value="en" label="Inglés" current={v('slng')} onChange={onChange} />
            <R name="slng" value="both" label="Bilingüe" current={v('slng')} onChange={onChange} />
            {e('slng') && <p className="text-xs text-red-600">Selecciona.</p>}
          </div>
        </div>
      )
    if (stepIndex === 1)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="fn" label="Nombre del padre/tutor" value={v('fn')} onChange={onChange} err={e('fn')} />
          <T id="ln" label="Apellido del padre/tutor" value={v('ln')} onChange={onChange} err={e('ln')} />
          <T id="rel" label="Relación con el estudiante" value={v('rel')} onChange={onChange} err={e('rel')} />
          <T id="phone" label="Celular" value={v('phone')} onChange={onChange} err={e('phone')} type="tel" />
          <T id="email" label="Correo" value={v('email')} onChange={onChange} type="email" />
        </div>
      )
    if (stepIndex === 2)
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <T id="str" label="Domicilio" value={v('str')} onChange={onChange} err={e('str')} />
          <T id="cty" label="Ciudad" value={v('cty')} onChange={onChange} err={e('cty')} />
          <T id="zip" label="ZIP" value={v('zip')} onChange={onChange} err={e('zip')} />
          <T id="en" label="Emergencia — nombre" value={v('en')} onChange={onChange} err={e('en')} />
          <T id="er" label="Emergencia — relación" value={v('er')} onChange={onChange} err={e('er')} />
          <T id="ep" label="Emergencia — teléfono" value={v('ep')} onChange={onChange} err={e('ep')} />
          <T id="allergy" label="Alergias" value={v('allergy')} onChange={onChange} />
          <T id="meds" label="Medicamentos" value={v('meds')} onChange={onChange} />
          <T id="doctor" label="Doctor" value={v('doctor')} onChange={onChange} />
          <div className="sm:col-span-2">
            <div className="text-xs font-bold text-stone-600 mb-2">Seguro médico</div>
            <R name="ins" value="none" label="Sin seguro" current={v('ins')} onChange={onChange} />
            <R name="ins" value="medicaid" label="Medicaid/CHIP" current={v('ins')} onChange={onChange} />
            <R name="ins" value="private" label="Privado" current={v('ins')} onChange={onChange} />
          </div>
        </div>
      )
    if (stepIndex === 3)
      return (
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <C id="sch_bc" label="Acta de nacimiento" checked={!!v('sch_bc')} onChange={onChange} />
          <C id="sch_vx" label="Cartilla de vacunas" checked={!!v('sch_vx')} onChange={onChange} />
          <C id="sch_addr" label="Comprobante de domicilio" checked={!!v('sch_addr')} onChange={onChange} />
          <C id="sch_id" label="ID del tutor" checked={!!v('sch_id')} onChange={onChange} />
          <C id="sch_rec" label="Expediente escolar previo" checked={!!v('sch_rec')} onChange={onChange} />
        </div>
      )
    return <p className="text-sm text-stone-600">Plyler v. Doe: derecho a educación pública en Texas.</p>
  }

  return <p className="text-sm text-stone-500">Formulario no disponible.</p>
}

function HouseholdMembersEditor({ value, onChange }: { value: unknown; onChange: Props['onChange'] }) {
  const members = Array.isArray(value) ? (value as { name: string; dob: string; rel: string }[]) : []
  const set = (next: typeof members) => onChange('members', next)

  return (
    <div className="space-y-3">
      {members.map((m, i) => (
        <div key={i} className="grid sm:grid-cols-3 gap-2 border border-stone-200 rounded-xl p-3">
          <input
            className="rounded-lg border border-stone-200 px-2 py-1 text-sm"
            placeholder="Nombre"
            value={m.name}
            onChange={e => {
              const next = [...members]
              next[i] = { ...next[i], name: e.target.value }
              set(next)
            }}
          />
          <input
            className="rounded-lg border border-stone-200 px-2 py-1 text-sm"
            placeholder="DOB"
            value={m.dob}
            onChange={e => {
              const next = [...members]
              next[i] = { ...next[i], dob: e.target.value }
              set(next)
            }}
          />
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border border-stone-200 px-2 py-1 text-sm"
              placeholder="Relación"
              value={m.rel}
              onChange={e => {
                const next = [...members]
                next[i] = { ...next[i], rel: e.target.value }
                set(next)
              }}
            />
            <button
              type="button"
              className="text-xs text-red-600 px-2"
              onClick={() => set(members.filter((_, j) => j !== i))}
            >
              Quitar
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="text-sm font-semibold text-teal-700"
        onClick={() => set([...members, { name: '', dob: '', rel: '' }])}
      >
        + Agregar persona
      </button>
    </div>
  )
}
