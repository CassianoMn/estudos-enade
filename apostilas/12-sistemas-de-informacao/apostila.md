# Sistemas de Informação

> **Foco ENADE:** Sistemas de Informação é a área com maior presença nas provas do ENADE de SI. Os temas centrais recorrentes incluem: **Teoria Geral de Sistemas** (subsistema, relação e propósito), distinção entre **dado, informação e conhecimento** (tácito vs. explícito), **classificação de SI** (SPT, SIG, SAD, SIE, Sistemas Especialistas), sistemas integrados **ERP/CRM/SCM** (parametrização vs. customização), **BPM/BPMN/BPMS**, **Governança e Gestão de TI** (**COBIT**, **ISO/IEC 38500**, **ITIL** com Service Desk/SLA/Incidentes vs. Problemas, PETI e *compliance*), **Segurança da Informação (ISO/IEC 27001/27002)**, **LGPD** e **TI Verde / Cidades Inteligentes**.

---

## Módulo 1: Teoria Geral de Sistemas (TGS) e Conceito de SI

Formulada por Ludwig von Bertalanffy, a **Teoria Geral de Sistemas (TGS)** oferece uma visão transdisciplinar na qual um **sistema** é um conjunto de elementos interdependentes e interagentes que atuam de forma coordenada para atingir um objetivo comum, convertendo **insumos (*inputs*)** do ambiente em **produtos (*outputs*)** por meio de **processamento** e **retroalimentação (*feedback*)**.

### Elementos Essenciais da TGS (Cobrança Discursiva Clássica)

| Conceito | Definição Técnica e Papel no Sistema |
| :--- | :--- |
| **Subsistema** | Parte constituinte de um sistema maior que possui identidade própria e executa uma função específica, resolvendo parte do problema global (ex.: subsistema financeiro dentro de um ERP). |
| **Relação (Interdependência)** | Ligação e interação dinâmica entre os subsistemas. É o conjunto de relações que gera **sinergia**, fazendo com que o sistema produza um comportamento que seus elementos isolados não alcançariam. |
| **Propósito (Objetivo)** | Razão de ser ou função principal para a qual o sistema foi concebido (objetivos econômicos, sociais ou operacionais), definindo sua identidade e sobrevivência no ambiente. |
| **Fronteira e Ambiente** | A **fronteira** separa o sistema do seu **ambiente** externo; sistemas organizacionais são **sistemas abertos**, pois trocam matéria, energia e informação continuamente com o ambiente. |
| **Entropia e Homeostase** | **Entropia** é a tendência natural à desordem/degradação; **homeostase** (ou equilíbrio dinâmico) é a capacidade do sistema de se autorregular por meio de *feedback* para manter sua estabilidade. |

### Dado, Informação e Conhecimento

| Nível | Definição | Exemplo em Contexto Acadêmico |
| :--- | :--- | :--- |
| **Dado** | Descrição elementar, bruta e isolada de eventos, coisas ou transações registradas, sem organização ou significado específico por si só. | `nota = 7,5`; `quantidade_alunos = 42`; `acessos = 18`. |
| **Informação** | Dados processados, organizados, contextualizados ou agregados de modo a adquirirem significado útil para o receptor. | `Média da turma = 7,8`; `Percentual de tarefas entregues = 85%`. |
| **Conhecimento** | Aplicação de informações combinadas com experiência, aprendizado acumulado, regras e contexto para interpretar situações e orientar decisões. | *"Estudantes que realizam menos de 30% das tarefas ficam consistentemente abaixo da média da turma."* |

---

## Módulo 2: Classificação dos Sistemas de Informação nas Organizações

Os sistemas de informação estruturam-se conforme os níveis organizacionais (operacional, tático e estratégico) e as funções empresariais.

| Tipo de Sistema | Sigla | Nível Atendido | Função Principal e Características |
| :--- | :--- | :--- | :--- |
| **Sistema de Processamento de Transações** | **SPT** (*TPS*) | Operacional | Registra transações rotineiras e estruturadas do dia a dia (vendas, folha de pagamento, controle de estoque). Foco em confiabilidade e velocidade. |
| **Sistema de Informação Gerencial** | **SIG** (*MIS*) | Tático / Gerencial | Consolida e sumariza dados oriundos dos SPTs em relatórios periódicos e indicadores de desempenho (previsto × realizado) para gerentes intermediários. |
| **Sistema de Apoio à Decisão** | **SAD** (*DSS*) | Tático / Analítico | Apoia decisões **semiestruturadas** combinando grandes bases analíticas (DW/OLAP) com modelos matemáticos, estatísticos e simulações *what-if*. |
| **Sistema de Informação Executiva** | **SIE** (*EIS*) | Estratégico | Fornece à alta direção visão consolidada por meio de painéis visuais (*dashboards*), tendências internas/externas e KPIs críticos sem exigir conhecimento técnico. |
| **Sistemas Especialistas** | **SE** | Tático / Operacional Especializado | Emulam o raciocínio de um especialista humano em um domínio restrito. Seus dois componentes centrais são a **Base de Conhecimento** (fatos e regras de produção) e o **Motor de Inferência** (conjunto de heurísticas e mecanismos lógicos que aplicam as regras para chegar a conclusões/diagnósticos). |

