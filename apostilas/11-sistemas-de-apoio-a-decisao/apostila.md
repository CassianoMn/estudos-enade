# Sistemas de Apoio à Decisão

> **Foco ENADE:** Em Sistemas de Apoio à Decisão (SAD), o ENADE cobra com frequência a distinção e interdependência entre ambientes **OLTP e OLAP** via processos **ETL/ELT**, modelagem dimensional para **Data Warehouse** (estrela vs. floco de neve), **Business Intelligence (BI) e KPIs**, descoberta de conhecimento (**KDD** e **Mineração de Dados**), os **Vs do Big Data** (com atenção especial à **baixa latência** na velocidade e aos tipos de dados na variedade) e a formulação de modelos matemáticos de **Pesquisa Operacional / Programação Linear** aplicados a problemas reais de custo e produção.

---

## Módulo 1: Pirâmide Decisória, Tipos de Decisão e OLTP vs. OLAP

Nas organizações, os processos decisórios distribuem-se em três níveis hierárquicos, que demandam informações com granularidade, horizonte temporal e grau de estruturação distintos.

### Níveis Organizacionais e Tipos de Decisão

| Nível Decisório | Tipo de Decisão Predominante | Características da Informação | Exemplos de Sistemas |
| :--- | :--- | :--- | :--- |
| **Operacional** | **Estruturada** (rotineira, regras bem definidas e repetitivas) | Alta granularidade (detalhe por transação), tempo real, foco interno e histórico imediato. | **SPT / OLTP** (ERP transacional, PDV, controle de estoque). |
| **Tático (Gerencial)** | **Semiestruturada** (combina modelos analíticos com julgamento humano) | Dados consolidados/agregados, comparações previstas × realizadas, relatórios periódicos e análises *ad hoc*. | **SIG** e **SAD / BI** (painéis gerenciais, análise de vendas regionais). |
| **Estratégico (Executivo)** | **Não estruturada** (alta incerteza, longo prazo, impacto global) | Altamente resumida, tendências históricas, indicadores externos e simulações de cenários (*what-if*). | **SIE / EIS**, **BSC** e plataformas de Analytics avançado. |

### OLTP vs. OLAP: Diferenças e Interdependência

Embora distintos em propósito e modelagem, **sistemas OLTP e OLAP são inter-relacionados**: na maioria das arquiteturas analíticas, os sistemas OLAP são alimentados por dados extraídos e transformados das bases transacionais OLTP por meio de rotinas **ETL**.

| Critério | OLTP (*Online Transaction Processing*) | OLAP (*Online Analytical Processing*) |
| :--- | :--- | :--- |
| **Objetivo principal** | Registrar e processar transações diárias do negócio com alta concorrência e consistência. | Analisar grandes volumes históricos de dados para apoiar decisões gerenciais e estratégicas. |
| **Modelagem predominante** | **Relacional normalizada** (geralmente 3FN) para evitar redundância e anomalias de escrita. | **Multidimensional** (Esquema Estrela ou Floco de Neve) desnormalizada para acelerar leituras agregadas. |
| **Operações típicas** | Leituras curtas e muitas escritas (`INSERT`, `UPDATE`, `DELETE`) com propriedades **ACID**. | Consultas complexas, agregações (`SUM`, `AVG`, `COUNT`) e leituras em massa (`SELECT` com muitos filtros). |
| **Horizonte dos dados** | Dados atuais (correntes). | Dados históricos acumulados ao longo de anos (variante no tempo). |
| **Usuários** | Operadores, caixas, sistemas de atendimento, clientes finais. | Analistas de dados, gerentes, diretores, cientistas de dados. |

---

## Módulo 2: Data Warehouse, Modelagem Dimensional e Operações OLAP

Segundo Bill Inmon, um **Data Warehouse (DW)** é um conjunto de dados **orientado a assuntos**, **integrado**, **variante no tempo** e **não volátil**, construído para dar suporte ao processo de tomada de decisão.

### Conceitos Arquiteturais: DW, Data Mart, Data Lake e Lakehouse

