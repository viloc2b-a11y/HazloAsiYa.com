"""
HazloAsíYa — Implementación SEO Completa
=========================================
Este módulo implementa la arquitectura SEO descrita en el análisis:
  - Arquitectura de URLs por niveles (core, hubs, money pages, guías)
  - Generación de meta tags (title + description) por tipo de página
  - Generación de datos estructurados (Schema.org JSON-LD)
  - Mapa de enlazado interno jerárquico
  - Validaciones técnicas SEO (canónicos, noindex, sitemap, robots)
  - Generación de sitemap.xml limpio
  - Generación de robots.txt
  - Exportación completa a JSON y XML
"""

import json
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

# ---------------------------------------------------------------------------
# 1. CONFIGURACIÓN GLOBAL
# ---------------------------------------------------------------------------

DOMAIN = "https://www.hazloasiya.com"
BRAND = "HazloAsíYa"

# Páginas de negocio principales (Nivel 1)
CORE_PAGES: list[dict] = [
    {"slug": "/", "label": "Home", "intent": "brand"},
    {"slug": "/tramites/", "label": "Trámites", "intent": "hub_root"},
    {"slug": "/como-funciona/", "label": "Cómo funciona", "intent": "trust"},
    {"slug": "/precios/", "label": "Precios", "intent": "commercial"},
    {"slug": "/sobre-nosotros/", "label": "Sobre nosotros", "intent": "brand"},
    {"slug": "/contacto/", "label": "Contacto", "intent": "trust"},
    {"slug": "/faq/", "label": "FAQ", "intent": "trust"},
    {"slug": "/privacy/", "label": "Privacidad", "intent": "legal"},
    {"slug": "/terms/", "label": "Términos", "intent": "legal"},
]

# Hubs temáticos (Nivel 3) → cada hub agrupa sus money pages
HUBS: dict[str, dict] = {
    "beneficios": {
        "label": "Beneficios",
        "pages": ["snap", "medicaid", "wic"],
        "guides": [
            "documentos-para-snap",
            "como-solicitar-medicaid-en-espanol",
            "documentos-para-medicaid",
        ],
    },
    "impuestos": {
        "label": "Impuestos",
        "pages": ["itin", "taxes"],
        "guides": [
            "que-es-el-itin-y-para-que-sirve",
            "como-llenar-la-w7",
        ],
    },
    "escuela": {
        "label": "Escuela",
        "pages": ["escuela", "matricula", "prek", "iep"],
        "guides": [
            "documentos-para-inscribir-a-tu-hijo-en-la-escuela",
        ],
    },
    "inmigracion": {
        "label": "Inmigración",
        "pages": ["daca"],
        "guides": [],
    },
    "vivienda": {
        "label": "Vivienda",
        "pages": ["rent", "utilities"],
        "guides": [
            "ayuda-para-pagar-renta-en-tu-ciudad",
            "ayuda-para-pagar-luz-y-gas",
        ],
    },
    "finanzas": {
        "label": "Finanzas",
        "pages": ["bank"],
        "guides": [],
    },
    "trabajo": {
        "label": "Trabajo",
        "pages": ["jobs", "twc"],
        "guides": [],
    },
}

# Metadata de cada money page (Nivel 2)
MONEY_PAGES: dict[str, dict] = {
    "snap": {"label": "SNAP", "hub": "beneficios", "intent": "transactional"},
    "medicaid": {"label": "Medicaid", "hub": "beneficios", "intent": "transactional"},
    "wic": {"label": "WIC", "hub": "beneficios", "intent": "transactional"},
    "id": {"label": "ID", "hub": "finanzas", "intent": "transactional"},
    "twc": {"label": "TWC", "hub": "trabajo", "intent": "transactional"},
    "taxes": {"label": "Taxes", "hub": "impuestos", "intent": "transactional"},
    "escuela": {"label": "Escuela", "hub": "escuela", "intent": "transactional"},
    "daca": {"label": "DACA", "hub": "inmigracion", "intent": "transactional"},
    "iep": {"label": "IEP", "hub": "escuela", "intent": "transactional"},
    "itin": {"label": "ITIN", "hub": "impuestos", "intent": "transactional"},
    "rent": {"label": "Renta", "hub": "vivienda", "intent": "transactional"},
    "prek": {"label": "Pre-K", "hub": "escuela", "intent": "transactional"},
    "utilities": {"label": "Utilities", "hub": "vivienda", "intent": "transactional"},
    "jobs": {"label": "Empleos", "hub": "trabajo", "intent": "transactional"},
    "bank": {"label": "Banco", "hub": "finanzas", "intent": "transactional"},
    "matricula": {"label": "Matrícula", "hub": "escuela", "intent": "transactional"},
}