### Arquitetura de Sistemas de Informação (ASI) e Cadeia de Valor

A **Arquitetura de Sistemas de Informação (ASI)** estabelece um mapeamento integrado da organização — conectando perspectiva de negócio, processos, dados, aplicações, hardware, software e redes — para orientar o desenvolvimento e a implantação de sistemas alinhados à estratégia. Quando a TI se integra aos processos primários (logística, operações, marketing/vendas, atendimento) e aos processos de apoio da **Cadeia de Valor de Porter**, gera-se **vantagem competitiva sustentável**. Além disso, arquiteturas empresariais orientadas à **integração por processos colaborativos** superam a fragmentação de sistemas departamentais isolados (*silos*).

---

## Módulo 3: Sistemas Integrados — ERP, CRM e SCM

Para eliminar ilhas de informação entre departamentos, as empresas adotam sistemas corporativos integrados que compartilham uma base de dados única e fluxos ponta a ponta.

| Sistema | Foco Estratégico | Escopo Funcional |
| :--- | :--- | :--- |
| **ERP (*Enterprise Resource Planning*)** | Integração interna da organização | Unifica finanças, contabilidade, RH, compras, produção, estoque (**WMS** — *Warehouse Management System*) e vendas em um banco de dados único. |
| **CRM (*Customer Relationship Management*)** | Relacionamento com o cliente | Integra vendas, marketing e pós-venda/atendimento para aumentar retenção, personalização e valor do ciclo de vida do cliente (*LTV*). |
| **SCM (*Supply Chain Management*)** | Cadeia de suprimentos externa | Coordena o fluxo de materiais, informações e finanças entre fornecedores, fabricantes, distribuidores e varejistas (*just-in-time*). |

### Parametrização vs. Customização em ERPs (Tema Clássico do ENADE)

* **Parametrização:** ajuste do comportamento do ERP por meio da configuração de **variáveis internas e tabelas de parâmetros** já disponibilizadas pelo fornecedor do software, **sem alterar o código-fonte** (menor custo e menor impacto em atualizações futuras).
* **Customização:** modificação do código-fonte ou criação de extensões específicas no ERP para adaptar o sistema a uma regra de negócio peculiar da empresa que **não pode ser atendida pelos parâmetros preexistentes** (maior custo, risco e complexidade de manutenção).

---

## Módulo 4: Gestão de Processos de Negócio (BPM, BPMN e BPMS)

A **Gestão de Processos de Negócio (BPM)** é uma disciplina gerencial voltada à identificação, modelagem, análise, execução, monitoramento e melhoria contínua dos processos organizacionais ponta a ponta (visão horizontal interdepartamental, e não vertical por departamentos isolados).

* **Seleção de Processos:** um processo de negócio passível de melhoria possui início, fim, entradas, saídas e entrega valor a um cliente interno ou externo (ex.: *"Prospectar novos clientes"*, *"Revisar plano de vendas"*), não devendo ser confundido com uma tarefa atômica isolada (ex.: *"Criar conta de cliente"*) ou um canal genérico (ex.: *"Comércio eletrônico via Web"*).
* **BPMN (*Business Process Model and Notation*):** notação padrão (OMG) baseada em diagramas de fluxo com raias (*pools* e *lanes* para atores/departamentos), eventos (início, intermediário, fim), atividades, *gateways* (decisão exclusiva `X`, paralela `+`, inclusiva `O`) e artefatos.
* **BPMS (*Business Process Management System*):** plataforma tecnológica que automatiza e orquestra a execução de processos modelados. Um impacto direto da adoção de BPMS é a **redução do tempo de envio, tramitação e recebimento de dados entre os níveis organizacionais**, eliminando gargalos manuais.

---

## Módulo 5: Gestão do Conhecimento e Inteligência Organizacional

Segundo **Nonaka e Takeuchi**, o conhecimento organizacional divide-se em duas dimensões que interagem continuamente:
* **Conhecimento Tácito:** pessoal, subjetivo, enraizado em experiências individuais, intuições e habilidades práticas, difícil de formalizar e mensurar diretamente.
* **Conhecimento Explícito:** formal, sistemático, articulado e codificado em documentos, manuais, bases de dados, modelos ou código-fonte, facilmente transmissível.