* **Data Warehouse Corporativo (Abordagem Top-Down — Inmon):** repositório centralizado empresarial em 3FN que alimenta Data Marts departamentais.
* **Data Marts Integrados via Barramento (Abordagem Bottom-Up — Kimball):** construção incremental de **Data Marts** (subconjuntos departamentais, ex.: Vendas, Estoque) modelados dimensionalmente e conectados por **dimensões conformadas** (ex.: mesma dimensão `Tempo` e `Produto`).
* **Data Lake:** repositório de baixo custo que armazena grandes volumes de dados brutos em seu formato nativo (**estruturados, semiestruturados e não estruturados**), adotando o paradigma *schema-on-read*.
* **Data Lakehouse:** arquitetura híbrida que combina a escalabilidade e suporte multi-formato do Data Lake com transações ACID, governança e desempenho analítico de Data Warehouses (ex.: Delta Lake, Apache Iceberg).

### Modelagem Dimensional: Fatos, Dimensões e Esquemas

Um modelo dimensional organiza dados quantitativos de negócio em torno de **fatos** (o que se mede) e **dimensões** (o contexto da medição: quem, o quê, onde, quando):
* **Tabela Fato:** armazena **métricas numéricas** (medidas como `valor_venda`, `quantidade`, `saldo`) e **chaves estrangeiras** apontando para as tabelas dimensão.
  * *Medidas aditivas:* podem ser somadas em qualquer dimensão (ex.: `valor_venda`, `quantidade`).
  * *Medidas semiaditivas:* somáveis apenas em algumas dimensões, mas não no tempo (ex.: `saldo_estoque` ou `saldo_bancario` — soma-se entre filiais, mas tira-se a média/último valor ao longo dos meses).
  * *Medidas não aditivas:* não podem ser somadas diretamente (ex.: `percentual_margem`, `preco_unitario`).
* **Tabela Dimensão:** armazena atributos descritivos e hierarquias usadas para filtrar e agrupar (ex.: `Dim_Tempo` com dia/mês/trimestre/ano; `Dim_Produto` com SKU/categoria/marca).
  * **SCD (*Slowly Changing Dimensions*):** estratégias para lidar com mudanças de atributos dimensionais ao longo do tempo: **Tipo 1** (sobrescreve o valor antigo, sem histórico), **Tipo 2** (cria novo registro com chave substituta e datas de vigência, preservando histórico completo), **Tipo 3** (adiciona coluna de valor anterior na mesma linha).

| Aspecto | Esquema Estrela (*Star Schema*) | Esquema Floco de Neve (*Snowflake Schema*) | Constelação de Fatos (*Galaxy*) |
| :--- | :--- | :--- | :--- |
| **Estrutura** | Uma tabela fato central ligada diretamente a tabelas dimensão **desnormalizadas**. | Dimensões são **normalizadas** em sub-tabelas hierárquicas (ex.: `Produto` → `Categoria` → `Departamento`). | Múltiplas tabelas fato compartilhando dimensões conformadas. |
| **Junções (`JOIN`)** | Menor número de `JOIN`s → consultas mais rápidas. | Maior número de `JOIN`s → maior sobrecarga em consultas. | Depende da consulta entre fatos. |
| **Armazenamento** | Maior redundância nas tabelas dimensão. | Menor redundância de atributos textuais. | Compartilha dimensões entre processos. |
| **Uso típico** | Padrão preferencial em BI e ferramentas OLAP. | Dimensões muito grandes com hierarquias profundas. | DWs corporativos com múltiplos processos de negócio. |

#### Exemplo Numérico 1: Granularidade e Contagem de Linhas no Esquema Estrela

Suponha um Data Mart de varejo em Esquema Estrela com **40 lojas**, **500 produtos** e **365 dias** no ano, em que a tabela fato `Fato_Venda_Diaria` registra a granularidade `(id_tempo, id_loja, id_produto)`. Se apenas **15%** das combinações loja-produto têm venda em um dia típico:
* Volume máximo teórico por ano: `365 × 40 × 500 = 7.300.000` registros.
* Volume esperado com 15% de densidade: `7.300.000 × 0,15 = 1.095.000` linhas/ano na tabela fato, enquanto as dimensões somam apenas `365 + 40 + 500 = 905` linhas — demonstrando por que a tabela fato concentra quase todo o volume físico do DW.

### Operações OLAP e Arquiteturas de Armazenamento