# Guías informacionales (Nivel 4)
GUIDES: list[dict] = [
    {"slug": "documentos-para-snap", "label": "Documentos para SNAP", "tramite": "snap", "hub": "beneficios"},
    {
        "slug": "como-solicitar-medicaid-en-espanol",
        "label": "Cómo solicitar Medicaid en español",
        "tramite": "medicaid",
        "hub": "beneficios",
    },
    {"slug": "documentos-para-medicaid", "label": "Documentos para Medicaid", "tramite": "medicaid", "hub": "beneficios"},
    {"slug": "que-es-el-itin-y-para-que-sirve", "label": "Qué es el ITIN y para qué sirve", "tramite": "itin", "hub": "impuestos"},
    {"slug": "como-llenar-la-w7", "label": "Cómo llenar la W-7 (ITIN)", "tramite": "itin", "hub": "impuestos"},
    {
        "slug": "documentos-para-inscribir-a-tu-hijo-en-la-escuela",
        "label": "Documentos para inscribir a tu hijo en la escuela",
        "tramite": "escuela",
        "hub": "escuela",
    },
    {"slug": "ayuda-para-pagar-renta-en-tu-ciudad", "label": "Ayuda para pagar renta en tu ciudad", "tramite": "rent", "hub": "vivienda"},
    {"slug": "ayuda-para-pagar-luz-y-gas", "label": "Ayuda para pagar luz y gas", "tramite": "utilities", "hub": "vivienda"},
]

# Páginas que deben tener noindex
NOINDEX_PATTERNS: list[str] = ["/form/", "/result/"]


# ---------------------------------------------------------------------------
# 2. GENERADOR DE META TAGS
# ---------------------------------------------------------------------------


class MetaTagGenerator:
    """Genera title y meta description para cada tipo de página."""

    def for_home(self) -> dict:
        return {
            "title": f"{BRAND} | Trámites en español en EE. UU. sin errores",
            "description": (
                "Descubre qué documentos necesitas y cómo completar trámites como "
                "SNAP, Medicaid, ITIN, escuela, renta y más. Empieza gratis en 5 minutos."
            ),
        }

    def for_tramite(self, label: str) -> dict:
        return {
            "title": f"Solicitar {label} en español: requisitos, documentos y pasos | {BRAND}",
            "description": (
                f"Revisa qué necesitas para {label}, qué te falta y cómo completarlo "
                f"paso a paso en español. Empieza gratis."
            ),
        }

    def for_guide(self, label: str) -> dict:
        return {
            "title": f"Qué documentos necesitas para {label} en EE. UU.",
            "description": f"Lista clara de documentos, requisitos y errores comunes para completar {label} sin errores.",
        }

    def for_hub(self, category: str) -> dict:
        return {
            "title": f"Trámites de {category} en español | {BRAND}",
            "description": f"Encuentra guías y ayuda paso a paso para trámites de {category} en Estados Unidos.",
        }

    def for_faq(self) -> dict:
        return {
            "title": f"Preguntas frecuentes sobre trámites en español | {BRAND}",
            "description": "Resolvemos las dudas más comunes sobre SNAP, Medicaid, ITIN, escuela, renta y más trámites en EE. UU.",
        }

    def for_pricing(self) -> dict:
        return {
            "title": f"Precios | {BRAND}",
            "description": "Cuestionario gratis + plan básico $19 + plan anual $49. Garantía de satisfacción de 30 días.",
        }

    def for_how_it_works(self) -> dict:
        return {
            "title": f"Cómo funciona {BRAND} | Trámites en español paso a paso",
            "description": (
                "Completa un cuestionario gratis, descubre qué te falta y "
                "resuelve tu trámite en 5 minutos con pasos exactos en español."
            ),
        }

    def generate_all(self) -> dict:
        """Retorna un diccionario completo con los meta tags de todas las páginas."""
        result = {}

        result["/"] = self.for_home()
        result["/tramites/"] = self.for_hub("todos los trámites")
        result["/como-funciona/"] = self.for_how_it_works()
        result["/precios/"] = self.for_pricing()
        result["/faq/"] = self.for_faq()

        for hub_key, hub_data in HUBS.items():
            slug = f"/tramites/{hub_key}/"
            result[slug] = self.for_hub(hub_data["label"])

        for page_key, page_data in MONEY_PAGES.items():
            slug = f"/{page_key}/"
            result[slug] = self.for_tramite(page_data["label"])

        for guide in GUIDES:
            slug = f"/guias/{guide['slug']}/"
            result[slug] = self.for_guide(guide["label"])

        return result


