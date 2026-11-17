"""Valida integridade das apostilas e do banco de questões (oficiais + inéditas) e gera banco-unificado.json."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).resolve().parent.parent
APOSTILAS_DIR = ROOT_DIR / "apostilas"
QUESTOES_DIR = ROOT_DIR / "questoes"
OFICIAIS_DIR = QUESTOES_DIR / "oficiais"
INEDITAS_DIR = QUESTOES_DIR / "ineditas"

VALID_AREAS = {
    "00-formacao-geral",
    "01-banco-de-dados",
    "02-engenharia-de-software",
    "03-estrutura-de-dados",
    "04-gerencia-de-projetos",
    "05-inteligencia-artificial",
    "06-interacao-humano-computador",
    "07-logica-matematica",
    "08-matematica-discreta",
    "09-oac",
    "10-redes-de-computadores",
    "11-sistemas-de-apoio-a-decisao",
    "12-sistemas-de-informacao",
    "13-sistemas-distribuidos",
    "14-sistemas-operacionais",
}


def validate_question(q: dict[str, Any], origin_file: str) -> list[str]:
    errs: list[str] = []
    required = ["id", "source", "year", "component", "areaId", "areaName", "type", "stem", "options"]
    for field in required:
        if field not in q:
            errs.append(f"{origin_file}: questão sem campo '{field}' ({q.get('id', '?')})")

    qid = q.get("id", "?")
    if q.get("areaId") not in VALID_AREAS:
        errs.append(f"{origin_file} [{qid}]: areaId inválido '{q.get('areaId')}'")
    if q.get("component") not in {"formacao_geral", "especifico"}:
        errs.append(f"{origin_file} [{qid}]: component inválido '{q.get('component')}'")
    if not str(q.get("stem", "")).strip():
        errs.append(f"{origin_file} [{qid}]: stem vazio")

    q_type = q.get("type")
    if q_type == "objetiva":
        opts = q.get("options", [])
        if len(opts) != 5:
            errs.append(f"{origin_file} [{qid}]: objetiva deve ter 5 opções, tem {len(opts)}")
        else:
            letters = [o.get("letter") for o in opts]
            if letters != ["A", "B", "C", "D", "E"]:
                errs.append(f"{origin_file} [{qid}]: letras inválidas {letters}")
            if any(not str(o.get("text", "")).strip() for o in opts):
                errs.append(f"{origin_file} [{qid}]: opção com texto vazio")
        if not q.get("annulled", False):
            if q.get("correctAnswer") not in {"A", "B", "C", "D", "E"}:
                errs.append(f"{origin_file} [{qid}]: correctAnswer inválido '{q.get('correctAnswer')}'")
    elif q_type == "discursiva":
        if not str(q.get("discursiveRubric") or "").strip():
            errs.append(f"{origin_file} [{qid}]: discursiva sem discursiveRubric")
    else:
        errs.append(f"{origin_file} [{qid}]: type inválido '{q_type}'")

    return errs


def main() -> None:
    errors: list[str] = []
    all_questions: list[dict[str, Any]] = []
    seen_ids: set[str] = set()

    # 1. Validar apostilas (.md e .pdf)
    for area_id in sorted(VALID_AREAS):
        md_path = APOSTILAS_DIR / area_id / "apostila.md"
        pdf_path = APOSTILAS_DIR / area_id / "apostila.pdf"
        if not md_path.exists() or md_path.stat().st_size < 500:
            errors.append(f"Apostila Markdown ausente ou muito curta: {md_path}")
        if not pdf_path.exists() or pdf_path.stat().st_size < 2000:
            errors.append(f"Apostila PDF ausente ou inválida: {pdf_path}")

    indice_path = APOSTILAS_DIR / "indice.json"
    if not indice_path.exists():
        errors.append("apostilas/indice.json não encontrado")
    else:
        indice = json.loads(indice_path.read_text(encoding="utf-8"))
        if len(indice.get("areas", [])) != len(VALID_AREAS):
            errors.append(f"indice.json deveria listar {len(VALID_AREAS)} áreas, encontrou {len(indice.get('areas', []))}")

    # 2. Validar questões oficiais
    for fpath in sorted(OFICIAIS_DIR.glob("*.json")):
        items = json.loads(fpath.read_text(encoding="utf-8"))
        for q in items:
            errors.extend(validate_question(q, fpath.name))
            qid = q.get("id", "")
            if qid in seen_ids:
                errors.append(f"ID duplicado: {qid}")
            seen_ids.add(qid)
            all_questions.append(q)

    # 3. Validar questões inéditas
    for area_id in sorted(VALID_AREAS):
        fpath = INEDITAS_DIR / f"{area_id}.json"
        if not fpath.exists():
            errors.append(f"Arquivo de inéditas ausente: {fpath.name}")
            continue
        items = json.loads(fpath.read_text(encoding="utf-8"))
        if len(items) < 10:
            errors.append(f"{fpath.name}: esperado >= 10 questões inéditas, encontrou {len(items)}")
        for q in items:
            errors.extend(validate_question(q, fpath.name))
            qid = q.get("id", "")
            if qid in seen_ids:
                errors.append(f"ID duplicado: {qid}")
            seen_ids.add(qid)
            all_questions.append(q)

    if errors:
        print(f"[FAIL] {len(errors)} erros encontrados:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        sys.exit(1)

    unified_path = QUESTOES_DIR / "banco-unificado.json"
    unified_path.write_text(
        json.dumps(
            {
                "version": "1.0.0",
                "totalQuestions": len(all_questions),
                "officialCount": sum(1 for q in all_questions if q["source"] == "oficial"),
                "ineditaCount": sum(1 for q in all_questions if q["source"] == "inedita"),
                "questions": all_questions,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(
        f"[OK] Validação 100% aprovada! {len(all_questions)} questões "
        f"({sum(1 for q in all_questions if q['source'] == 'oficial')} oficiais + "
        f"{sum(1 for q in all_questions if q['source'] == 'inedita')} inéditas) em {unified_path.name}."
    )


if __name__ == "__main__":
    main()
