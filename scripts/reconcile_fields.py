#!/usr/bin/env python3
"""
HazloAsíYa — AcroField Reconciler (versión completa, 6 formularios)

Uso:
  # 1. Descargar PDFs
  curl -L https://www.irs.gov/pub/irs-pdf/fw4.pdf      -o public/forms/fw4.pdf
  curl -L https://www.irs.gov/pub/irs-pdf/fw7.pdf      -o public/forms/fw7.pdf
  curl -L https://www.uscis.gov/.../i-765.pdf          -o public/forms/i765.pdf
  curl -L https://www.uscis.gov/.../i-821d.pdf         -o public/forms/i821d.pdf
  curl -L https://www.uscis.gov/.../i-9-paper-version.pdf -o public/forms/i-9.pdf
  curl -L https://hhs.texas.gov/.../h1010.pdf          -o public/forms/h1010.pdf

  # 2. Inspeccionar
  python inspect_fields.py public/forms/fw4.pdf   > w4_actual.json
  python inspect_fields.py public/forms/fw7.pdf   > w7_actual.json
  python inspect_fields.py public/forms/i765.pdf  > i765_actual.json
  python inspect_fields.py public/forms/i821d.pdf > i821d_actual.json
  python inspect_fields.py public/forms/i-9.pdf   > i9_actual.json
  python inspect_fields.py public/forms/h1010.pdf > h1010_actual.json

  # 3. Reconciliar
  python reconcile_fields.py w4_actual.json    w4
  python reconcile_fields.py w7_actual.json    w7
  python reconcile_fields.py i765_actual.json  i765
  python reconcile_fields.py i821d_actual.json i821d
  python reconcile_fields.py i9_actual.json    i9
  python reconcile_fields.py h1010_actual.json h1010
"""

import sys
import json

