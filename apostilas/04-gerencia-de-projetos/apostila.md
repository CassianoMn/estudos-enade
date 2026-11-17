# Gerência de Projetos

> **Foco ENADE:** O ENADE em Sistemas de Informação cobra Gerência de Projetos em perspectiva **situacional e integrada**: não basta decorar nomes de processos, é preciso saber identificar em qual momento do ciclo de vida um artefato surge, calcular **Caminho Crítico (CPM)**, **PERT** e **Valor Agregado (EVM)**, comparar estruturas organizacionais (funcional, matricial e projetizada), distinguir **governança de gerenciamento** (COBIT 2019, ITIL 5, CMMI AIM) e reconhecer a transição do **PMBOK 6ª edição** para as abordagens orientadas a princípios, domínios de desempenho e entregas híbridas do **PMBOK 7ª e 8ª edições**.

---

## Módulo 1: Fundamentos de Projetos, Estruturas Organizacionais e Ciclo de Vida

### 1.1 Projeto, Programa, Portfólio e Operações

Segundo o PMI (*Project Management Institute*), um **projeto** é um **esforço temporário empreendido para criar um produto, serviço ou resultado único**. Duas características o definem de modo inegociável:

* **Temporalidade:** possui início e término definidos (mesmo que o resultado dure anos, o projeto acaba quando seus objetivos são atingidos ou quando é encerrado).
* **Exclusividade (Unicidade):** gera uma entrega singular, diferente de rotinas operacionais repetitivas.

| Conceito | Natureza | Escopo e Horizonte | Exemplo em TI |
| :--- | :--- | :--- | :--- |
| **Projeto** | Temporário e único | Escopo delimitado; cria produto, serviço ou resultado exclusivo | Implantação de um novo ERP acadêmico |
| **Programa** | Grupo de projetos relacionados | Gerenciados de forma coordenada para obter benefícios não disponíveis individualmente | Programa de Transformação Digital (ERP + Portal do Aluno + BI) |
| **Portfólio** | Projetos, programas, subportfólios e operações | Alinhamento aos objetivos estratégicos da organização (não precisam ser interdependentes) | Carteira anual de investimentos em TI da empresa |
| **Operações (Nível de Serviço)** | Contínuas e repetitivas | Sustentam o negócio e mantêm sistemas em produção | Atendimento de Service Desk Nível 1 e backup diário |

### 1.2 Tripla Restrição e Restrições Ampliadas

A **Tripla Restrição** clássica envolve **Escopo, Tempo (Cronograma) e Custo**, tendo a **Qualidade** no centro (impactada por qualquer alteração nos três eixos). Em abordagens modernas (PMBOK 6/7/8), somam-se **Riscos, Recursos e Satisfação das Partes Interessadas**.

### 1.3 Estruturas Organizacionais e Autoridade do Gerente de Projetos

O poder do Gerente de Projetos (GP), a disponibilidade de recursos e a lealdade da equipe variam drasticamente conforme a estrutura organizacional:

| Tipo de Estrutura | Autoridade do GP | Papel do GP | Controle de Orçamento | Características-Chave (Foco ENADE) |
| :--- | :--- | :--- | :--- | :--- |
| **Funcional** | Pouca ou nenhuma | Tempo parcial (muitas vezes *Expeditor* ou *Coordenador*) | Gerente Funcional | Equipe responde ao chefe funcional; se alguém recebe múltiplas demandas, o **gerente funcional** direciona o trabalho. |
| **Matricial Fraca** | Baixa | Tempo parcial (coordenador/facilitador) | Gerente Funcional | Semelhante à funcional; o **facilitador** apenas auxilia comunicações e **não pode tomar decisões** autônomas. |
| **Matricial Balanceada** | Baixa a Moderada | Tempo integral (como GP) | Compartilhado | O GP existe formalmente, mas divide poder com os gerentes funcionais. |
| **Matricial Forte** | Moderada a Alta | Tempo integral | Gerente de Projetos | Há escritório de projetos (PMO) estruturado; **maior necessidade de gerenciamento de integração** devido à dupla subordinação. |
| **Projetizada (Pura)** | Alta a Quase Total | Tempo integral | Gerente de Projetos | Equipe dedicada ao projeto ("tem lealdade ao projeto"), mas ao término "nem sempre tem para onde voltar". |

> **Atenção à distinção clássica de prova:** Um **facilitador de projetos** (*Project Expeditor*) atua como assistente de comunicação e **não tem autoridade para tomar decisões**; já o **coordenador de projetos** possui alguma autoridade decisória e reporta-se à gerência de nível mais alto, embora ainda com menos poder que um Gerente de Projetos pleno.

