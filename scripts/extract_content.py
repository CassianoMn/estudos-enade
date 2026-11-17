"""Extrai texto estruturado de PDFs, DOCX e PPT binário para auxiliar na unificação das apostilas e provas."""

from __future__ import annotations

import json
import struct
from pathlib import Path
from typing import Any

import docx
import olefile
import pymupdf

ROOT_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT_DIR / "materiais-brutos"
EXTRACTED_DIR = RAW_DIR / "extracted"


def extract_pdf(path: Path) -> tuple[str, dict[str, Any]]:
    doc = pymupdf.open(path)
    pages: list[str] = []
    total_chars = 0
    for i, page in enumerate(doc, start=1):
        text = page.get_text("text").strip()
        total_chars += len(text)
        pages.append(f"--- PÁGINA {i} ---\n{text}")
    meta = {
        "pages": len(doc),
        "chars": total_chars,
        "likely_scanned": len(doc) > 0 and (total_chars / len(doc)) < 30,
    }
    doc.close()
    return "\n\n".join(pages), meta


def extract_docx(path: Path) -> tuple[str, dict[str, Any]]:
    document = docx.Document(path)
    parts: list[str] = []
    for para in document.paragraphs:
        t = para.text.strip()
        if t:
            style = para.style.name if para.style else ""
            if "Heading" in style:
                parts.append(f"## {t}")
            else:
                parts.append(t)
    for t_idx, table in enumerate(document.tables, start=1):
        parts.append(f"\n[Tabela {t_idx}]")
        for row in table.rows:
            cells = [c.text.strip().replace("\n", " ") for c in row.cells]
            parts.append(" | ".join(cells))
    text = "\n\n".join(parts)
    return text, {"paragraphs": len(document.paragraphs), "tables": len(document.tables), "chars": len(text)}


def extract_ppt_binary(path: Path) -> tuple[str, dict[str, Any]]:
    """Extrai TextCharsAtom (0x0FA0) e TextBytesAtom (0x0FA8) do stream PowerPoint Document."""
    if not olefile.isOleFile(path):
        return "", {"error": "Não é um arquivo OLE2 válido"}

    texts: list[str] = []
    with olefile.OleFileIO(path) as ole:
        if not ole.exists("PowerPoint Document"):
            return "", {"error": "Stream 'PowerPoint Document' não encontrado"}
        data = ole.openstream("PowerPoint Document").read()

    pos = 0
    n = len(data)
    while pos + 8 <= n:
        ver_inst, rec_type, rec_len = struct.unpack_from("<HHI", data, pos)
        rec_ver = ver_inst & 0x000F
        if rec_ver == 0x000F:
            # Container record: descer para os filhos
            pos += 8
            continue
        payload_start = pos + 8
        payload_end = payload_start + rec_len
        if payload_end > n:
            break
        if rec_type == 0x0FA0:  # TextCharsAtom (UTF-16LE)
            chunk = data[payload_start:payload_end].decode("utf-16le", errors="replace")
            chunk = chunk.replace("\r", "\n").strip()
            if chunk:
                texts.append(chunk)
        elif rec_type == 0x0FA8:  # TextBytesAtom (latin-1 / cp1252)
            chunk = data[payload_start:payload_end].decode("cp1252", errors="replace")
            chunk = chunk.replace("\r", "\n").strip()
            if chunk:
                texts.append(chunk)
        pos = payload_end

    joined = "\n\n---\n\n".join(texts)
    return joined, {"text_atoms": len(texts), "chars": len(joined)}


def main() -> None:
    EXTRACTED_DIR.mkdir(parents=True, exist_ok=True)
    report: list[dict[str, Any]] = []

    for src in sorted(RAW_DIR.rglob("*")):
        if not src.is_file() or EXTRACTED_DIR in src.parents or src.name == "manifest.json":
            continue
        rel = src.relative_to(RAW_DIR)
        out_path = EXTRACTED_DIR / rel.with_suffix(rel.suffix + ".txt")
        out_path.parent.mkdir(parents=True, exist_ok=True)

        ext = src.suffix.lower()
        try:
            if ext == ".pdf":
                text, meta = extract_pdf(src)
            elif ext == ".docx":
                text, meta = extract_docx(src)
            elif ext == ".ppt":
                text, meta = extract_ppt_binary(src)
            else:
                continue
            out_path.write_text(text, encoding="utf-8")
            entry = {"file": rel.as_posix(), "output": out_path.relative_to(RAW_DIR).as_posix(), **meta}
            report.append(entry)
            print(f"[OK] {rel.as_posix()} -> {meta}")
        except Exception as exc:
            entry = {"file": rel.as_posix(), "error": str(exc)}
            report.append(entry)
            print(f"[ERR] {rel.as_posix()} -> {exc}")

    (EXTRACTED_DIR / "extraction_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"[DONE] Extraídos {len(report)} arquivos.")


if __name__ == "__main__":
    main()