* **Operações sobre o Cubo OLAP:**
  * **Roll-up (Drill-up):** sobe na hierarquia agregando dados (ex.: de `Cidade` para `Estado` ou de `Dia` para `Trimestre`).
  * **Drill-down:** desce na hierarquia detalhando os dados (ex.: de `Ano` para `Mês`).
  * **Slice:** fixa um valor em uma única dimensão, gerando uma "fatia" bidimensional do cubo (ex.: apenas `Ano = 2025`).
  * **Dice:** seleciona subconjuntos/intervalos em duas ou mais dimensões, gerando um subcubo (ex.: `Ano IN (2024, 2025)` e `Região IN ('NE', 'SE')`).
  * **Pivot (Rotação):** gira os eixos da visualização (linhas ↔ colunas) para análise cruzada.
* **Motores OLAP:** **ROLAP** (usa banco relacional e SQL sobre esquema estrela; alta escalabilidade), **MOLAP** (pré-computa agregações em matrizes multidimensionais proprietárias; altíssima velocidade de consulta) e **HOLAP** (híbrido: detalhes no relacional e agregações no multidimensional).

---

## Módulo 3: ETL, ELT e Governança de Dados

A integração entre sistemas operacionais heterogêneos e o ambiente analítico ocorre por meio de pipelines **ETL** (*Extract, Transform, Load*) ou **ELT** (*Extract, Load, Transform*).

| Etapa / Critério | ETL Tradicional | ELT Moderno (Nuvem / Lakehouse) |
| :--- | :--- | :--- |
| **Fluxo** | Extrai da origem → Transforma em servidor intermediário (*staging*) → Carrega no DW. | Extrai da origem → Carrega dados brutos no Data Lake/DW em nuvem → Transforma dentro do próprio motor analítico. |
| **Onde transforma** | Servidor dedicado de ETL antes da carga. | Motor distribuído do destino (ex.: Spark, SQL em nuvem). |
| **Vantagem principal** | Envia apenas dados limpos e conformados para o DW; menor tráfego de dados finais e maior controle de privacidade pré-carga. | Alta escalabilidade elástica, agilidade para reprocessar regras sem reextrair da origem e suporte nativo a dados brutos. |

Durante a **Transformação**, realizam-se: limpeza de nulos e duplicatas, padronização de formatos (datas, moedas, CPF), deduplicação, criação de **chaves substitutas (*surrogate keys*)** independentes das chaves naturais operacionais e cálculos derivados.

---

## Módulo 4: Business Intelligence (BI), KPIs e Gestão Estratégica

**Business Intelligence (BI)** engloba metodologias, processos e ferramentas para transformar dados brutos em informações acionáveis por meio de painéis (*dashboards*), relatórios e alertas.

* **KPI (*Key Performance Indicator*):** métrica quantitativa crítica vinculada a uma meta estratégica (ex.: *Churn Rate*, *Ticket Médio*, *NPS*, *MTTR*, *Margem Líquida*). Um bom KPI segue o critério **SMART** (Específico, Mensurável, Atingível, Relevante e Temporal).
* **Balanced Scorecard (BSC):** framework estratégico de Kaplan e Norton que equilibra indicadores financeiros e não financeiros em **quatro perspectivas**:
  1. **Financeira:** retorno sobre investimento, lucratividade, redução de custos.
  2. **Clientes:** satisfação, retenção, participação de mercado.
  3. **Processos Internos:** eficiência operacional, qualidade, ciclo de entrega.
  4. **Aprendizado e Crescimento:** capacitação, cultura organizacional, infraestrutura de TI.

---

## Módulo 5: KDD e Mineração de Dados (*Data Mining*)

O processo de **KDD (*Knowledge Discovery in Databases*)** vai além da consulta descritiva de BI: busca descobrir padrões novos, válidos, potencialmente úteis e compreensíveis em grandes bases de dados.

### Etapas do KDD (Fayyad) e CRISP-DM

No modelo clássico de **KDD**, as etapas são iterativas:
1. **Seleção:** recorte dos dados relevantes a partir das fontes.
2. **Pré-processamento / Limpeza:** tratamento de ruídos, valores ausentes e inconsistências.
3. **Transformação:** normalização, redução de dimensionalidade, engenharia de atributos.
4. **Mineração de Dados (*Data Mining*):** aplicação de algoritmos estatísticos e de aprendizado de máquina para extrair padrões.
5. **Interpretação / Avaliação:** validação dos padrões encontrados para convertê-los em conhecimento acionável.

