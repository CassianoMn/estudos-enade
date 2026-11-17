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

EXTRA_VISUAL_PAGES: dict[str, set[int]] = {
    "2014": {4, 7, 14, 28},
    "2017": {18, 23, 28},
    "2021": set(),
}

SKIP_VISUAL_QIDS = {"enade-2014-q07", "enade-2017-d05"}

ENCLITIC_SUFFIXES = {"se", "lo", "la", "los", "las", "me", "te", "nos", "vos", "lhe", "lhes"}

PARAGRAPH_STARTERS = (
    "Considerando",
    "Com base",
    "A partir",
    "Nesse contexto",
    "Diante desse",
    "Diante disso",
    "Em relação",
    "A respeito",
    "Tendo em vista",
    "No que se refere",
    "Assinale",
    "É correto",
    "São comandos",
    "Qual ",
    "Entre os ",
    "Para que ",
    "Com relação",
    "Suponha",
    "Observação:",
    "Obs.:",
)


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

    m_q35 = re.search(r"(?im)^\s*QUEST[ÃA]O\s+35\b", raw)
    if m_q35:
        m_next_page = re.search(r"(?m)^---\s*PÁGINA\s+\d+\s*---\s*$", raw[m_q35.end() :])
        if m_next_page:
            after_page = raw[m_q35.end() + m_next_page.end() :]
            if re.search(r"(?im)^\s*QUEST[ÃA]O\s+0?1\b", after_page[:400]):
                raw = raw[: m_q35.end() + m_next_page.start()]

    raw_lines = raw.splitlines()
    cleaned_lines: list[str] = []
    lines_since_page_marker = 99

    for idx, line in enumerate(raw_lines):
        m_page = re.match(r"^---\s*PÁGINA\s+(\d+)\s*---\s*$", line.strip())
        if m_page:
            current_page = int(m_page.group(1))
            cleaned_lines.append(f"<<<PAGE_{current_page}>>>")
            lines_since_page_marker = 0
            continue

        lines_since_page_marker += 1
        s = line.strip()
        if not s:
            cleaned_lines.append("")
            continue
        if re.match(r"^\*R\d+\*$", s):
            continue
        if re.match(r"^(?:\d{1,2}\s*)?SISTEMAS DE INFORMAÇÃO$", s, flags=re.IGNORECASE):
            continue
        if s.upper() in {"ÁREA LIVRE", "RASCUNHO", "FORMAÇÃO GERAL", "COMPONENTE ESPECÍFICO"}:
            continue

        next_non_empty = ""
        for look_idx in range(idx + 1, min(idx + 4, len(raw_lines))):
            cand = raw_lines[look_idx].strip()
            if cand:
                next_non_empty = cand
                break

        if re.match(r"^\d{1,2}$", s) and (
            lines_since_page_marker <= 2
            or re.match(r"^SISTEMAS DE INFORMAÇÃO$", next_non_empty, flags=re.IGNORECASE)
        ):
            continue

        cleaned = re.sub(r"\s+\d{1,2}\s*SISTEMAS DE INFORMAÇÃO\s*$", "", line.rstrip(), flags=re.IGNORECASE)
        cleaned_lines.append(cleaned)

    text = "\n".join(cleaned_lines)
    text = re.sub(r"(?:\n\s*(?:1[0-5]|[1-9])){10,}\s*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"(?:\n\s*(?:1[0-5]|[1-9])){10,}(?=\n(?:QUEST[ÃA]O|PADRÃO|$))", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\n{3,}", "\n\n", text)

    page_markers: dict[int, int] = {}
    final_parts: list[str] = []
    pos = 0
    for part in re.split(r"(<<<PAGE_\d+>>>\n?)", text):
        m_tag = re.match(r"^<<<PAGE_(\d+)>>>\n?$", part)
        if m_tag:
            page_markers[pos] = int(m_tag.group(1))
        else:
            final_parts.append(part)
            pos += len(part)
    text = "".join(final_parts)
    return text, page_markers


def page_for_offset(offset: int, page_map: dict[int, int]) -> int:
    page = 1
    for off, p in sorted(page_map.items()):
        if off <= offset:
            page = p
        else:
            break
    return page


def rejoin_hyphenated_words(text: str) -> str:
    def _repl(match: re.Match[str]) -> str:
        before, after = match.group(1), match.group(2)
        if after.lower() in ENCLITIC_SUFFIXES:
            return f"{before}-{after}"
        return f"{before}{after}"

    return re.sub(r"([A-Za-zÀ-ÿ]+)-\s*\n\s*([a-zà-ÿ]+)", _repl, text)