# ---------------------------------------------------------------------------
# 3. GENERADOR DE DATOS ESTRUCTURADOS (Schema.org JSON-LD)
# ---------------------------------------------------------------------------


class StructuredDataGenerator:
    """Genera bloques JSON-LD de Schema.org para cada tipo de página."""

    def organization(self) -> dict:
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": BRAND,
            "url": DOMAIN,
            "description": "Plataforma en español para ayudar a familias hispanas en EE. UU. a completar trámites sin errores.",
            "contactPoint": {"@type": "ContactPoint", "contactType": "customer support", "availableLanguage": "Spanish"},
        }

    def website(self) -> dict:
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": BRAND,
            "url": DOMAIN,
            "potentialAction": {
                "@type": "SearchAction",
                "target": f"{DOMAIN}/?s={{search_term_string}}",
                "query-input": "required name=search_term_string",
            },
        }

    def breadcrumb(self, items: list[dict]) -> dict:
        """items: lista de dicts con 'name' y 'url'."""
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": i + 1, "name": item["name"], "item": f"{DOMAIN}{item['url']}"}
                for i, item in enumerate(items)
            ],
        }

    def service(self, label: str, slug: str, price: str = "19.00") -> dict:
        return {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": f"Ayuda para trámite {label} en español",
            "description": (
                f"Guía paso a paso para completar el trámite {label} en EE. UU. sin errores, "
                "con documentos requeridos y ejemplos prácticos."
            ),
            "provider": {"@type": "Organization", "name": BRAND, "url": DOMAIN},
            "url": f"{DOMAIN}{slug}",
            "offers": {
                "@type": "Offer",
                "price": price,
                "priceCurrency": "USD",
                "priceValidUntil": "2026-12-31",
                "availability": "https://schema.org/InStock",
            },
            "areaServed": {"@type": "Country", "name": "United States"},
            "availableLanguage": "Spanish",
        }

    def faq_page(self, faqs: list[dict]) -> dict:
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": faq["question"],
                    "acceptedAnswer": {"@type": "Answer", "text": faq["answer"]},
                }
                for faq in faqs
            ],
        }

    def generate_all_service_schemas(self) -> dict:
        schemas = {}
        for page_key, page_data in MONEY_PAGES.items():
            slug = f"/{page_key}/"
            schemas[slug] = self.service(page_data["label"], slug)
        return schemas

    def default_faqs(self) -> dict:
        faqs = [
            {
                "question": "¿Cómo funciona HazloAsíYa?",
                "answer": (
                    "Completas un cuestionario gratis en 5 minutos. Te decimos qué tienes, "
                    "qué te falta y cómo completar tu trámite paso a paso."
                ),
            },
            {
                "question": "¿Cuánto cuesta?",
                "answer": (
                    "El cuestionario es gratis. El plan básico cuesta $19 por trámite "
                    "y el plan anual $49 para acceso ilimitado."
                ),
            },
            {
                "question": "¿Es asesoría legal?",
                "answer": "No. HazloAsíYa es una guía informativa. No somos abogados ni representantes legales.",
            },
            {
                "question": "¿Mis datos están seguros?",
                "answer": "Sí. Usamos SSL, pagos seguros con Square y no guardamos información de tarjetas.",
            },
            {"question": "¿Tienen garantía?", "answer": "Sí, ofrecemos garantía de satisfacción de 30 días."},
        ]
        return self.faq_page(faqs)