### 1.4 Ciclo de Vida do Projeto vs. Ciclo de Vida do Produto

* **Ciclo de Vida do Produto:** engloba concepção, desenvolvimento, operação, manutenção e retirada de mercado. Pode gerar múltiplos projetos ao longo do tempo.
* **Ciclo de Vida do Projeto:** sequência de fases (iniciação, planejamento, execução, encerramento — ou iterações) definidas para governar e gerenciar o projeto. **Não existe um único modelo** de ciclo de vida; ele pode ser:
  * **Preditivo (Cascata):** escopo, prazo e custo definidos cedo; mudanças são rigorosamente controladas.
  * **Iterativo / Incremental:** escopo geral entendido, mas detalhado por iterações sucessivas com entregas parciais funcionais.
  * **Adaptativo (Ágil):** escopo altamente mutável, ciclos curtos (*sprints*), entrega contínua de valor e feedback frequente do cliente.
  * **Híbrido:** combina planejamento preditivo de alto nível (marcos, governança, contratos) com execução adaptativa por iterações.

### 1.5 Iniciação e Termo de Abertura do Projeto (TAP / *Project Charter*)

Durante a **Iniciação**, ocorrem atividades críticas que legitimam o projeto:
1. Definição de critérios de seleção e justificativa de negócio (*Business Case*).
2. Criação e aprovação do **Termo de Abertura do Projeto (TAP / *Project Charter*)** — documento emitido pelo **patrocinador (*sponsor*)** (e **não** criado unilateralmente pelo GP sem autorização superior), que autoriza formalmente a existência do projeto e confere ao GP autoridade para alocar recursos organizacionais.
3. Nomeação oficial do Gerente de Projetos e identificação inicial das partes interessadas (*stakeholders*).

> **Pegadinha recorrente:** O orçamento detalhado e a **linha de base de custos** só são finalizados e aceitos ao término do **Planejamento**, e não na Iniciação (o TAP traz apenas estimativas preliminares de alto nível).

---

## Módulo 2: Evolução do PMBOK (6ª, 7ª e 8ª Edições)

Compreender a evolução do Guia PMBOK é essencial para responder tanto questões tradicionais quanto questões atuais do ENADE.

### 2.1 Visão Clássica (PMBOK 6ª Edição): 5 Grupos de Processos × 10 Áreas de Conhecimento × 49 Processos

Na 6ª edição, o gerenciamento preditivo organiza-se em **49 processos**, estruturados por **ITTOs** (*Inputs, Tools & Techniques, Outputs* — Entradas, Ferramentas/Técnicas e Saídas), distribuídos em **5 Grupos de Processos** e **10 Áreas de Conhecimento**:

1. **5 Grupos de Processos:** Iniciação (2), Planejamento (24), Execução (10), Monitoramento e Controle (12) e Encerramento (1).
2. **10 Áreas de Conhecimento:**
   * **Integração:** unifica processos e coordena o TAP, o Plano de Gerenciamento do Projeto (PGP) e o controle integrado de mudanças.
   * **Escopo:** define o trabalho necessário (e apenas o necessário) via EAP/WBS.
   * **Cronograma (Tempo):** define, sequencia, estima durações e controla o cronograma.
   * **Custos:** estima, determina o orçamento e controla custos.
   * **Qualidade:** planeja, gerencia (garantia de qualidade / auditoria de processos) e controla a qualidade (inspeção de entregas).
   * **Recursos:** planeja, adquire, desenvolve e gerencia equipe e recursos físicos.
   * **Comunicações:** planeja, gerencia e monitora o fluxo de informações.
   * **Riscos:** identifica, analisa (qualitativa e quantitativa), planeja respostas e monitora riscos.
   * **Aquisições:** planeja, conduz e controla contratos e fornecedores.
   * **Partes Interessadas (*Stakeholders*):** identifica, planeja, gerencia e monitora o engajamento de todos os afetados pelo projeto.

### 2.2 A Virada de Chave do PMBOK 7ª Edição (2021)

