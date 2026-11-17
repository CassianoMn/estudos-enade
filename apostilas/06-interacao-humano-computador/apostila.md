# Interação Humano-Computador (IHC)

> **Foco ENADE:** Com base no material do Prof. Dr. Raphael Pereira de Oliveira (UFS) e na literatura clássica de Barbosa & Silva, Norman, Nielsen e Pressman, o ENADE cobra IHC articulando **conceitos fundamentais** (interface, interação, *affordance*, comunicabilidade), **qualidade de uso** (**usabilidade** ISO 9241-11 / ISO 25010, **experiência do usuário — UX**, **acessibilidade** e legislação brasileira), **fatores humanos/cognitivos** (Processador Humano de Informações, memória, **Lei de Fitts**), as **10 Heurísticas de Nielsen**, o **Design Centrado no Usuário (DCU)** com **prototipação** e os métodos de **avaliação** (avaliação heurística com escala de severidade e testes de usabilidade).

---

## Módulo 1: Fundamentos de IHC — Interface, Interação, *Affordance* e Comunicabilidade

### 1.1 O que é IHC e por que ela importa?

**Interação Humano-Computador (IHC)** é uma área **multidisciplinar** (que integra **Computação, Pessoas e Processos Sociais**) voltada ao **projeto, implementação e avaliação de sistemas computacionais interativos para uso humano** (Hewett et al., 1992).

Enquanto a Engenharia de Software foca tradicionalmente em eficiência interna, testes e manutenibilidade, a IHC foca na **qualidade de uso** e no **impacto na vida dos usuários**. Investir em IHC traz benefícios diretos:
* Evita **retrabalho** causado por solicitações tardias de alteração pelo usuário final.
* Aumenta a **produtividade** e a satisfação/fidelidade do cliente.
* Reduz a **quantidade e a gravidade dos erros** operacionais cometidos pelos usuários.
* Diminui custos de **treinamento** e de **suporte técnico**.

### 1.2 Interface de Usuário (IU) vs. Interação

* **Interface de Usuário (UI / IU):** superfície de contato e comunicação entre dois sistemas (o humano e o computacional). É o suporte pelo qual o usuário aciona funções do sistema e recebe informações. Possui duas camadas:
  * **Hardware:** dispositivos físicos de entrada e saída (teclado, mouse, monitores, telas sensíveis ao toque, óculos de RV).
  * **Software:** componentes lógicos responsáveis pela apresentação da informação, acionamento dos dispositivos e dinâmica do sistema.
* **Interação:** refere-se a um **diálogo**, um ato de comunicação envolvendo uma **linguagem artificial** mediada pela interface. O **contexto de uso** (pessoas, atividades, ambiente físico/social e tecnologia — desktop em casa, smartphone no aeroporto, projetor em sala) altera profundamente como a interação ocorre.

### 1.3 *Affordance* (Norman, 1988)

Em IHC, **affordance** corresponde ao conjunto de características perceptíveis de um objeto/elemento de interface que **revelam aos usuários as operações e manipulações possíveis** com ele.
* **Boa affordance:** um botão com sombra/relevo convida ao clique; uma barra de rolagem indica deslocamento; um campo sublinhado ou com borda sugere edição.
* **Affordance confusa ou falsa:** um texto sublinhado que não é link; um rótulo com borda de botão que não é clicável; *checkboxes* (quadrados) usados onde a seleção é exclusiva (deveriam ser *radio buttons* circulares).

### 1.4 Comunicabilidade e Uso de Analogias

**Comunicabilidade** (base da Engenharia Semiótica, de Clarisse de Souza / Barbosa & Silva) é a qualidade de sistemas cuja interface e interação:
1. Expressam bem a **intenção e a lógica de design** dos produtores do sistema (*"o designer explica ao usuário como e por que usar o sistema"*).
2. Permitem ao usuário **expressar bem sua intenção de uso**.
3. Respondem às expressões do usuário com comunicações úteis e adequadas ao contexto.