# Campos esperados por cada formulario (copiados del mapper TypeScript)
EXPECTED = {
    "w4": {
        "text": [
            "f1_09[0]",   # firstName
            "f1_10[0]",   # lastName
            "f1_11[0]",   # address
            "f1_12[0]",   # cityStateZip
            "f1_13[0]",   # ssn
            "f1_14[0]",   # childTaxCredit
            "f1_15[0]",   # otherDependents
            "f1_16[0]",   # totalCredits
            "f1_17[0]",   # otherIncome
            "f1_18[0]",   # deductions
            "f1_19[0]",   # extraWithholding
            "f1_20[0]",   # exemptLine
        ],
        "radio":    ["c1_1[0]"],
        "checkbox": ["c1_2[0]"],
    },

    "w7": {
        "checkbox": [
            "c1_1[0]",  # reasonA
            "c1_2[0]",  # reasonB
            "c1_3[0]",  # reasonC
            "c1_4[0]",  # reasonD
            "c1_5[0]",  # reasonE
            "c1_6[0]",  # reasonF
            "c1_7[0]",  # reasonG
            "c1_8[0]",  # reasonH
            "c1_9[0]",  # docPassport
            "c1_10[0]", # docDriverLic
            "c1_11[0]", # docNatIDCard
            "c1_16[0]", # docCivilBirthCert
            "c1_19[0]", # prevITINYes
            "c1_20[0]", # prevITINNo
            "c1_21[0]", # lostITINYes
            "c1_22[0]", # lostITINNo
        ],
        "text": [
            "f1_01[0]",  # reasonHText
            "f1_02[0]",  # firstName
            "f1_03[0]",  # middleName
            "f1_04[0]",  # lastName
            "f1_05[0]",  # priorFirstName
            "f1_06[0]",  # priorLastName
            "f1_07[0]",  # streetAddr
            "f1_08[0]",  # city
            "f1_09[0]",  # state
            "f1_10[0]",  # zip
            "f1_11[0]",  # country
            "f1_15[0]",  # dobMonth
            "f1_16[0]",  # dobDay
            "f1_17[0]",  # dobYear
            "f1_18[0]",  # citizenship
            "f1_19[0]",  # foreignTaxID
            "f1_20[0]",  # passportNum
            "f1_21[0]",  # passportCountry
            "f1_22[0]",  # visaType
            "f1_25[0]",  # docNumber
            "f1_26[0]",  # docExp
            "f1_27[0]",  # docCountry
            "f1_28[0]",  # prevITIN
            "f1_29[0]",  # prevName
            "f1_30[0]",  # signDate
            "f1_31[0]",  # phone
        ],
    },

    "i765": {
        "text": [
            "form1[0].Page1[0].FamilyName[0]",
            "form1[0].Page1[0].GivenName[0]",
            "form1[0].Page1[0].MiddleName[0]",
            "form1[0].Page1[0].StreetNumberName[0]",
            "form1[0].Page1[0].CityOrTown[0]",
            "form1[0].Page1[0].State[0]",
            "form1[0].Page1[0].ZipCode[0]",
            "form1[0].Page1[0].DOBMonth[0]",
            "form1[0].Page1[0].DOBDay[0]",
            "form1[0].Page1[0].DOBYear[0]",
            "form1[0].Page1[0].CountryOfBirth[0]",
            "form1[0].Page1[0].CountryOfCitizenship[0]",
            "form1[0].Page1[0].ANumber[0]",
            "form1[0].Page1[0].SSN[0]",
            "form1[0].Page1[0].EligibilityCategory[0]",
            "form1[0].Page1[0].I94Number[0]",
            "form1[0].Page1[0].PassportNumber[0]",
            "form1[0].Page2[0].PrevEADNumber[0]",
            "form1[0].Page2[0].PrevEADExpMonth[0]",
            "form1[0].Page2[0].PrevEADExpDay[0]",
            "form1[0].Page2[0].PrevEADExpYear[0]",
            "form1[0].Page2[0].SignDate[0]",
        ],
        "radio": [
            "form1[0].Page1[0].RequestType[0]",
            "form1[0].Page1[0].Gender[0]",
        ],
    },

    "i821d": {
        "text": [
            "form1[0].Page1[0].FamilyName[0]",
            "form1[0].Page1[0].GivenName[0]",
            "form1[0].Page1[0].MiddleName[0]",
            "form1[0].Page1[0].ANumber[0]",
            "form1[0].Page1[0].DOBMonth[0]",
            "form1[0].Page1[0].DOBDay[0]",
            "form1[0].Page1[0].DOBYear[0]",
            "form1[0].Page1[0].CountryOfBirth[0]",
            "form1[0].Page1[0].SSN[0]",
            "form1[0].Page1[0].StreetNumberName[0]",
            "form1[0].Page1[0].CityOrTown[0]",
            "form1[0].Page1[0].State[0]",
            "form1[0].Page1[0].ZipCode[0]",
            "form1[0].Page1[0].DaytimeTelephone[0]",
            "form1[0].Page1[0].EmailAddress[0]",
            "form1[0].Page2[0].EntryMonth[0]",
            "form1[0].Page2[0].EntryDay[0]",
            "form1[0].Page2[0].EntryYear[0]",
            "form1[0].Page3[0].SchoolName[0]",
            "form1[0].Page3[0].SchoolCity[0]",
            "form1[0].Page3[0].SchoolState[0]",
        ],
        "radio": [
            "form1[0].Page1[0].RequestType[0]",
            "form1[0].Page1[0].Gender[0]",
            "form1[0].Page3[0].EduStatus[0]",
        ],
        "checkbox": [
            "form1[0].Page1[0].Detained[1]",
            "form1[0].Page1[0].Detained[2]",
            "form1[0].Page2[0].Under16[1]",
            "form1[0].Page2[0].Under16[2]",
            "form1[0].Page2[0].ContRes[1]",
            "form1[0].Page2[0].ContRes[2]",
            "form1[0].Page3[0].Travel[1]",
            "form1[0].Page3[0].Travel[2]",
            "form1[0].Page4[0].Criminal[1]",
            "form1[0].Page4[0].Criminal[2]",
        ],
    },

    "i9": {
        "text": [
            "form1[0].#subform[0].Section1[0].LastName[0]",
            "form1[0].#subform[0].Section1[0].FirstName[0]",
            "form1[0].#subform[0].Section1[0].MiddleInitial[0]",
            "form1[0].#subform[0].Section1[0].OtherLastNamesUsed[0]",
            "form1[0].#subform[0].Section1[0].Address[0]",
            "form1[0].#subform[0].Section1[0].CityOrTown[0]",
            "form1[0].#subform[0].Section1[0].State[0]",
            "form1[0].#subform[0].Section1[0].ZipCode[0]",
            "form1[0].#subform[0].Section1[0].DOBMonth[0]",
            "form1[0].#subform[0].Section1[0].DOBDay[0]",
            "form1[0].#subform[0].Section1[0].DOBYear[0]",
            "form1[0].#subform[0].Section1[0].SSN1[0]",
            "form1[0].#subform[0].Section1[0].SSN2[0]",
            "form1[0].#subform[0].Section1[0].SSN3[0]",
            "form1[0].#subform[0].Section1[0].Email[0]",
            "form1[0].#subform[0].Section1[0].Phone[0]",
            "form1[0].#subform[0].Section1[0].AlienRegNum[0]",
            "form1[0].#subform[0].Section1[0].AuthExpDate[0]",
            "form1[0].#subform[0].Section1[0].I94AdmissionNum[0]",
            "form1[0].#subform[0].Section1[0].ForeignPassportNum[0]",
            "form1[0].#subform[0].Section1[0].CountryOfIssuance[0]",
            "form1[0].#subform[0].Section1[0].SignDate[0]",
        ],
        "radio": [
            "form1[0].#subform[0].Section1[0].CitizenshipStatus[0]",
        ],
        "checkbox": [
            "form1[0].#subform[0].Section1[0].PrepNotUsed[0]",
        ],
    },

    "h1010": {
        "checkbox": [
            "form1[0].#subform[0].CheckBox_SNAP[0]",
            "form1[0].#subform[0].CheckBox_Medicaid[0]",
            "form1[0].#subform[0].CheckBox_CHIP[0]",
            "form1[0].#subform[0].CheckBox_TANF[0]",
            "form1[0].#subform[0].CheckBox_Expedited[0]",
            "form1[0].#subform[0].CheckBox_P1GenderM[0]",
            "form1[0].#subform[0].CheckBox_P1GenderF[0]",
            "form1[0].#subform[0].CheckBox_P1CitizenY[0]",
            "form1[0].#subform[0].CheckBox_P1CitizenN[0]",
        ],
        "text": [
            "form1[0].#subform[0].TextField_HHSize[0]",
            "form1[0].#subform[0].TextField_StreetAddr[0]",
            "form1[0].#subform[0].TextField_City[0]",
            "form1[0].#subform[0].TextField_County[0]",
            "form1[0].#subform[0].TextField_State[0]",
            "form1[0].#subform[0].TextField_ZIP[0]",
            "form1[0].#subform[0].TextField_P1First[0]",
            "form1[0].#subform[0].TextField_P1Last[0]",
            "form1[0].#subform[0].TextField_P1DOB[0]",
            "form1[0].#subform[0].TextField_P1SSN[0]",
            "form1[0].#subform[0].TextField_P1Phone[0]",
            "form1[0].#subform[0].TextField_P1Email[0]",
            "form1[0].#subform[0].TextField_EmpIncome[0]",
            "form1[0].#subform[0].TextField_Rent[0]",
            "form1[0].#subform[0].TextField_Utilities[0]",
            "form1[0].#subform[0].TextField_Medical[0]",
            "form1[0].#subform[0].TextField_Childcare[0]",
            "form1[0].#subform[0].TextField_SignDate[0]",
        ],
    },
}