### Principais Tarefas de Mineração de Dados

| Tarefa | Paradigma | Objetivo | Algoritmos Clássicos |
| :--- | :--- | :--- | :--- |
| **Classificação** | Supervisionado | Prever uma classe/rótulo categórico (ex.: aprovar ou negar crédito). | Árvores de Decisão (ID3, C4.5, CART), Naive Bayes, SVM, Random Forest. |
| **Regressão** | Supervisionado | Prever um valor numérico contínuo (ex.: previsão de demanda). | Regressão Linear/Múltipla, Redes Neurais, Gradient Boosting. |
| **Clusterização (Agrupamento)** | Não supervisionado | Agrupar registros similares sem rótulos prévios (ex.: segmentação de clientes). | K-Means, DBSCAN, Agrupamento Hierárquico. |
| **Regras de Associação** | Não supervisionado | Descobrir coocorrência entre itens (`{Fralda} → {Cerveja}`). | Apriori, FP-Growth. |

#### Exemplo Numérico 2: Suporte e Confiança em Regras de Associação

Em um conjunto de **1.000 transações** de supermercado: o item `Café` aparece em **400** transações; `Açúcar` aparece em **300** transações; e ambos (`Café` e `Açúcar`) aparecem juntos em **240** transações. Calcule o **Suporte** e a **Confiança** da regra `{Café} → {Açúcar}`:
* `Suporte(Café → Açúcar) = P(Café ∩ Açúcar) = 240 / 1000 = 0,24` (**24%** das cestas contêm ambos).
* `Confiança(Café → Açúcar) = P(Açúcar | Café) = 240 / 400 = 0,60` (**60%** dos clientes que compram café também compram açúcar).

---

## Módulo 6: Big Data e Ecossistema Analítico Distribuído

O termo **Big Data** refere-se a conjuntos de dados cuja escala, heterogeneidade e taxa de chegada superam a capacidade de ferramentas relacionais tradicionais e processamento sequencial em máquina única.

### Os Vs do Big Data (Atenção ao ENADE!)

| Dimensão | Significado e Implicações Técnicas |
| :--- | :--- |
| **Volume** | Quantidade massiva de dados (terabytes a exabytes) gerada continuamente, exigindo armazenamento distribuído horizontal (ex.: HDFS, Object Storage). |
| **Variedade** | Diversidade de fontes e formatos: **dados estruturados** (tabelas relacionais, dados cadastrais), **dados semiestruturados** (JSON, XML, logs de sensores IoT) e **dados não estruturados** (vídeos de câmeras de segurança, áudios, imagens, textos livres em redes sociais). |
| **Velocidade** | Rapidez com que os dados são gerados e precisam ser processados. **Atenção:** o processamento em tempo real/streaming exige **baixa latência** (e **nunca** "alta latência" — pegadinha oficial do ENADE 2021 Q26!), sob pena de os dados perderem utilidade (ex.: tráfego urbano, detecção de fraude). |
| **Veracidade** | Confiabilidade, consistência e qualidade dos dados coletados de múltiplas fontes, evitando viés e erros nas decisões (*garbage in, garbage out*). |
| **Valor** | Capacidade efetiva de converter os dados analisados em retorno econômico, social ou operacional mensurável. |

No processamento distribuído em larga escala, destacam-se os paradigmas **Batch** (ex.: Hadoop MapReduce e Apache Spark em disco/memória) e **Streaming** (ex.: Apache Kafka + Spark Streaming / Flink para ingestão contínua em baixa latência).

---

## Módulo 7: Pesquisa Operacional Aplicada à Tomada de Decisão

A **Pesquisa Operacional (PO)** emprega modelagem matemática e algoritmos de otimização para apoiar decisões de alocação de recursos escassos, logística, produção e redução de custos.

### Estrutura de um Modelo de Programação Linear (PL)

Todo problema de Programação Linear possui três elementos formais:
1. **Variáveis de decisão:** incógnitas quantitativas a serem determinadas (ex.: `x` e `y`, com restrição de não negatividade `x >= 0, y >= 0`).
2. **Função objetivo:** expressão linear a **Maximizar (`Max Z`)** (lucro, receita, eficiência) ou **Minimizar (`Min Z`)** (custo, tempo, desperdício).
3. **Restrições lineares:** equações ou inequações que representam limites de recursos (`<=`), metas mínimas de demanda (`>=`) ou balanços exatos (`=`).