Um recurso poderoso para aumentar a comunicabilidade é o uso de **analogias/metáforas** (ex.: lixeira para excluir arquivos, carrinho de compras), permitindo que o usuário formule hipóteses com base em experiências prévias. Porém, **péssimas analogias** ou mensagens ambíguas (ex.: um botão "Cancelar" que não informa se arquivos já copiados permanecem no *pen drive* ou serão apagados) geram **baixa comunicabilidade**.

---

## Módulo 2: Fatores Humanos e Cognitivos na Interação

### 2.1 Modelo do Processador Humano de Informações

Desenvolvido por Card, Moran e Newell, modela o ser humano como três subsistemas integrados:

| Subsistema | Função Principal | Tempos / Parâmetros Típicos (Material Prof. Raphael) |
| :--- | :--- | :--- |
| **Perceptivo** | Capta estímulos sensoriais (visão, audição, tato) e os armazena brevemente | Estímulo **auditivo**: ~**130–150 ms**; Estímulo **visual**: ~**170–200 ms** |
| **Cognitivo** | Interpreta informações, recupera conhecimento na memória e decide a resposta | Processamento dependente da carga cognitiva e familiaridade |
| **Motor** | Executa a resposta física (clicar, digitar, tocar na tela) | Movimento típico: ~**700 ms** |

### 2.2 Sistema de Memória e Implicações para Interface

A memória humana organiza-se em três níveis sequenciais:
1. **Memória Sensorial (visual/icônica, auditiva/ecoica, tátil):** retém estímulos brutos por frações de segundo; passa adiante apenas o que recebe **atenção**.
2. **Memória de Trabalho (Curta Duração):** capacidade altamente limitada (regra clássica de Miller: **7 ± 2 itens**, ou cerca de 4 blocos ativos). Retém informações temporárias enquanto realizamos uma tarefa.
3. **Memória Permanente (Longa Duração):** capacidade virtualmente ilimitada, consolidada por **ensaio/repetição ou emoção**.

**Aplicação direta em IHC (Chunking e Carga Cognitiva):** Agrupar sequências longas em blocos menores (**chunking** — ex.: `267 988 002 804` em vez de `267988002804`, ou formatar CPF/telefone com separadores) reduz drasticamente o esforço da memória de trabalho e previne erros. Além disso, interfaces devem favorecer o **reconhecimento** (opções visíveis, menus, ícones claros) em vez da **recordação** (obrigar o usuário a decorar comandos ou códigos).

### 2.3 Lei de Fitts (Fitts' Law)

A **Lei de Fitts** modela o tempo `T` necessário para um usuário apontar rapidamente para um alvo em função da **distância (`D`)** até o alvo e do **tamanho/largura (`S`)** do alvo:

```text
T = k × log2( D / S + 0,5 )
```

*(Onde `k ~ 100 ms` é uma constante empírica que varia conforme o dispositivo de apontamento, como mouse, trackpad ou dedo em tela sensível ao toque.)*

**Implicações práticas no design de UI:**
* Botões de ação frequente ou crítica devem ser **maiores (`S` maior)** e estar **mais próximos (`D` menor)** do foco atual do cursor/polegar.
* As **bordas e cantos da tela** possuem tamanho efetivo "infinito" para ponteiros de mouse (o cursor para na borda), tornando menus nas extremidades muito rápidos de atingir.
* **Menus circulares (*Pie Menus*)** reduzem `D` igualmente em todas as direções a partir do ponto de clique.
* Em dispositivos móveis (*touch*), áreas de toque pequenas aumentam erros motores (especialmente para idosos ou usuários em movimento).

---

## Módulo 3: Qualidade em IHC — Usabilidade, UX e Regras de Ouro

### 3.1 Evolução e Definições de Usabilidade

A usabilidade é um **requisito não funcional (de qualidade)** do software, frequentemente em equilíbrio (*trade-off*) com o perfil do usuário (ex.: muitos atalhos de teclado aumentam a eficiência de experientes, mas dificultam a memorização por usuários ocasionais; muitos tutoriais facilitam o aprendizado inicial, mas atrasam especialistas).