def reconcile(actual_json_path: str, form_name: str) -> None:
    with open(actual_json_path) as f:
        actual = json.load(f)

    actual_fields = actual.get("fields", [])
    actual_ids    = {f["field_id"] for f in actual_fields}
    actual_by_type: dict[str, list[str]] = {}
    for f in actual_fields:
        t = f.get("type", "unknown")
        actual_by_type.setdefault(t, []).append(f["field_id"])

    expected    = EXPECTED.get(form_name, {})
    all_expected = [fid for ids in expected.values() for fid in ids]

    print(f"\n{'='*64}")
    print(f"  RECONCILIATION — {form_name.upper()}")
    print(f"{'='*64}")
    print(f"\n  Actual PDF fields : {len(actual_ids)}")
    print(f"  Expected in mapper: {len(all_expected)}")

    print(f"\n── ACTUAL FIELDS BY TYPE ──────────────────────────────────")
    for t, ids in actual_by_type.items():
        print(f"  {t}: {len(ids)}")
        for fid in ids[:6]:
            print(f"    {fid}")
        if len(ids) > 6:
            print(f"    … y {len(ids)-6} más")

    print(f"\n── MAPPER → PDF (campos que no están en el PDF) ──────────")
    missing = [e for e in all_expected if e not in actual_ids]
    if not missing:
        print("  ✓ Todos los campos del mapper están en el PDF")
    else:
        for m in missing:
            # Busca candidatos similares
            base = m.split(".")[-1].split("[")[0].lower()
            candidates = [
                a for a in actual_ids
                if base in a.lower()
            ][:3]
            suggestion = f"  → posiblemente: {candidates}" if candidates else ""
            print(f"  ✗ {m}{suggestion}")

    print(f"\n── PDF → MAPPER (campos en el PDF sin mapear) ─────────────")
    extra = [a for a in actual_ids if a not in all_expected]
    if not extra:
        print("  ✓ No hay campos sin mapear")
    else:
        for e in extra[:15]:
            print(f"  ? {e}")
        if len(extra) > 15:
            print(f"  … y {len(extra)-15} más")

    print()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python reconcile_fields.py <actual_fields.json> <form>")
        print("  form: w4 | w7 | i765 | i821d | i9 | h1010")
        sys.exit(1)
    reconcile(sys.argv[1], sys.argv[2])
