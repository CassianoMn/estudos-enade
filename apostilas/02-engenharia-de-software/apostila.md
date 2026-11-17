# Engenharia de Software

A **Engenharia de Software** é uma disciplina de engenharia voltada a todos os aspectos da produção sistemática de software — desde a concepção inicial, modelagem de negócios e elicitação de requisitos até o projeto arquitetural, codificação, verificação, validação, implantação, manutenção e garantia da qualidade. Para além da programação isolada, seu foco está em aplicar métodos, processos e ferramentas que tornem o desenvolvimento previsível, sustentável, rastreável e alinhado ao valor esperado pelo cliente.

> **Foco ENADE:** Nas provas do ENADE de Sistemas de Informação e Ciência da Computação, Engenharia de Software é uma das áreas com maior peso no Componente Específico. As questões costumam apresentar estudos de caso organizacionais ou diagramas (UML e BPMN) para avaliar a escolha de modelos de processo, a distinção entre Requisitos Funcionais, Não Funcionais e Regras de Negócio, o domínio de relacionamentos UML (generalização, composição, `<<include>>`, `<<extend>>`), a aplicação de testes e análise estática, métricas GQM e os níveis de maturidade do CMMI e do MPS.BR.

---

## Módulo 1: Fundamentos e Processos de Software

Um **processo de software** é um conjunto estruturado de atividades, ações e tarefas que levam à produção de um produto de software de alta qualidade. Ele funciona como a base organizacional para a aplicação disciplinada de métodos e ferramentas de desenvolvimento.

### Por que adotar um processo definido?

- **Padronização dos artefatos produzidos**, facilitando a comunicação entre equipes e a manutenção futura.
- **Mitigação da dependência individual** (evitar a criação dos chamados *"donos do software"*, em que o conhecimento fica retido em uma única pessoa).
- **Adoção de melhores práticas** consolidadas pela Engenharia de Software.
- **Maior velocidade sustentável e controle** sobre custos, prazos e escopo.
- **Melhoria contínua da qualidade** do produto entregue.

Para que uma metodologia de desenvolvimento tenha sucesso na prática, não basta escolher um modelo teórico; é indispensável investir em **treinamento adequado da equipe**, **adaptação da metodologia ao contexto do projeto**, **apoio especializado** e **tempo de absorção** para equilibrar qualidade e produtividade.

### Modelos Tradicionais (Prescritivos e Evolucionários)

Um **modelo de processo de software** é uma representação abstrata (um *framework* genérico) de como o trabalho é organizado ao longo do ciclo de vida:

1. **Modelo em Cascata (Ciclo Clássico — Winston Royce, 1970):**
   - Organiza o desenvolvimento em fases estritamente sequenciais e sem sobreposição: Comunicação/Requisitos -> Planejamento -> Modelagem/Projeto -> Construção/Codificação -> Testes -> Implantação/Manutenção.
   - **Vantagens:** documentação rigorosa, marcos bem definidos e facilidade de acompanhamento em projetos com requisitos altamente estáveis e bem compreendidos desde o início.
   - **Limitações:** baixa tolerância a mudanças tardias; erros de requisitos ou arquitetura frequentemente só são percebidos na fase final de testes, elevando drasticamente o custo e o risco na entrega (ponto recorrente no ENADE, como na questão 17 de 2017).

2. **Modelo de Prototipagem:**
   - Consiste na construção rápida de uma versão preliminar (protótipo) para validar requisitos junto ao cliente quando há incerteza sobre funcionalidades, interface ou viabilidade técnica.
   - Pode ser **descartável** (usado apenas para esclarecer requisitos e depois descartado) ou **evolucionário** (refinado até virar o sistema final).

3. **Modelo Evolucionário Incremental:**
   - Combina elementos sequenciais aplicados repetidamente para entregar o sistema em **incrementos funcionais**.
   - O primeiro incremento costuma constituir um **produto nuclear** (*core product*), ao qual novas funcionalidades são agregadas a cada ciclo até a conclusão do sistema. Reduz riscos de entrega e gera valor antecipado ao negócio.

4. **Modelo Espiral (Barry Boehm):**
   - Modelo evolucionário orientado a **análise de riscos**. Cada volta da espiral representa uma fase do processo composta por quatro quadrantes: (1) definição de objetivos, alternativas e restrições; (2) avaliação de alternativas, identificação e resolução de riscos (frequentemente usando protótipos); (3) desenvolvimento e verificação do produto da iteração; (4) planejamento do próximo ciclo.

5. **RUP (*Rational Unified Process*):**
   - Processo iterativo e incremental, **dirigido por casos de uso**, **centrado na arquitetura** e voltado à redução de riscos.
   - Organiza o ciclo de vida em quatro fases (**Concepção, Elaboração, Construção e Transição**) executadas ao longo de iterações que atravessam disciplinas como Modelagem de Negócios, Requisitos, Análise e Projeto, Implementação, Testes e Implantação.

### Manifesto Ágil e Métodos Ágeis

O **Manifesto Ágil (2001)** propôs uma mudança de mentalidade frente ao excesso de burocracia dos processos pesados, estabelecendo **quatro valores fundamentais**:

1. **Indivíduos e interações** mais que processos e ferramentas.
2. **Software em funcionamento** mais que documentação abrangente.
3. **Colaboração com o cliente** mais que negociação de contratos.
4. **Responder a mudanças** mais que seguir um plano.

*(Importante: os itens à direita ainda têm valor, mas os itens à esquerda são priorizados.)*

