"""Compila todas as apostilas Markdown em PDF via Microsoft Edge Headless e gera apostilas/indice.json."""

from __future__ import annotations

import json
import re
import subprocess
import tempfile
from pathlib import Path
from typing import Any

import markdown

ROOT_DIR = Path(__file__).resolve().parent.parent
APOSTILAS_DIR = ROOT_DIR / "apostilas"
EDGE_PATH = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>{title}</title>
  <style>
    @page {{
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
    }}
    * {{
      box-sizing: border-box;
    }}
    body {{
      font-family: "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.62;
      font-size: 10.5pt;
      margin: 0;
      padding: 0;
    }}
    .cover-banner {{
      border-left: 5px solid #2563eb;
      background: #f8fafc;
      padding: 14px 18px;
      margin-bottom: 18px;
      border-radius: 6px;
    }}
    .cover-tag {{
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #2563eb;
      margin-bottom: 4px;
    }}
    h1 {{
      font-size: 20pt;
      color: #0f172a;
      margin: 0 0 8px 0;
      line-height: 1.25;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
    }}
    h2 {{
      font-size: 14pt;
      color: #1e3a8a;
      margin-top: 22px;
      margin-bottom: 8px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      page-break-after: avoid;
    }}
    h3 {{
      font-size: 11.5pt;
      color: #0f172a;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }}
    p {{
      margin: 0 0 9px 0;
      text-align: justify;
    }}
    ul, ol {{
      margin: 0 0 10px 0;
      padding-left: 20px;
    }}
    li {{
      margin-bottom: 4px;
    }}
    blockquote {{
      margin: 12px 0;
      padding: 10px 14px;
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 4px;
      color: #1e3a8a;
      page-break-inside: avoid;
    }}
    code {{
      font-family: "Cascadia Code", "Consolas", monospace;
      font-size: 9pt;
      background: #f1f5f9;
      padding: 1px 4px;
      border-radius: 3px;
      color: #0f172a;
    }}
    pre {{
      background: #0f172a;
      color: #f8fafc;
      padding: 12px 14px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 8.5pt;
      line-height: 1.45;
      page-break-inside: avoid;
      margin: 10px 0 14px 0;
    }}
    pre code {{
      background: transparent;
      color: inherit;
      padding: 0;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px 0;
      font-size: 9.2pt;
      page-break-inside: avoid;
    }}
    th, td {{
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: left;
      vertical-align: top;
    }}
    th {{
      background: #1e293b;
      color: #ffffff;
      font-weight: 600;
    }}
    tr:nth-child(even) td {{
      background: #f8fafc;
    }}
    hr {{
      border: none;
      border-top: 1px solid #cbd5e1;
      margin: 18px 0;
    }}
  </style>
</head>
<body>
  <div class="cover-banner">
    <div class="cover-tag">EstudosEnade • Sistemas de Informação • Material Unificado</div>
    <div><strong>Área de Conhecimento:</strong> {title}</div>
  </div>
  {body}
</body>
</html>
"""


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[áàâã]", "a", s)
    s = re.sub(r"[éèê]", "e", s)
    s = re.sub(r"[íìî]", "i", s)
    s = re.sub(r"[óòôõ]", "o", s)
    s = re.sub(r"[úùû]", "u", s)
    s = re.sub(r"[ç]", "c", s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def parse_markdown_meta(md_text: str, area_id: str) -> dict[str, Any]:
    lines = md_text.splitlines()
    title = area_id
    topics: list[dict[str, str]] = []
    for line in lines:
        if line.startswith("# ") and title == area_id:
            title = line[2:].strip()
        elif line.startswith("## "):
            heading = line[3:].strip()
            topics.append({"id": f"{area_id}__{slugify(heading)}", "title": heading})
    words = len(re.findall(r"\w+", md_text))
    estimated_minutes = max(10, round(words / 180))
    return {
        "title": title,
        "topics": topics,
        "wordCount": words,
        "estimatedMinutes": estimated_minutes,
    }


def render_pdf(html_content: str, pdf_path: Path) -> None:
    if not EDGE_PATH.exists():
        raise FileNotFoundError(f"Microsoft Edge não encontrado em {EDGE_PATH}")

    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as tmp:
        tmp.write(html_content)
        tmp_path = Path(tmp.name)

    try:
        cmd = [
            str(EDGE_PATH),
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}",
            tmp_path.as_uri(),
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if res.returncode != 0 or not pdf_path.exists() or pdf_path.stat().st_size < 1000:
            raise RuntimeError(f"Falha ao gerar PDF {pdf_path.name}: {res.stderr}")
    finally:
        tmp_path.unlink(missing_ok=True)


def main() -> None:
    if not APOSTILAS_DIR.exists():
        print("[WARN] Diretório apostilas/ não encontrado.")
        return

    meta_file = APOSTILAS_DIR / "areas_meta.json"
    extra_meta: dict[str, Any] = {}
    if meta_file.exists():
        extra_meta = json.loads(meta_file.read_text(encoding="utf-8"))

    index_items: list[dict[str, Any]] = []
    for area_dir in sorted(APOSTILAS_DIR.iterdir()):
        if not area_dir.is_dir():
            continue
        md_path = area_dir / "apostila.md"
        if not md_path.exists():
            continue
        area_id = area_dir.name
        md_text = md_path.read_text(encoding="utf-8")
        parsed = parse_markdown_meta(md_text, area_id)

        html_body = markdown.markdown(
            md_text,
            extensions=["tables", "fenced_code", "toc", "sane_lists"],
        )
        full_html = HTML_TEMPLATE.format(title=parsed["title"], body=html_body)
        pdf_path = area_dir / "apostila.pdf"
        render_pdf(full_html, pdf_path)

        area_extra = extra_meta.get(area_id, {})
        index_items.append(
            {
                "areaId": area_id,
                "title": area_extra.get("title", parsed["title"]),
                "shortTitle": area_extra.get("shortTitle", parsed["title"]),
                "component": area_extra.get("component", "formacao_geral" if area_id.startswith("00-") else "especifico"),
                "hasDriveMaterial": area_extra.get("hasDriveMaterial", True),
                "sourceFiles": area_extra.get("sourceFiles", []),
                "videoRefs": area_extra.get("videoRefs", []),
                "estimatedMinutes": parsed["estimatedMinutes"],
                "wordCount": parsed["wordCount"],
                "topics": parsed["topics"],
                "markdownPath": f"apostilas/{area_id}/apostila.md",
                "pdfPath": f"apostilas/{area_id}/apostila.pdf",
                "pdfBytes": pdf_path.stat().st_size,
            }
        )
        print(f"[PDF] {area_id}/apostila.pdf ({pdf_path.stat().st_size} bytes, {len(parsed['topics'])} tópicos)")

    (APOSTILAS_DIR / "indice.json").write_text(
        json.dumps({"areas": index_items}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"[DONE] Compiladas {len(index_items)} apostilas e atualizado apostilas/indice.json.")


if __name__ == "__main__":
    main()