# ---------------------------------------------------------------------------
# 4. MAPA DE ENLAZADO INTERNO
# ---------------------------------------------------------------------------


class InternalLinkMap:
    """Construye el mapa de enlazado interno jerárquico."""

    def home_links(self) -> dict:
        return {
            "page": "/",
            "links_to": [f"/tramites/{hub}/" for hub in HUBS]
            + [f"/{p}/" for p in MONEY_PAGES]
            + ["/precios/", "/como-funciona/", "/faq/"],
        }

    def hub_links(self, hub_key: str) -> dict:
        hub = HUBS[hub_key]
        return {
            "page": f"/tramites/{hub_key}/",
            "links_to": [f"/{p}/" for p in hub["pages"]]
            + [f"/guias/{g}/" for g in hub["guides"]]
            + ["/faq/", "/precios/"],
        }

    def money_page_links(self, page_key: str) -> dict:
        page = MONEY_PAGES[page_key]
        hub_key = page["hub"]
        hub = HUBS.get(hub_key, {})
        related_guides = [
            f"/guias/{g}/" for g in hub.get("guides", []) if page_key in g or hub_key in g
        ][:3]
        return {"page": f"/{page_key}/", "links_to": [f"/tramites/{hub_key}/"] + related_guides + ["/faq/", "/precios/", "/privacy/"]}

    def guide_links(self, guide: dict) -> dict:
        hub_key = guide["hub"]
        tramite = guide["tramite"]
        hub = HUBS.get(hub_key, {})
        related = [f"/guias/{g}/" for g in hub.get("guides", []) if g != guide["slug"]][:2]
        return {
            "page": f"/guias/{guide['slug']}/",
            "links_to": [f"/{tramite}/", f"/tramites/{hub_key}/"] + related + ["/faq/"],
        }

    def generate_full_map(self) -> list[dict]:
        link_map = [self.home_links()]
        for hub_key in HUBS:
            link_map.append(self.hub_links(hub_key))
        for page_key in MONEY_PAGES:
            link_map.append(self.money_page_links(page_key))
        for guide in GUIDES:
            link_map.append(self.guide_links(guide))
        return link_map


# ---------------------------------------------------------------------------
# 5. GENERADOR DE SITEMAP XML
# ---------------------------------------------------------------------------


class SitemapGenerator:
    """Genera un sitemap.xml limpio con solo las URLs indexables."""

    def _all_indexable_urls(self) -> list[str]:
        urls: list[str] = []
        for page in CORE_PAGES:
            urls.append(f"{DOMAIN}{page['slug']}")
        for hub_key in HUBS:
            urls.append(f"{DOMAIN}/tramites/{hub_key}/")
        for page_key in MONEY_PAGES:
            urls.append(f"{DOMAIN}/{page_key}/")
        for guide in GUIDES:
            urls.append(f"{DOMAIN}/guias/{guide['slug']}/")
        return urls

    def generate_xml(self) -> str:
        urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
        now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        for url in self._all_indexable_urls():
            url_el = ET.SubElement(urlset, "url")
            ET.SubElement(url_el, "loc").text = url
            ET.SubElement(url_el, "lastmod").text = now
            ET.SubElement(url_el, "changefreq").text = "monthly"
            ET.SubElement(url_el, "priority").text = (
                "1.0"
                if url == f"{DOMAIN}/"
                else "0.9"
                if "/tramites/" in url and url.count("/") == 4
                else "0.8"
                if any(f"/{p}/" in url for p in MONEY_PAGES)
                else "0.6"
            )
        ET.indent(urlset, space="  ")
        return ET.tostring(urlset, encoding="unicode", xml_declaration=False)

    def save(self, path: str = "sitemap.xml") -> None:
        xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n' + self.generate_xml()
        with open(path, "w", encoding="utf-8") as f:
            f.write(xml_content)
        print(f"[sitemap] Saved → {path}")