Entre os principais frameworks e métodos ágeis destacam-se:

- **Scrum:** Framework iterativo e incremental baseado em ciclos curtos de duração fixa (**Sprints**, geralmente de 1 a 4 semanas).
  - **Papéis (Responsabilidades):** *Product Owner* (maximiza o valor do produto e gerencia o *Product Backlog*), *Scrum Master* (assegura a adoção do Scrum e remove impedimentos) e *Developers* (equipe multifuncional auto-organizável que entrega o incremento).
  - **Artefatos e Compromissos:** *Product Backlog* (compromisso: Meta do Produto), *Sprint Backlog* (compromisso: Meta da Sprint) e *Incremento* (compromisso: Definição de Pronto — *Definition of Done*).
  - **Eventos:** *Sprint Planning*, *Daily Scrum* (reunião diária de até 15 minutos para inspeção e adaptação), *Sprint Review* (inspeção do incremento com stakeholders) e *Sprint Retrospective* (melhoria contínua do processo da equipe).
- **Extreme Programming (XP):** Foca na excelência técnica de engenharia por meio de práticas como Programação em Pares (*Pair Programming*), Desenvolvimento Orientado a Testes (**TDD** — *Test-Driven Development*), Integração Contínua, Refatoração constante, Propriedade Coletiva do Código, Design Simples, Pequenas Entregas e Ritmo Sustentável.
- **Kanban:** Método de gestão visual do fluxo contínuo de trabalho (sem iterações obrigatórias de tamanho fixo), fundamentado em visualizar o fluxo em um quadro, **limitar o trabalho em progresso (WIP — *Work In Progress*)**, gerenciar o fluxo e otimizar o *lead time* e o *throughput*.

### Tabela Comparativa de Processos de Software

| Modelo / Abordagem | Estrutura do Ciclo | Tolerância a Mudanças | Entregas de Valor | Melhor Cenário de Uso |
| :--- | :--- | :--- | :--- | :--- |
| **Cascata** | Sequencial e rígido | Muito baixa | Apenas no final | Requisitos estáveis, sistemas regulados/críticos |
| **Prototipagem** | Exploratório rápido | Alta (na concepção) | Protótipo inicial | Requisitos nebulosos ou UI inovadora |
| **Incremental** | Ciclos com entregas parciais | Moderada a alta | A cada incremento | Necessidade de colocar módulos em produção cedo |
| **Espiral** | Iterativo orientado a riscos | Alta | Ao fim de cada volta | Projetos de grande porte e alto risco técnico |
| **Scrum** | Iterativo em *Sprints* fixas | Muito alta | A cada Sprint | Produtos digitais com requisitos dinâmicos |
| **XP** | Ciclos curtos com foco técnico | Muito alta | Contínua | Equipes pequenas/médias com alta volatilidade |
| **Kanban** | Fluxo contínuo (puxado) | Contínua | Contínua | Manutenção, sustentação e entrega contínua |

---

## Módulo 2: Modelagem de Negócios e Notação BPMN

Antes de especificar telas ou classes de software, é frequentemente necessário compreender como a organização opera. A **Modelagem de Negócios** busca:

- Identificar problemas atuais e gargalos operacionais;
- Identificar oportunidades de melhoria e automação;
- Entender a estrutura e a dinâmica da organização;
- Assegurar um entendimento comum entre áreas de negócio e tecnologia;
- Derivar requisitos de sistema de forma mais natural a partir de uma abstração de alto nível.

Entre as ferramentas para modelar processos de negócio estão os sistemas de *Workflow*, as extensões de negócio do RUP, o Diagrama de Atividades da UML e o padrão internacional **BPMN (*Business Process Modeling and Notation*)**.

### Elementos Principais da Notação BPMN

A BPMN (mantida pela OMG) utiliza símbolos padronizados divididos em categorias:

1. **Objetos de Fluxo:**
   - **Eventos** (círculos): representam algo que *acontece* durante o processo.
     - *Início* (borda fina simples): onde o processo começa (ex.: mensagem recebida, temporizador).
     - *Intermediário* (borda dupla): ocorre entre o início e o fim (ex.: evento de tempo/temporizador, recebimento de mensagem, erro).
     - *Fim* (borda espessa): onde o fluxo termina.
   - **Atividades / Tarefas** (retângulos de cantos arredondados): representam o trabalho executado. Podem ser **Tarefas** atômicas (ex.: *Tarefa de Usuário*, *Tarefa de Serviço*, *Tarefa Manual*, *Tarefa de Script*) ou **Subprocessos** (indicados pelo símbolo `+` na base, encapsulando um fluxo interno).
   - **Gateways** (losangos): controlam a divergência e a convergência dos fluxos de sequência:
     - **Gateway Exclusivo (`X` — XOR):** apenas **um** caminho alternativo é seguido com base em uma condição (decisão excludente).
     - **Gateway Paralelo (`+` — AND):** todos os caminhos de saída são executados **simultaneamente** (bifurcação/*fork*) e, na convergência (*join*), aguarda-se a conclusão de todos os fluxos entrantes.
     - **Gateway Inclusivo (`O` — OR):** **um ou mais** caminhos podem ser ativados simultaneamente conforme as condições verdadeiras; na junção, sincroniza os fluxos que foram ativados.
     - **Gateway Baseado em Eventos:** a escolha do caminho depende de qual evento ocorrer primeiro (ex.: recebimento de pagamento *ou* expiração de prazo).

2. **Objetos de Conexão:**
   - **Fluxo de Sequência** (linha contínua com seta cheia): mostra a ordem de execução das atividades dentro de um mesmo *Pool*.
   - **Fluxo de Mensagem** (linha tracejada com círculo na origem e seta aberta no destino): mostra troca de comunicação entre participantes/processos distintos (*Pools* diferentes). **Atenção:** fluxos de sequência não cruzam fronteiras de *Pool*; fluxos de mensagem não conectam atividades dentro da mesma raia/pool de forma intra-processo.
   - **Associação** (linha pontilhada): liga artefatos de dados ou anotações de texto aos elementos do fluxo.

3. **Raias (*Swimlanes*):**
   - **Pool (Piscina):** representa um participante externo ou um processo organizacional completo (ex.: *Cliente*, *Companhia Aérea*).
   - **Lane (Raia):** subdivisão interna de um *Pool* que indica quem executa cada atividade (ex.: *Comercial*, *Financeiro*).

4. **Artefatos:** Objetos de Dados (*Data Objects*), Armazenamentos de Dados (*Data Stores*), Grupos e Anotações de Texto.

### Exemplo Comentado Estilo ENADE (Análise de Processo BPMN)

Considere um processo de venda de passagens aéreas modelado com um *Pool* **Cliente** e um *Pool* **Companhia Aérea** (dividido nas raias *Comercial* e *Financeiro*). Quando o gateway exclusivo *"Voo disponível?"* avalia a resposta *"Não"* e leva diretamente ao evento de fim *"Pedido fracassado"*, a modelagem reflete fielmente a lógica atual, mas revela uma **oportunidade de melhoria de negócio**: adicionar na raia *Comercial* uma tarefa de oferecimento de outro voo alternativo antes de encerrar o pedido aumenta a taxa de conversão e o retorno financeiro (exatamente a lógica cobrada no ENADE 2014, Questão 32).

---

## Módulo 3: Engenharia de Requisitos

A **Engenharia de Requisitos** é o processo sistemático de descobrir, analisar, documentar e verificar os serviços que um sistema deve fornecer e as restrições sob as quais ele deve operar. Erros cometidos na fase de requisitos são os mais caros para corrigir em etapas posteriores do ciclo de vida.

No contexto ágil e de inovação de produtos, também se destaca o conceito de **MVP (*Minimum Viable Product* — Produto Mínimo Viável)**: a versão enxuta do produto que reúne apenas os requisitos essenciais para validar hipóteses de negócio junto a usuários reais com o menor esforço possível.

### O Processo da Engenharia de Requisitos

O processo é iterativo e compreende quatro grandes macroatividades:

1. **Estudo de Viabilidade:** avalia se o sistema contribui para os objetivos do negócio e se é viável técnica, econômica e operacionalmente dentro de prazo e orçamento. *Saída:* **Relatório de Viabilidade**.
2. **Elicitação e Análise de Requisitos:** compreende a descoberta dos requisitos junto aos *stakeholders* e a investigação do domínio. *Saída:* **Modelos do Sistema**.
   - **Subatividades:** Obter requisitos -> Classificar e organizar -> Priorizar e negociar conflitos -> Documentar.
   - **Técnicas de Elicitação:** Entrevistas e Questionários, Cenários, Casos de Uso, **Etnografia** (observação imersiva do usuário no ambiente real de trabalho, revelando regras implícitas), Prototipagem, *Brainstorming* e *Workshops* de Requisitos (JAD).
3. **Especificação de Requisitos:** tradução do conhecimento levantado para um documento ou repositório estruturado. *Saída:* **Requisitos do Usuário e de Sistema**.
4. **Validação de Requisitos:** verificação se os requisitos definidos representam de fato o que o cliente deseja (consistência, completude, realismo, verificabilidade). *Saída:* **Documento de Requisitos** (SRS — *Software Requirements Specification*).

### Classificação dos Requisitos

No ENADE, é muito comum a cobrança da distinção exata entre essas categorias (como na Questão 09 de 2017):

| Categoria | Definição | Exemplo (Sistema de Biblioteca / Vendas) |
| :--- | :--- | :--- |
| **Requisito Funcional (RF)** | Declarações dos **serviços e ações** que o sistema deve executar, como deve reagir a entradas específicas e como deve se comportar em dadas situações. | *"RF01: O sistema deve permitir buscar livros pelo nome do autor."* / *"RF02: O sistema deve processar o empréstimo e a devolução de livros."* |
| **Requisito Não Funcional (RNF)** | **Restrições e atributos de qualidade** sobre os serviços ou sobre o processo de desenvolvimento. Aplicam-se geralmente ao sistema como um todo. | *"RNF01: O tempo de resposta da busca não deve ultrapassar 3 segundos (desempenho/eficiência)."* / *"RNF02: O sistema deve operar em ambiente web responsivo e cumprir a LGPD (portabilidade/segurança)."* |
| **Regra de Negócio (RN)** | Políticas, normas, cálculos ou restrições **da organização/domínio** que definem ou limitam aspectos do negócio (independem inicialmente da tecnologia). | *"RN01: Conceder desconto de 10% aos clientes que comprarem 2 ou mais itens."* / *"RN02: Entregar o pedido somente após a confirmação do pagamento."* |
| **Requisito de Domínio** | Requisitos originados diretamente na área de aplicação (legislação, padrões contábeis, protocolos médicos), podendo gerar novos RF ou restringir RNF. | *"Normas do Banco Central para compensação de boletos ou padrões DICOM para imagens médicas."* |

> **Pegadinha comum de prova:** "Exibir relatório com o balanço de vendas" é um **Requisito Funcional** (funcionalidade de saída), e *não* um RNF! Já "especificar que o tempo de resposta máximo seja de 2 segundos" ou "definir o tempo máximo de treinamento do usuário (usabilidade)" são **Requisitos Não Funcionais**. Da mesma forma, "aplicar desconto de 10% acima de 2 unidades" é uma **Regra de Negócio**.

### Níveis de Detalhamento e Formas de Descrição

- **Requisitos de Usuário:** declarações em linguagem natural (e diagramas simples) voltadas a clientes e gestores. Em métodos ágeis, assumem frequentemente o formato de **Histórias de Usuário (*User Stories*)**: *"Como \<perfil\>, eu quero \<funcionalidade\>, para que \<benefício\>."* + **Critérios de Aceitação**.
- **Requisitos de Sistema:** especificações técnicas detalhadas usadas pelos desenvolvedores e testadores como contrato de implementação. Podem ser descritos por:
  1. **Linguagem Natural Estruturada:** uso de formulários e *templates* padronizados.
  2. **Linguagem de Descrição de Projeto (PDL):** semelhante a uma linguagem de programação, usada pontualmente para interfaces.
  3. **Notação Gráfica:** Diagramas UML (Casos de Uso, Atividades, Estados) que complementam o texto.
  4. **Especificações Matemáticas:** baseadas em lógica formal, conjuntos e máquinas de estados finitos (alta precisão para sistemas críticos).

### Gerenciamento de Mudanças em Requisitos

Mudanças de escopo são inevitáveis. Mesmo quando uma alteração melhora a usabilidade (como trocar uma planilha por um gráfico sugerido pela equipe), o gerente de projetos deve **analisar o impacto** (custo, prazo, arquitetura) e **submeter a mudança à aprovação do cliente/Comitê de Controle de Mudanças (CCB)** antes de implementá-la, garantindo rastreabilidade (ENADE 2014, Questão 25).

---

## Módulo 4: Análise, Projeto e Modelagem com UML

A **UML (*Unified Modeling Language*)**, padronizada pela OMG em 1997, **não é uma metodologia nem uma linguagem de programação**, mas sim uma linguagem de modelagem visual padronizada e **independente de processo** que permite especificar, visualizar, construir e documentar artefatos de sistemas orientados a objetos.

### Análise vs. Projeto (*Design*)

| Dimensão | Análise de Software | Projeto (*Design*) de Software |
| :--- | :--- | :--- |
| **Foco principal** | **No problema** ("o que" o sistema faz) | **Na solução** ("como" o sistema será construído) |
| **Visão do comportamento** | Comportamento **caixa-preta** | Detalha operações, visibilidade e atributos dos objetos |
| **Abrangência de requisitos** | Principalmente Requisitos Funcionais | Requisitos Funcionais **e** Não Funcionais |
| **Abstração** | Estrutura conceitual, modelo mais simples | Arquitetura de subsistemas, banco de dados e classes próximas ao código |

No fluxo clássico de Análise e Projeto (como no RUP), colaboram papéis como o **Arquiteto** (projeta a arquitetura e subsistemas), o **Projetista** (analisa casos de uso e projeta classes), o **Projetista de Banco de Dados** e o **Revisor do Projeto**.

Os diagramas da UML dividem-se em **Estruturais** (visão estática: Classes, Objetos, Componentes, Implantação, Pacotes, Estrutura Composta) e **Comportamentais** (visão dinâmica: Casos de Uso, Atividades, Máquina de Estados e os diagramas de Interação — Sequência, Comunicação, Tempo e Visão Geral de Interação).

### 1. Diagrama de Casos de Uso

Captura os requisitos funcionais sob a perspectiva externa dos usuários (**atores**).

- **Ator:** papel desempenhado por um usuário humano, dispositivo ou sistema externo que interage com o sistema (representado por boneco palito ou classe com estereótipo `<<actor>>`).
- **Caso de Uso:** conjunto de cenários que descrevem uma interação que entrega um resultado de valor a um ator (elipse).
- **Relacionamentos fundamentais:**
  - **Associação:** linha contínua ligando ator ao caso de uso.
  - **`<<include>>` (Inclusão):** dependência obrigatória — o caso de uso base *sempre* executa o caso de uso incluído (seta tracejada aponta **do caso base para o incluído**). Útil para evitar duplicação de comportamento comum (ex.: *Processar Venda* `<<include>>` *Emitir Nota Fiscal*).
  - **`<<extend>>` (Extensão):** dependência opcional ou condicional — o caso de uso extensor amplia o comportamento do caso base apenas em pontos de extensão específicos (seta tracejada aponta **do caso extensor para o caso base**!). Ex.: *Solicitar Entrega* `<<extend>>` *Processar Venda*.
  - **Generalização (Herança):** linha contínua com triângulo vazio apontando para o elemento mais geral. Pode ocorrer entre atores (ex.: *Gerente* herda de *Atendente*, podendo realizar tudo que o atendente faz e mais) ou entre casos de uso (ex.: *Pagar com Cartão* e *Pagar com Boleto* especializam *Realizar Pagamento a Prazo* — padrão exato da Discursiva 05 do ENADE 2021!).

### 2. Diagrama de Classes

É o diagrama estrutural mais importante da UML e o mais frequente em questões discursivas e objetivas do ENADE. Representa classes (nome, atributos e operações/métodos), interfaces e seus relacionamentos estáticos.

- **Visibilidade:** `+` pública (`public`), `-` privada (`private`), `#` protegida (`protected`), `~` pacote (`package`).
- **Multiplicidade (Cardinalidade):** indica quantas instâncias de uma classe se relacionam com uma instância da outra: `1` (exatamente um), `0..1` (zero ou um), `0..*` ou `*` (zero ou muitos), `1..*` (um ou muitos).
- **Relacionamentos entre Classes:**
  - **Associação:** conexão estrutural permanente entre objetos (linha contínua).
  - **Agregação (losango vazio junto ao todo):** relação "todo-parte" fraca; as partes podem existir independentemente do todo (ex.: *Departamento* ◇— *Professor*).
  - **Composição (losango preenchido junto ao todo):** relação "todo-parte" forte com dependência de ciclo de vida; se o todo for destruído, as partes também são (ex.: *Pedido* ◆— *ItemPedido*).
  - **Generalização / Especialização (triângulo vazio apontando para a superclasse):** relação "é-um" (herança). Ex.: *PessoaFísica* e *PessoaJurídica* herdam de *Cliente*. **Atenção:** herança simples (uma subclasse aponta para uma superclasse) ≠ herança múltipla (uma subclasse herda de duas ou mais superclasses distintas). Além disso, as subclasses folha concretas não são obrigatoriamente abstratas (ENADE 2021, Q09).
  - **Realização (linha tracejada com triângulo vazio):** classe implementa uma `<<interface>>`.
  - **Dependência (linha tracejada com seta aberta):** uso temporário (ex.: uma classe recebe outra como parâmetro de método).

### 3. Diagrama de Sequência

Modela a interação dinâmica entre objetos ao longo do **tempo** (eixo vertical de cima para baixo), destacando a ordem cronológica das mensagens trocadas.

- **Linha de vida (*Lifeline*):** retângulo com nome `objeto:Classe` e linha tracejada vertical.
- **Barra de ativação (foco de controle):** retângulo fino sobre a linha de vida indicando que o objeto está ativo executando uma operação.
- **Tipos de mensagens:**
  - **Síncrona** (seta contínua com ponta preenchida): o remetente bloqueia e aguarda a conclusão/retorno antes de prosseguir.
  - **Assíncrona** (seta contínua com ponta aberta): o remetente envia a mensagem e continua sua execução imediatamente **sem esperar** resposta imediata (permite paralelismo entre chamadas).
  - **Retorno** (seta tracejada com ponta aberta): devolve resultado ao chamador.
  - **Auto-mensagem:** chamada de um método do próprio objeto.
- **Fragmentos combinados:** caixas rotuladas que controlam o fluxo: `alt` (alternativa if/else), `opt` (opcional), `loop` (repetição), `par` (execução paralela).

### 4. Diagrama de Atividades e Diagrama de Máquina de Estados

- **Diagrama de Atividades:** modela fluxos de controle e de dados (semelhante a um fluxograma evoluído, útil em regras de negócio e algoritmos). Possui **nó inicial** (círculo cheio), **nó final** (círculo com borda), **ações** (retângulos arredondados), **nós de decisão/união** (losangos com condições de guarda `[condição]`), **barras de *fork* e *join*** (linhas espessas que dividem e sincronizam fluxos paralelos) e **partições/*swimlanes*** que atribuem responsabilidades (ex.: *Empresa*, *Aplicativo*, *Transportador* — ENADE 2017 Q21).
- **Diagrama de Máquina de Estados:** descreve os estados possíveis de um único objeto ou componente ao longo de seu ciclo de vida e os eventos que disparam transições entre estados (`estadoInicial -> [evento / guarda] / ação -> novoEstado`).

---

## Módulo 5: Arquitetura de Software, Princípios SOLID e Padrões de Projeto

### Estilos Arquiteturais

A arquitetura define a estrutura macroscópica do sistema em componentes e suas interações, impactando diretamente **requisitos não funcionais** (escalabilidade, manutenibilidade, desempenho, segurança):

- **Arquitetura em Camadas (*Layered*):** organiza o sistema em níveis hierárquicos (ex.: Apresentação -> Negócio/Serviços -> Persistência/Dados), onde cada camada consome serviços apenas da camada imediatamente inferior. Facilita separação de responsabilidades e manutenção.
- **MVC (*Model-View-Controller*):** separa dados e regras de negócio (*Model*), interface de exibição (*View*) e controle de entrada/fluxo (*Controller*). Muito comum em aplicações web e desktop.
- **Cliente-Servidor e Arquitetura Orientada a Serviços (SOA):** separa provedores de serviços (servidores) de consumidores (clientes).
- **Pipes and Filters (Dutos e Filtros):** componentes independentes (*filters*) transformam fluxos de dados conectados por canais (*pipes*), ideal para compiladores e processamento de *streams*.
- **Microsserviços:** decompõe a aplicação em serviços pequenos, autônomos, implantáveis de forma independente e comunicando-se por APIs leves (HTTP/REST, gRPC, mensageria), geralmente com bancos de dados desacoplados por serviço.

### Princípios SOLID (Design Orientado a Objetos)

Acrônimo cunhado por Michael Feathers a partir dos cinco princípios de design OO formulados por Robert C. Martin (*Uncle Bob*) para evitar código rígido, frágil e fortemente acoplado:

| Letra | Princípio | Definição Essencial | Benefício Direto |
| :---: | :--- | :--- | :--- |
| **S** | **SRP** — *Single Responsibility Principle* (Responsabilidade Única) | Uma classe deve ter apenas **um motivo para mudar** (uma única responsabilidade coesa). | Alta coesão; evita classes "Deus" que misturam regra de negócio, SQL e UI. |
| **O** | **OCP** — *Open-Closed Principle* (Aberto-Fechado) | Entidades de software devem estar **abertas para extensão, mas fechadas para modificação**. | Permite adicionar novos comportamentos (ex.: novo meio de pagamento) via polimorfismo/interfaces sem alterar código já testado. |
| **L** | **LSP** — *Liskov Substitution Principle* (Substituição de Liskov) | Objetos de uma subclasse devem poder substituir objetos da superclasse **sem quebrar os contratos** ou a corretude do programa. | Garante uso seguro de herança e polimorfismo (ex.: `Quadrado` não deve quebrar invariantes de `Retangulo`). |
| **I** | **ISP** — *Interface Segregation Principle* (Segregação de Interface) | Clientes não devem ser forçados a depender de interfaces (métodos) que **não utilizam**. | Prefira várias interfaces específicas e coesas em vez de uma interface genérica inchada. |
| **D** | **DIP** — *Dependency Inversion Principle* (Inversão de Dependência) | Módulos de alto nível não devem depender de módulos de baixo nível; **ambos devem depender de abstrações** (interfaces). | Baixo acoplamento e alta testabilidade (facilita injeção de dependências e uso de *mocks*). |

### Padrões de Projeto (*Design Patterns* — GoF)

Os padrões do *Gang of Four* (Gamma, Helm, Johnson, Vlissides) oferecem soluções reutilizáveis para problemas recorrentes de design OO, divididos em três categorias:

1. **Padrões Criacionais** (abstraem a instanciação de objetos):
   - **Singleton:** garante que uma classe tenha apenas uma única instância global e fornece um ponto de acesso a ela (ex.: gerenciador de configuração).
   - **Factory Method:** define uma interface para criar um objeto, deixando que as subclasses decidam qual classe instanciar.
   - **Abstract Factory:** cria famílias de objetos relacionados sem especificar suas classes concretas.
   - **Builder:** separa a construção de um objeto complexo de sua representação, permitindo criar diferentes configurações passo a passo.

2. **Padrões Estruturais** (compõem classes e objetos em estruturas maiores):
   - **Adapter:** converte a interface de uma classe em outra esperada pelo cliente (compatibilização de APIs legadas).
   - **Facade:** fornece uma interface unificada e simplificada para um conjunto complexo de interfaces de um subsistema.
   - **Decorator:** anexa responsabilidades adicionais a um objeto dinamicamente, como alternativa flexível à herança.
   - **Composite:** compõe objetos em estruturas de árvore para representar hierarquias parte-todo, tratando objetos individuais e composições uniformemente.
   - **Proxy:** fornece um substituto ou representante de outro objeto para controlar o acesso a ele (cache, segurança, *lazy loading*).

3. **Padrões Comportamentais** (gerenciam algoritmos e comunicação entre objetos):
   - **Strategy:** define uma família de algoritmos, encapsula cada um e os torna intercambiáveis em tempo de execução (ex.: cálculo de frete ou desconto, aplicando diretamente o OCP).
   - **Observer:** define uma dependência um-para-muitos para que, quando um objeto (*Subject*) muda de estado, todos os seus dependentes (*Observers*) sejam notificados automaticamente.
   - **Template Method:** define o esqueleto de um algoritmo na superclasse, delegando alguns passos específicos às subclasses.
   - **Command:** encapsula uma solicitação como um objeto, permitindo parametrizar clientes, enfileirar requisições e suportar operações de desfazer (*undo*).
   - **State:** permite que um objeto altere seu comportamento quando seu estado interno muda.

---

## Módulo 6: Verificação, Validação, Testes e Manutenção de Software

As atividades de **Verificação e Validação (V&V)** têm como objetivos centrais descobrir defeitos no sistema, avaliar se ele é útil e verificar se pode operar adequadamente nas situações esperadas. Embora frequentemente confundidos, os conceitos são distintos:

- **Verificação ("Estamos construindo o produto corretamente?"):** analisa se o software atende à sua especificação técnica e aos requisitos formalmente documentados em cada fase.
- **Validação ("Estamos construindo o produto certo?"):** verifica se o software implementado atende de fato às **necessidades e expectativas reais do cliente/usuário**.

### Análise Estática vs. Análise Dinâmica (Testes)

A V&V deve ocorrer **desde o início do projeto** (e não apenas ao final, quando o acúmulo de defeitos eleva o risco de entrega — lição do ENADE 2017, Q17) por meio de duas abordagens complementares:

1. **Análise Estática (sem execução do código):**
   - Busca problemas em documentos, modelos e código-fonte **antes** dos testes dinâmicos, reduzindo o esforço posterior de depuração.
   - **Técnicas:**
     - *Revisão:* leitura crítica de artefatos anotando problemas encontrados.
     - *Inspeção:* revisão formal conduzida segundo um procedimento bem definido, com papéis (moderador, autor, inspetores) e *checklists* documentados.
     - *Análise Estática Automatizada:* ferramentas (linters, SAST, SonarQube) que detectam vulnerabilidades, variáveis não usadas e violações de estilo.
     - *Métodos Formais:* provas matemáticas para verificar consistência e corretude da especificação.
     - *Medição:* coleta de métricas estruturais (tamanho, acoplamento, complexidade).

2. **Testes de Software (Análise Dinâmica):**
   - Segundo a **IEEE 729**, é o processo formal de avaliar um sistema ou componente por meios manuais ou automáticos para verificar se satisfaz os requisitos ou identificar diferenças entre resultados esperados e obtidos. Segundo **Glenford Myers**, *"testar consiste em executar o programa com a intenção de encontrar erros (bugs)"*.
   - **Terminologia rigorosa (IEEE):**
     - **Erro (*Error*):** engano humano cometido pelo desenvolvedor ou analista.
     - **Defeito / Falta (*Fault/Bug*):** manifestação do erro em um artefato ou código-fonte (ex.: operador `>` no lugar de `>=`).
     - **Falha (*Failure*):** comportamento incorreto observável durante a execução do sistema. *Testes revelam falhas; a **depuração** localiza e corrige o defeito que originou a falha.*

### Técnicas de Projeto de Casos de Teste

| Critério / Técnica | Base de Derivação | Principais Métodos |
| :--- | :--- | :--- |
| **Caixa Preta (Funcional)** | Especificação de requisitos, entradas e saídas (sem olhar o código interno) | **Particionamento de Equivalência** (divide entradas em classes válidas/inválidas), **Análise de Valor Limite** (testa fronteiras `min-1, min, max, max+1`), **Tabela de Decisão** e **Transição de Estados**. |
| **Caixa Branca (Estrutural)** | Estrutura interna do código-fonte e grafo de fluxo de controle | Cobertura de **Comandos/Instruções**, Cobertura de **Ramos/Decisões**, Cobertura de **Condições** (MC/DC) e Cobertura de **Caminhos**. |

**Complexidade Ciclomática de McCabe (`V(G)`):** métrica estrutural que determina o número de caminhos linearmente independentes no grafo de fluxo de controle de um módulo (fornecendo o limite mínimo de casos de teste para cobertura de ramos):

- `V(G) = E - N + 2` (onde `E` = arestas e `N` = nós do grafo de fluxo), ou
- `V(G) = P + 1` (onde `P` = número de nós predicado/condições simples como `if`, `while`, `for`), ou igual ao número de regiões do grafo planar.

### Níveis (Estágios) e Tipos de Teste

1. **Teste de Unidade:** testa individualmente a menor unidade testável (função, método ou classe), geralmente conduzido pelo programador com *mocks* e *stubs* (e automatizado com JUnit, xUnit, pytest, Jest).
2. **Teste de Integração:** verifica a comunicação e as interfaces entre módulos integrados (estratégias *Top-Down* com *stubs*, *Bottom-Up* com *drivers*, ou *Sanduíche*).
3. **Teste de Sistema:** valida o sistema completo integrado em ambiente equivalente ao de produção, cobrindo requisitos funcionais e não funcionais (desempenho, carga, estresse, segurança, usabilidade).
4. **Teste de Aceitação:** conduzido pelo cliente/usuário final para confirmar que o sistema está apto para uso em operação (**Alfa**: no ambiente do desenvolvedor; **Beta**: no ambiente real do cliente).
5. **Teste de Regressão:** reexecução de testes após modificações ou correções de defeitos para assegurar que funcionalidades existentes não foram quebradas.

### Manutenção e Evolução de Software

Após a entrega em produção, o software entra em fase contínua de manutenção (que consome a maior parte do custo total do ciclo de vida). Classifica-se em quatro tipos:

- **Manutenção Corretiva:** correção de defeitos/falhas detectados após a entrega em operação.
- **Manutenção Adaptativa:** modificação do software para mantê-lo funcional diante de mudanças no ambiente técnico ou regulatório (novo SO, atualização de SGBD, nova legislação fiscal).
- **Manutenção Perfectiva (Evolutiva):** implementação de novos requisitos de usuário, melhorias de desempenho ou usabilidade.
- **Manutenção Preventiva:** refatoração e reestruturação proativa do código para melhorar a manutenibilidade e reduzir dívida técnica antes que falhas ocorram.

---

## Módulo 7: Qualidade de Software, Métricas, Maturidade e Gerência de Configuração

Segundo Pressman, **Qualidade de Software** é a conformidade com requisitos funcionais e de desempenho explicitamente declarados, padrões de desenvolvimento explicitamente documentados e características implícitas esperadas de todo software desenvolvido profissionalmente.

A qualidade sustenta-se em dois pilares interdependentes (ENADE 2021, Q13): a **Qualidade do Processo** (que aumenta a previsibilidade e reduz a inserção de defeitos) e a **Qualidade do Produto**. No lançamento do produto (ENADE 2014, Q27), busca-se o ponto ótimo de equilíbrio entre o custo de desenvolvimento e o custo de falhas pós-lançamento para maximizar o **valor líquido (retorno do investimento)**.

### Norma ISO/IEC 25000 (SQuaRE)

A família **ISO/IEC 25000 (SQuaRE — *Software Product Quality Requirements and Evaluation*)** sucedeu a clássica ISO/IEC 9126 e organiza-se em cinco divisões:
- **2500n:** Gerenciamento de Qualidade;
- **2501n:** Modelo de Qualidade (**Qualidade Interna**, **Qualidade Externa** e **Qualidade em Uso** — quanto maior a qualidade interna, maior a probabilidade de alcançar qualidade externa e, consequentemente, qualidade em uso);
- **2502n:** Medição de Qualidade;
- **2503n:** Requisitos de Qualidade;
- **2504n:** Avaliação de Qualidade.

O modelo de qualidade do produto da ISO/IEC 25010 define **oito características**: *Adequação Funcional, Eficiência de Desempenho, Compatibilidade, Usabilidade, Confiabilidade, Segurança, Manutenibilidade e Portabilidade*.

### Métricas de Software e Método GQM

Medir significa atribuir valores quantitativos a atributos de produto, processo ou recursos para reduzir a subjetividade, gerenciar contratos, estimar esforços e identificar módulos críticos. Como existem centenas de métricas, adota-se o **Método GQM (*Goal-Question-Metric* — Basili)** para alinhar medições aos objetivos reais:

1. **Goal (Objetivo):** definido a partir das necessidades dos *stakeholders* (ex.: *"Reduzir o prazo de entrega de manutenções urgentes sem perder qualidade"*).
2. **Question (Questão):** perguntas concretas que avaliam o atingimento do objetivo (ex.: *"Quanto tempo é necessário para corrigir um problema urgente?"*).
3. **Metric (Métrica):** dado objetivo coletado para responder à questão (ex.: *"Tempo médio entre o levantamento do problema e a aceitação da mudança"* — exatamente como cobrado no ENADE 2014, Q24!).

### Modelos de Maturidade: CMMI-Dev vs. MPS.BR (MPS-SW)

É fundamental distinguir **adequação** (adotar total ou parcialmente as práticas recomendadas por uma norma) de **certificação/avaliação oficial** (auditoria conduzida por organismo independente credenciado que atesta a conformidade).

Tanto o **CMMI-Dev** (internacional, SEI / CMMI Institute) quanto o **MPS.BR / MPS-SW** (brasileiro, SOFTEX, adaptado à realidade das PMEs brasileiras e compatível com ISO/IEC 12207, ISO/IEC 15504/33000 e CMMI) avaliam a capacidade organizacional e exigem alinhamento com o planejamento estratégico da empresa.

#### Comparativo de Níveis de Maturidade

| CMMI-Dev (Representação por Estágios — 5 Níveis) | MPS.BR / MPS-SW (7 Níveis) | Características Principais |
| :--- | :---: | :--- |
| **Nível 1: Inicial** | *(sem equivalente formal)* | Processo *ad hoc*, imprevisível, pouco controlado e reativo; sucesso depende de esforço heróico individual. |
| **Nível 2: Gerenciado** | **G** (Parcialmente Gerenciado) e **F** (Gerenciado) | Processos planejados, executados, monitorados e controlados **no nível de projetos** (ex.: Gerência de Requisitos e Gerência de Projetos). |
| **Nível 3: Definido** | **E** (Parcialmente Definido), **D** (Largamente Definido) e **C** (Definido) | Processos **padronizados para toda a organização**, bem caracterizados, documentados com ferramentas e métodos estabelecidos, adaptados a cada projeto (ENADE 2021, Q18). |
| **Nível 4: Gerenciado Quantitativamente** | **B** (Gerenciado Quantitativamente) | Processos medidos e controlados estatisticamente/quantitativamente com objetivos de qualidade e desempenho de processo. |
| **Nível 5: Em Otimização (*Optimizing*)** | **A** (Em Otimização) | Foco na **melhoria contínua e inovação** de processos com base em análise quantitativa de causas comuns de variação. |

*(Nota sobre o CMMI: além da representação **por estágios** — níveis de maturidade 1 a 5 aplicáveis à organização — existe a representação **contínua**, que avalia **níveis de capacidade de 0 a 5** para uma única Área de Processo ou um subconjunto delas.)*

*(Nota sobre avaliações MPS.BR — ENADE 2014, Q26: cada resultado esperado, como `GRH 6`, `GRH 7`, `GRH 8`, pode ser avaliado como Totalmente Atendido, Largamente Atendido, Parcialmente Atendido ou Não Atendido mediante evidências objetivas completas. Por exemplo, ter plano de cargos/carreira para indivíduos sem contemplar avaliação de **grupos** atende apenas **parcialmente** ao GRH 8.)*

### Gerência de Configuração de Software (GCS) e DevOps

No desenvolvimento paralelo, surgem cinco problemas clássicos: **(1) duplicidade de trabalho**, **(2) trabalhos sobrepostos**, **(3) perda de trabalho**, **(4) perda do histórico de mudanças** e **(5) versões inconsistentes**. A **Gerência de Configuração** resolve esses problemas por meio de três pilares:

1. **Gerenciamento de Mudanças:** controla solicitações de alteração, analisa custos, benefícios e impactos, submete à aprovação formal e mantém a rastreabilidade de quais itens de configuração foram modificados (ferramentas como Redmine, Jira).
2. **Gerenciamento de Versões:** identifica e preserva o histórico e a rastreabilidade de versões de código e artefatos, permitindo recuperar qualquer *release* e evitar edição simultânea destrutiva (ex.: Git com estratégia **GitFlow** — *main/master*, *develop*, *feature*, *release*, *hotfix*).
3. **Gerenciamento de Builds e Integração Contínua (CI):** automatiza a compilação, execução de testes e empacotamento frequente (idealmente a cada *commit* ou diariamente) utilizando servidores como Jenkins, GitHub Actions ou GitLab CI, reduzindo erros manuais e versões inconsistentes.

Por fim, a cultura **DevOps** integra **Desenvolvimento (Dev)** e **Operações (Ops)**, unindo pessoas, processos e automação (*CI/CD — Continuous Integration / Continuous Delivery*, Infraestrutura como Código e monitoramento contínuo) para entregar valor com alta frequência, confiabilidade e menor tempo de recuperação a falhas.
