"""Extrai e estrutura as 120 questões oficiais (2014, 2017, 2021) em JSON e renderiza páginas com figuras."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import pymupdf

ROOT_DIR = Path(__file__).resolve().parent.parent
EXTRACTED_PROVA_DIR = ROOT_DIR / "materiais-brutos" / "extracted" / "provas"
PROVA_PDF_DIR = ROOT_DIR / "materiais-brutos" / "provas"
OUT_DIR = ROOT_DIR / "questoes" / "oficiais"
IMG_OUT_DIR = ROOT_DIR / "app" / "public" / "images" / "provas"

GABARITO_OBJ: dict[str, dict[int, str]] = {
    "2014": {
        1: "A", 2: "C", 3: "E", 4: "B", 5: "D", 6: "C", 7: "E", 8: "D",
        9: "A", 10: "B", 11: "D", 12: "A", 13: "D", 14: "B", 15: "A", 16: "E",
        17: "D", 18: "E", 19: "C", 20: "A", 21: "B", 22: "D", 23: "D", 24: "E",
        25: "C", 26: "B", 27: "C", 28: "C", 29: "A", 30: "C", 31: "E", 32: "B",
        33: "C", 34: "C", 35: "C",
    },
    "2017": {
        1: "C", 2: "C", 3: "B", 4: "B", 5: "C", 6: "E", 7: "A", 8: "D",
        9: "C", 10: "E", 11: "A", 12: "C", 13: "E", 14: "ANULADA", 15: "A", 16: "D",
        17: "B", 18: "B", 19: "B", 20: "E", 21: "B", 22: "D", 23: "D", 24: "B",
        25: "B", 26: "E", 27: "A", 28: "E", 29: "A", 30: "C", 31: "B", 32: "D",
        33: "C", 34: "C", 35: "C",
    },
    "2021": {
        1: "E", 2: "C", 3: "B", 4: "B", 5: "A", 6: "A", 7: "C", 8: "D",
        9: "C", 10: "E", 11: "C", 12: "B", 13: "D", 14: "C", 15: "D", 16: "A",
        17: "C", 18: "B", 19: "A", 20: "B", 21: "C", 22: "E", 23: "B", 24: "B",
        25: "E", 26: "E", 27: "D", 28: "A", 29: "D", 30: "E", 31: "A", 32: "C",
        33: "ANULADA", 34: "D", 35: "D",
    },
}

AREA_TITLES: dict[str, str] = {
    "00-formacao-geral": "Formação Geral",
    "01-banco-de-dados": "Banco de Dados",
    "02-engenharia-de-software": "Engenharia de Software",
    "03-estrutura-de-dados": "Estrutura de Dados e Algoritmos",
    "04-gerencia-de-projetos": "Gerência de Projetos",
    "05-inteligencia-artificial": "Inteligência Artificial",
    "06-interacao-humano-computador": "Interação Humano-Computador",
    "07-logica-matematica": "Lógica Matemática",
    "08-matematica-discreta": "Matemática Discreta",
    "09-oac": "Organização e Arquitetura de Computadores",
    "10-redes-de-computadores": "Redes de Computadores",
    "11-sistemas-de-apoio-a-decisao": "Sistemas de Apoio à Decisão",
    "12-sistemas-de-informacao": "Sistemas de Informação",
    "13-sistemas-distribuidos": "Sistemas Distribuídos",
    "14-sistemas-operacionais": "Sistemas Operacionais",
}

AREA_KEYWORDS: list[tuple[str, list[str]]] = [
    ("01-banco-de-dados", ["sql", "sgbd", "normalização", "forma normal", "entidade-relacionamento", "modelo relacional", "chave primária", "chave estrangeira", "select ", "join ", "álgebra relacional", "transação", "acid", "dependência funcional"]),
    ("02-engenharia-de-software", ["uml", "scrum", "kanban", "ágil", "requisitos", "caso de uso", "diagrama de classes", "diagrama de sequência", "teste de software", "manutenção de software", "engenharia de software", "xp", "extreme programming", "refatoração", "padrão de projeto", "design pattern", "mvc", "bpmn", "processo de software", "reuso", "cmmi", "mps.br", "modelo cascata", "espiral"]),
    ("03-estrutura-de-dados", ["árvore", "grafo", "pilha", "fila", "lista encadeada", "busca binária", "ordenação", "quicksort", "mergesort", "complexidade", "big o", "recursão", "vetor", "array", "matriz", "hash", "algoritmo", "for (", "while ("]),
    ("04-gerencia-de-projetos", ["pmbok", "gerência de projetos", "gerenciamento de projetos", "eap", "wbs", "caminho crítico", "pert", "gantt", "risco do projeto", "escopo", "stakeholder", "valor agregado", "evm", "cpi", "spi"]),
    ("05-inteligencia-artificial", ["inteligência artificial", "aprendizado de máquina", "machine learning", "rede neural", "busca heurística", "a*", "minimax", "lógica fuzzy", "algoritmo genético", "sistema especialista", "ontologia", "classificação", "clustering", "mineração de texto"]),
    ("06-interacao-humano-computador", ["usabilidade", "nielsen", "heurística", "acessibilidade", "ihc", "interface", "ux", "experiência do usuário", "ergonomia", "prototipação", "design centrado no usuário", "wcag", "affordance"]),
    ("07-logica-matematica", ["tautologia", "contradição", "tabela-verdade", "proposição", "silogismo", "lógica proposicional", "predicado", "quantificador", "inferência", "equivalência lógica", "implicação lógica"]),
    ("08-matematica-discreta", ["combinatória", "permutação", "probabilidade", "conjunto", "relação de equivalência", "função bijetora", "indução matemática", "teoria dos grafos", "módulo", "congruência", "árvore geradora"]),
    ("09-oac", ["registrador", "pipeline", "cache", "memória principal", "ula", "unidade lógica", "arquitetura von neumann", "risc", "cisc", "barramento", "interrupção", "assembly", "porta lógica", "flip-flop", "cpu"]),
    ("10-redes-de-computadores", ["tcp/ip", "osi", "roteamento", "ip ", "ipv4", "ipv6", "dns", "http", "https", "dhcp", "firewall", "criptografia", "camada de rede", "camada de transporte", "udp", "tcp", "ethernet", "switch", "roteador", "sub-rede", "máscara"]),
    ("11-sistemas-de-apoio-a-decisao", ["data warehouse", "olap", "etl", "business intelligence", "bi ", "cubo", "mineração de dados", "data mining", "apoio à decisão", "sad", "kdd", "tabela fato", "dimensão"]),
    ("13-sistemas-distribuidos", ["sistema distribuído", "sistemas distribuídos", "nuvem", "cloud", "iaas", "paas", "saas", "rpc", "rest", "microsserviço", "consenso", "lamport", "relógio lógico", "tolerância a falhas", "replicação", "soa", "web service", "soap"]),
    ("14-sistemas-operacionais", ["sistema operacional", "sistemas operacionais", "processo", "thread", "escalonamento", "deadlock", "semáforo", "memória virtual", "paginação", "segmentação", "sistema de arquivos", "linux", "round-robin", "fifo", "virtualização", "máquina virtual"]),
    ("12-sistemas-de-informacao", ["sistema de informação", "sistemas de informação", "erp", "crm", "scm", "itil", "cobit", "governança de ti", "segurança da informação", "iso 27001", "lgpd", "planejamento estratégico", "cadeia de valor", "sig", "spt"]),
]


MANUAL_AREA_OVERRIDES: dict[str, str] = {
    "enade-2014-q14": "03-estrutura-de-dados",
    "enade-2014-q18": "12-sistemas-de-informacao",
    "enade-2014-q21": "04-gerencia-de-projetos",
    "enade-2014-q24": "02-engenharia-de-software",
    "enade-2014-q27": "02-engenharia-de-software",
    "enade-2014-q33": "12-sistemas-de-informacao",
    "enade-2014-q34": "12-sistemas-de-informacao",
    "enade-2017-d05": "01-banco-de-dados",
    "enade-2017-q10": "04-gerencia-de-projetos",
    "enade-2017-q12": "12-sistemas-de-informacao",
    "enade-2017-q13": "12-sistemas-de-informacao",
    "enade-2017-q15": "12-sistemas-de-informacao",
    "enade-2017-q16": "06-interacao-humano-computador",
    "enade-2017-q17": "02-engenharia-de-software",
    "enade-2017-q20": "07-logica-matematica",
    "enade-2017-q21": "02-engenharia-de-software",
    "enade-2017-q25": "12-sistemas-de-informacao",
    "enade-2017-q26": "03-estrutura-de-dados",
    "enade-2017-q27": "12-sistemas-de-informacao",
    "enade-2017-q28": "04-gerencia-de-projetos",
    "enade-2017-q29": "12-sistemas-de-informacao",
    "enade-2017-q30": "02-engenharia-de-software",
    "enade-2017-q32": "12-sistemas-de-informacao",
    "enade-2017-q33": "10-redes-de-computadores",
    "enade-2021-d03": "12-sistemas-de-informacao",
    "enade-2021-q10": "12-sistemas-de-informacao",
    "enade-2021-q13": "02-engenharia-de-software",
    "enade-2021-q20": "07-logica-matematica",
    "enade-2021-q23": "01-banco-de-dados",
    "enade-2021-q24": "11-sistemas-de-apoio-a-decisao",
    "enade-2021-q26": "11-sistemas-de-apoio-a-decisao",
    "enade-2021-q27": "09-oac",
    "enade-2021-q28": "12-sistemas-de-informacao",
    "enade-2021-q29": "01-banco-de-dados",
    "enade-2021-q30": "12-sistemas-de-informacao",
    "enade-2021-q32": "02-engenharia-de-software",
    "enade-2021-q34": "12-sistemas-de-informacao",
}


def classify_area(text: str, component: str, qid: str) -> str:
    if component == "formacao_geral":
        return "00-formacao-geral"
    if qid in MANUAL_AREA_OVERRIDES:
        return MANUAL_AREA_OVERRIDES[qid]
    lower = text.lower()
    best_area = "12-sistemas-de-informacao"
    best_score = 0
    for area_id, keywords in AREA_KEYWORDS:
        score = sum(lower.count(kw) for kw in keywords)
        if score > best_score:
            best_score = score
            best_area = area_id
    return best_area


def clean_exam_text(raw: str) -> tuple[str, dict[int, int]]:
    """Remove ruídos de paginação/rascunho mantendo mapa de offsets para páginas."""
    m_cutoff = re.search(r"questi\s*on[áa]rio\s+de\s+percep[çc][ãa]o", raw[len(raw) // 2 :], flags=re.IGNORECASE)
    if m_cutoff:
        raw = raw[: len(raw) // 2 + m_cutoff.start()]

    # Cortar também após o fim da página contendo QUESTÃO 35 (para remover Questionário de Percepção sem título)
    m_q35 = re.search(r"(?im)^\s*QUEST[ÃA]O\s+35\b", raw)
    if m_q35:
        m_next_page = re.search(r"(?m)^---\s*PÁGINA\s+\d+\s*---\s*$", raw[m_q35.end() :])
        if m_next_page:
            after_page = raw[m_q35.end() + m_next_page.end() :]
            # Se a próxima página já começa com QUESTÃO 01 / QUESTÃO 1 do questionário de percepção, corta ali
            if re.search(r"(?im)^\s*QUEST[ÃA]O\s+0?1\b", after_page[:400]):
                raw = raw[: m_q35.end() + m_next_page.start()]

    # Registrar páginas antes de remover marcadores
    page_markers: list[tuple[int, int]] = []
    cleaned_lines: list[str] = []
    current_page = 1
    for line in raw.splitlines():
        m_page = re.match(r"^---\s*PÁGINA\s+(\d+)\s*---\s*$", line.strip())
        if m_page:
            current_page = int(m_page.group(1))
            page_markers.append((sum(len(x) + 1 for x in cleaned_lines), current_page))
            continue
        s = line.strip()
        if not s:
            cleaned_lines.append("")
            continue
        if re.match(r"^\*R\d+\*$", s):
            continue
        if s.upper() in {"SISTEMAS DE INFORMAÇÃO", "ÁREA LIVRE", "RASCUNHO", "FORMAÇÃO GERAL", "COMPONENTE ESPECÍFICO"}:
            continue
        if re.match(r"^\d{1,2}$", s) and int(s) <= 40:
            continue
        cleaned_lines.append(line.rstrip())

    text = "\n".join(cleaned_lines)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text, dict(page_markers)


def page_for_offset(offset: int, page_map: dict[int, int]) -> int:
    page = 1
    for off, p in sorted(page_map.items()):
        if off <= offset:
            page = p
        else:
            break
    return page


def split_options(block: str) -> tuple[str, list[dict[str, str]]]:
    """Separa o enunciado das 5 alternativas A..E usando a ocorrência válida mais próxima do fim."""
    lines = block.splitlines()
    expected = ["A", "B", "C", "D", "E"]
    candidates: dict[str, list[int]] = {l: [] for l in expected}

    for i, line in enumerate(lines):
        stripped = line.strip()
        for letter in expected:
            if re.match(rf"^{letter}(?:[\t ]+|\)\s*|$)", stripped):
                candidates[letter].append(i)

    # Buscar de trás para frente: último E, depois último D < E, etc.
    chosen: dict[str, int] = {}
    upper_bound = len(lines)
    for letter in reversed(expected):
        valid = [idx for idx in candidates[letter] if idx < upper_bound]
        if valid:
            chosen[letter] = valid[-1]
            upper_bound = valid[-1]

    if len(chosen) < 5:
        # Fallback para alternativas em 2 colunas (ex: A D B E C)
        found: dict[str, int] = {}
        for i, line in enumerate(lines):
            s = line.strip()
            if s in expected:
                found[s] = i
        if len(found) == 5:
            ordered = sorted(found.items(), key=lambda kv: kv[1])
            first_idx = ordered[0][1]
            stem = "\n".join(lines[:first_idx]).strip()
            by_letter: dict[str, str] = {}
            for pos, (letter, start_line) in enumerate(ordered):
                end_line = ordered[pos + 1][1] if pos + 1 < 5 else len(lines)
                rest = [lines[j].strip() for j in range(start_line + 1, end_line) if lines[j].strip()]
                by_letter[letter] = "\n".join(rest).strip()
            options = [{"letter": l, "text": by_letter[l]} for l in expected]
            return stem, options
        return block.strip(), []

    first_idx = chosen["A"]
    stem = "\n".join(lines[:first_idx]).strip()
    options: list[dict[str, str]] = []
    for idx, letter in enumerate(expected):
        start_line = chosen[letter]
        end_line = chosen[expected[idx + 1]] if idx + 1 < 5 else len(lines)
        first_part = re.sub(rf"^{letter}(?:[\t ]+|\)\s*)?", "", lines[start_line].strip(), count=1)
        rest = [lines[j].strip() for j in range(start_line + 1, end_line) if lines[j].strip()]
        opt_text = " ".join([first_part] + rest).strip()
        options.append({"letter": letter, "text": opt_text})
    return stem, options


def parse_discursive_rubrics(year: str) -> dict[int, str]:
    txt = (EXTRACTED_PROVA_DIR / f"{year}_gabarito_discursivas_sistemas_informacao.pdf.txt").read_text(encoding="utf-8")
    # Remover marcadores de página
    txt = re.sub(r"---\s*PÁGINA\s+\d+\s*---", "", txt)
    parts = re.split(r"(?im)PADRÃO DE RESPOSTA(?:\s+DAS\s+QUESTÕES\s+DISCURSIVAS)?", txt)
    # Normalmente os últimos 5 blocos após 'PADRÃO DE RESPOSTA' correspondem a D1..D5
    rubrics: dict[int, str] = {}
    candidates = [p.strip() for p in parts[1:] if len(p.strip()) > 60]
    if len(candidates) >= 5:
        candidates = candidates[-5:]
    for idx, content in enumerate(candidates, start=1):
        # Cortar possível cabeçalho da próxima questão discursiva no final
        cut = re.search(r"(?im)^\s*QUESTÃO\s+DISCURSIVA\s+\d+", content)
        if cut:
            content = content[:cut.start()].strip()
        rubrics[idx] = re.sub(r"\n{3,}", "\n\n", content).strip()
    return rubrics


def detect_visual_pages(year: str) -> set[int]:
    doc = pymupdf.open(PROVA_PDF_DIR / f"{year}_prova_sistemas_informacao.pdf")
    visual_pages: set[int] = set()
    threshold = 53 if year == "2014" else 20
    for i, page in enumerate(doc, start=1):
        if i == 1:
            continue
        has_img = len(page.get_images()) > 0
        drawings = [d for d in page.get_drawings() if d.get("rect") and d["rect"].height > 5 and d["rect"].width > 5]
        if has_img or len(drawings) > threshold:
            visual_pages.add(i)
    doc.close()
    return visual_pages


def render_page_image(year: str, page_num: int) -> str:
    IMG_OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_file = IMG_OUT_DIR / f"{year}_p{page_num:02d}.png"
    if not out_file.exists():
        doc = pymupdf.open(PROVA_PDF_DIR / f"{year}_prova_sistemas_informacao.pdf")
        pix = doc[page_num - 1].get_pixmap(dpi=150)
        pix.save(out_file)
        doc.close()
    return f"/images/provas/{out_file.name}"


def clean_pdf_kerning(text: str) -> str:
    """Corrige quebras de kerning/ligadura comuns nos PDFs do INEP (ex: 'ati vidade', 'd esenvolvimento')."""
    text = re.sub(r" {2,}", " ", text)
    replacements = [
        (r"\bd esenvolv", "desenvolv"),
        (r"\bp rodu", "produ"),
        (r"\beconô mic", "econômic"),
        (r"\bdifer entes\b", "diferentes"),
        (r"\billustr", "ilustr"),
        (r"\bill ", "il "),
        (r"\b(a|e|o|de|em|no|na|com|para|sem|por)\b", lambda m: m.group(0)),  # noop anchor
    ]
    # Corrigir separações específicas após ligaduras 'fi' e 'ti' nos PDFs do INEP
    ligature_fixes = [
        (r"\bverifi\s+c", "verific"),
        (r"\bidenti\s+f", "identif"),
        (r"\bsigni\s+f", "signif"),
        (r"\bespecí\s+fi", "específi"),
        (r"\bdefi\s+n", "defin"),
        (r"\bconfi\s+g", "config"),
        (r"\bconfi\s+r", "confir"),
        (r"\bbenefí\s+c", "benefíc"),
        (r"\bgráfi\s+c", "gráfic"),
        (r"\bdifí\s+c", "difíc"),
        (r"\bcientí\s+fi", "científi"),
        (r"\bobjeti\s+v", "objetiv"),
        (r"\bati\s+v", "ativ"),
        (r"\bati\s+n", "atin"),
        (r"\besti\s+m", "estim"),
        (r"\bparti\s+r\b", "partir"),
        (r"\bparti\s+c", "partic"),
        (r"\bconsti\s+t", "constit"),
        (r"\binsti\s+t", "instit"),
        (r"\bpráti\s+c", "prátic"),
        (r"\bartísti\s+c", "artístic"),
        (r"\bpolíti\s+c", "polític"),
        (r"\bestatísti\s+c", "estatístic"),
        (r"\binformáti\s+c", "informátic"),
        (r"\bmatemáti\s+c", "matemátic"),
        (r"\bmúlti\s+p", "múltip"),
        (r"\buti\s+l", "util"),
        (r"\bquesti\s+o", "questio"),
        (r"\bsemi\s+óti", "semióti"),
        (r"\bsemióti\s+c", "semiótic"),
        (r"\bgaranti\s+r\b", "garantir"),
        (r"\bgaranti\s+n", "garantin"),
        (r"\bdebati\s+d", "debatid"),
        (r"\bdiscuti\s+r\b", "discutir"),
        (r"\bdiscuti\s+d", "discutid"),
        (r"\brealiza\s+d", "realizad"),
        (r"\bcompu\s+t", "comput"),
        (r"\baplica\s+t", "aplicat"),
        (r"\btranspor\s+t", "transport"),
        (r"\bcarac\s+ter", "caracter"),
        (r"\bimplemen\s+t", "implement"),
        (r"\badmi\s+n", "admin"),
        (r"\bsis\s+tem", "sistem"),
        (r"\barti\s+g", "artig"),
        (r"\bcríti\s+c", "crític"),
        (r"\bautomo\s+ti\s+v", "automotiv"),
        (r"\bautomoƟvo\b", "Automotivo"),
    ]
    for pat, repl in replacements[:6]:
        text = re.sub(pat, repl, text, flags=re.IGNORECASE)
    for pat, repl in ligature_fixes:
        text = re.sub(pat, repl, text, flags=re.IGNORECASE)
    return text


def load_exam_raw_text(year: str) -> str:
    raw = (EXTRACTED_PROVA_DIR / f"{year}_prova_sistemas_informacao.pdf.txt").read_text(encoding="utf-8")
    if year == "2021":
        # No PDF de 2021, o cabeçalho 'QUESTÃO 31' aparece no stream após *R27202134* no fim da p.34;
        # movê-lo para o início da p.34 para manter a ordem visual correta.
        raw = re.sub(
            r"(---\s*PÁGINA\s+34\s*---\s*\n34\s*\nSistemas de informação\s*\n)(.*?)(\*R27202134\*\s*\n\s*QUESTÃO 31\s*\n)",
            r"\1QUESTÃO 31\n\2*R27202134*\n",
            raw,
            flags=re.DOTALL,
        )
    cleaned = raw.replace("\ufb01", "fi").replace("\ufb02", "fl").replace("\t", " ").replace("mÅ ", "• ")
    return clean_pdf_kerning(cleaned)


def parse_exam(year: str) -> list[dict[str, Any]]:
    raw = load_exam_raw_text(year)
    text, page_map = clean_exam_text(raw)
    rubrics = parse_discursive_rubrics(year)
    visual_pages = detect_visual_pages(year)

    header_re = re.compile(r"(?im)^\s*(QUEST[ÃA]O\s+(?:(DISCURSIVA)\s+)?0?(\d+))\s*$")
    matches = list(header_re.finditer(text))
    questions: list[dict[str, Any]] = []

    for idx, m in enumerate(matches):
        start = m.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        block = text[start:end].strip()
        is_disc = m.group(2) is not None
        num = int(m.group(3))
        p_start = page_for_offset(m.start(), page_map)
        p_end = page_for_offset(end - 1, page_map)

        if is_disc:
            component = "formacao_geral" if num <= 2 else "especifico"
            q_type = "discursiva"
            stem = block
            options: list[dict[str, str]] = []
            correct_answer = None
            annulled = False
            rubric_text = rubrics.get(num, "")
            qid = f"enade-{year}-d{num:02d}"
            label = f"ENADE {year} • Discursiva {num:02d}"
        else:
            component = "formacao_geral" if num <= 8 else "especifico"
            q_type = "objetiva"
            stem, options = split_options(block)
            ans = GABARITO_OBJ[year].get(num, "")
            annulled = ans == "ANULADA"
            correct_answer = None if annulled else ans
            rubric_text = None
            qid = f"enade-{year}-q{num:02d}"
            label = f"ENADE {year} • Questão {num:02d}"
            if year == "2021" and num == 33 and len(options) != 5:
                options = [{"letter": l, "text": f"Alternativa {l} — ver diagrama na imagem da página 37"} for l in "ABCDE"]

        area_id = classify_area(stem, component, qid)

        image_urls: list[str] = []
        mentions_visual = any(
            kw in block.lower()
            for kw in ["figura", "gráfico", "diagrama", "charge", "tirinha", "infográfico", "esquema", "quadro a seguir", "modelo abaixo", "modelo de entidades", "ilustração", "tabela-verdade", "áreas hachuradas", "conjuntos a seguir"]
        )
        if mentions_visual or (year == "2021" and num == 33):
            for p in range(p_start, p_end + 1):
                if p in visual_pages or (year == "2017" and num == 20) or (year == "2021" and num == 33 and p == 37):
                    image_urls.append(render_page_image(year, p))

        questions.append(
            {
                "id": qid,
                "label": label,
                "source": "oficial",
                "year": int(year),
                "examNumber": num,
                "component": component,
                "areaId": area_id,
                "areaName": AREA_TITLES[area_id],
                "type": q_type,
                "difficulty": "media",
                "annulled": annulled,
                "stem": stem,
                "options": options,
                "correctAnswer": correct_answer,
                "explanation": (
                    "Questão anulada no gabarito oficial definitivo do INEP."
                    if annulled
                    else (
                        f"Gabarito oficial definitivo INEP ({year}): alternativa {correct_answer}."
                        if q_type == "objetiva"
                        else "Compare sua resposta com o padrão oficial de correção do INEP abaixo."
                    )
                ),
                "discursiveRubric": rubric_text,
                "imageUrls": image_urls,
                "topics": [],
            }
        )
    return questions


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for year in ["2014", "2017", "2021"]:
        qs = parse_exam(year)
        out_file = OUT_DIR / f"{year}.json"
        out_file.write_text(json.dumps(qs, ensure_ascii=False, indent=2), encoding="utf-8")
        missing_opts = [q["id"] for q in qs if q["type"] == "objetiva" and len(q["options"]) != 5]
        empty_rubric = [q["id"] for q in qs if q["type"] == "discursiva" and not q["discursiveRubric"]]
        with_imgs = [q["id"] for q in qs if q["imageUrls"]]
        print(
            f"[{year}] total={len(qs)} | missing_opts={missing_opts} | empty_rubric={empty_rubric} | with_imgs={with_imgs}"
        )


if __name__ == "__main__":
    main()