#### a) Critérios de Usabilidade de Jakob Nielsen (5 Atributos Clássicos)
1. **Facilidade de Aprendizado (*Learnability*):** quão rápido um usuário novato realiza tarefas básicas no primeiro contato.
2. **Eficiência (*Efficiency*):** quão rápido usuários experientes executam tarefas após aprenderem o sistema.
3. **Facilidade de Recordação (*Memorability*):** quão facilmente usuários esporádicos retomam o uso sem precisar reaprender tudo.
4. **Baixa Taxa de Erros (*Errors*):** quantos erros os usuários cometem, quão graves são e quão fácil é se recuperar deles.
5. **Satisfação Subjetiva (*Subjective Satisfaction*):** o quanto é agradável utilizar o sistema.

*(Com a Web e o Mobile, somaram-se **Navegabilidade** — ex.: operações principais em até 3 telas —, **Findability** [facilidade de encontrar conteúdos], **Portabilidade**, **Responsividade** e **Sensibilidade ao contexto**.)*

#### b) Norma ISO 9241-11
Define usabilidade como: *"a capacidade que um sistema interativo oferece a seus usuários, em um **contexto específico de uso**, para alcançar objetivos especificados com **eficácia**, **eficiência** e **satisfação**."*
* **Eficácia:** acurácia e completude com que os usuários atingem objetivos específicos (conseguiu concluir a tarefa?).
* **Eficiência:** recursos gastos (tempo, esforço, cliques) em relação à acurácia e completude obtidas.
* **Satisfação:** ausência de desconforto e atitudes positivas em relação ao uso do produto.

#### c) Norma ISO/IEC 25010 (SQuaRE)
Divide a qualidade relacionada à interação em duas visões:
* **Usabilidade como Qualidade do Produto:** Capacidade de Reconhecimento da Adequação, Facilidade de Aprendizado, Operabilidade, Proteção contra Erro do Usuário, Estética da Interface de Usuário e Acessibilidade.
* **Qualidade em Uso:** **Eficácia**, **Eficiência**, **Satisfação** (Utilidade, Confiança, Prazer, Conforto), **Isenção de Risco** e **Cobertura de Contexto**.

### 3.2 Experiência do Usuário (UX — *User Experience*)

Segundo McCarthy & Wright (2007), **UX** refere-se à qualidade da interação das pessoas com a tecnologia e às **consequências emocionais e cognitivas** que decorrem dessa interação (prazer, diversão, confiança, motivação, estética, ou frustração, cansaço, ofensa).

A UX é **subjetiva, abrangente e longitudinal**: envolve todos os **pontos de contato** (marketing, loja, manual, instalação, interface de uso, suporte, descarte) e todos os **momentos** (antecipação do uso, primeiro uso, uso esporádico e uso continuado).

| Comparação | Usabilidade | Experiência do Usuário (UX) |
| :--- | :--- | :--- |
| **Natureza** | Característica **intrínseca** especificada e projetada no produto/sistema | Perspectiva **individual/subjetiva** vivenciada pelo usuário |
| **Foco** | Eficácia, eficiência e satisfação durante o uso das tarefas | Emoções, expectativas, vivências anteriores e toda a jornada com a marca/produto |
| **Relação** | Uma boa usabilidade é condição base para viabilizar uma boa UX | Afetada pela usabilidade, mas vai além da interface imediata |

### 3.3 As 3 Regras de Ouro de Pressman para Projeto de Interface

Muito cobradas no ENADE (como na questão clássica de Pressman citada pelo Prof. Raphael):
1. **Deixar o usuário no comando:** permitir desfazer ações (*Undo*), personalizar interações, evitar modos restritivos desnecessários.
2. **Reduzir a carga de memória do usuário:** diminuir exigência de memória de curto prazo, usar metáforas visuais (ex.: ícone/imagem de cartão de crédito guiando pagamento), defaults inteligentes e divulgação progressiva.
3. **Tornar a interface consistente:** manter padrões visuais, terminológicos e comportamentais entre telas de uma aplicação e entre sistemas da mesma família.