### Espiral do Conhecimento (Modelo SECI)

| Conversão | Direção | Descrição e Exemplo em TI |
| :--- | :--- | :--- |
| **Socialização** | Tácito → Tácito | Compartilhamento de experiências diretas: *pair programming*, mentoria, observação prática. |
| **Externalização** | Tácito → Explícito | Articulação do saber pessoal em documentos formais: especificação de requisitos, documentação de arquitetura, lições aprendidas. |
| **Combinação** | Explícito → Explícito | Reorganização e integração de documentos e dados explícitos: consolidação de relatórios de BI, wikis corporativas, *Linked Open Data (LOD)*. |
| **Internalização** | Explícito → Tácito | Aprendizado prático a partir de documentação formal (*learning by doing*): estudar manuais e aplicá-los em novos projetos. |

**Atenção ao ENADE:** durante o desenvolvimento de software, **tanto o conhecimento tácito quanto o explícito são utilizados em todas as fases** (não se restringem a uma única etapa!). Além disso, fontes externas como redes sociais alimentam a **inteligência organizacional e competitiva**, fornecendo insumos de consumidores e colaboradores para tomada de decisão estratégica.

---

## Módulo 6: Governança de TI e Gestão de Serviços (COBIT, ISO 38500, ITIL)

É fundamental distinguir **Governança de TI** de **Gestão de TI**:
* **Governança de TI:** responsabilidade da alta direção/conselho; define **direcionamento estratégico, avaliação e monitoramento** (*Evaluate, Direct, Monitor*), garantindo alinhamento ao negócio, entrega de valor, gestão de riscos e conformidade (*compliance* com leis como **Sarbanes-Oxley — SOX** e **LGPD**).
* **Gestão de TI:** responsabilidade dos executivos/gerentes de TI; planeja, constrói, executa e monitora as operações e projetos para cumprir as diretrizes definidas pela governança.

### Principais Frameworks e Normas

| Referência | Foco Principal | Estrutura e Conceitos Cobrados no ENADE |
| :--- | :--- | :--- |
| **ISO/IEC 38500** | Norma internacional de **Governança Corporativa de TI** | Define o ciclo **EDM** (*Evaluate, Direct, Monitor* — Avaliar, Dirigir e Monitorar) e seis princípios: Responsabilidade, Estratégia, Aquisição, Desempenho, Conformidade e Comportamento Humano. |
| **COBIT** (ISACA) | Framework abrangente de **Governança e Gestão de TI Corporativa** | Conecta objetivos de negócio e de TI; no COBIT 5/2019 separa claramente o domínio de **Governança (EDM)** dos domínios de **Gestão (APO, BAI, DSS, MEA)**, atendendo a *compliance* e controle. |
| **ITIL** | Biblioteca de boas práticas para **Gerenciamento de Serviços de TI (ITSM)** | Foca na entrega de valor ao cliente por meio de catálogo de serviços, acordos e suporte estruturado. |

*(Nota: **BSC** é metodologia de gestão estratégica por indicadores e **CMMI** é modelo de maturidade de processos de desenvolvimento/engenharia — nenhum dos dois é framework específico de Governança de TI como ISO 38500 e COBIT!)*

### ITIL na Prática: Conceitos de Alta Cobrança

1. **Central de Serviços (*Service Desk*):** ponto único de contato (**SPOC**) entre os usuários/áreas de negócio e a área de TI, registrando, classificando, acompanhando e comunicando incidentes e requisições de serviço (não tem como função principal negociar SLAs, mas sim executar o atendimento e dar transparência).
2. **Acordo de Nível de Serviço (SLA — *Service Level Agreement*):** contrato formal entre o provedor de TI e o cliente interno/externo que define os serviços prestados, metas de disponibilidade, prazos de atendimento e indicadores de desempenho monitoráveis.
3. **Gerenciamento de Incidentes:** busca **restaurar a operação normal do serviço o mais rápido possível** (ação reativa com foco em contorno/restauração), minimizando impactos ao negócio. Se o 1º nível não resolve, **escala** para níveis mais avançados (2º/3º nível).
4. **Gerenciamento de Problemas:** investiga a **causa raiz** de um ou mais incidentes recorrentes, documenta soluções de contorno (*workarounds*) e registra erros conhecidos na **Base de Erros Conhecidos (*Known Error Database — KEDB*)**, elevando o desempenho futuro do suporte.

#### Exemplo Numérico: Cálculo de Disponibilidade em SLA

Um contrato de SLA prevê disponibilidade mensal mínima de **99,5%** para um portal corporativo em regime 24×7 durante um mês de **30 dias** (`30 × 24 × 60 = 43.200 minutos`).
* Indisponibilidade máxima permitida sem violar o SLA: `43.200 × (1 - 0,995) = 43.200 × 0,005 = 216 minutos` (**3 horas e 36 minutos** no mês).
* Se uma parada não programada durar **240 minutos**, a disponibilidade efetiva cai para `(43.200 - 240) / 43.200 = 99,44%`, violando o SLA contratado.

