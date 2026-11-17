"""Script para baixar materiais de estudo do Google Drive e provas oficiais do portal Enade DSI."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

import gdown
import requests

ROOT_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT_DIR / "materiais-brutos"
DRIVE_DIR = RAW_DIR / "drive"
EXAMS_DIR = RAW_DIR / "provas"

DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1KIYpMo6wJFf7X-DAX9WhrEAUMGlc98M8"

OFFICIAL_EXAMS: list[dict[str, str]] = [
    {
        "year": "2021",
        "kind": "prova",
        "url": "https://enade.itatechjr.com.br/wp-content/uploads/2026/06/2021_prova_sistemas_informacao.pdf",
        "filename": "2021_prova_sistemas_informacao.pdf",
    },
    {
        "year": "2021",
        "kind": "gabarito_objetivas",
        "url": "https://enade.itatechjr.com.br/wp-content/uploads/2026/06/2021_gabarito_sistemas_informacao.pdf",
        "filename": "2021_gabarito_sistemas_informacao.pdf",
    },
    {
        "year": "2021",
        "kind": "gabarito_discursivas",
        "url": "https://enade.itatechjr.com.br/wp-content/uploads/2026/06/2021_gabarito__discursivas_sistemas_informacao.pdf",
        "filename": "2021_gabarito_discursivas_sistemas_informacao.pdf",
    },
    {
        "year": "2017",
        "kind": "prova",
        "url": "https://enade.itatechjr.com.br/wp-content/uploads/2026/06/2017_prova_sistemas_informacao.pdf",
        "filename": "2017_prova_sistemas_informacao.pdf",
    },
    {
        "year": "2017",
        "kind": "gabarito_objetivas",
        "url": "https://enade.itatechjr.com.br/wp-content/uploads/2026/06/2017_gabarito_sistemas_informacao.pdf",
        "filename": "2017_gabarito_sistemas_informacao.pdf",
    },
    {
        "year": "2017",
        "kind": "gabarito_discursivas",
        "url": "https://enade.itatechjr.com.br/wp-content/uploads/2026/06/2017_gabarito__discursivas_sistemas_informacao.pdf",
        "filename": "2017_gabarito_discursivas_sistemas_informacao.pdf",
    },
    {
        "year": "2014",
        "kind": "prova",
        "url": "https://enade.itatechjr.com.br/wp-content/uploads/2026/06/2014_prova_sistemas_informacao.pdf",
        "filename": "2014_prova_sistemas_informacao.pdf",
    },
    {
        "year": "2014",
        "kind": "gabarito_objetivas",
        "url": "https://enade.itatechjr.com.br/wp-content/uploads/2026/06/2014_gabarito_sistemas_informacao.pdf",
        "filename": "2014_gabarito_sistemas_informacao.pdf",
    },
    {
        "year": "2014",
        "kind": "gabarito_discursivas",
        "url": "https://enade.itatechjr.com.br/wp-content/uploads/2026/06/2014_gabarito__discursivas_sistemas_informacao.pdf",
        "filename": "2014_gabarito_discursivas_sistemas_informacao.pdf",
    },
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    ),
    "Referer": "https://enade.itatechjr.com.br/",
}


def download_official_exams() -> list[dict[str, Any]]:
    EXAMS_DIR.mkdir(parents=True, exist_ok=True)
    results: list[dict[str, Any]] = []
    session = requests.Session()
    session.headers.update(HEADERS)

    for item in OFFICIAL_EXAMS:
        dest = EXAMS_DIR / item["filename"]
        if dest.exists() and dest.stat().st_size > 1000:
            print(f"[SKIP] Já existe: {dest.name} ({dest.stat().st_size} bytes)")
            results.append({**item, "status": "existing", "bytes": dest.stat().st_size})
            continue

        print(f"[GET] Baixando {item['filename']}...")
        resp = session.get(item["url"], timeout=60)
        resp.raise_for_status()
        dest.write_bytes(resp.content)
        print(f"[OK] {dest.name} ({len(resp.content)} bytes)")
        results.append({**item, "status": "downloaded", "bytes": len(resp.content)})

    return results


DRIVE_FALLBACK_FILES: list[tuple[str, str]] = [
    ("1PNQeeAUScDWbVNVH-11r1KFQlWy_fBYX", "Lógica Matemática/LM - NA03_TabelasVerdade.pdf"),
    ("1ZFP4j5zWmnDG0rU_jXMI_L-kq2Em9BGi", "Lógica Matemática/LM - NA11_SimplificaçãoConclusão.pdf"),
    ("1lzWPexbGrgr8bK1l1Xdat5_nChJaZa0W", "Lógica Matemática/LM - NA12_Regras de Inferência e Equivalência - Um folha.pdf"),
    ("1E2UwBCWd-2xLXtHsboD23nLGMHB9Ssrk", "Lógica Matemática/LM - NA12_RegrasEquivalência.pdf"),
    ("1sG4OElL2GNHCSEA60UNzffLIV63EBWD3", "Lógica Matemática/LM - NA13_Regras de Tableau Semântico - Um folha.pdf"),
    ("1zKEeMro-AJHsyZiDSbzO3CCUaeM5UFD1", "Lógica Matemática/LM - NA13_TableauSemântico.pdf"),
    ("1MP-1Jqh7Su-_N-9lC_qCs1kRjg_wQXLI", "Matemática Discreta/MD_exercicio_enade.pdf"),
    ("19UNBhcm_8pppCjmgFA19T_3GnZlbRSdw", "Organização e Arquitetura de Computadores/2026 -Enade - OAC.pdf"),
    ("1AlxiFUDSRctvW_K5D5wDjF_40sQvvQT7", "Redes de Computadores/Enade-Redes.docx"),
    ("1KkbTkKsAWaP0S16Osf9tEWdQ4Qu0vVxZ", "Sistemas Operacionais/2026 -Enade - SO.pdf"),
]


def download_drive_direct(file_id: str, rel_path: str, session: requests.Session) -> tuple[bool, str]:
    target = DRIVE_DIR / rel_path
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() and target.stat().st_size > 1000:
        return True, f"existing ({target.stat().st_size} bytes)"
    url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"
    resp = session.get(url, timeout=90)
    if resp.status_code != 200 or resp.content.lstrip().startswith(b"<!DOCTYPE html"):
        return False, f"HTTP {resp.status_code} ou HTML de erro"
    target.write_bytes(resp.content)
    return True, f"downloaded ({len(resp.content)} bytes)"


def download_drive_folder() -> dict[str, Any]:
    DRIVE_DIR.mkdir(parents=True, exist_ok=True)
    # Garante criação das 4 pastas atualmente vazias no Drive para manter espelho fiel
    for empty_dir in [
        "Inteligência Artificial",
        "Sistemas de Apoio à Decisão",
        "Sistemas de Informação",
        "Sistemas Distribuídos",
    ]:
        (DRIVE_DIR / empty_dir).mkdir(parents=True, exist_ok=True)

    session = requests.Session()
    session.headers.update({"User-Agent": HEADERS["User-Agent"]})
    fallback_results: list[dict[str, str]] = []

    print(f"[DRIVE] Verificando e baixando arquivos pendentes em {DRIVE_DIR}...")
    for file_id, rel_path in DRIVE_FALLBACK_FILES:
        ok, info = download_drive_direct(file_id, rel_path, session)
        print(f"  [{'OK' if ok else 'ERR'}] {rel_path} -> {info}")
        fallback_results.append({"file_id": file_id, "path": rel_path, "status": info})

    if all((DRIVE_DIR / rel).exists() for _, rel in DRIVE_FALLBACK_FILES):
        return {"status": "ok", "fallback_results": fallback_results}

    try:
        files = gdown.download_folder(
            url=DRIVE_FOLDER_URL,
            output=str(DRIVE_DIR),
            quiet=False,
            use_cookies=False,
            resume=True,
        )
        return {
            "status": "ok",
            "downloaded_count": len(files) if files else 0,
            "fallback_results": fallback_results,
        }
    except Exception as exc:
        print(f"[WARN] download_folder retornou aviso ({exc})", file=sys.stderr)
        return {"status": "partial", "error": str(exc), "fallback_results": fallback_results}


def collect_inventory() -> list[dict[str, Any]]:
    inventory: list[dict[str, Any]] = []
    for path in sorted(RAW_DIR.rglob("*")):
        if path.is_file() and path.name != "manifest.json":
            inventory.append(
                {
                    "relative_path": path.relative_to(RAW_DIR).as_posix(),
                    "bytes": path.stat().st_size,
                }
            )
    return inventory


def main() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    exam_results = download_official_exams()
    drive_result = download_drive_folder()
    inventory = collect_inventory()

    manifest = {
        "drive_folder_url": DRIVE_FOLDER_URL,
        "drive_result": drive_result,
        "official_exams": exam_results,
        "total_files": len(inventory),
        "inventory": inventory,
    }
    (RAW_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"[DONE] Total de arquivos em materiais-brutos/: {len(inventory)}")


if __name__ == "__main__":
    main()