---

## Módulo 4: As 10 Heurísticas de Usabilidade de Jakob Nielsen

As **10 Heurísticas de Nielsen** são princípios gerais derivados da prática para orientar o design e fundamentar a Avaliação Heurística:

| # | Heurística de Nielsen | Significado Prático ("Voz do Usuário") | Exemplo de Boa Prática / Violação Comum |
| :---: | :--- | :--- | :--- |
| **1** | **Visibilidade do status do sistema** | *"Eu sei tudo o que acontece!"* | Barra de progresso, spinner de carregamento, confirmação de envio. Violação: clicar em "Salvar" e nada acontecer na tela. |
| **2** | **Sintonia entre o sistema e o mundo real** | *"Isso faz sentido!"* | Linguagem natural familiar ao usuário, ícones/metáforas cotidianas. Violação: exibir códigos técnicos (`ORA-00942`) para usuário leigo. |
| **3** | **Controle e liberdade do usuário** | *"Eu faço assim!"* | Botões claros de "Desfazer", "Refazer", "Voltar" e "Cancelar" (saída de emergência). Violação: modal sem botão fechar ou fluxo sem retorno. |
| **4** | **Consistência e padronização** | *"Já vi isso antes!"* | Mesmos termos, cores e posicionamento de botões (consistência **interna** e **externa** com padrões da plataforma). Violação: chamar a mesma ação de "Excluir" numa tela e "Remover" noutra. |
| **5** | **Prevenção de erros (Evitar erros)** | *"Ufa! Quase errei!"* | Confirmação antes de ação destrutiva, desabilitar datas inválidas no calendário, validação em tempo real. Violação: calendário aceitar data de retorno anterior à de ida. |
| **6** | **Reconhecer mais do que lembrar** | *"É esse botão aqui!"* | Autocompletar, histórico recente, rótulos visíveis nos ícones. Violação: exigir que o usuário digite de cabeça o código interno do produto. |
| **7** | **Flexibilidade e eficiência de uso** | *"Esse atalho me ajuda!"* | Atalhos de teclado (`Ctrl+C`, `Ctrl+S`), macros, filtros salvos para usuários avançados sem atrapalhar novatos. |
| **8** | **Design estético e minimalista** | *"Comunique, não decore!"* | Exibir apenas informações relevantes à tarefa atual, boa hierarquia visual. Violação: telas poluídas com dezenas de banners e campos irrelevantes. |
| **9** | **Reconhecer, diagnosticar e corrigir erros** | *"Sei que errei e como consertar!"* | Mensagem em linguagem simples explicando o problema e sugerindo a solução (ex.: destacar campo com CPF inválido). Violação: *"Erro desconhecido (500)"*. |
| **10** | **Ajuda e documentação** | *"Ah! Agora entendi!"* | Ajuda contextual pesquisável, *tooltips*, passo a passo conciso focado em tarefas. |

---

## Módulo 5: Acessibilidade Digital, Legislação e Diretrizes WCAG

### 5.1 Conceito de Acessibilidade e Inclusão

**Acessibilidade** em IHC significa garantir que usuários com diferentes habilidades **motoras** (dispositivos de entrada), **sensoriais** (visão, audição, tato para saídas) e **cognitivas** possam acessar e interagir com o sistema **sem que a interface imponha barreiras**, com segurança e autonomia (Barbosa & Silva, 2017; Melo & Baranauskas, 2005).

* **Abordagem Inclusiva (Design Universal):** não se deve criar um "sistema separado" só para pessoas com deficiência, e sim projetar interfaces flexíveis que beneficiem **a todos** (como rampas na arquitetura, legendas em vídeos, alto contraste sob luz solar e suporte para idosos lidando com redução motora ou de acuidade visual).

### 5.2 Legislação Brasileira Aplicável