---

## Módulo 7: Segurança da Informação (ISO 27001/27002), LGPD, TI Verde e Cidades Inteligentes

### Gestão de Segurança da Informação e Continuidade de Negócios

As normas **ABNT NBR ISO/IEC 27001** (requisitos do Sistema de Gestão de Segurança da Informação — SGSI) e **ISO/IEC 27002** (código de prática para controles de segurança) protegem os ativos de informação sob os pilares de **Confidencialidade, Integridade e Disponibilidade** (além de autenticidade e legalidade). Pontos essenciais cobrados no ENADE:
* A segurança da informação **não é responsabilidade restrita da área de TI**: envolve processos, tecnologia e **todas as pessoas** da organização (ética individual não dispensa controles técnicos e políticas formais!).
* **Auditoria de Contingência e Recuperação de Desastres:** avalia especificamente os **sistemas de backup, políticas de retenção, testes de restauração e planos de continuidade (RTO/RPO)**.

### LGPD (Lei Geral de Proteção de Dados — Lei nº 13.709/2018)

| Conceito / Papel na LGPD | Definição e Responsabilidades |
| :--- | :--- |
| **Titular** | Pessoa natural a quem se referem os dados pessoais objeto de tratamento. |
| **Controlador** | Pessoa natural ou jurídica a quem competem as **decisões** referentes ao tratamento de dados pessoais. |
| **Operador** | Pessoa natural ou jurídica que realiza o tratamento de dados pessoais **em nome do controlador**. |
| **Encarregado (DPO)** | Pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares e a **ANPD** (Autoridade Nacional de Proteção de Dados). |
| **Dados Pessoais Sensíveis** | Dados sobre origem racial/étnica, convicção religiosa, opinião política, saúde, vida sexual, dado genético ou biométrico (exigem proteção reforçada). |
| **Princípios e Bases Legais** | Finalidade, adequação, necessidade (minimização), transparência, segurança e prevenção; tratamento exige base legal (consentimento, obrigação legal, execução de contrato, legítimo interesse etc.). |

### TI Verde, Inclusão Digital e Cidades Inteligentes

* **TI Verde (*Green IT*):** uso sustentável dos recursos computacionais, abrangendo: (i) conscientização de usuários (redução de impressões e e-mails desnecessários), (ii) eficiência energética em **data centers verdes** (virtualização e consolidação de servidores, refrigeração inteligente) e (iii) **gestão e descarte adequado de lixo eletrônico (e-lixo)** sob responsabilidade da governança corporativa.
* **Cidades Inteligentes e IoT:** utilizam TICs e sensores urbanos para otimizar mobilidade, energia, saúde e segurança com foco em desenvolvimento sustentável e governança colaborativa. Seus principais desafios incluem **privacidade/segurança dos cidadãos**, **gerenciamento de Big Data**, **heterogeneidade de dispositivos** e **baixo reuso/integração entre sistemas em silos**. **Atenção:** a IoT apoia-se em **padrões abertos e interoperáveis** (TCP/IP, HTTP, MQTT, CoAP), e **não** apenas em tecnologias proprietárias!

---

## Resumo Estratégico para o ENADE

1. **TGS:** `Subsistema` = parte com função própria; `Relação` = interação dinâmica que cria sinergia; `Propósito` = objetivo principal que define a identidade do sistema.
2. **Conhecimento:** Tácito (pessoal, experiencial) × Explícito (formal, documentado); ambos ocorrem ao longo de **todo** o ciclo de vida de software.
3. **ERP:** **Parametrização** ajusta variáveis internas nativas; **Customização** altera código/funcionalidade para cenários não cobertos pelos parâmetros.
4. **BPM / BPMS:** Processo selecionado deve ser ponta a ponta com entrega de valor; **BPMS** reduz o tempo de trâmite de informações entre níveis organizacionais.
5. **Governança × Gestão:** **ISO/IEC 38500** e **COBIT** são referências de Governança de TI (Avaliar, Dirigir, Monitorar); **ITIL** foca em Gestão de Serviços (**Central de Serviços** = canal único; **SLA** = acordo de níveis de serviço monitorados; **Incidente** = restaurar rápido; **Problema** = causa raiz + **Base de Erros Conhecidos**).
6. **TI Verde & Cidades Inteligentes:** Descarte de lixo eletrônico **faz parte** da governança de TI Verde; Cidades Inteligentes enfrentam desafios de privacidade, heterogeneidade e silos, e a IoT utiliza **padrões abertos**, não proprietários.