# ---------------------------------------------------------------------------
# 6. GENERADOR DE ROBOTS.TXT
# ---------------------------------------------------------------------------


class RobotsGenerator:
    """Genera un robots.txt correcto para el dominio principal."""

    def generate(self) -> str:
        lines = ["User-agent: *", "Allow: /", ""]
        for pattern in NOINDEX_PATTERNS:
            lines.append(f"Disallow: {pattern}")
        lines += ["", f"Sitemap: {DOMAIN}/sitemap.xml"]
        return "\n".join(lines)

    def save(self, path: str = "robots.txt") -> None:
        with open(path, "w", encoding="utf-8") as f:
            f.write(self.generate())
        print(f"[robots] Saved → {path}")


# ---------------------------------------------------------------------------
# 7. VALIDADOR TÉCNICO SEO
# ---------------------------------------------------------------------------


class TechnicalSEOValidator:
    """Lista de verificaciones técnicas SEO obligatorias."""

    def run_checks(self) -> list[dict]:
        checks = [
            {
                "id": "canonical_domain",
                "priority": "CRITICAL",
                "check": "Dominio canónico único",
                "status": "PENDING",
                "action": (
                    f"Todas las páginas deben tener <link rel='canonical' href='{DOMAIN}/...'/>. "
                    "Eliminar referencias a hazloasiya.pages.dev del sitemap y del código."
                ),
            },
            {
                "id": "noindex_forms",
                "priority": "CRITICAL",
                "check": "Noindex en /form/ y /result/",
                "status": "PENDING",
                "action": (
                    "Añadir <meta name='robots' content='noindex, follow'> a todas las páginas "
                    "/form/* y /result/*. Eliminarlas del sitemap.xml."
                ),
            },
            {
                "id": "redirect_pages_dev",
                "priority": "HIGH",
                "check": "Redirección 301 desde pages.dev",
                "status": "PENDING",
                "action": f"Configurar redirección 301 desde hazloasiya.pages.dev hacia {DOMAIN} para consolidar autoridad de dominio.",
            },
            {
                "id": "sitemap_clean",
                "priority": "HIGH",
                "check": "Sitemap limpio",
                "status": "PENDING",
                "action": "El sitemap.xml debe contener solo URLs indexables del dominio principal. Excluir /form/, /result/ y variantes técnicas.",
            },
            {
                "id": "robots_txt",
                "priority": "HIGH",
                "check": "robots.txt correcto",
                "status": "PENDING",
                "action": "Verificar que robots.txt no bloquee CSS/JS, que referencie el sitemap correcto y que solo bloquee /form/ y /result/.",
            },
            {
                "id": "structured_data",
                "priority": "MEDIUM",
                "check": "Datos estructurados Schema.org",
                "status": "PENDING",
                "action": "Añadir JSON-LD con Organization, WebSite, BreadcrumbList, FAQPage, Service y Offer en las páginas correspondientes.",
            },
            {
                "id": "core_web_vitals",
                "priority": "MEDIUM",
                "check": "Core Web Vitals",
                "status": "PENDING",
                "action": "Optimizar peso de imágenes, reducir hydration innecesaria, diferir scripts de terceros y optimizar carga de fuentes.",
            },
            {
                "id": "internal_links",
                "priority": "MEDIUM",
                "check": "Enlazado interno jerárquico",
                "status": "PENDING",
                "action": "Implementar el mapa de enlaces internos: home → hubs → money pages → guías. Cada money page debe enlazar a su hub, guías relacionadas, FAQ y precios.",
            },
            {
                "id": "trust_signals",
                "priority": "LOW",
                "check": "Señales de confianza visibles",
                "status": "PENDING",
                "action": "Integrar en páginas de trámite: 'Pagos seguros con Square', 'SSL', 'Garantía 30 días', 'No es asesoría legal', soporte visible.",
            },
        ]
        return checks

    def print_report(self) -> None:
        checks = self.run_checks()
        print("\n" + "=" * 70)
        print("  REPORTE DE VALIDACIONES TÉCNICAS SEO — HazloAsíYa")
        print("=" * 70)
        for c in checks:
            print(f"\n[{c['priority']}] {c['check']}")
            print(f"  → {c['action']}")
        print("\n" + "=" * 70)