* **Lei nº 10.098/2000** e **Lei Brasileira de Inclusão — LBI (Lei nº 13.146/2015):** definem acessibilidade como a possibilidade e condição de alcance para utilização, **com segurança e autonomia**, de espaços, mobiliários, informação e comunicação — **inclusive seus sistemas e tecnologias** — por pessoa com deficiência ou com mobilidade reduzida (abrangendo portais públicos e serviços de uso coletivo na web).

### 5.3 W3C / WAI e os 4 Princípios da WCAG (POUR)

A **WAI (*Web Accessibility Initiative*)** do consórcio **W3C** publica as diretrizes **WCAG (*Web Content Accessibility Guidelines*)** (versões 2.0 / 2.1 / 2.2, com níveis de conformidade **A**, **AA** e **AAA**), estruturadas em **4 princípios fundamentais**:

| Princípio | Significado | Exemplos Práticos de Implementação |
| :--- | :--- | :--- |
| **1. Perceptível** | Conteúdo e interface devem poder ser percebidos pelos sentidos disponíveis do usuário | Atributo `alt` descritivo em imagens para leitores de tela, legendas e audiodescrição em vídeos, contraste mínimo de cor (4,5:1 no nível AA), não depender apenas da cor para transmitir informação. |
| **2. Operável** | Componentes de interface e navegação devem ser acionáveis por diferentes dispositivos | Navegação integral via **teclado** (`Tab`, `Enter`, foco visível), tempo suficiente para leitura/ação, evitar conteúdo piscante que cause convulsões. |
| **3. Compreensível** | Informações e operação da interface devem ser claras e previsíveis | Linguagem clara, atributo `lang="pt-BR"`, identificação e sugestão de correção de erros em formulários, navegação consistente. |
| **4. Robusto** | Conteúdo deve ser bem estruturado para ser interpretado por navegadores e **tecnologias assistivas** | HTML semântico válido (`<header>`, `<nav>`, `<main>`, `<button>`), uso adequado de atributos **WAI-ARIA** (`role`, `aria-label`, `aria-live`). |

---

## Módulo 6: Design Centrado no Usuário (DCU), Prototipação e Métodos Ágeis

### 6.1 Usuário, Cliente, Papel (*Role*) e Perfil

* **Cliente vs. Usuário:** o cliente contrata/compra o sistema (ex.: diretor do hospital); o usuário interage diretamente com ele (ex.: recepcionista, enfermeiro, paciente). Nem sempre são a mesma pessoa.
* **Papel (*Role*):** abstração das necessidades de um grupo de usuários em uma interface (equivale ao ator de caso de uso). Divide-se em **Primário** (uso direto e frequente) e **Secundário** (uso ocasional ou via intermediário).
* **Perfil do Usuário:** distribuição de características socioeconômicas, de formação, físicas, comportamentais e de experiência — classificando usuários em **frequentes vs. ocasionais** e **novatos vs. experientes**.

### 6.2 Princípios e Ciclo do Design Centrado no Usuário (DCU / ISO 9241-210)

O DCU apoia-se em **3 princípios centrais**:
1. **Foco no Usuário:** projetar interação e interface para atender necessidades reais e objetivos dos usuários (palavra-chave: **empatia**).
2. **Métricas Observáveis:** realizar estudos empíricos em que representantes dos usuários utilizam protótipos/simulações.
3. **Design Iterativo:** corrigir e refinar o projeto a cada ciclo de avaliação.

#### Etapas do Processo DCU e Técnicas Associadas

