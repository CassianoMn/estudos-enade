# EstudosEnade — Sistemas de Informação

Ecossistema completo de preparação para o **ENADE (Sistemas de Informação)** reunindo:

- **15 Apostilas Unificadas (`.md` e `.pdf`)** cobrindo Formação Geral e todas as 14 áreas do Google Drive do curso (incluindo apostilas-base alinhadas ao ENADE para as áreas originalmente vazias).
- **Banco de 270+ Questões Estruturadas**:
  - **120 questões oficiais** extraídas das provas ENADE **2014, 2017 e 2021** (objetivas com gabarito definitivo e discursivas com padrão de resposta oficial do INEP).
  - **150+ questões inéditas no estilo ENADE** (10 por área: 8 objetivas com justificativa alternativa por alternativa + 2 discursivas com rubrica de correção).
- **Aplicativo Web de Estudos (`app/`)** em React + Vite + TypeScript com:
  - Leitor interativo de apostilas (sumário clicável, busca interna, download do PDF e checklist de módulos).
  - Simulado cronometrado (ENADE Oficial 2014/2017/2021, Simulado Inédito Completo e Simulado Rápido) com cartão de respostas e salvamento automático.
  - Quiz por áreas com filtros por fonte, tipo, status e feedback imediato.
  - Métricas de desempenho por área, histórico de simulados e backup/restauração em JSON (`localStorage`).

## Link para acessar:

https://cassianomn.github.io/estudos-enade/

## Estrutura do Projeto

```text
EstudosEnade/
├── apostilas/          # 15 áreas unificadas em Markdown (.md), PDF (.pdf) e indice.json
├── questoes/           # Provas oficiais (2014/2017/2021), inéditas por área e banco-unificado.json
├── scripts/            # Scripts Python de download, extração, compilação PDF e validação
├── app/                # Aplicação Web SPA (React + Vite + TypeScript + Tailwind CSS)
└── .github/workflows/  # Pipeline de build e publicação no GitHub Pages
```

## Como Executar o App Localmente

```bash
cd app
npm install
npm run dev
```

Para executar os testes unitários e o build de produção:

```bash
cd app
npm test
npm run build
```

## Reprocessar Materiais Brutos e Recompilar PDFs

Os arquivos brutos baixados do Google Drive e as provas originais em PDF ficam em `materiais-brutos/` (ignorado pelo Git para manter o repositório leve). Para baixar e reprocessar localmente:

```bash
python -m venv scripts/.venv
scripts/.venv/Scripts/python.exe -m pip install -r scripts/requirements.txt
scripts/.venv/Scripts/python.exe scripts/download_materials.py
scripts/.venv/Scripts/python.exe scripts/extract_content.py
scripts/.venv/Scripts/python.exe scripts/build_apostilas_pdf.py
scripts/.venv/Scripts/python.exe scripts/validate_data.py
scripts/.venv/Scripts/python.exe scripts/sync_app_data.py
```

## Fontes de Referência

- Pasta de materiais dos professores (Google Drive)
- [Portal Enade DSI — UFS / ItaTech Jr.](https://enade.itatechjr.com.br/#inicio)