def clean_pdf_kerning(text: str) -> str:
    """Corrige quebras de kerning/ligadura comuns nos PDFs do INEP."""
    text = (
        text.replace("\ufb01", "fi")
        .replace("\ufb02", "fl")
        .replace("\uf0b7", "•")
        .replace("\uf0fc", "•")
        .replace("\uf09f", "•")
        .replace("\uf0a7", "•")
        .replace("\t", " ")
        .replace("mÅ ", "• ")
    )
    text = re.sub(r" {2,}", " ", text)

    exact_fixes = [
        (r"\btEXtO\s+i\b", "TEXTO I"),
        (r"\btEXtO\s+ii\b", "TEXTO II"),
        (r"\bCapítulo\s+i\b", "Capítulo I"),
        (r"\bconstituição\s+Federal\b", "Constituição Federal"),
        (r"\bdireito,\s+arte\s+e\s+liberdade\b", "Direito, arte e liberdade"),
        (r"\bGuatt\s+ari\b", "Guattari"),
        (r"\bh\s+ttp", "http"),
        (r"\bhtt\s+(ps?://)", r"htt\1"),
        (r"\bd\s+esenvolv", "desenvolv"),
        (r"\bp\s+rodu", "produ"),
        (r"\beconô\s+mic", "econômic"),
        (r"\bdifer\s+entes\b", "diferentes"),
        (r"\billustr", "ilustr"),
        (r"\bill\s+", "il "),
        (r"\borga\s+nizaç", "organizaç"),
        (r"\bp\s+rioriz", "prioriz"),
        (r"\birrito\s+u\b", "irritou"),
        (r"\bum\s+a\b", "uma"),
        (r"\bu\s+ma\b", "uma"),
        (r"\bma\s+is\b", "mais"),
        (r"\bpa\s+ra\b", "para"),
        (r"\bp\s+ara\b", "para"),
        (r"\bbai\s+xa\b", "baixa"),
        (r"\bca\s+paz\b", "capaz"),
        (r"\bte\s+las\b", "telas"),
        (r"\bpon\s+tos\b", "pontos"),
        (r"\bfic\s+ha\b", "ficha"),
        (r"\bmulhe\s+r\b", "mulher"),
        (r"\beducaç\s+ão\b", "educação"),
        (r"\bcompilaç\s+ão\b", "compilação"),
        (r"\bcomeç\s+a\b", "começa"),
        (r"\baç\s+ões\b", "ações"),
        (r"\baçõ\s+es\b", "ações"),
        (r"\bcoordenaçã\s+o\b", "coordenação"),
        (r"\binformaç\s+ões\b", "informações"),
        (r"\bNotati\s+on\b", "Notation"),
        (r"\breti\s+rar\b", "retirar"),
        (r"\bhaiti\s+anos\b", "haitianos"),
        (r"\bha\s+itian", "haitian"),
        (r"\blideranç\s+a\b", "liderança"),
        (r"\bnã\s+o\b", "não"),
        (r"\bganha\s+ndo\b", "ganhando"),
        (r"\bforma\s+to\b", "formato"),
        (r"\bnecess\s+idade\b", "necessidade"),
        (r"\bexem\s+plo\b", "exemplo"),
        (r"\bafazer\s+es\b", "afazeres"),
        (r"\bc\s+onfunde\b", "confunde"),
        (r"\btransmi\s+ssão\b", "transmissão"),
        (r"\bs\s+equência\b", "sequência"),
        (r"\bC\s+línicas\b", "Clínicas"),
        (r"\bdese\s+nvolvedor\b", "desenvolvedor"),
        (r"\bmódu\s+los\b", "módulos"),
        (r"\brespe\s+ctivo\b", "respectivo"),
        (r"\btécn\s+ica\b", "técnica"),
        (r"\butil\s+izadas\b", "utilizadas"),
        (r"\bes\s+truturado\b", "estruturado"),
        (r"\bS\s+abe-se\b", "Sabe-se"),
        (r"\bantecessor\s+es\b", "antecessores"),
        (r"\bconve\s+rsa\b", "conversa"),
        (r"\bprestado\s+s\b", "prestados"),
        (r"\btem\s+os\b", "temos"),
        (r"\btext\s+o\b", "texto"),
        (r"\bpar\s+a\b", "para"),
        (r"\bqu\s+antidade\b", "quantidade"),
        (r"\bent\s+rega\b", "entrega"),
        (r"\bprod\s+utos\b", "produtos"),
        (r"\br\s+eemitir\b", "reemitir"),
        (r"\brela\s+cionamento\b", "relacionamento"),
        (r"\bObr\s+a\b", "Obra"),
        (r"\be\s+strangeira\b", "estrangeira"),
        (r"\bmes\s+es\b", "meses"),
        (r"\btransporta\s+dores\b", "transportadores"),
        (r"\bdi\s+sponibilidade\b", "disponibilidade"),
        (r"\bdisponibi\s+lidade\b", "disponibilidade"),
        (r"\bresu\s+ltados\b", "resultados"),
        (r"\bap\s+ontador\b", "apontador"),
        (r"\bdife\s+rença\b", "diferença"),
        (r"\bágu\s+a\b", "água"),
        (r"\bAcordo\s+s\b", "Acordos"),
        (r"\bfuncionár\s+ias\b", "funcionárias"),
        (r"\bpossuí\s+r\b", "possuir"),
        (r"\bcomercializa\s+ção\b", "comercialização"),
        (r"\bsu\s+as\b", "suas"),
        (r"\bmensal\s+mente\b", "mensalmente"),
        (r"\bcom\s+putacionais\b", "computacionais"),
        (r"\bcompu\s+tacionais\b", "computacionais"),
        (r"\bidentifi\s+cação\b", "identificação"),
        (r"\biden\s+tificou\b", "identificou"),
        (r"\bsignific\s+ativa\b", "significativa"),
        (r"\bsubmeteu\s+simultaneament\s+e\b", "submeteu simultaneamente"),
        (r"\btrabalh\s+a\b", "trabalha"),
        (r"\bseria\s+lizam\b", "serializam"),
        (r"\bo\s+s\s+acessos\b", "os acessos"),
        (r"\bcorre\s+ção\b", "correção"),
        (r"\bcompo\s+nentes\b", "componentes"),
        (r"\bco\s+mponentes\b", "componentes"),
        (r"\bsu\s+portar\b", "suportar"),
        (r"\bp\s+ode\b", "pode"),
        (r"\bdevidamen\s+te\b", "devidamente"),
        (r"\bautomoƟvo\b", "Automotivo"),
        (r"\bConceitutal\b", "Conceitual"),
        (r"\bbeneficios\b", "benefícios"),
        (r"\bfisica\b", "física"),
        (r"\bdificil\b", "difícil"),
        (r"\boficio\b", "ofício"),
        (r"\bqu\s+e\b", "que"),
        (r"\bcl\s+iente\b", "cliente"),
        (r"\bi\s+ndivíduos\b", "indivíduos"),
        (r"\bmelhor\s+á-lo\b", "melhorá-lo"),
        (r"\bd\s+essa\b", "dessa"),
        (r"\bcontribuiçõe\s+s\b", "contribuições"),
        (r"\bcom\s+paração\b", "comparação"),
        (r"\bR\s+eino\b", "Reino"),
        (r"\bche\s+gando\b", "chegando"),
        (r"\bob\s+jetivo\b", "objetivo"),
        (r"\bho\s+mem\b", "homem"),
        (r"\bsífili\s+s\b", "sífilis"),
        (r"\bpú\s+blicas\b", "públicas"),
        (r"\bmo\s+strado\b", "mostrado"),
        (r"\bfu\s+i\b", "fui"),
        (r"\btomad\s+a\b", "tomada"),
        (r"\bfra\s+gmentos\b", "fragmentos"),
        (r"\bd\s+a\b", "da"),
        (r"\bhidrorretentor\s+es\b", "hidrorretentores"),
        (r"\bes\s+tudos\b", "estudos"),
        (r"\bc\s+om\b", "com"),
        (r"\bcomercialmen\s+te\b", "comercialmente"),
        (r"\bsup\s+erabsorventes\b", "superabsorventes"),
        (r"\binfluê\s+ncia\b", "influência"),
        (r"\ba\s+colhidos\b", "acolhidos"),
        (r"\bxenofóbi\s+cos\b", "xenofóbicos"),
        (r"\bs\s+erviu\b", "serviu"),
        (r"\bód\s+io\b", "ódio"),
        (r"\baum\s+entando\b", "aumentando"),
        (r"\bimigr\s+antes\b", "imigrantes"),
        (r"\bexpre\s+ssões\b", "expressões"),
        (r"\bA\s+té\b", "Até"),
        (r"\bap\s+resenta\b", "apresenta"),
        (r"\bprimeir\s+a\b", "primeira"),
        (r"\bculi\s+nária\b", "culinária"),
        (r"\bmunicí\s+pio\b", "município"),
        (r"\bM\s+ulembá\b", "Mulembá"),
        (r"\bimpermeabili\s+zante\b", "impermeabilizante"),
        (r"\bto\s+rta\b", "torta"),
        (r"\bproduz\s+idas\b", "produzidas"),
        (r"\bprincipalmen\s+te\b", "principalmente"),
        (r"\bpela\s+s\b", "pelas"),
        (r"\btípi\s+co\b", "típico"),
        (r"\ba\s+genda\b", "agenda"),
        (r"\bSust\s+entável\b", "Sustentável"),
        (r"\bcu\s+mprimento\b", "cumprimento"),
        (r"\bTe\s+cnologia\b", "Tecnologia"),
        (r"\bus\s+uário\b", "usuário"),
        (r"\beconomizand\s+o\b", "economizando"),
        (r"\bassi\s+m\b", "assim"),
        (r"\bAli\s+mentação\b", "Alimentação"),
        (r"\brelacio\s+nados\b", "relacionados"),
        (r"\btecnologia\s+s\b", "tecnologias"),
        (r"\bti\s+ver\b", "tiver"),
        (r"\bti\s+po\b", "tipo"),
        (r"\brepre\s+sentado\b", "representado"),
    ]
    for pat, repl in exact_fixes:
        text = re.sub(pat, repl, text)

    for _ in range(3):
        text = re.sub(
            r"\b(?!ti\b|si\b|travesti\b)([A-Za-zÀ-ÿ]*(?:fi|fí|ti|tí))\s+([a-záéíóúâêôãõç]+)\b",
            r"\1\2",
            text,
        )

    text = re.sub(r"(?<=[A-Za-zÀ-ÿ0-9”’\"'\)\]])\s+([.,?!])(?=\s|$)", r"\1", text)
    text = re.sub(r"([A-Za-zÀ-ÿ0-9”’\"'\)\]])\s+;(?!\s*\w+=)", r"\1;", text)
    return text


def is_citation_line(line: str) -> bool:
    s = line.strip()
    return bool(
        re.match(r"^(?:Disponível em:|Acesso em:|FONTE:|Fonte:|CENSO \d{4}/IBGE)", s)
        or re.match(r"^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,},\s+[A-Z]", s)
        or re.match(r"^(?:BRASIL|PMI)\.\s+", s)
    )


def format_prose_markdown(text: str) -> str:
    """Converte linhas quebradas de PDF em parágrafos Markdown fluidos e estruturados."""
    text = rejoin_hyphenated_words(text)
    raw_lines = [l.strip() for l in text.splitlines()]

    blocks: list[str] = []
    current_lines: list[str] = []
    in_citation = False

    def flush_current() -> None:
        nonlocal current_lines, in_citation
        if not current_lines:
            return
        joined = " ".join(current_lines).strip()
        joined = re.sub(r" {2,}", " ", joined)
        if joined:
            blocks.append(joined)
        current_lines = []
        in_citation = False

    for line in raw_lines:
        if not line:
            flush_current()
            continue

        if re.match(r"^TEXTO\s+(I{1,3}|[12])$", line, flags=re.IGNORECASE):
            flush_current()
            blocks.append(f"**{line.upper()}**")
            continue

        if line.upper() == "PORQUE":
            flush_current()
            blocks.append("**PORQUE**")
            continue

        if line.startswith("•"):
            flush_current()
            current_lines = ["- " + line[1:].strip()]
            continue

        if re.match(r"^(?:[IVX]+\.|[a-z]\))\s+", line):
            flush_current()
            current_lines = [line]
            continue

        if is_citation_line(line):
            if not in_citation:
                flush_current()
                in_citation = True
            current_lines.append(line)
            continue

        if in_citation:
            prev_joined = " ".join(current_lines)
            citation_ended = bool(
                re.search(r"(?:\(adaptado\)\.|Acesso em:[^.]+\.|p\.\s*\d+(?:-\d+)?\.|\d{4}\.)$", prev_joined)
            )
            continues_citation = bool(
                re.match(r"^(?:Acesso em:|Disponível em:|São Paulo:|Rio de Janeiro:|v\.|n\.|p\.|Ed\.|ed\.|\d{4}\b)", line)
            )
            if citation_ended and not continues_citation:
                flush_current()
            elif not any(line.startswith(p) for p in PARAGRAPH_STARTERS):
                current_lines.append(line)
                continue
            else:
                flush_current()

        if current_lines:
            prev = current_lines[-1]
            prev_ends_sentence = bool(re.search(r"[.?!:]$|\(adaptado\)\.$|pontos\)\.$", prev))
            if prev_ends_sentence and any(line.startswith(p) for p in PARAGRAPH_STARTERS):
                flush_current()
            elif prev_ends_sentence and len(prev) < 42 and not current_lines[0].startswith(("- ", "I.", "II.", "III.", "IV.", "V.")):
                flush_current()

        current_lines.append(line)

    flush_current()
    result = "\n\n".join(blocks)
    result = re.sub(r"\n{3,}", "\n\n", result)
    return result.strip()


def clean_option_text(text: str, preserve_lines: bool = False) -> str:
    text = clean_pdf_kerning(text)
    if preserve_lines:
        lines = [l.rstrip() for l in text.splitlines() if l.strip()]
        return "\n".join(lines).strip()
    text = " ".join(l.strip() for l in text.splitlines() if l.strip())
    return re.sub(r" {2,}", " ", text).strip()