| Etapa do DCU | Objetivo Principal | Técnicas e Artefatos Típicos (Prof. Raphael) |
| :--- | :--- | :--- |
| **1. Planejar o processo centrado no usuário** | Definir cronograma, equipe e métodos de IHC | Plano de UX / Pesquisa integrado ao ciclo de software |
| **2. Compreender e especificar o contexto de uso** | Identificar *stakeholders*, usuários, tarefas, dores, ambiente e plataformas | Entrevistas (abertas/fechadas), Questionários, Grupos de Foco, Estudos de Campo / Investigação Contextual, *Card Sorting* |
| **3. Especificar os requisitos de usuário** | Descrever população, resolver conflitos e definir metas de usabilidade/UX | **Mapa de Empatia** (vê, escuta, fala/faz, pensa/sente, dores e desejos), **Personas** (arquétipo fictício baseado em dados reais), **Cenários de Interação** (narrativa de uso) |
| **4. Produzir soluções de design** | Conceber modelo conceitual, tarefas, interação e interface | **Protótipos** (baixa, média e alta fidelidade), aplicação de padrões e heurísticas, Design Participativo |
| **5. Avaliar soluções em relação aos requisitos** | Verificar atendimento às metas antes e após implementação | **Avaliação Formativa** (durante construção, para melhorar) e **Somativa** (ao final, para validar), Avaliação Heurística, Testes de Usabilidade |

### 6.3 Níveis de Prototipação

* **Baixa Fidelidade:** esboços em papel, *storyboards*, técnica ***Crazy Eights*** (8 ideias rápidas em 8 minutos). Baixíssimo custo, fácil modificação e **transmitem ideia de provisoriedade** (deixando o usuário à vontade para criticar).
* **Média Fidelidade:** ***Wireframes*** digitais com estrutura de layout, fluxos e hierarquia sem detalhamento visual definitivo.
* **Alta Fidelidade:** protótipos detalhados, realistas e **executáveis/clicáveis** (ex.: Figma interativo, HTML/CSS), próximos ao produto final.

### 6.4 DCU na Engenharia de Software e Métodos Ágeis

O DCU não é incompatível com Engenharia de Software nem com Métodos Ágeis: atividades de design ocorrem **antes, durante e depois** do desenvolvimento. Em times ágeis (*Dual-Track Agile* / *Lean UX*), costuma-se empregar uma **Sprint 0** (ou trilha contínua de *Discovery* / Ideação) para estudos de usuário e design da experiência à frente da **Sprint de Desenvolvimento**, validando **MVPs (*Minimum Viable Products*)** com usuários reais a cada incremento.

---

## Módulo 7: Avaliação em IHC — Avaliação Heurística e Testes de Usabilidade

### 7.1 Métodos de Inspeção vs. Métodos de Observação

* **Métodos de Inspeção (sem usuários finais):** especialistas examinam a interface buscando violações de princípios (ex.: **Avaliação Heurística**, Percurso Cognitivo, Inspeção Semiótica).
* **Métodos de Observação / Empíricos (com usuários reais):** observam representantes dos usuários executando tarefas reais ou simuladas (ex.: **Testes de Usabilidade**, *Think-Aloud*).

### 7.2 Avaliação Heurística (Nielsen)

Proposta como um **método de avaliação "descontado" (econômico)**, rápido de aplicar e produtivo. Envolve um pequeno grupo de **3 a 5 avaliadores especialistas** examinando a interface contra as 10 heurísticas.

**5 Passos do Processo de Avaliação Heurística:**
1. **Instruções / Treinamento pré-avaliação:** explicar o método, o domínio e o cenário específico de tarefas.
2. **Avaliação independente:** cada avaliador inspeciona a interface **separadamente** (para evitar viés de grupo) em **dois passos**: (1º) entender o fluxo geral da interação; (2º) focar em elementos específicos anotando os problemas e **qual heurística foi violada**.
3. **Compilação:** reunir avaliadores para consolidar problemas, remover duplicatas em sessão aberta (sem rebater ideias prematuramente).
4. **Classificação de Severidade:** priorizar cada problema considerando **3 fatores de gravidade**: **Impacto** (impede continuidade da tarefa?), **Visibilidade** (quantos usuários percebem?) e **Persistência** (ocorre repetidamente ou uma vez?).

| Grau | Nível de Severidade (Nielsen) | Ação Recomendada |
| :---: | :--- | :--- |
| **0** | Não é problema | Não há consenso de que seja um problema de usabilidade. |
| **1** | **Cosmético** | Corrigir apenas se houver tempo extra no projeto. |
| **2** | **Menor** | Corrigir com **baixa prioridade**. |
| **3** | **Maior** | Importante corrigir; **alta prioridade**. |
| **4** | **Catástrofe** | **Correção obrigatória e urgente** antes de liberar o produto. |

