#!/usr/bin/env python3
"""
Lista campos AcroForm de un PDF → JSON (entrada para scripts/reconcile_fields.py).

  pip install pypdf
  python scripts/inspect_fields.py public/forms/fw7.pdf > w7_actual.json
"""
from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> None:
    if len(sys.argv) < 2:
        print("Uso: python inspect_fields.py <ruta.pdf>", file=sys.stderr)
        sys.exit(1)
    try:
        from pypdf import PdfReader
    except ImportError:
        from PyPDF2 import PdfReader  # type: ignore

    path = Path(sys.argv[1])
    reader = PdfReader(str(path))
    raw = reader.get_fields() or {}
    fields: list[dict[str, str]] = []
    for name, info in raw.items():
        ft = str(info.get("/FT", "")) if isinstance(info, dict) else ""
        t = "text"
        if "/Btn" in ft or "Btn" in ft:
            t = "button"
        elif "/Ch" in ft or "Ch" in ft:
            t = "choice"
        fields.append({"field_id": name, "type": t})

    json.dump({"fields": fields}, sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