def split_options(block: str, qid: str) -> tuple[str, list[dict[str, str]]]:
    """Separa o enunciado das 5 alternativas A..E preservando formatação especial quando necessário."""
    lines = block.splitlines()
    expected = ["A", "B", "C", "D", "E"]
    candidates: dict[str, list[int]] = {l: [] for l in expected}

    for i, line in enumerate(lines):
        stripped = line.strip()
        for letter in expected:
            if re.match(rf"^{letter}(?:[\t ]+|\)\s*|$)", stripped):
                candidates[letter].append(i)

    chosen: dict[str, int] = {}
    upper_bound = len(lines)
    for letter in reversed(expected):
        valid = [idx for idx in candidates[letter] if idx < upper_bound]
        if valid:
            chosen[letter] = valid[-1]
            upper_bound = valid[-1]

    preserve_code = qid in {"enade-2014-q09", "enade-2021-q23"}

    if len(chosen) < 5:
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
                rest = [lines[j].rstrip() for j in range(start_line + 1, end_line) if lines[j].strip()]
                raw_opt = "\n".join(rest).strip()
                by_letter[letter] = clean_option_text(raw_opt, preserve_lines=True)
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
        rest = [lines[j].rstrip() for j in range(start_line + 1, end_line) if lines[j].strip()]
        raw_opt = "\n".join(([first_part] if first_part else []) + rest).strip()

        if qid == "enade-2017-q01" and letter == "E":
            cut = raw_opt.find("Contribuições para a UE")
            if cut != -1:
                raw_opt = raw_opt[:cut].strip()
        if qid == "enade-2017-q23" and letter == "E":
            raw_opt = re.sub(r"\s*Tabela1\s+Tabela2\s*$", "", raw_opt).strip()

        opt_text = clean_option_text(raw_opt, preserve_lines=preserve_code)
        if qid == "enade-2021-q23":
            opt_text = f"```sql\n{opt_text}\n```"
        elif qid == "enade-2014-q09":
            opt_text = re.sub(r"\s+(4\.|5\.)\s+", r"\n\1 ", opt_text)
            opt_text = f"```c\n{opt_text}\n```"

        options.append({"letter": letter, "text": opt_text})
    return stem, options


def parse_discursive_rubrics(year: str) -> dict[int, str]:
    txt = (EXTRACTED_PROVA_DIR / f"{year}_gabarito_discursivas_sistemas_informacao.pdf.txt").read_text(encoding="utf-8")
    txt = re.sub(r"---\s*PÁGINA\s+\d+\s*---", "", txt)
    txt = re.sub(r"(?im)^\s*Sistemas de Informação\s*$", "", txt)
    parts = re.split(r"(?im)PADRÃO DE RESPOSTA(?:\s+DAS\s+QUESTÕES\s+DISCURSIVAS)?", txt)
    rubrics: dict[int, str] = {}
    candidates = [p.strip() for p in parts[1:] if len(p.strip()) > 60]
    if len(candidates) >= 5:
        candidates = candidates[-5:]
    for idx, content in enumerate(candidates, start=1):
        cut = re.search(r"(?im)^\s*QUESTÃO\s+DISCURSIVA\s+\d+", content)
        if cut:
            content = content[:cut.start()].strip()
        content = clean_pdf_kerning(content)
        qid = f"enade-{year}-d{idx:02d}"
        if qid == "enade-2014-d03":
            rubrics[idx] = (
                "O estudante deve apresentar um algoritmo com pesquisa binária.\n\n"
                "A seguir são apresentados dois exemplos de resposta escritos em linguagem de programação C: "
                "um utilizando a abordagem iterativa e outro utilizando a abordagem recursiva.\n\n"
                "**Solução iterativa:**\n\n"
                "```c\n"
                "// x: valor a ser pesquisado, n: tamanho do vetor, v: vetor de valores\n"
                "// Se encontrar retorna o índice do vetor, senão retorna -1\n"
                "int buscaBinaria(int x, int n, int v[]) {\n"
                "   int e, m, d;\n"
                "   e = 0; d = n - 1;\n"
                "   while (e <= d) {\n"
                "      m = (e + d) / 2;\n"
                "      if (v[m] == x)\n"
                "         return m;\n"
                "      if (v[m] < x)\n"
                "         e = m + 1;\n"
                "      else\n"
                "         d = m - 1;\n"
                "   }\n"
                "   return -1;\n"
                "}\n"
                "```\n\n"
                "**Solução recursiva:**\n\n"
                "```c\n"
                "// x: valor a ser pesquisado, e: índice do início da pesquisa, d: índice do fim da pesquisa, v: vetor de valores\n"
                "// Se encontrar retorna o índice do vetor, senão retorna -1\n"
                "int buscaBinaria(int x, int e, int d, int v[]) {\n"
                "   int m;\n"
                "   if (e <= d) {\n"
                "      m = (e + d) / 2;\n"
                "      if (v[m] == x)\n"
                "         return m;\n"
                "      if (v[m] < x)\n"
                "         return buscaBinaria(x, m + 1, d, v);\n"
                "      else\n"
                "         return buscaBinaria(x, e, m - 1, v);\n"
                "   }\n"
                "   else return -1;\n"
                "}\n"
                "```"
            )
        else:
            rubrics[idx] = format_prose_markdown(content)
    return rubrics


def detect_visual_pages(year: str) -> set[int]:
    doc = pymupdf.open(PROVA_PDF_DIR / f"{year}_prova_sistemas_informacao.pdf")
    visual_pages: set[int] = set(EXTRA_VISUAL_PAGES.get(year, set()))
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


def load_exam_raw_text(year: str) -> str:
    raw = (EXTRACTED_PROVA_DIR / f"{year}_prova_sistemas_informacao.pdf.txt").read_text(encoding="utf-8")
    if year == "2021":
        raw = re.sub(
            r"(---\s*PÁGINA\s+34\s*---\s*\n34\s*\nSistemas de informação\s*\n)(.*?)(\*R27202134\*\s*\n\s*QUESTÃO 31\s*\n)",
            r"\1QUESTÃO 31\n\2*R27202134*\n",
            raw,
            flags=re.DOTALL,
        )
    return clean_pdf_kerning(raw)