O PMBOK 7 rompeu com o modelo prescritivo de 49 processos e ITTOs, adotando uma visão baseada em **Entrega de Valor**, **12 Princípios de Gerenciamento de Projetos** (administração, equipe, partes interessadas, valor, pensamento sistêmico, liderança, adaptação/*tailoring*, qualidade, complexidade, risco, adaptabilidade/resiliência, mudança) e **8 Domínios de Desempenho** (Partes Interessadas, Equipe, Abordagem de Desenvolvimento e Ciclo de Vida, Planejamento, Trabalho do Projeto, Entrega, Medição e Incerteza).

### 2.3 PMBOK 8ª Edição (2026): O Modelo Híbrido Equilibrado

Publicado em 2026, o **PMBOK 8** promove uma síntese prática: mantém a flexibilidade da mentalidade ágil e orientada a valor, mas **resgata os processos com ITTOs** de forma enxuta e adaptável, evitando tanto a rigidez burocrática da 6ª edição quanto a abstração excessiva da 7ª.

| Elemento Estrutural | PMBOK Clássico (6ª Ed.) | PMBOK 8ª Edição (2026) | Impacto Prático e de Prova |
| :--- | :--- | :--- | :--- |
| **Abordagem** | Prescritiva ("como fazer" passo a passo) | **Híbrida / Orientada a Valor** | Combina estrutura de processos com princípios estratégicos. |
| **Princípios** | Não possuía lista formal de 6 ou 12 | **6 Princípios Norteadores** | Simplificação e foco direto em decisão e geração de valor. |
| **Áreas de Conhecimento** | **10 Áreas de Conhecimento** | **Eliminadas** (substituídas) | O conceito formal de áreas de conhecimento dá lugar a resultados. |
| **Domínios de Desempenho** | Inexistentes na 6ª (8 na 7ª) | **7 Domínios de Desempenho** | Substituem o foco técnico departamental por foco em resultados. |
| **Grupos de Processos** | **5 Grupos de Processos** | **5 Áreas de Foco** | Caráter **não-sequencial e adaptável**. |
| **Quantidade de Processos** | **49 Processos** | **40 Processos** | Redução de 9 processos por fusão de tarefas microgerenciais. |

#### Reconfiguração dos 7 Domínios de Desempenho no PMBOK 8

1. **Governança (*Governance*):** substitui a antiga **Integração** (iniciação, TAP, alinhamento estratégico e decisões críticas) e **absorve Aquisições** em um único processo chamado *Plan Sourcing Strategy* (Planejar Estratégia de Fornecimento).
2. **Escopo (*Scope*):** mantido, mas **absorve Qualidade** (atividades de verificação e testes passam a integrar a garantia de entrega correta do produto).
3. **Cronograma (*Schedule*):** condensado (ex.: definir atividades, sequenciar, estimar durações e desenvolver cronograma foram unificados em *Develop Schedule*).
4. **Finanças (*Finance*):** substitui **Custos**, deslocando o foco de mero controle de gastos para gestão do financiamento e retorno financeiro do projeto.
5. **Partes Interessadas (*Stakeholders*):** **absorve Comunicações**, integrando comunicação ao engajamento contínuo.
6. **Recursos (*Resources*):** equipe e recursos físicos (ex.: Desenvolver Equipe + Gerenciar Equipe unificados em *Lead the Team*).
7. **Riscos (*Risk*):** mantido com estrutura equivalente.

> **Exemplos de fusão de processos (49 -> 40):** *Develop Scope Structure* (coletar requisitos + definir escopo), *Develop Schedule* (definir + sequenciar + estimar durações + desenvolver cronograma) e *Lead the Team* (desenvolver + gerenciar equipe).

---

## Módulo 3: Escopo, EAP/WBS, Cronograma, Rede (PDM), Caminho Crítico e PERT

### 3.1 Gerenciamento do Escopo e EAP/WBS

* **Escopo do Produto:** características e funções que descrevem um produto, serviço ou resultado.
* **Escopo do Projeto:** todo o trabalho que precisa ser realizado para entregar o produto com as características especificadas.
* **EAP (Estrutura Analítica do Projeto) / WBS (*Work Breakdown Structure*):** decomposição hierárquica orientada às **entregas** do trabalho a ser executado pela equipe.
  * **Regra dos 100%:** a EAP deve conter 100% do trabalho definido no escopo do projeto — o que não está na EAP não faz parte do projeto.
  * **Pacote de Trabalho (*Work Package*):** nível mais baixo de cada ramo da EAP, onde custos e durações podem ser estimados e gerenciados com confiabilidade.
  * **Dicionário da EAP:** documento que detalha cada componente da EAP (critérios de aceitação, responsável, marcos, estimativas).
  * **Scope Creep (Corrupção de Escopo):** expansão descontrolada do escopo sem ajustes correspondentes de prazo, custo ou recursos. Diferencia-se do *Gold Plating* (adicionar funcionalidades extras "de graça" sem solicitação do cliente).

### 3.2 Sequenciamento com PDM (*Precedence Diagram Method*)

O **PDM (Método do Diagrama de Precedência)** é a técnica utilizada no sequenciamento de atividades (Rede AON — *Activity-on-Node*, onde os nós representam atividades e as setas representam dependências lógicas):

* **Término-para-Início (TI / FS):** a sucessora só inicia após o término da predecessora (mais comum).
* **Início-para-Início (II / SS):** a sucessora só inicia após o início da predecessora.
* **Término-para-Término (TT / FF):** a sucessora só termina após o término da predecessora.
* **Início-para-Término (IT / SF):** a sucessora só termina após o início da predecessora (raro).

### 3.3 Método do Caminho Crítico (CPM)

O **Caminho Crítico** é a sequência de atividades que representa o **caminho mais longo da rede** em termos de duração, determinando a **menor duração possível (data mais cedo de conclusão)** para o projeto.

Para cada atividade, calculam-se quatro datas via *Forward Pass* (ida) e *Backward Pass* (volta):
* `IC` (Início Mais Cedo / *Early Start - ES*) e `TC` (Término Mais Cedo / *Early Finish - EF*): `TC = IC + Duração`
  * Na ida, quando uma atividade tem múltiplas predecessoras, `IC = max(TC das predecessoras)`.
* `IT` (Início Mais Tarde / *Late Start - LS*) e `TT` (Término Mais Tarde / *Late Finish - LF*): `IT = TT - Duração`
  * Na volta, quando uma atividade tem múltiplas sucessoras, `TT = min(IT das sucessoras)`.

**Fórmulas de Folga:**

```text
Folga Total (FT) = IT - IC = TT - TC
Folga Livre (FL) = min(IC das sucessoras) - TC
```

* Atividades do **Caminho Crítico** possuem **Folga Total = 0** (qualquer atraso nelas atrasa a conclusão do projeto).
* Um projeto pode ter mais de um caminho crítico (o que aumenta o risco de atraso).
* **Compressão de Cronograma:**
  * **Compressão (*Crashing*):** alocar mais recursos às atividades críticas para reduzir duração, **aumentando custos**.
  * **Paralelismo (*Fast Tracking*):** executar em paralelo atividades originalmente sequenciais (ex.: iniciar codificação antes do término completo do design), **aumentando riscos e retrabalho**.

### 3.4 Estimativa de Três Pontos (PERT)

Quando há incerteza nas estimativas de duração ou custo, utiliza-se a técnica **PERT (*Program Evaluation and Review Technique*)**, combinando estimativa Otimista (`O`), Mais Provável (`M`) e Pessimista (`P`):

```text
Duração Esperada (Te) - Distribuição Beta (PERT):   Te = (O + 4M + P) / 6
Duração Esperada (Te) - Distribuição Triangular:    Te = (O + M + P) / 3
Desvio-Padrão da Atividade (σ):                     σ  = (P - O) / 6
Variância da Atividade (V):                         V  = ((P - O) / 6)^2
```

Para calcular o desvio-padrão de um caminho completo (ex.: caminho crítico), **somam-se as variâncias** das atividades críticas e extrai-se a raiz quadrada (nunca se somam desvios-padrão diretamente!):

```text
σ_caminho = raiz_quadrada( Σ V_i )
```

### 3.5 Buffers (Reservas) de Cronograma

Os *buffers* (reservas de contingência de tempo) servem para absorver riscos conhecidos de cronograma. Como regra de boas práticas (e questão recorrente de prova), **os buffers devem ser documentados explicitamente**, de modo que possam ser ajustados ou eliminados caso premissas mudem ou estimativas mais precisas fiquem disponíveis — nunca escondidos silenciosamente dentro de cada tarefa (*padding*).

---

## Módulo 4: Custos, Finanças e Gerenciamento de Valor Agregado (EVM)

### 4.1 Tipos de Custos e Reservas Orçamentárias

No gerenciamento de custos/finanças, o foco principal do GP recai sobre **custos diretos** (mão de obra, licenças, equipamentos alocados ao projeto) e o controle da **Linha de Base de Custos**, que é formada pela soma das estimativas dos pacotes de trabalho mais a **Reserva de Contingência** (para riscos identificados — "conhecidos-desconhecidos", gerenciada pelo GP).

Acima da Linha de Base de Custos fica a **Reserva Gerencial** (para riscos imprevistos — "desconhecidos-desconhecidos"), que exige aprovação da alta gestão/patrocinador para uso. A soma da Linha de Base de Custos com a Reserva Gerencial compõe o **Orçamento do Projeto**.

```text
Orçamento Total do Projeto = Linha de Base de Custos + Reserva Gerencial
Linha de Base de Custos    = Estimativas das Atividades + Reserva de Contingência
```

### 4.2 Gerenciamento de Valor Agregado (EVM — *Earned Value Management*)

O **EVM** integra escopo, cronograma e custos para medir objetivamente o desempenho e prever tendências. É um dos cálculos mais cobrados em provas de Gerência de Projetos.

#### Três Métricas-Base (em um instante de medição *t*)

* **`VP` (Valor Planejado / *PV - Planned Value*):** orçamento autorizado para o trabalho que deveria estar concluído até o momento *t*. O total planejado para o projeto inteiro é o **`ONT` (Orçamento no Término / *BAC - Budget at Completion*)**.
* **`VA` (Valor Agregado / *EV - Earned Value*):** valor orçado do trabalho que foi **efetivamente realizado** até o momento *t* (`VA = % concluído real × ONT`).
* **`CR` (Custo Real / *AC - Actual Cost*):** custo efetivamente gasto/incorrido para realizar o trabalho até o momento *t*.

#### Fórmulas de Variação, Índices e Previsão (Tabela de Referência)

| Indicador / Métrica | Fórmula | Interpretação (Regra de Ouro) |
| :--- | :--- | :--- |
| **Variação de Custo (`VC` / *CV*)** | `VC = VA - CR` | `VC > 0`: Abaixo do orçamento (bom); `VC < 0`: Acima do orçamento (estouro) |
| **Variação de Prazo (`VPr` / *SV*)** | `VPr = VA - VP` | `VPr > 0`: Adiantado; `VPr < 0`: Atrasado |
| **Índice de Desempenho de Custo (`IDC` / *CPI*)** | `IDC = VA / CR` | `IDC >= 1`: Eficiente no custo; `IDC < 1`: Gastando mais por real agregado |
| **Índice de Desempenho de Prazo (`IDP` / *SPI*)** | `IDP = VA / VP` | `IDP >= 1`: No prazo ou adiantado; `IDP < 1`: Atrasado |
| **Estimativa no Término (`ENT` / *EAC*) — Tendência típica** | `ENT = ONT / IDC` | Projeta custo final mantendo a eficiência atual de custos |
| **Estimativa no Término (`ENT` / *EAC*) — Variação atípica** | `ENT = CR + (ONT - VA)` | Assume que o trabalho restante seguirá o orçamento original |
| **Estimativa no Término (`ENT` / *EAC*) — Custo + Prazo** | `ENT = CR + [(ONT - VA) / (IDC × IDP)]` | Considera impacto simultâneo de atraso e custo |
| **Estimativa para Terminar (`EPT` / *ETC*)** | `EPT = ENT - CR` | Quanto ainda falta gastar a partir de agora até o fim |
| **Variação no Término (`VNT` / *VAC*)** | `VNT = ONT - ENT` | Saldo final previsto (`VNT < 0` indica estouro projetado) |
| **Índice de Desempenho para Terminar (`IDPT` / *TCPI*)** | `IDPT = (ONT - VA) / (ONT - CR)` | Eficiência exigida no restante do projeto para cumprir o `ONT` |

> **Dica infalível de memorização:** Nas fórmulas do EVM, **`VA` (Valor Agregado) vem sempre primeiro** nas subtrações (`VA - CR`, `VA - VP`) e **sempre no numerador** das divisões (`VA / CR`, `VA / VP`). Se o resultado for **negativo** (nas variações) ou **menor que 1** (nos índices), o desempenho é **ruim**.

---

## Módulo 5: Qualidade, Riscos, Comunicações, Conflitos e Aquisições

### 5.1 Gerenciamento da Qualidade

* **Qualidade vs. Grau (*Grade*):** Qualidade é o grau em que um conjunto de características atende aos requisitos; Grau é uma categoria atribuída a entregas com o mesmo uso funcional, mas características técnicas distintas. **Baixa qualidade é sempre um problema; grau baixo pode ser aceitável** (ex.: um software simples sem recursos avançados, mas livre de defeitos).
* **Planejamento da Qualidade:** define padrões e métricas aplicáveis ao projeto e ao produto.
* **Garantia da Qualidade (Gerenciar a Qualidade):** foco nos **processos** (auditorias, prevenção, melhoria contínua, reuniões de ajuste para garantir que o processo produza dentro dos padrões).
* **Controle da Qualidade:** foco nas **entregas/produtos** (inspeções, testes, verificação de defeitos antes da validação pelo cliente).
* **Ferramentas clássicas (7 Ferramentas da Qualidade):** Diagrama de Causa e Efeito (Ishikawa / Espinha de Peixe), Fluxograma, Folha de Verificação, Diagrama de Pareto (regra 80/20), Histograma, Gráfico de Controle (limites superior/inferior e regra dos 7) e Diagrama de Dispersão.

### 5.2 Gerenciamento de Riscos

Um **risco** é um evento ou condição incerta que, se ocorrer, provoca um efeito positivo (**oportunidade**) ou negativo (**ameaça**) em pelo menos um objetivo do projeto.

| Estratégia para Ameaças (Riscos Negativos) | Significado Prático | Estratégia para Oportunidades (Riscos Positivos) |
| :--- | :--- | :--- |
| **Escalar** | Passar ao nível de programa/portfólio fora da alçada do GP | **Escalar** |
| **Prevenir (*Avoid*)** | Eliminar a ameaça alterando o plano (ex.: trocar tecnologia instável) | **Explorar (*Exploit*)** (garantir que ocorra) |
| **Transferir (*Transfer*)** | Repassar impacto a terceiros (seguro, contrato de preço fixo, garantia) | **Compartilhar (*Share*)** (parceria/consórcio) |
| **Mitigar (*Mitigate*)** | Reduzir probabilidade e/ou impacto (ex.: protótipos, testes extras) | **Melhorar (*Enhance*)** (aumentar prob./impacto) |
| **Aceitar (*Accept*)** | Reconhecer sem agir proativamente (passiva) ou criar contingência (ativa) | **Aceitar (*Accept*)** |

* **Análise Qualitativa vs. Quantitativa:** A qualitativa prioriza riscos usando matriz **Probabilidade × Impacto**; a quantitativa modela numericamente o efeito agregado (Análise de Monte Carlo, Árvore de Decisão / Valor Monetário Esperado `VME = Probabilidade × Impacto`).

### 5.3 Comunicações, Conflitos e PMIS

* **Fórmula de Canais de Comunicação:** com `n` partes interessadas, o número de canais potenciais é:

```text
Canais = n × (n - 1) / 2
```

* **Sistema de Informação de Gerenciamento de Projetos (PMIS):** repositório e ferramentas automatizadas usados para coletar, integrar e disseminar informações e entregas do projeto.
* **Fontes mais comuns de conflito em projetos:** cronogramas, prioridades do projeto e **recursos** (além de opiniões técnicas, custos e personalidades).
* **Técnicas de Resolução de Conflitos (Thomas-Kilmann / PMBOK):**
  1. **Colaborar / Solucionar Problemas (Confronto):** analisar alternativas em conjunto para solução ganha-ganha (mais duradoura).
  2. **Entrar em Acordo / Conciliar (*Compromising*):** cada parte cede um pouco (solução perde-perde parcial ou compromisso — ex.: aceitar entrega com atraso em troca de redução de custo).
  3. **Suavizar / Acomodar (*Smoothing*):** enfatizar pontos em comum e minimizar diferenças (solução temporária).
  4. **Forçar / Direcionar (*Forcing*):** impor um ponto de vista por autoridade (ganha-perde; útil em emergências).
  5. **Retirar-se / Evitar (*Withdrawing*):** adiar ou recuar do conflito.

### 5.4 Aquisições e Contratos

Quando um projeto adquire produtos ou serviços externos (lembrando que no **PMBOK 8** isso foi consolidado em *Plan Sourcing Strategy* dentro de **Governança**), a escolha do contrato redistribui o risco financeiro entre comprador e fornecedor:

| Tipo de Contrato | Risco Maior para... | Cenário de Uso Ideal |
| :--- | :--- | :--- |
| **Preço Fixo (FFP / FPIF / FPEPA)** | **Fornecedor (Vendedor)** | Escopo muito bem definido e estável. |
| **Tempo e Material (T&M)** | **Compartilhado** (tende ao comprador sem teto) | Contratação rápida de especialistas ou suporte com escopo aberto; recomenda-se teto máximo. |
| **Custos Reembolsáveis (CPFF / CPIF / CPAF)** | **Comprador** | Alta incerteza de escopo ou P&D; exige auditoria rigorosa de custos. |

---

## Módulo 6: Governança de TI e Alinhamento Estratégico (COBIT 2019, ITIL 5 e CMMI AIM)

Nos materiais do Prof. Methanias Colaço Júnior, a Gerência de Projetos de TI não existe isolada: ela responde ao **Planejamento Estratégico da TI** e conecta o negócio aos frameworks de **Governança, Gestão de Serviços e Maturidade**, incluindo suas atualizações para **Inteligência Artificial**.

### 6.1 Níveis de Decisão, BSC e Governança vs. Gerenciamento

* **Balanced Scorecard (BSC):** traduz a estratégia em objetivos e indicadores sob **4 perspectivas**: **Financeira**, **do Cliente**, **dos Processos Internos** e **de Aprendizagem e Renovação (Crescimento)**.
* **Separação Governança × Gerenciamento (COBIT):**
  * **Governança (Conselho de Administração / Alta Direção):** avalia necessidades das partes interessadas, define direcionamento e monitora o desempenho (**Domínio EDM**: *Evaluate, Direct and Monitor*).
  * **Gerenciamento (Executivos / CEO / CIO):** planeja, constrói, executa e monitora atividades alinhadas às diretrizes da governança (**Domínios APO, BAI, DSS, MEA**).

### 6.2 COBIT 2019 e Governança de IA

Mantido pela **ISACA**, o COBIT 2019 diz **"O QUE"** governar/gerenciar (não prescreve "COMO"), atua como ponte entre negócios e TI e introduziu **Fatores de Desenho** (*Design Factors*) e **Áreas de Foco** para personalização. Estrutura-se em **5 domínios**, **40 objetivos de governança e gerenciamento** (com destaque para os acréscimos da versão 2019: `APO14` Dados Gerenciados, `BAI11` Projetos separado de `BAI01` Programas, e `MEA04` Avaliação com Garantia Gerenciada), **7 componentes** (habilitadores) e **7 critérios de informação** (efetividade, eficiência, confidencialidade, integridade, disponibilidade, conformidade e confiabilidade).

* **KGI vs. KPI no COBIT:**
  * **Indicadores de Resultado (antigos KGIs - *Key Goal Indicators*):** medem se o objetivo foi atingido após o fato (**indicadores históricos / *lagging***).
  * **Indicadores de Performance (KPIs - *Key Performance Indicators*):** medem a probabilidade de atingir o objetivo antes do resultado final (**indicadores futuros / *leading***).
* **Adaptação do COBIT 2019 para IA (2025–2026):** a ISACA não lançou nova versão, mas mapeou os 40 objetivos e 7 enablers para IA (ex.: `APO01` padrões éticos, `APO11` qualidade de dados/modelos, `APO14` governança de dados para IA, `BAI03` qualidade dos dados de treinamento, `BAI06` mudanças em modelos/algoritmos, `MEA03` conformidade com LGPD, GDPR, EU AI Act, NIST AI RMF e ISO/IEC 42001), criando as certificações **CGAIS** (Governança) e **CMAIS** (Gestão de Sistemas de IA).

### 6.3 ITIL (ITIL 4 -> ITIL 5 AI-Native) e CMMI AIM

| Dimensão | ITIL 5 (Version 5 - 2026) | COBIT 2019 + IA | CMMI AIM (Junho/2026) |
| :--- | :--- | :--- | :--- |
| **Foco Principal** | **Gestão de Produtos e Serviços Digitais (DPSM)** (amplia ITSM) | Governança corporativa de TI aplicada à IA | Maturidade e capacidade de IA em escala |
| **Estrutura Central** | **PSLM** (8 atividades, substitui Service Value Chain), 34 práticas (*value enablers* em 2 grupos), 7 princípios | 5 domínios (`EDM`, `APO`, `BAI`, `DSS`, `MEA`), 40 objetivos, 7 componentes | **4 estágios de maturidade**, **8 domínios** e **31 Practice Areas** |
| **Tratamento da IA** | **AI-native**: *AI Capability Model (6C)* + módulo de Governança de IA + *Complexity Thinking* + *Industry 5.0* | Mapeamento de processos existentes + crosswalk (NIST AI RMF, ISO 42001, EU AI Act) | Extensão dedicada e independente com **Crosswalk AI Bundle** (ISO 42001, 23053, 23894, 31000) |
| **Estágios / Certificações** | ITIL AI Governance / Transformation | CGAIS e CMAIS | Estágios: *Chaos & Risk -> Structure & Cohesion -> Validation & Trust -> Value & Growth*; Appraiser/Practitioner |

> **Regra de ouro ENADE (Prof. Methanias):**
> * Questão sobre **governança corporativa, alinhamento estratégico e compliance regulatório** -> **COBIT 2019** (`EDM`, cascata de objetivos).
> * Questão sobre **avaliação formal de maturidade (*appraisal*) e melhoria contínua de processos de IA** -> **CMMI AIM** (domínios obrigatórios em *appraisals*: *Data*, *Security* e *Development* e/ou *Services*).
> * Questão sobre **produtos e serviços digitais, ciclo de vida de serviços e incidente/restauração rápida** -> **ITIL** (propósito do Gerenciamento de Incidentes: **restaurar o serviço normal o mais rápido possível**, minimizando impactos).

---

## Módulo 7: Gestão Ágil e Híbrida de Projetos

### 7.1 Manifesto Ágil (2001): 4 Valores Fundamentais

1. **Indivíduos e interações** mais que processos e ferramentas.
2. **Software em funcionamento** mais que documentação abrangente.
3. **Colaboração com o cliente** mais que negociação de contratos.
4. **Responder a mudanças** mais que seguir um plano.

*(Importante: os itens à direita têm valor, mas valorizamos mais os itens à esquerda.)*

### 7.2 Principais Frameworks Ágeis e Papéis

| Framework | Papéis / Responsabilidades | Artefatos e Cadência | Métricas Típicas |
| :--- | :--- | :--- | :--- |
| **Scrum** | **Product Owner (PO)** (maximiza valor e gerencia Backlog), **Scrum Master** (facilita o processo e remove impedimentos), **Developers** (equipe multifuncional auto-organizável). | *Product Backlog*, *Sprint Backlog*, *Incremento*; **Sprints** (1 a 4 semanas); *Sprint Planning*, *Daily Scrum* (15 min), *Sprint Review*, *Sprint Retrospective*. | **Velocidade** (pontos/sprint), *Burndown* / *Burnup*. |
| **Kanban** | Sem papéis prescritos; evolução gradual sobre o fluxo existente. | Quadro visual com colunas e **limite de WIP (*Work in Progress*)** explícito. Fluxo contínuo (puxado). | **Lead Time**, **Cycle Time**, *Throughput* (vazão). |
| **XP (Extreme Programming)** | Cliente presente, programadores, coach. | Práticas de engenharia: **TDD**, **Programação em Pares**, **Integração Contínua**, Refatoração, *Small Releases*, Propriedade Coletiva do Código. | Cobertura de testes, taxa de defeitos. |

### 7.3 Gestão Híbrida na Prática (e no PMBOK 8)

Em projetos reais de Sistemas de Informação (ex.: implantação de nuvem corporativa com desenvolvimento de módulos sob medida), adota-se o **modelo híbrido**:
* **Camada Preditiva (Governança e Contratos):** Termo de Abertura, orçamento macro (*Finanças*), marcos contratuais com fornecedores (*Plan Sourcing Strategy*) e conformidade regulatória (LGPD).
* **Camada Adaptativa (Execução e Entrega):** Backlog priorizado por valor de negócio, *Sprints* iterativas, revisões frequentes com *stakeholders* e melhoria contínua via retrospectivas.

---

## Módulo 8: Resumo Estratégico e Checklist de Revisão ENADE

### Checklist de Ouro para a Prova

1. **Iniciação vs. Planejamento:** O **TAP** é criado na Iniciação pelo **patrocinador** e nomeia o GP. O **orçamento detalhado e a linha de base de custos** só são fechados no **Planejamento**.
2. **Estruturas Organizacionais:** Funcional = autoridade do gerente funcional; Matricial Forte = maior necessidade de integração; Projetizada = lealdade ao projeto, mas sem garantia de realocação ao final.
3. **Caminho Crítico e PERT:** Caminho crítico é o caminho **mais longo** (determina a menor duração do projeto; folga total = 0). No PERT, `Te = (O + 4M + P) / 6`, e para o caminho somam-se **variâncias**, nunca desvios-padrão diretamente.
4. **EVM sem erro:** `VC = VA - CR`, `VPr = VA - VP`, `IDC = VA / CR`, `IDP = VA / VP`, `ENT = ONT / IDC` (cenário típico). Valores `< 0` (variações) ou `< 1` (índices) indicam problema.
5. **Garantia vs. Controle da Qualidade:** Garantia = auditoria e melhoria do **processo**; Controle = inspeção e teste do **produto/entrega**.
6. **PMBOK 6 vs. PMBOK 8:** PMBOK 6 = 5 grupos, 10 áreas, 49 processos. PMBOK 8 = modelo híbrido orientado a valor, **6 princípios**, **7 domínios de desempenho** (Governança, Escopo, Cronograma, Finanças, Partes Interessadas, Recursos, Riscos), **5 áreas de foco** e **40 processos com ITTOs** (Qualidade foi para Escopo; Comunicações foi para Partes Interessadas; Aquisições virou processo em Governança).
7. **Governança (COBIT / ITIL / CMMI):** COBIT diz **o quê** (governança e controles; `EDM` governa, `APO/BAI/DSS/MEA` gerenciam); ITIL trata de **serviços e produtos digitais** (ITIL 5 = DPSM, PSLM, AI 6C); CMMI AIM avalia **maturidade em IA** (4 estágios, 8 domínios, 31 *Practice Areas*).