#### Exemplo Numérico 3: Formulação e Solução de Minimização de Custos (Estilo ENADE)

Uma empresa monta três tipos de equipamentos (`Desktops`, `Notebooks` e `Tablets`) em duas fábricas (`Fábrica 1` e `Fábrica 2`). Ela precisa entregar pelo menos **16 mil desktops**, **6 mil notebooks** e **28 mil tablets**.
* **Fábrica 1** (custo diário: **R$ 150.000**): produz por dia **8 mil** desktops, **1 mil** notebooks e **2 mil** tablets.
* **Fábrica 2** (custo diário: **R$ 210.000**): produz por dia **2 mil** desktops, **1 mil** notebooks e **7 mil** tablets.

**1) Formulação do Modelo:**
Sejam `x` = dias de operação da Fábrica 1 e `y` = dias de operação da Fábrica 2 (`x >= 0, y >= 0`).
* **Função Objetivo (minimizar custo total):**
  `Min Z = 150.000x + 210.000y`
* **Restrições de demanda mínima** (atenção: atender **pelo menos** a demanda implica sinal `>=`, e não `<=`!):
  * Desktops: `8x + 2y >= 16`
  * Notebooks: `1x + 1y >= 6`
  * Tablets: `2x + 7y >= 28`

**2) Determinação do Ponto Ótimo (avaliando os vértices da região viável):**
* Interseção de `8x + 2y = 16` com `x + y = 6`:
  Da 2ª, `y = 6 - x`. Substituindo: `8x + 2(6 - x) = 16` → `6x = 4` → `x = 2/3` (`0,67`), `y = 16/3` (`5,33`). Checando tablets: `2(2/3) + 7(16/3) = 116/3 = 38,67 >= 28` (viável!). Custo: `Z = 150.000(2/3) + 210.000(16/3) = 100.000 + 1.120.000 = R$ 1.220.000`.
* Interseção de `x + y = 6` com `2x + 7y = 28`:
  Substituindo `x = 6 - y`: `2(6 - y) + 7y = 28` → `12 + 5y = 28` → `5y = 16` → `y = 3,2` dias, `x = 2,8` dias. Checando desktops: `8(2,8) + 2(3,2) = 22,4 + 6,4 = 28,8 >= 16` (viável!).
  Custo: `Z = 150.000(2,8) + 210.000(3,2) = 420.000 + 672.000 = R$ 1.092.000`.
* Extremos nos eixos: `(x = 14, y = 0)` satisfaz `2(14) = 28`, custo `Z = 2.100.000`; `(x = 0, y = 8)` satisfaz `2(8) = 16`, custo `Z = 1.680.000`.

**Conclusão:** O custo mínimo é **R$ 1.092.000,00**, operando **2,8 dias** na Fábrica 1 e **3,2 dias** na Fábrica 2.

---

## Resumo Estratégico para o ENADE

1. **OLTP × OLAP:** OLTP é normalizado (3FN), operacional e focado em escrita concorrente; OLAP é multidimensional (estrela/floco de neve), histórico e alimentado pelo OLTP via **ETL/ELT**.
2. **Modelagem Dimensional:** Prefira **Star Schema** para reduzir `JOIN`s; lembre-se da **SCD Tipo 2** para preservar histórico dimensional e classifique corretamente medidas aditivas, semiaditivas e não aditivas.
3. **KDD e Mineração:** Classificação (rótulo discreto, supervisionado), Regressão (valor contínuo, supervisionado), Clusterização (grupos, não supervisionado) e Associação (`suporte` = frequência conjunta; `confiança` = probabilidade condicional).
4. **Big Data:** Os 4 Vs clássicos no ENADE são **Volume, Variedade, Velocidade e Veracidade**. Na velocidade, a exigência é de **baixa latência** (nunca alta latência!). Na variedade, distinga dados estruturados (bancos relacionais), semiestruturados (JSON/XML/sensores) e não estruturados (vídeos/imagens/texto livre).
5. **Pesquisa Operacional:** Leia com atenção se o problema pede **minimizar custo** com **demanda mínima (`>=`)** ou **maximizar lucro** com **capacidade máxima de recursos (`<=`)** — inverter os sinais das inequações é a armadilha mais frequente da prova.