SPECIAL_STEMS: dict[str, str] = {
    "enade-2014-d01": (
        "Os desafios da mobilidade urbana associam-se à necessidade de desenvolvimento urbano sustentável. "
        "A ONU define esse desenvolvimento como aquele que assegura qualidade de vida, incluídos os componentes "
        "ecológicos, culturais, políticos, institucionais, sociais e econômicos que não comprometam a qualidade de "
        "vida das futuras gerações.\n\n"
        "O espaço urbano brasileiro é marcado por inúmeros problemas cotidianos e por várias contradições. Uma das "
        "grandes questões em debate diz respeito à mobilidade urbana, uma vez que o momento é de motorização "
        "dos deslocamentos da população, por meio de transporte coletivo e individual.\n\n"
        "Considere os dados do seguinte quadro.\n\n"
        "**Mobilidade urbana em cidade com mais de 500 mil habitantes**\n\n"
        "| Modalidade | Tipologia | Porcentagem (%) |\n"
        "| :--- | :--- | :---: |\n"
        "| Não motorizado | A pé | 15,9 |\n"
        "| Não motorizado | Bicicleta | 2,7 |\n"
        "| Motorizado coletivo | Ônibus municipal | 22,2 |\n"
        "| Motorizado coletivo | Ônibus metropolitano | 4,5 |\n"
        "| Motorizado coletivo | Metroferroviário | 25,1 |\n"
        "| Motorizado individual | Automóvel | 27,5 |\n"
        "| Motorizado individual | Motocicleta | 2,1 |\n\n"
        "Tendo em vista o texto e o quadro de mobilidade urbana apresentados, redija um texto dissertativo, "
        "contemplando os seguintes aspectos:\n\n"
        "a) consequências, para o desenvolvimento sustentável, do uso mais frequente do transporte motorizado; (valor: 5,0 pontos)\n\n"
        "b) duas ações de intervenção que contribuam para a consolidação de política pública de incremento ao uso "
        "de bicicleta na cidade mencionada, assegurando-se o desenvolvimento sustentável. (valor: 5,0 pontos)"
    ),
    "enade-2014-q03": (
        "Pegada ecológica é um indicador que estima a demanda ou a exigência humana sobre o meio ambiente, "
        "considerando-se o nível de atividade para atender ao padrão de consumo atual (com a tecnologia atual). É, de "
        "certa forma, uma maneira de medir o fluxo de ativos ambientais de que necessitamos para sustentar nosso padrão de "
        "consumo. Esse indicador é medido em hectare global, medida de área equivalente a 10 000 m². Na medida hectare "
        "global, são consideradas apenas as áreas produtivas do planeta. A biocapacidade do planeta, indicador que reflete "
        "a regeneração (natural) do meio ambiente, é medida também em hectare global.\n\n"
        "Uma razão entre pegada ecológica e biocapacidade do planeta igual a 1 indica que a exigência humana sobre os "
        "recursos do meio ambiente é reposta na sua totalidade pelo planeta, devido à capacidade natural de regeneração. "
        "Se for maior que 1, a razão indica que a demanda humana é superior à capacidade do planeta de se recuperar e, "
        "se for menor que 1, indica que o planeta se recupera mais rapidamente.\n\n"
        "**Razão entre a pegada ecológica e a biocapacidade do planeta**\n\n"
        "| Ano | 1961 | 1965 | 1970 | 1975 | 1980 | 1985 | 1990 | 1995 | 2000 | 2005 | 2008 |\n"
        "| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n"
        "| **Razão** | 0,74 | 0,85 | 1,00 | 1,08 | 1,16 | 1,14 | 1,25 | 1,27 | 1,30 | 1,45 | 1,52 |\n\n"
        "Disponível em: <http://financasfaceis.wordpress.com>. Acesso em: 10 ago. 2014.\n\n"
        "O aumento da razão entre pegada ecológica e biocapacidade representado no gráfico evidencia"
    ),
    "enade-2014-q06": (
        "As mulheres frequentam mais os bancos escolares que os homens, dividem seu tempo entre o trabalho e os "
        "cuidados com a casa, geram renda familiar, porém continuam ganhando menos e trabalhando mais que os homens.\n\n"
        "As políticas de benefícios implementadas por empresas preocupadas em facilitar a vida das funcionárias que "
        "têm criança pequena em casa já estão chegando ao Brasil. Acordos de horários flexíveis, programas como "
        "auxílio-creche, auxílio-babá e auxílio-amamentação são alguns dos benefícios oferecidos.\n\n"
        "Disponível em: <http://www1.folha.uol.com.br>. Acesso em: 30 jul. 2013 (adaptado).\n\n"
        "*(Veja o gráfico **Jornada média total de trabalho por semana no Brasil** na figura da página original abaixo.)*\n\n"
        "Disponível em: <http://ipea.gov.br>. Acesso em: 30 jul. 2013.\n\n"
        "Considerando o texto e o gráfico, avalie as afirmações a seguir.\n\n"
        "I. O somatório do tempo dedicado pelas mulheres aos afazeres domésticos e ao trabalho remunerado "
        "é superior ao dedicado pelos homens, independentemente do formato da família.\n\n"
        "II. O fragmento de texto e os dados do gráfico apontam para a necessidade de criação de políticas que "
        "promovam a igualdade entre os gêneros no que concerne, por exemplo, a tempo médio dedicado "
        "ao trabalho e remuneração recebida.\n\n"
        "III. No fragmento de reportagem apresentado, ressalta-se a diferença entre o tempo dedicado por "
        "mulheres e homens ao trabalho remunerado, sem alusão aos afazeres domésticos.\n\n"
        "É correto o que se afirma em"
    ),
    "enade-2014-q07": (
        "O quadro a seguir apresenta a proporção (%) de trabalhadores por faixa de tempo gasto no "
        "deslocamento casa-trabalho, no Brasil e em três cidades brasileiras.\n\n"
        "| Tempo de deslocamento | Brasil | Rio de Janeiro | São Paulo | Curitiba |\n"
        "| :--- | :---: | :---: | :---: | :---: |\n"
        "| Até cinco minutos | 12,70 | 5,80 | 5,10 | 7,80 |\n"
        "| De seis minutos até meia hora | 52,20 | 32,10 | 31,60 | 45,80 |\n"
        "| Mais de meia hora até uma hora | 23,60 | 33,50 | 34,60 | 32,40 |\n"
        "| Mais de uma hora até duas horas | 9,80 | 23,20 | 23,30 | 12,90 |\n"
        "| Mais de duas horas | 1,80 | 5,50 | 5,30 | 1,20 |\n\n"
        "CENSO 2010/IBGE (adaptado).\n\n"
        "Com base nos dados apresentados e considerando a distribuição da população trabalhadora nas cidades e "
        "as políticas públicas direcionadas à mobilidade urbana, avalie as afirmações a seguir.\n\n"
        "I. A distribuição das pessoas por faixa de tempo de deslocamento casa-trabalho na região "
        "metropolitana do Rio de Janeiro é próxima à que se verifica em São Paulo, mas não em Curitiba e na média brasileira.\n\n"
        "II. Nas metrópoles, em geral, a maioria dos postos de trabalho está localizada nas áreas urbanas "
        "centrais, e as residências da população de baixa renda estão concentradas em áreas irregulares "
        "ou na periferia, o que aumenta o tempo gasto por esta população no deslocamento casa-trabalho e o custo do transporte.\n\n"
        "III. As políticas públicas referentes a transportes urbanos, como, por exemplo, Bilhete Único "
        "e Veículo Leve sobre Trilhos (VLT), ao serem implementadas, contribuem para redução do "
        "tempo gasto no deslocamento casa-trabalho e do custo do transporte.\n\n"
        "É correto o que se afirma em"
    ),
    "enade-2014-q09": (
        "Considere uma situação em que um professor que queira saber se existem alunos cursando, ao mesmo "
        "tempo, as disciplinas A e B, tenha implementado um programa que:\n\n"
        "1) inicializa um array `a` de 30 posições que contém as matrículas dos alunos da disciplina A;\n\n"
        "2) inicializa outro array `b` de 40 posições, que contém as matrículas dos alunos da disciplina B;\n\n"
        "3) imprime a matrícula dos alunos que estão cursando as disciplinas A e B ao mesmo tempo.\n\n"
        "Considere, ainda, que os arrays foram declarados e inicializados, não estão necessariamente ordenados, "
        "e seus índices variam entre `0` e `n – 1`, sendo `n` o tamanho do array.\n\n"
        "```c\n"
        "1. for ( i = 0 to 29 ) {\n"
        "2.   for ( j = 0 to 39 ) {\n"
        "3.\n"
        "4.\n"
        "5.\n"
        "6.   }\n"
        "7. }\n"
        "```\n\n"
        "Com base nessas informações, conclui-se que o trecho a ser incluído nas linhas 3, 4 e 5 do "
        "código acima, para que o programa funcione corretamente, é"
    ),
    "enade-2014-q11": (
        "Considere que uma rede de supermercados tenha contratado um analista de informática para elaborar um "
        "plano de prevenção de erros na operação do software das lojas. Com o objetivo de melhorar a tomada de "
        "decisão, o analista classificou os erros quanto ao tempo de emprego do operador (linha) e quanto aos setores "
        "que originaram os erros (coluna). Os dados levantados são apresentados na tabela abaixo.\n\n"
        "**Tabela de erros da operação do software — Setor do supermercado**\n\n"
        "| Tempo de emprego do operador | Caixa | Padaria | Açougue | TOTAL |\n"
        "| :--- | :---: | :---: | :---: | :---: |\n"
        "| < 2 anos (A) | 55 | 25 | 10 | 90 |\n"
        "| 2 a 4 anos (B) | 20 | 6 | 4 | 30 |\n"
        "| > 4 anos (C) | 35 | 15 | 10 | 60 |\n"
        "| TOTAL | 110 | 46 | 24 | 180 |\n\n"
        "Considerando essas informações, conclui-se que a probabilidade aproximada de um erro ser cometido por "
        "um operador com tempo de emprego correspondente a 4 anos ou menos é de"
    ),
    "enade-2014-q12": (
        "Considere a situação em que uma empresa que comercializa software customizado precisa definir a alocação "
        "de quantidade de horas de trabalho para um programador e um desenvolvedor. Considere, ainda, que os "
        "profissionais estão envolvidos no projeto de um sistema composto por módulos de controle de estoque "
        "e vendas e que os recursos financeiros a serem investidos para realizar as atividades de programação "
        "e desenvolvimento para cada hora trabalhada nos respectivos módulos são indicados na tabela abaixo.\n\n"
        "Assim, por exemplo, o custo unitário por hora trabalhada na atividade de programação no módulo de "
        "estoque é $ 3, ao passo que o custo do desenvolvimento do respectivo módulo é $ 6.\n\n"
        "| Atividade \\ Módulo | Estoque | Vendas |\n"
        "| :--- | :---: | :---: |\n"
        "| Programação | $ 3 | $ 3 |\n"
        "| Desenvolvimento | $ 6 | $ 3 |\n\n"
        "O valor previsto em orçamento para a atividade de programação é de $ 30, e para a de desenvolvimento é "
        "de $ 48. Ao modelar esse problema para ser resolvido com a técnica de pesquisa operacional, define-se `V` "
        "como a quantidade de horas alocadas no módulo de vendas e `E` como a quantidade de horas alocadas no "
        "módulo de estoque. Nesse modelo, uma das restrições a serem utilizadas é representada por"
    ),
    "enade-2014-q13": (
        "Na figura 1, abaixo, está representado, esquematicamente, um processo de tradução de um programa "
        "(arquivo fonte) em um código binário. Esse processo de compilação clássica é utilizado em compiladores "
        "como os das linguagens C e Pascal.\n\n"
        "**Figura 1 — Processo de compilação clássica:** `Arquivo fonte` → *(Compilação)* → `Código binário`\n\n"
        "Na figura 2, abaixo, está representado, esquematicamente, um processo de tradução de um programa "
        "(arquivo fonte) em um código intermediário. Esse processo híbrido é utilizado em compiladores como os das "
        "linguagens Java e C#.\n\n"
        "**Figura 2 — Processo híbrido:** `Arquivo fonte` → *(Compilação)* → `Código intermediário` → *(Interpretação)* → `Código binário`\n\n"
        "Considerando que, em ambos os processos, o código binário é o que será executado pelo computador, "
        "e que a execução de dois programas gerados, cada qual por um dos processos apresentados, ocorre em "
        "situações equivalentes, avalie as afirmações a seguir.\n\n"
        "I. Há portabilidade para a execução de ambos os programas gerados em cada processo.\n\n"
        "II. Na execução do programa gerado por meio do processo híbrido, o consumo de memória é maior que "
        "na execução pelo processo de compilação clássica.\n\n"
        "III. O desempenho na execução do programa gerado pelo processo de compilação clássica é melhor que "
        "na execução pelo processo híbrido.\n\n"
        "É correto o que se afirma em"
    ),
    "enade-2014-q14": (
        "A tabela abaixo apresenta o ranking das 20 linguagens de programação mais populares.\n\n"
        "| Jul 2014 | Jul 2013 | Programming Language | Ratings | Change |\n"
        "| :---: | :---: | :--- | :---: | :---: |\n"
        "| 1 | 1 | C | 17.145% | -0,48% |\n"
        "| 2 | 2 | Java | 15.688% | -0,22% |\n"
        "| 3 | 3 | Objective-C | 10.294% | +0,05% |\n"
        "| 4 | 4 | C++ | 5.520% | -3,23% |\n"
        "| 5 | 7 | (Visual) Basic | 4.341% | +0,01% |\n"
        "| 6 | 6 | C# | 4.051% | -2.16% |\n"
        "| 7 | 5 | PHP | 2.916% | -4.27% |\n"
        "| 8 | 8 | Python | 2.656% | -1.38% |\n"
        "| 9 | 10 | JavaScript | 1.806% | -0,04% |\n"
        "| 10 | 12 | Transact-SQL | 1.759% | +0,19% |\n"
        "| 11 | 9 | Perl | 1.627% | -0,52% |\n"
        "| 12 | 13 | Visual Basic .NET | 1.495% | +0,24% |\n"
        "| 13 | 37 | F# | 1.093% | +0,86% |\n"
        "| 14 | 11 | Ruby | 1.072% | -0,51% |\n"
        "| 15 | 45 | ActionScript | 1.067% | +0,86% |\n"
        "| 16 | - | Swift | 1.054% | +1,05% |\n"
        "| 17 | 17 | Delphi/Object Pascal | 1.031% | +0,34% |\n"
        "| 18 | 15 | Lisp | 0,829% | -0,04% |\n"
        "| 19 | 18 | MATLAB | 0,781% | +0,10% |\n"
        "| 20 | 20 | Assembly | 0,777% | +0,20% |\n\n"
        "Disponível em: <http://www.tiobe.com>. Acesso em: 23 jul. 2014 (adaptado).\n\n"
        "Considerando a classificação das linguagens de programação apresentada na tabela, avalie as afirmações a seguir.\n\n"
        "I. O ranking é liderado por uma linguagem de terceira geração e de paradigma funcional.\n\n"
        "II. Linguagens com licença livre têm participação inferior a 20%, se somados os percentuais de popularidade.\n\n"
        "III. É maior, no ranking, a participação de linguagens que utilizam o paradigma orientado a objetos que a das "
        "linguagens que utilizam os demais paradigmas.\n\n"
        "É correto o que se afirma em"
    ),
    "enade-2014-q19": (
        "Um analista de sistemas usa um computador para executar apenas 2 tipos de operações: processamento "
        "lógico/aritmético e acesso a disco.\n\n"
        "O computador é um servidor com apenas um processador de um núcleo (core). Além do sistema operacional "
        "multitarefa e dos processos do sistema, tal servidor serializa os acessos a disco e é usado para executar "
        "apenas os programas que o analista solicita. O analista trabalha com dois tipos de programas: aqueles "
        "que realizam em torno de 100% de operações lógicas/aritméticas (quantidade desprezível de acesso a "
        "disco), denominados `cpu-bound`, e aqueles que executam em torno de 70% de acesso a disco e 30% de "
        "operações lógicas/aritméticas, denominados `io-bound`. Certa vez, o analista executou alguns programas "
        "isoladamente e mediu os tempos de execução de cada um. Os dados obtidos foram registrados na tabela I. "
        "Em seguida, ele combinou programas e os submeteu simultaneamente em grupos. Os resultados foram "
        "registrados na tabela II.\n\n"
        "**Tabela I**\n\n"
        "| Programa | Tipo | Tempo de Execução (ut) |\n"
        "| :---: | :---: | :---: |\n"
        "| P01 | CPU-BOUND | 20 |\n"
        "| P02 | CPU-BOUND | 40 |\n"
        "| P03 | CPU-BOUND | 60 |\n"
        "| P04 | IO-BOUND | 50 |\n"
        "| P05 | IO-BOUND | 100 |\n"
        "| P06 | IO-BOUND | 150 |\n\n"
        "**Tabela II**\n\n"
        "| Grupo | Tempo de Execução (ut) |\n"
        "| :--- | :---: |\n"
        "| 1: P01 + P02 + P03 | 123 |\n"
        "| 2: P04 + P05 + P06 | 210 |\n"
        "| 3: P03 + P05 + P06 | 160 |\n"
        "| 4: Todos | 306 |\n\n"
        "Dias depois, revendo as tabelas, ele teve dúvida quanto à correção dos tempos anotados. "
        "Considere `ut` = unidade de tempo.\n\n"
        "Com relação a essa situação, avalie as afirmações a seguir.\n\n"
        "I. É possível que o tempo total do grupo 4 seja 306 ut.\n\n"
        "II. O tempo total do grupo 1 deveria ser, no mínimo, de 100 ut.\n\n"
        "III. O tempo total do grupo 2 deveria ser, no mínimo, de 300 ut.\n\n"
        "IV. O tempo total do grupo 3 deveria estar acima de 175 e abaixo de 310 ut.\n\n"
        "É correto o que se afirma em"
    ),
    "enade-2014-q24": (
        "Uma empresa mantém um serviço de software que atende a centenas de clientes pelo mundo. O serviço é "
        "bastante complexo e requer um esforço contínuo de manutenção. Para melhor gerenciar a manutenção do "
        "sistema, a empresa decidiu implantar um programa de medição, em que várias métricas foram agregadas, "
        "cada uma delas associada a determinada questão que se desejava responder. A tabela a seguir apresenta as "
        "questões e suas métricas associadas.\n\n"
        "| Questão | Métrica associada |\n"
        "| :--- | :--- |\n"
        "| Quantos problemas afetam os clientes? | Número de solicitações de mudanças |\n"
        "| Quanto tempo é necessário para se corrigir um problema urgente? | Tempo entre levantamento do problema e aceitação da mudança |\n"
        "| Quanto custa uma entrega de manutenção? | Custo por entrega |\n"
        "| Como são alocados os custos? | Custo por atividade |\n"
        "| Que tipos de mudanças são feitas? | Número de mudanças por tipo |\n"
        "| Quanto esforço é despendido por tipo de mudança? | Pessoas-dia gastos, agregados por tipo |\n"
        "| Quão difícil é a entrega? | Número de recursos computacionais a serem utilizados |\n\n"
        "O objetivo atual da empresa é reduzir o prazo de suas entregas, sem comprometer o que foi acordado com o "
        "cliente. A métrica que permite avaliar se esse objetivo está sendo atingido é o"
    ),
    "enade-2014-q28": (
        "Conforme a norma ISO 9241, a usabilidade é definida como a capacidade que um sistema interativo de "
        "software oferece a seus usuários, em um contexto específico de operação, para a realização de tarefas "
        "de maneira eficaz, eficiente e agradável. Com fundamento nesse conceito, uma empresa deseja medir a "
        "satisfação dos consumidores de seus produtos e, para isso, desenvolverá um sistema de software. A equipe "
        "de desenvolvimento do sistema de software elencou os requisitos listados na tabela abaixo.\n\n"
        "| Código do Requisito | Descrição do Requisito |\n"
        "| :---: | :--- |\n"
        "| RQ1 | Cada produto da empresa deverá ser avaliado, por um usuário, com um valor numérico inteiro entre -5 e 5. |\n"
        "| RQ2 | Cada transação do sistema com o banco de dados para registrar uma avaliação de um produto deve ser realizada em um tempo inferior a 20 segundos. |\n"
        "| RQ3 | Cada operação do usuário deverá ser realizada em até três telas. |\n"
        "| RQ4 | O sistema deve ter interface com sistemas legados. |\n"
        "| RQ5 | O usuário consumidor irá identificar-se pelo código do número de Cadastro de Pessoa Física (CPF). |\n\n"
        "Entre os requisitos listados na tabela, o código do que se refere à usabilidade é"
    ),
    "enade-2014-q30": (
        "Considere que uma empresa que presta serviços de transporte de pacientes em ambulâncias para clientes "
        "conveniados disponha de um sistema de controle e gerenciamento de atendimentos e viagens realizados. "
        "Considere, ainda, que, em atendimento, é utilizada uma ambulância e são registrados a data e o convênio "
        "a que o atendimento está vinculado. Em um atendimento, uma ambulância realiza uma ou mais viagens "
        "e, a cada viagem, é incrementado um número sequencial que começa em 1. Nessa situação, o esquema "
        "relacional simplificado, mostrado a seguir, foi projetado para suportar um banco de dados que controle a "
        "operação. No esquema, as chaves primárias têm seus atributos componentes destacados em negrito.\n\n"
        "- **Paciente** (**`CodPaciente`**, `Nome`, `Endereço`)\n"
        "- **Convênio** (**`CodConvênio`**, `Empresa`, `Plano`)\n"
        "- **Atendimento** (**`CodAtendimento`**, `CodPaciente`, `CodConvênio`, `Data`, `Finalidade`)\n"
        "- **Viagem** (**`CodAtendimento`**, **`Sequência`**, `Origem`, `Destino`)\n\n"
        "Com base nas informações e no esquema apresentado, avalie as afirmações a seguir.\n\n"
        "I. `CodConvênio` é uma chave estrangeira na tabela `Atendimento`.\n\n"
        "II. `CodAtendimento` não pode ser chave estrangeira na tabela `Viagem` porque faz parte da chave primária.\n\n"
        "III. `CodPaciente` nunca pode assumir valores nulos na tabela `Atendimento` porque é uma chave estrangeira.\n\n"
        "IV. `CodPaciente → Nome, Endereço`; `CodConvênio → Empresa, Plano`; `CodAtendimento → CodPaciente, CodConvênio, Data, Finalidade`; "
        "`CodAtendimento, Sequência → Origem, Destino`; são dependências funcionais corretamente deduzidas.\n\n"
        "É correto apenas o que se afirma em"
    ),
    "enade-2014-q31": (
        "Um sistema de informação usa um banco de dados relacional que possui tabelas cujos esquemas em "
        "SQL estão representados a seguir.\n\n"
        "```sql\n"
        "CREATE TABLE Artista (\n"
        "  id INTEGER PRIMARY KEY,\n"
        "  nome VARCHAR(40) NOT NULL,\n"
        "  CPF CHAR(11) NOT NULL,\n"
        "  dataNascimento DATE,\n"
        "  UNIQUE (CPF)\n"
        ");\n\n"
        "CREATE TABLE Evento (\n"
        "  id INTEGER PRIMARY KEY,\n"
        "  descricao VARCHAR(60) NOT NULL,\n"
        "  numMaxConvidados INTEGER DEFAULT 0,\n"
        "  CHECK (numMaxConvidados >= 0)\n"
        ");\n\n"
        "CREATE TABLE Atuacao (\n"
        "  idArtista INTEGER,\n"
        "  idEvento INTEGER,\n"
        "  PRIMARY KEY (idArtista, idEvento),\n"
        "  FOREIGN KEY (idArtista) REFERENCES Artista,\n"
        "  FOREIGN KEY (idEvento) REFERENCES Evento(id)\n"
        ");\n"
        "```\n\n"
        "O sistema também possui uma consulta que integra um de seus relatórios, conforme indicado a seguir.\n\n"
        "```sql\n"
        "SELECT A.nome, E.descricao\n"
        "FROM Evento E FULL JOIN Atuacao T ON E.id = T.idEvento\n"
        "  FULL OUTER JOIN Artista A ON T.idArtista = A.id\n"
        "```\n\n"
        "Considerando que todas as tabelas possuem dados, o resultado da consulta utilizada no relatório é"
    ),
    "enade-2014-q32": (
        "Considere um cenário de venda de passagens aéreas cujo processo de negócio apresenta-se modelado no "
        "diagrama abaixo, usando-se BPMN (*Business Process Modeling and Notation*).\n\n"
        "*(Veja o diagrama BPMN completo na figura da página original abaixo.)*\n\n"
        "Para que essa companhia aérea obtenha mais retorno, será necessário"
    ),
    "enade-2017-d02": (
        "> \"A pessoa trans precisa que alguém ateste, confirme e comprove que ela pode ser reconhecida pelo nome que ela escolheu. "
        "Não aceitam que ela se autodeclare mulher ou homem. Exigem que um profissional de saúde diga quem ela é. "
        "Sua declaração é o que menos conta na hora de solicitar, judicialmente, a mudança dos documentos.\"\n\n"
        "Disponível em: <http://www.ebc.com.br>. Acesso em: 31 ago. 2017 (adaptado).\n\n"
        "> No chão, a travesti morre  \n"
        "> Ninguém jamais saberá seu nome  \n"
        "> Nos jornais, fala-se de outra morte  \n"
        "> De tal homem que ninguém conheceu\n\n"
        "Disponível em: <http://www.aminoapps.com>. Acesso em: 31 ago. 2017 (adaptado).\n\n"
        "> \"Usava meu nome oficial, feminino, no currículo porque diziam que eu estava cometendo um crime, "
        "que era falsidade ideológica se eu usasse outro nome. Depois fui pesquisar e descobri que não é assim. "
        "Infelizmente, ainda existe muita desinformação sobre os direitos das pessoas trans.\"\n\n"
        "Disponível em: <https://www.brasil.elpais.com>. Acesso em: 31 ago. 2017 (adaptado).\n\n"
        "> \"Uma vez o segurança da balada achou que eu tinha, por engano, mostrado o RG do meu namorado. "
        "Isso quando insistem em não colocar meu nome social na minha ficha de consumação.\"\n\n"
        "Disponível em: <https://www.brasil.elpais.com>. Acesso em: 31 ago. 2017 (adaptado).\n\n"
        "Com base nessas falas, discorra sobre a importância do nome para as pessoas transgêneras e, nesse contexto, "
        "proponha uma medida, no âmbito das políticas públicas, que tenha como objetivo facilitar o acesso dessas pessoas "
        "à cidadania. (valor: 10,0 pontos)"
    ),
    "enade-2017-d05": (
        "Durante as Olimpíadas de 2016, foram disputadas nove competições masculinas e seis competições "
        "femininas de tiro esportivo. Para os Jogos Olímpicos de 2020, propõe-se o desenvolvimento de um "
        "sistema de agendamento de competições de tiro esportivo, com base nas competições realizadas nos "
        "últimos jogos.\n\n"
        "No tiro esportivo, cada competição é composta por eventos, que podem ser a fase classificatória, a fase "
        "final ou a cerimônia de entrega de medalhas. Para cada evento, é preciso saber a data de realização, o "
        "horário de início, o horário estimado de término e o local, que pode ser uma das diversas salas de tiro "
        "ou o campo de tiro externo, destinado às competições de fossa olímpica e skeet. As competições se "
        "diferenciam em função de três características:\n\n"
        "- o equipamento utilizado, que pode ser pistola, carabina ou espingarda;\n"
        "- o tipo de alvo e a distância, que pode ser um alvo fixo em distâncias de 10 m, 25 m ou 50 m ou "
        "pratos lançados que devem ser atingidos no ar;\n"
        "- a posição do atirador ao disparar, que pode ser deitado, ajoelhado ou em pé.\n\n"
        "As competições de tiro esportivo realizadas nos últimos Jogos Olímpicos de 2016 estão apresentadas no "
        "quadro a seguir.\n\n"
        "| Competições masculinas | Competições femininas |\n"
        "| :--- | :--- |\n"
        "| Pistola de ar 10 m | Pistola de ar 10 m |\n"
        "| Carabina de ar 10 m | Carabina de ar 10 m |\n"
        "| Pistola rápida 25 m | Pistola 25 m |\n"
        "| Pistola 50 m | Carabina três posições 50 m |\n"
        "| Carabina deitado 50 m | Skeet |\n"
        "| Carabina três posições 50 m | Fossa olímpica |\n"
        "| Skeet | |\n"
        "| Fossa olímpica | |\n"
        "| Fossa olímpica dupla | |\n\n"
        "As competições dessa modalidade contam com atletas de diversos países, sendo que cada atleta pode "
        "participar de uma ou mais competições, desde que esteja devidamente classificado. Para cada atleta, é "
        "preciso registrar o nome, o país e o comitê olímpico nacional que representa, além das competições que "
        "irá disputar.\n\n"
        "Considerando o domínio apresentado no texto, elabore um diagrama de classe da UML para esse sistema, "
        "identificando as classes (no máximo seis), os atributos e os relacionamentos. (valor: 10,0 pontos)"
    ),
    "enade-2017-q03": (
        "O sistema de tarifação de energia elétrica funciona com base em três bandeiras. Na bandeira verde, "
        "as condições de geração de energia são favoráveis e a tarifa não sofre acréscimo. Na bandeira amarela, "
        "a tarifa sofre acréscimo de R$ 0,020 para cada kWh consumido, e na bandeira vermelha, condição de "
        "maior custo de geração de energia, a tarifa sofre acréscimo de R$ 0,035 para cada kWh consumido. Assim, "
        "para saber o quanto se gasta com o consumo de energia de cada aparelho, basta multiplicar o consumo "
        "em kWh do aparelho pela tarifa em questão.\n\n"
        "Disponível em: <http://www.aneel.gov.br>. Acesso em: 17 jul. 2017 (adaptado).\n\n"
        "Na tabela a seguir, são apresentadas a potência e o tempo de uso diário de alguns aparelhos "
        "eletroeletrônicos usuais em residências.\n\n"
        "| Aparelho | Potência (kW) | Tempo de uso diário (h) | kWh |\n"
        "| :--- | :---: | :---: | :---: |\n"
        "| Carregador de celular | 0,010 | 24 | 0,240 |\n"
        "| Chuveiro 3 500 W | 3,500 | 0,5 | 1,750 |\n"
        "| Chuveiro 5 500 W | 5,500 | 0,5 | 2,250 |\n"
        "| Lâmpada de LED | 0,008 | 5 | 0,040 |\n"
        "| Lâmpada fluorescente | 0,015 | 5 | 0,075 |\n"
        "| Lâmpada incandescente | 0,060 | 5 | 0,300 |\n"
        "| Modem de internet em stand-by | 0,005 | 24 | 0,120 |\n"
        "| Modem de internet em uso | 0,012 | 8 | 0,096 |\n\n"
        "Disponível em: <https://www.educandoseubolso.blog.br>. Acesso em: 17 jul. 2017 (adaptado).\n\n"
        "Considerando as informações do texto, os dados apresentados na tabela, uma tarifa de R$ 0,50 por kWh "
        "em bandeira verde e um mês de 30 dias, avalie as afirmações a seguir.\n\n"
        "I. Em bandeira amarela, o valor mensal da tarifa de energia elétrica para um chuveiro de 3 500 W "
        "seria de R$ 1,05, e de R$ 1,65, para um chuveiro de 5 500 W.\n\n"
        "II. Deixar um carregador de celular e um modem de internet em stand-by conectados na rede de "
        "energia durante 24 horas representa um gasto mensal de R$ 5,40 na tarifa de energia elétrica em "
        "bandeira verde, e de R$ 5,78, em bandeira amarela.\n\n"
        "III. Em bandeira verde, o consumidor gastaria mensalmente R$ 3,90 a mais na tarifa de energia elétrica "
        "em relação a cada lâmpada incandescente usada no lugar de uma lâmpada LED.\n\n"
        "É correto o que se afirma em"
    ),
    "enade-2017-q11": (
        "O diagrama Entidade-Relacionamento (DER) a seguir apresenta a modelagem conceitual de dados de "
        "um sistema de informação para um museu. A partir dessa modelagem observa-se o seguinte: uma `Obra` "
        "é criada por um único `Artista` e um `Artista` pode criar no mínimo uma `Obra` e no máximo várias `Obras`; as "
        "entidades `Pintura` e `Escultura` são especializações da entidade `Obra`; um `Artista` tem o domínio de várias "
        "`Técnicas`, assim como uma `Técnica` é dominada por diversos `Artistas`.\n\n"
        "*(Veja o diagrama DER completo na figura da página original abaixo.)*\n\n"
        "Com base nas regras de mapeamento que transformam o Modelo Conceitual em um Modelo Lógico "
        "Relacional, avalie as afirmações a seguir, a respeito do Esquema Lógico Relacional gerado a partir do DER "
        "apresentado.\n\n"
        "I. No Esquema Lógico Relacional, haverá uma tabela associativa, criada em função do relacionamento "
        "muitos para muitos entre as entidades `Artista` e `Técnica`, que terá uma chave primária composta "
        "pelo código do artista e o código da técnica.\n\n"
        "II. No Esquema Lógico Relacional, haverá uma tabela `Artista` na qual o atributo código do artista será "
        "a chave primária da tabela, e o código da obra será uma chave estrangeira que fará referência a "
        "uma obra existente na tabela `Obra`.\n\n"
        "III. No Esquema Lógico Relacional, haverá, em função da generalização/especialização, uma tabela "
        "`Obra` com apenas os atributos código da obra, título, data de aquisição e dimensões, e duas outras "
        "tabelas: a tabela `Pintura`, com apenas o atributo tipo de tinta, e a tabela `Escultura` com apenas o "
        "atributo material.\n\n"
        "É correto o que se afirma em"
    ),
    "enade-2017-q17": (
        "Uma equipe de projeto desenvolveu um aplicativo mobile para a gestão de frotas de caminhões entre os "
        "meses de janeiro e junho de 2017. O projeto seguiu um processo baseado no modelo de ciclo de vida de "
        "desenvolvimento em cascata, com atividades realizadas sequencialmente e sem sobreposição.\n\n"
        "Ao final do projeto, a equipe precisou tratar uma grande quantidade de defeitos encontrados no aplicativo "
        "em um curto espaço de tempo. Como mostra o gráfico a seguir, a maior parte dos defeitos foi identificada "
        "ao final do projeto, o que elevou o risco de se entregar o aplicativo com muitos defeitos ao cliente.\n\n"
        "*(Veja o gráfico **Frequência mensal de defeitos do aplicativo desenvolvido no projeto** na figura da página original abaixo.)*\n\n"
        "Diante desse cenário, a equipe do projeto decidiu que, em novos projetos, realizaria ações que pudessem "
        "distribuir o esforço de tratamento de defeitos ao longo dos meses, diminuindo o risco de ainda haver "
        "muitos defeitos não tratados no momento próximo à entrega do produto.\n\n"
        "Considerando a situação, o gráfico apresentado e o modelo de ciclo de vida de desenvolvimento utilizado "
        "no projeto (cascata), assinale a opção que descreve uma ação capaz de produzir o resultado esperado "
        "pela equipe."
    ),
    "enade-2017-q21": (
        "Uma startup de tecnologia pretende desenvolver um aplicativo que aproxime empresas que precisam "
        "transportar mercadorias de condutores autônomos de veículos de carga (transportadores). O uso do "
        "aplicativo permitirá um aumento do número potencial de transportadores e de tipos de veículos, bem "
        "como o compartilhamento de frete, com redução do custo de transporte e do custo de armazenamento "
        "de mercadorias pelas empresas. Além disso, a visibilidade da disponibilidade dos transportadores pelo "
        "aplicativo pode aumentar suas possibilidades de negócios. Durante a concepção e o projeto do aplicativo, "
        "foram elaborados modelos UML (*Unified Modeling Language*), sendo um deles o diagrama de atividades, "
        "conforme apresentado na figura a seguir.\n\n"
        "*(Veja o diagrama de atividades UML na figura da página original abaixo.)*\n\n"
        "Com base no diagrama apresentado, avalie as afirmações a seguir.\n\n"
        "I. Os serviços oferecidos por outros aplicativos, como mapas para o cálculo de rotas, por exemplo, "
        "poderão ser usados no desenvolvimento do aplicativo, mesmo que não tenham sido representados "
        "no diagrama.\n\n"
        "II. Os fluxos paralelos indicados nos pontos de decisão 2 e 3 levam a erros no funcionamento do "
        "aplicativo, uma vez que permitem a continuidade do processo mesmo que não haja rota, destino "
        "ou tipo de veículo adequado.\n\n"
        "III. O diagrama apresenta atividades desempenhadas pela \"Empresa que precisa de transporte\" e pelo "
        "\"Transportador\", no entanto, as atividades que precisarão ser modeladas no sistema restringem-se "
        "às desempenhadas pelo \"Aplicativo\".\n\n"
        "IV. As ações \"Informar indisponibilidade\" e \"Confirmar disponibilidade\" correspondem a "
        "funcionalidades distintas no sistema, visto que a primeira se relaciona à existência de tipo de "
        "veículo, rota e destino e a segunda se relaciona à agenda do transportador.\n\n"
        "É correto apenas o que se afirma em"
    ),
    "enade-2017-q23": (
        "No modelo de dados relacional, uma junção entre tabelas cria uma pseudo-tabela derivada de duas "
        "ou mais tabelas de acordo com os critérios especificados, similar às regras da teoria dos conjuntos. "
        "Nos conjuntos a seguir, as áreas hachuradas representam os resultados das consultas SQL (padrão) em "
        "que `id` é uma chave primária e `fk` uma chave estrangeira.\n\n"
        "*(Veja os diagramas de conjuntos e o conjunto alvo na figura da página original abaixo.)*\n\n"
        "Assinale a opção em que a declaração SQL é equivalente ao conjunto apresentado a seguir."
    ),
    "enade-2017-q24": (
        "Em uma pesquisa de satisfação com notas de 0 a 10, sendo 0 muito insatisfeito e 10 muito satisfeito, "
        "uma empresa construiu um quadro, mostrado a seguir, com o resumo das notas atribuídas pelos "
        "seus clientes aos serviços recebidos.\n\n"
        "| NOTA | QUANTIDADE DE CLIENTES |\n"
        "| :---: | :---: |\n"
        "| 3 | 1 |\n"
        "| 4 | 2 |\n"
        "| 5 | 2 |\n"
        "| 6 | 2 |\n"
        "| 7 | 2 |\n"
        "| 8 | 2 |\n"
        "| 9 | 1 |\n"
        "| 10 | 0 |\n\n"
        "Considerando essa situação e as informações apresentadas, avalie as afirmações a seguir.\n\n"
        "I. A média das notas dos clientes é igual a 6,0.\n\n"
        "II. A mediana das notas dos clientes é igual a 6,0.\n\n"
        "III. O desvio padrão populacional é menor do que 3,0.\n\n"
        "IV. O conjunto de dados é amodal.\n\n"
        "V. Um cliente que atribuiu nota 3,0 encontra-se no 1º quartil.\n\n"
        "É correto apenas o que se afirma em"
    ),
    "enade-2017-q26": (
        "Algumas linguagens de programação obedecem a uma ordem específica no que diz respeito à "
        "avaliação de operadores. A precedência dos operadores aritméticos, relacionais e booleanos "
        "é demonstrada na tabela a seguir, na qual os operadores `++` e `--`, pré ou pós-fixados, "
        "respectivamente, incrementam ou decrementam a variável, como no exemplo: variável `x` com valor `0`, "
        "resultado de `++x` é igual a `1` e o de `--x` é igual a `-1`.\n\n"
        "| Ordem de precedência (do maior para o menor) | Operadores |\n"
        "| :---: | :--- |\n"
        "| 1 | `++` e `--` pós-fixados |\n"
        "| 2 | `+` e `-` unários, `++` e `--` pré-fixados, `!` |\n"
        "| 3 | `*`, `/`, `%` |\n"
        "| 4 | `+` e `-` binários |\n"
        "| 5 | `<`, `>`, `<=`, `>=` |\n"
        "| 6 | `=`, `!=` |\n"
        "| 7 | `&&` |\n"
        "| 8 | `||` |\n\n"
        "SEBESTA, R. W. Conceitos de linguagens de programação. Porto Alegre: Bookman, 2011 (adaptado).\n\n"
        "Considerando essas informações e sabendo que as variáveis `a`, `b` e `c` têm, em determinado "
        "momento, os valores `1`, `2` e `0`, respectivamente, assinale a opção em que o resultado da "
        "expressão apresentada corresponde ao da expressão `-a * ++b - --c`."
    ),
    "enade-2021-q20": (
        "O paradigma de programação em lógica constitui-se como um processo de definição de relações em que "
        "se constroem fatos e regras sobre os elementos e suas relações. A ativação dos programas acontece por "
        "meio de consultas (ou perguntas) sobre o relacionamento definido. Ao construir-se um banco de dados "
        "referente a uma família, inicia-se pelas relações de parentesco, tais como:\n\n"
        "- `pai(joão,maria)` convencionado que joão é pai de maria\n"
        "- `mãe(maria,luiz)` convencionado que maria é mãe de luiz\n\n"
        "As cláusulas, sem condições, definem os fatos sobre o domínio do problema. De outra maneira, "
        "é possível definir as regras que são cláusulas com condições:\n\n"
        "```prolog\n"
        "avô_materno(joão,luiz):-pai(joão,maria), mãe(maria,luiz)\n"
        "```\n\n"
        "Nesse contexto, avalie as afirmações a seguir.\n\n"
        "I. A consulta `mãe(maria, X)` retorna verdadeiro conforme identificado na cláusula.\n\n"
        "II. A conclusão `joão é avô materno de luiz` é identificada como cabeça da cláusula.\n\n"
        "III. A regra `irmão(X,Y):-pai(Z, X), pai(Z, Y)` é uma regra genérica que define irmãos por parte de pai.\n\n"
        "IV. A regra `avo_materno(X,Y):-pai(Z,X), mae(Y,Z)` é uma regra genérica para o programa.\n\n"
        "É correto apenas o que se afirma em"
    ),
    "enade-2021-q21": (
        "Dado o controle de estoques de uma empresa de produção e embarque de peças, observe a descrição do "
        "esquema relacional abaixo para as tabelas `Peça`, `Fornecedor` e `Embarque`.\n\n"
        "- **Peça**(**`CodPeça`**, `NomePeça`, `CorPeça`, `PesoPeça`)\n"
        "- **Fornecedor**(**`CodFornecedor`**, `NomeFornecedor`, `StatusFornecedor`)\n"
        "- **Embarque**(**`CodPeça`**, **`CodFornecedor`**, `QuantidadeEmbarque`), tal que `CodPeça` referencia `Peça` e `CodFornecedor` referencia `Fornecedor`.\n\n"
        "Considere que os atributos em negrito no esquema relacional representam as chaves primárias das "
        "tabelas. Considere, ainda, que é necessário executar um comando *Structured Query Language* (SQL) "
        "que recupere todas as tuplas na base de dados `(CodPeça, NomePeça)` que possuem a quantidade de "
        "peças embarcadas maior do que 100.\n\n"
        "Com base nessas informações, avalie os comandos a seguir.\n\n"
        "I.\n\n"
        "```sql\n"
        "SELECT Embarque.CodPeça, Peça.NomePeça\n"
        "FROM Peça WHERE CodPeça IN\n"
        "  (SELECT Embarque.CodPeça\n"
        "   FROM Embarque\n"
        "   WHERE Embarque.QuantidadeEmbarque > 100);\n"
        "```\n\n"
        "II.\n\n"
        "```sql\n"
        "SELECT Peça.CodPeça, Peça.NomePeça\n"
        "FROM Peça Embarque\n"
        "WHERE Peça.CodPeça = Embarque.CodPeça AND Embarque.QuantidadeEmbarque > 100;\n"
        "```\n\n"
        "III.\n\n"
        "```sql\n"
        "SELECT P.CodPeça, P.NomePeça\n"
        "FROM Peça P JOIN Embarque E ON P.CodPeça = E.CodPeça AND E.QuantidadeEmbarque > 100;\n"
        "```\n\n"
        "IV.\n\n"
        "```sql\n"
        "SELECT CodPeça, NomePeça\n"
        "FROM Peça JOIN Embarque ON Peça.CodPeça = Embarque.CodPeça AND Embarque.QuantidadeEmbarque > 100;\n"
        "```\n\n"
        "São comandos SQL que promovem a recuperação da informação apenas os descritos em"
    ),
    "enade-2021-q23": (
        "É possível recuperar conjuntos de dados de forma organizada e que façam sentido para gerar informações. "
        "Nesse contexto, a recuperação de informações gravadas nos bancos de dados ocorre por meio de "
        "consultas SQL — *Structured Query Language* (linguagem de consulta de dados estruturados).\n\n"
        "Considere o seguinte conjunto de tabelas de banco de dados:\n\n"
        "**Motorista**\n\n"
        "| Idmoto | nome | telefone | idade |\n"
        "| :---: | :--- | :---: | :---: |\n"
        "| 22 | José | 8888-0000 | 45 |\n"
        "| 29 | Maria | 9999-0000 | 33 |\n"
        "| 31 | Antônio | Null | 35 |\n"
        "| 32 | Carlos | 3333-9999 | 16 |\n"
        "| 58 | Josefina | 3333-0000 | 60 |\n"
        "| 64 | Marilda | 3333-1111 | 26 |\n\n"
        "**Carro**\n\n"
        "| idcarro | nomecarro | cor |\n"
        "| :---: | :--- | :--- |\n"
        "| 101 | Ônix | Vermelho |\n"
        "| 102 | Gol | Vermelho |\n"
        "| 103 | Civic | Verde |\n"
        "| 104 | Pálio | Azul |\n\n"
        "**Reservas**\n\n"
        "| Idmoto | idcarro | dia |\n"
        "| :---: | :---: | :---: |\n"
        "| 22 | 101 | 07/08/2020 |\n"
        "| 22 | 102 | 07/08/2020 |\n"
        "| 22 | 103 | 09/08/2020 |\n"
        "| 22 | 104 | 10/08/2020 |\n"
        "| 31 | 102 | 10/08/2020 |\n"
        "| 31 | 103 | 11/08/2020 |\n"
        "| 64 | 101 | 13/08/2020 |\n\n"
        "Com base nas informações apresentadas, qual das seguintes consultas traria o nome dos motoristas que "
        "reservaram os carros vermelhos?"
    ),
    "enade-2021-q33": (
        "Uma abordagem calcula a posição da chave na tabela com base no valor da chave. Este valor é a única "
        "indicação da posição. Quando a chave é conhecida, a posição na tabela pode ser acessada diretamente, "
        "sem fazer qualquer outro teste preliminar, conforme exigido na busca binária ou durante a pesquisa em "
        "uma árvore. Precisamos encontrar uma função `h` que possa transformar uma chave particular `K` — seja ela "
        "uma cadeia de caracteres, um número, um registro etc. — em um índice na tabela usada para armazenar "
        "itens do mesmo tipo que `K`. A função `h` é chamada função de escrutínio (*hash*) e não retorna valores "
        "únicos. Por exemplo, `h(\"abc\") = h(\"acb\")`. Este problema é chamado colisão.\n\n"
        "DROZDEK, A. Estrutura de Dados e Algoritmos em C++. São Paulo: Cengage do Brasil, p. 473, 2016 (adaptado).\n\n"
        "Uma tabela na qual os dados são inseridos em entradas determinadas por uma função `h`, conforme "
        "descrito no texto, é chamada de tabela de dispersão ou tabela de espalhamento. A tabela de dispersão "
        "é representada por meio do vetor `tabelaH` de `T` posições, no qual cada posição é uma estrutura "
        "`ItemDado` e o procedimento de inserção em `tabelaH` está definido a seguir.\n\n"
        "```text\n"
        "ItemDado:\n"
        "  Chave: inteiro\n"
        "  Dado: inteiro\n"
        "  Prox: ItemDado\n\n"
        "procedimento insere(chave, dado: inteiro)\n"
        "início\n"
        "  item, temp: ItemDado\n"
        "  índice: inteiro\n"
        "  índice <- h(chave)\n"
        "  se tabelaH[índice].chave = -1 então\n"
        "    tabelaH[índice].chave <- chave\n"
        "    tabelaH[índice].dado <- dado\n"
        "    tabelaH[índice].prox <- NULO\n"
        "  senão\n"
        "    item.chave <- chave\n"
        "    item.dado <- dado\n"
        "    item.prox <- NULO\n"
        "    se tabelaH[índice].prox = NULO então\n"
        "      tabelaH[índice].prox <- item\n"
        "    senão\n"
        "      temp <- tabelaH[índice].prox\n"
        "      enquanto temp.prox ≠ NULO faça\n"
        "        temp <- temp.prox\n"
        "      fimenquanto\n"
        "      temp.prox <- item\n"
        "    fimse\n"
        "  fimse\n"
        "fimprocedimento\n"
        "```\n\n"
        "O valor `-1` no campo chave de uma entrada na tabela significa que aquela entrada está livre; o campo "
        "`Prox` com o valor `NULO` significa que ele não aponta para nenhum item de dado. A função `h(chave)` "
        "simplesmente retorna o valor do resto da divisão inteira de `chave` por `T`.\n\n"
        "Considerando as informações apresentadas e supondo que `T = 9`, assinale a opção que corresponde ao "
        "estado de `tabelaH` após a seguinte sequência de chamadas: `insere(13, 6); insere(46, 7); insere(20, 22); "
        "insere(28, 25); insere(19, 26); insere(17, 9).`"
    ),
}