5. **Decisão de Design:** propor alternativas de solução e analisar custo/benefício.

### 7.3 Testes de Usabilidade e Verificação de Interfaces Web

Os **Testes de Usabilidade** são experimentos empíricos que ensaiam a interação de **participantes representativos dos usuários reais** com o sistema ou protótipo.

**4 Fases do Teste de Usabilidade:**
1. **Definir o Objetivo:** estabelecer claramente o que se deseja validar logo no início.
2. **Planejamento:** seleção de **participantes** (perfil adequado), questões **éticas** (TCLE, privacidade, gravação), elaboração de **cenários/tarefas**, preparação do **ambiente** e execução de um **teste piloto** (para calibrar roteiro e equipamentos).
3. **Execução:**
   * *Pré-teste:* identificar perfil e expectativas do participante.
   * *Cenários:* participante realiza tarefas (muitas vezes verbalizando pensamentos — *Think-Aloud*) enquanto coletam-se dados (vídeo, áudio, tempo, erros, cliques).
   * *Pós-teste:* coletar impressões, satisfação subjetiva (ex.: questionário SUS — *System Usability Scale*).
4. **Análise de Resultados:** comparar expectativa com satisfação, analisar vídeos buscando **rupturas na interação**, diagnosticar causas/severidade e gerar recomendações de redesign.

*(Complementando Pressman para aplicações Web, a verificação inclui também: **Teste de Interface** — valida semântica de navegação, exibição e mecanismos estéticos/interativos — e **Teste de Compatibilidade** — define matriz de plataforma, sistema operacional e navegador no lado cliente.)*

---

## Módulo 8: Resumo Estratégico e Checklist de Revisão ENADE

### Checklist de Ouro para a Prova

1. **Affordance vs. Comunicabilidade:** *Affordance* = características que revelam *como operar* o objeto (ex.: botão parece clicável). Comunicabilidade = interface comunica a *intenção do designer* e responde utilmente ao usuário (uso de analogias adequadas).
2. **Processador Humano e Lei de Fitts:** Estímulo auditivo (~130–150 ms) é mais rápido que visual (~170–200 ms); movimento ~700 ms. Na **Lei de Fitts** `T = k * log2(D/S + 0,5)`, quanto **maior o alvo (`S`)** e **menor a distância (`D`)**, **menor o tempo** de apontamento.
3. **Memória e Carga Cognitiva:** Memória de trabalho é limitada; use **chunking** (agrupamento) e **reconhecimento no lugar de recordação** (Heurística 6).
4. **Usabilidade (ISO 9241-11) vs. UX:** Usabilidade = eficácia, eficiência e satisfação em contexto específico (qualidade intrínseca do sistema). UX = vivência subjetiva e emocional longitudinal em todos os pontos de contato.
5. **Acessibilidade (WCAG + Leis Brasileiras):** Atributo `alt` em imagens atende à **acessibilidade** (Princípio **Perceptível** da WCAG) para usuários de leitores de tela, não sendo apenas "estética" ou "segurança". Deve ser **inclusiva**, evitando versões segregadas.
6. **DCU e Prototipação:** Envolve obrigatoriamente o usuário (nunca é dispensável!). Baixa fidelidade (papel, *Crazy Eights*) transmite provisoriedade; média (*wireframe*); alta (clicável/executável). Mapas de Empatia, Personas e Cenários representam dados coletados.
7. **Avaliação Heurística vs. Teste de Usabilidade:** Avaliação Heurística = método **econômico de inspeção** por especialistas independentes (2 passos: fluxo geral -> elementos específicos), classificando severidade de **0 a 4** (impacto, visibilidade, persistência). Teste de Usabilidade = experimento empírico com **usuários representativos** (Objetivo -> Planejamento com Piloto -> Execução Pré/Cenários/Pós -> Análise).