# ---------------------------------------------------------------------------
# 8. GENERADOR DE ESTRUCTURA H1/H2 POR PÁGINA DE TRÁMITE
# ---------------------------------------------------------------------------


class ContentStructureGenerator:
    """Genera la estructura de contenido H1/H2 para cada money page."""

    def for_tramite(self, label: str) -> dict:
        return {
            "h1": f"Cómo solicitar {label} en español sin errores",
            "h2": [
                f"Qué es {label} y quién puede calificar",
                f"Qué documentos necesitas para solicitar {label}",
                "Errores comunes al aplicar",
                f"Qué recibirás con {BRAND}",
                "Cómo funciona el cuestionario gratis",
                f"Preguntas frecuentes sobre {label}",
            ],
            "conversion_block": [
                "Resultado en 5 minutos",
                "Sin registro previo",
                "Sin tarjeta de crédito",
                "Pasos exactos",
                "Ejemplo de llenado",
                "Ayuda local en español",
            ],
        }

    def generate_all(self) -> dict:
        result = {}
        for page_key, page_data in MONEY_PAGES.items():
            result[f"/{page_key}/"] = self.for_tramite(page_data["label"])
        return result


# ---------------------------------------------------------------------------
# 9. EXPORTACIÓN COMPLETA
# ---------------------------------------------------------------------------


class SEOExporter:
    """Orquesta la generación y exportación de todos los artefactos SEO."""

    def __init__(self, output_dir: str = "."):
        self.output_dir = output_dir
        self.meta_gen = MetaTagGenerator()
        self.schema_gen = StructuredDataGenerator()
        self.link_map = InternalLinkMap()
        self.sitemap_gen = SitemapGenerator()
        self.robots_gen = RobotsGenerator()
        self.validator = TechnicalSEOValidator()
        self.content_gen = ContentStructureGenerator()

    def export_all(self) -> None:
        import os

        os.makedirs(self.output_dir, exist_ok=True)

        meta_path = f"{self.output_dir}/meta_tags.json"
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(self.meta_gen.generate_all(), f, ensure_ascii=False, indent=2)
        print(f"[meta]    Saved → {meta_path}")

        schemas = {
            "organization": self.schema_gen.organization(),
            "website": self.schema_gen.website(),
            "faq": self.schema_gen.default_faqs(),
            "services": self.schema_gen.generate_all_service_schemas(),
        }
        schema_path = f"{self.output_dir}/structured_data.json"
        with open(schema_path, "w", encoding="utf-8") as f:
            json.dump(schemas, f, ensure_ascii=False, indent=2)
        print(f"[schema]  Saved → {schema_path}")

        link_path = f"{self.output_dir}/internal_links.json"
        with open(link_path, "w", encoding="utf-8") as f:
            json.dump(self.link_map.generate_full_map(), f, ensure_ascii=False, indent=2)
        print(f"[links]   Saved → {link_path}")

        content_path = f"{self.output_dir}/content_structure.json"
        with open(content_path, "w", encoding="utf-8") as f:
            json.dump(self.content_gen.generate_all(), f, ensure_ascii=False, indent=2)
        print(f"[content] Saved → {content_path}")

        self.sitemap_gen.save(f"{self.output_dir}/sitemap.xml")
        self.robots_gen.save(f"{self.output_dir}/robots.txt")

        checks_path = f"{self.output_dir}/technical_checks.json"
        with open(checks_path, "w", encoding="utf-8") as f:
            json.dump(self.validator.run_checks(), f, ensure_ascii=False, indent=2)
        print(f"[checks]  Saved → {checks_path}")

        self.validator.print_report()
        print(f"\n✅  Exportación completa en: {self.output_dir}/")


if __name__ == "__main__":
    exporter = SEOExporter(output_dir="seo_output")
    exporter.export_all()