def format_truth_table_option(raw_opt: str) -> str:
    lines = [l.strip() for l in raw_opt.splitlines() if l.strip()]
    if len(lines) < 9:
        return raw_opt
    rows = [
        "| p | q | r | (p ∨ q) | (q ∧ ¬r) | S |",
        "| :---: | :---: | :---: | :---: | :---: | :---: |",
    ]
    for line in lines[1:]:
        compact = re.sub(r"\s+", "", line).upper()
        if len(compact) == 6 and all(c in "VF" for c in compact):
            rows.append("| " + " | ".join(compact) + " |")
    return "\n".join(rows) if len(rows) == 10 else raw_opt


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
        p_start = page_for_offset(m.start(1), page_map)
        p_end = page_for_offset(end - 1, page_map)

        if is_disc:
            component = "formacao_geral" if num <= 2 else "especifico"
            q_type = "discursiva"
            stem_raw = block
            options: list[dict[str, str]] = []
            correct_answer = None
            annulled = False
            rubric_text = rubrics.get(num, "")
            qid = f"enade-{year}-d{num:02d}"
            label = f"ENADE {year} • Discursiva {num:02d}"
        else:
            component = "formacao_geral" if num <= 8 else "especifico"
            q_type = "objetiva"
            qid = f"enade-{year}-q{num:02d}"
            stem_raw, options = split_options(block, qid)
            if qid == "enade-2017-q20":
                for opt in options:
                    opt["text"] = format_truth_table_option(opt["text"])
            ans = GABARITO_OBJ[year].get(num, "")
            annulled = ans == "ANULADA"
            correct_answer = None if annulled else ans
            rubric_text = None
            label = f"ENADE {year} • Questão {num:02d}"
            if year == "2021" and num == 33 and len(options) != 5:
                options = [{"letter": l, "text": f"Alternativa {l} — ver diagrama na imagem da página 37"} for l in "ABCDE"]

        stem = SPECIAL_STEMS.get(qid) or format_prose_markdown(stem_raw)
        area_id = classify_area(stem, component, qid)

        image_urls: list[str] = []
        mentions_visual = bool(
            re.search(
                r"\b(?:figuras?|gráficos?|diagramas?|charges?|tirinhas?|infográficos?|esquemas?|quadro a seguir|modelo abaixo|modelo de entidades|ilustraç(?:ão|ões)|tabela-verdade|áreas hachuradas|conjuntos a seguir)\b",
                block.lower(),
            )
        )
        if qid not in SKIP_VISUAL_QIDS and (mentions_visual or (year == "2021" and num == 33)):
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
