"""Sincroniza apostilas (.md, .pdf, indice.json) e banco-unificado.json para dentro do app Vite."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
APOSTILAS_DIR = ROOT_DIR / "apostilas"
QUESTOES_DIR = ROOT_DIR / "questoes"
APP_DATA_DIR = ROOT_DIR / "app" / "src" / "data"
APP_PUBLIC_APOSTILAS = ROOT_DIR / "app" / "public" / "apostilas"


def main() -> None:
    APP_DATA_DIR.mkdir(parents=True, exist_ok=True)
    APP_PUBLIC_APOSTILAS.mkdir(parents=True, exist_ok=True)

    # 1. Copiar banco-unificado.json
    shutil.copy2(QUESTOES_DIR / "banco-unificado.json", APP_DATA_DIR / "banco-unificado.json")

    # 2. Empacotar indice.json + conteúdo Markdown das apostilas em app/src/data/apostilas-bundle.json
    indice = json.loads((APOSTILAS_DIR / "indice.json").read_text(encoding="utf-8"))
    bundle_areas = []
    for area in indice["areas"]:
        area_id = area["areaId"]
        md_text = (APOSTILAS_DIR / area_id / "apostila.md").read_text(encoding="utf-8")
        pdf_src = APOSTILAS_DIR / area_id / "apostila.pdf"
        pdf_dest = APP_PUBLIC_APOSTILAS / f"{area_id}.pdf"
        shutil.copy2(pdf_src, pdf_dest)
        bundle_areas.append(
            {
                **area,
                "publicPdfUrl": f"apostilas/{area_id}.pdf",
                "content": md_text,
            }
        )

    (APP_DATA_DIR / "apostilas-bundle.json").write_text(
        json.dumps({"areas": bundle_areas}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"[SYNC] Sincronizadas {len(bundle_areas)} apostilas + banco-unificado.json para app/src/data/ e app/public/apostilas/.")


if __name__ == "__main__":
    main()
