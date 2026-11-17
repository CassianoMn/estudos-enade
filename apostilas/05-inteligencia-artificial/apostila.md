# Inteligência Artificial

> **Foco ENADE:** Na prova de Sistemas de Informação, Inteligência Artificial é cobrada com ênfase na **escolha adequada de técnicas para problemas reais de negócio**, comparação entre **busca cega e busca heurística (A\*, Gulosa, Admissibilidade)**, análise de **árvores de jogo (Minimax e Poda Alfa-Beta)**, raciocínio lógico e probabilístico, **Aprendizado de Máquina** (supervisionado vs. não supervisionado, *overfitting*, matriz de confusão e métricas como Precisão, *Recall* e *F1-Score*), **Redes Neurais/Deep Learning** e **Ética, Viés Algorítmico e Governança em IA**.

---

## Módulo 1: Fundamentos da IA e Agentes Inteligentes

### 1.1 Abordagens Históricas da Inteligência Artificial

Segundo Russell & Norvig, a IA organiza-se em quatro eixos combinando pensamento/comportamento e fidelidade humana/racionalidade:

| Dimensão | Referência Humana | Referência Racional |
| :--- | :--- | :--- |
| **Pensamento** | **Pensar como humanos** (Ciência Cognitiva, modelagem do raciocínio humano) | **Pensar racionalmente** (Leis do pensamento, lógica formal e silogismos) |
| **Ação** | **Agir como humanos** (**Teste de Turing**: um avaliador humano não consegue distinguir respostas de um humano e de uma máquina) | **Agir racionalmente** (**Agente Racional**: age para alcançar o melhor resultado esperado dadas suas percepções e conhecimentos) |

Para passar no **Teste de Turing Total**, uma máquina precisa de Processamento de Linguagem Natural (PLN), Representação do Conhecimento, Raciocínio Automatizado, Aprendizado de Máquina, Visão Computacional e Robótica. Na engenharia de software e em SI, prevalece a abordagem de **Agentes Racionais**, por ser mensurável e orientada a utilidade.

### 1.2 Agentes Inteligentes e Especificação PEAS

Um **agente** percebe o ambiente por meio de **sensores** e age sobre ele por meio de **atuadores**. Um agente racional escolhe a ação que maximiza sua **medida de desempenho** com base na sequência de percepções e no conhecimento prévio.

Para projetar um agente, especifica-se o ambiente de tarefa via **PEAS**:
* **P (*Performance* - Desempenho):** critérios objetivos de sucesso (ex.: taxa de acerto, tempo de resposta, economia de combustível).
* **E (*Environment* - Ambiente):** domínio onde atua (ex.: rodovias, sistema bancário, prontuário eletrônico).
* **A (*Actuators* - Atuadores):** mecanismos de ação (ex.: bloqueio de transação, envio de alerta, volante).
* **S (*Sensors* - Sensores):** fontes de percepção (ex.: logs de API, câmeras, formulários de entrada).

### 1.3 Propriedades do Ambiente de Tarefa

| Dimensão | Oposição | Impacto no Projeto do Agente |
| :--- | :--- | :--- |
| **Observabilidade** | **Totalmente observável** vs. **Parcialmente observável** | Se parcial, o agente precisa manter **estado interno (memória)**. |
| **Quantidade de Agentes** | **Agente único** vs. **Multiagente** (cooperativo ou competitivo) | Multiagente competitivo exige modelar adversários (Teoria dos Jogos). |
| **Determinismo** | **Determinístico** vs. **Estocástico** | Ambientes estocásticos exigem probabilidades e utilidade esperada. |
| **Estrutura Temporal** | **Episódico** vs. **Sequencial** | No sequencial, decisões atuais afetam estados e recompensas futuras. |
| **Dinamismo** | **Estático** vs. **Dinâmico** (ou Semidinâmico) | No dinâmico, o ambiente muda enquanto o agente "pensa". |
| **Discretização** | **Discreto** vs. **Contínuo** | Define se há número finito de estados/ações (xadrez) ou valores reais (direção autônoma). |

### 1.4 Arquiteturas de Agentes (do mais simples ao mais complexo)

1. **Agente Reativo Simples:** decide apenas com base na percepção atual (regras `se-então`), ignorando histórico. Só funciona bem em ambientes totalmente observáveis.
2. **Agente Reativo Baseado em Modelo:** mantém um **estado interno** para rastrear aspectos do mundo que não são visíveis no instante atual (lida com observabilidade parcial).
3. **Agente Baseado em Objetivos:** combina modelo de mundo com **metas explícitas** e utiliza **busca ou planejamento** para escolher sequências de ações que atinjam o objetivo.
4. **Agente Baseado em Utilidade:** quando há múltiplos caminhos ou trade-offs entre objetivos conflitantes (ex.: rapidez vs. segurança), usa uma **função de utilidade** para escolher o estado de maior felicidade/retorno esperado.
5. **Agente com Aprendizagem:** possui um elemento crítico (avalia o desempenho), elemento de aprendizagem (ajusta comportamento) e gerador de problemas (explora novas ações) para melhorar com a experiência.

---

## Módulo 2: Resolução de Problemas por Busca (Busca Cega e Heurística)

### 2.1 Formulação de Problemas de Busca

Um problema de busca é formalizado por 5 componentes: **Estado Inicial**, **Ações possíveis**, **Modelo de Transição** (`Resultado(s, a)`), **Teste de Objetivo** e **Custo de Caminho** (soma dos custos das transições, `g(n)`).

A avaliação de qualquer algoritmo de busca considera 4 critérios:
* **Completude:** garante encontrar solução se ela existir?
* **Otimalidade:** garante encontrar a solução de menor custo?
* **Complexidade de Tempo:** número de nós gerados/expandidos (em função do fator de ramificação `b` e profundidade `d` ou `m`).
* **Complexidade de Espaço:** quantidade máxima de nós mantidos na memória.

### 2.2 Busca Cega (Não Informada)

Não possui informação adicional além da definição do problema; apenas gera sucessores e verifica se alcançou o objetivo.

| Algoritmo | Estrutura de Dados | Completo? | Ótimo? | Tempo | Espaço | Observação ENADE |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Largura (BFS)** | Fila (FIFO) | **Sim** (se `b` finito) | **Sim** (se custo uniforme por passo) | `O(b^d)` | `O(b^d)` | Grande consumo de memória; encontra o caminho mais raso. |
| **Custo Uniforme (UCS)** | Fila de Prioridade por `g(n)` | **Sim** (se custo `>= ε > 0`) | **Sim** | `O(b^(1 + floor(C*/ε)))` | `O(b^(1 + floor(C*/ε)))` | Generalização da BFS para arestas com pesos diferentes (equivalente a Dijkstra). |
| **Profundidade (DFS)** | Pilha (LIFO) / Recursão | **Não** (falha em espaços infinitos/ciclos) | **Não** | `O(b^m)` | **`O(b*m)`** | Excelente uso de memória (linear em `m`), mas pode cair em ramos infinitos. |
| **Profundidade Limitada (DLS)** | Pilha com limite `l` | **Não** (se `d > l`) | **Não** | `O(b^l)` | `O(b*l)` | Resolve laços infinitos se `l` for adequado, mas é incompleta se solução for mais profunda. |
| **Aprofundamento Iterativo (IDS)** | DFS repetida com `l = 0, 1, 2...` | **Sim** | **Sim** (custo unitário) | `O(b^d)` | **`O(b*d)`** | **Melhor busca cega** quando espaço de estados é grande e profundidade é desconhecida. |

*(Onde `b` = fator de ramificação, `d` = profundidade da solução mais rasa, `m` = profundidade máxima da árvore, `C*` = custo ótimo.)*

### 2.3 Busca Informada (Heurística)

Utiliza uma **função heurística `h(n)`**, que estima o custo do caminho mais barato do estado `n` até um estado objetivo (`h(objetivo) = 0`).

* **Busca Gulosa (Melhor-Escolha Gulosa):** ordena a fronteira apenas por `f(n) = h(n)`. É rápida, mas **não é completa** (sem detecção de estados repetidos pode entrar em ciclo) e **não é ótima** (pode escolher caminho aparentemente perto que custa caro no total).
* **Algoritmo A\* (A-Estrela):** avalia cada nó somando o custo real já percorrido até `n` e a estimativa até a meta:

```text
f(n) = g(n) + h(n)
```

Onde `g(n)` é o custo acumulado do início até `n` e `h(n)` é a estimativa heurística de `n` até o objetivo.

#### Condições para Otimalidade do A\*

1. **Heurística Admissível:** nunca **superestima** o custo real para atingir o objetivo (`0 <= h(n) <= h*(n)` para todo `n`, onde `h*(n)` é o custo real ótimo). Exemplo clássico em mapas: distância em linha reta (euclidiana) nunca supera a distância pelas ruas. **Se `h(n)` é admissível, o A\* (em busca em árvore) é completo e ótimo.**
2. **Heurística Consistente (Monotônica):** satisfaz a desigualdade triangular para todo nó `n` e sucessor `n'` gerado pela ação `a`:

```text
h(n) <= c(n, a, n') + h(n')
```

Toda heurística consistente é admissível. Com heurística consistente, o **A\* em grafo (com lista de explorados) garante otimalidade** e nunca precisa reabrir um nó já expandido.

* **Comparação de heurísticas (Dominância):** Se `h2(n) >= h1(n)` para todo `n` e ambas são admissíveis, diz-se que **`h2` domina `h1`**. `h2` é mais informada e expandirá menos (ou igual número de) nós que `h1`, mantendo a otimalidade.

### 2.4 Busca Local e Otimização

Quando importa apenas o **estado final** (e não o caminho até ele), como escalonamento de horários ou roteamento:
* **Subida da Encosta (*Hill Climbing*):** move-se sempre para o vizinho de melhor valor. Rápido, mas fica preso em **máximos locais**, **platôs** e **cumes**.
* **Têmpera Simulada (*Simulated Annealing*):** permite movimentos piores com probabilidade decrescente controlada pela "temperatura" `T` (`exp(ΔE / T)`), permitindo escapar de ótimos locais.
* **Algoritmos Genéticos (AG):** inspirados na evolução biológica; mantêm uma **população** de indivíduos (cromossomos), avaliam por **função de aptidão (*fitness*)** e geram novas gerações por **seleção**, **cruzamento (*crossover*)** e **mutação**.

---

## Módulo 3: Jogos e Busca Adversarial (Minimax e Poda Alfa-Beta)

### 3.1 O Problema Adversarial

Em jogos determinísticos de soma zero com informação perfeita (xadrez, jogo da velha, damas), dois agentes competem: **MAX** (tenta maximizar o valor do resultado) e **MIN** (tenta minimizar o valor do resultado).

### 3.2 Algoritmo Minimax

O **Minimax** percorre a árvore de jogos em profundidade até os estados terminais, aplica a função de utilidade nas folhas e propaga os valores de baixo para cima:
* Em nós **MAX**: escolhe o **maior** valor entre os filhos (`max`).
* Em nós **MIN**: escolhe o **menor** valor entre os filhos (`min`).

O Minimax assume que o oponente (**MIN**) sempre joga de forma ótima. Sua complexidade de tempo é `O(b^m)` e de espaço é `O(b*m)`.

### 3.3 Poda Alfa-Beta (*Alpha-Beta Pruning*)

A **Poda Alfa-Beta** otimiza o Minimax **eliminando ramos da árvore que não podem influenciar a decisão final**, retornando **exatamente o mesmo resultado** que o Minimax puro:
* **`α` (Alfa):** melhor opção de maior valor encontrada até o momento para **MAX** ao longo do caminho até a raiz (inicia em `-∞`).
* **`β` (Beta):** melhor opção de menor valor encontrada até o momento para **MIN** ao longo do caminho até a raiz (inicia em `+∞`).
* **Regra de Poda:** sempre que, em qualquer nó, **`α >= β`**, interrompe-se a exploração dos demais filhos daquele nó.
  * No melhor caso (ordenação ótima dos movimentos), reduz a complexidade efetiva de `O(b^m)` para aproximadamente **`O(b^(m/2))`**, dobrando a profundidade alcançável no mesmo tempo.

Em jogos reais (como xadrez), como `b^m` é inviável até o fim do jogo, usa-se **corte de profundidade** (*depth limit*) combinado com uma **função de avaliação heurística `Eval(s)`** que estima a chance de vitória em estados não terminais.

---

## Módulo 4: Representação do Conhecimento, Lógica e Incerteza

### 4.1 Sistemas Baseados em Conhecimento e Lógica

Um agente baseado em conhecimento mantém uma **Base de Conhecimento (BC)** com sentenças formais e usa um **motor de inferência** para derivar conclusões válidas (implicação lógica `BC |= α`).

| Aspecto | Lógica Proposicional | Lógica de Primeira Ordem (Predicados) |
| :--- | :--- | :--- |
| **Elementos** | Fatos atômicos (`P`, `Q`), conectivos (`¬`, `∧`, `∨`, `→`, `↔`) | Objetos, relações/predicados (`Pai(x,y)`), funções, quantificadores (`∀` universal, `∃` existencial) |
| **Poder Expressivo** | Limitado (não generaliza sobre conjuntos) | Alto (expressa regras gerais sobre domínios) |
| **Decidibilidade** | Decidível (tabelas-verdade, SAT, resolução) | Semidecidível |

### 4.2 Estratégias de Inferência e Sistemas Especialistas

Um **Sistema Especialista** emula a tomada de decisão de um especialista humano por meio de: (1) Base de Conhecimento (regras de produção `SE <condições> ENTÃO <conclusão>` + fatos), (2) Motor de Inferência e (3) Interface de Explicação.

* **Encadeamento para Frente (*Forward Chaining*):** orientado a **dados (*data-driven*)**. Parte dos fatos conhecidos e dispara regras cujas premissas são satisfeitas até atingir objetivos ou não haver novas conclusões. Ideal para monitoramento e diagnóstico reativo.
* **Encadeamento para Trás (*Backward Chaining*):** orientado a **objetivos (*goal-driven*)**. Parte de uma hipótese/meta e busca regras que a concluam, verificando recursivamente se suas premissas são verdadeiras. Ideal para sistemas de diagnóstico consultivos (ex.: Prolog, MYCIN).
* **Ontologias e Redes Semânticas:** representam conceitos, hierarquias (`é-um`) e propriedades (`tem-um`) de um domínio compartilhado (base da Web Semântica: RDF, OWL), permitindo inferência taxonômica e interoperabilidade.

### 4.3 Raciocínio sob Incerteza: Bayes e Lógica Fuzzy

Quando informações são incompletas ou ruidosas, a lógica booleana clássica falha.

1. **Probabilidade e Teorema de Bayes:** atualiza a crença em uma hipótese `H` dada uma evidência `E`:

```text
P(H | E) = [ P(E | H) × P(H) ] / P(E)
```

2. **Redes Bayesianas:** grafos acíclicos dirigidos (DAGs) em que nós são variáveis aleatórias e arestas indicam dependências condicionais diretas (tabelas de probabilidade condicional — CPT). Permitem modelar causalidade e inferência probabilística de forma compacta.
3. **Lógica Fuzzy (Difusa):** trata **graus de pertinência** contínuos no intervalo `[0, 1]` para lidar com **imprecisão/vagueza linguística** (ex.: "temperatura alta = 0,75", "temperatura média = 0,25"), muito usada em sistemas de controle (ar-condicionado, frenagem ABS). Diferente da probabilidade (incerteza de ocorrência), a lógica fuzzy mede grau de verdade parcial.

---

## Módulo 5: Aprendizado de Máquina (*Machine Learning*)

### 5.1 Paradigmas de Aprendizado

| Paradigma | Dados de Entrada | Objetivo Principal | Algoritmos Típicos |
| :--- | :--- | :--- | :--- |
| **Supervisionado** | Pares rotulados `(x_i, y_i)` | **Classificação** (`y` discreto) ou **Regressão** (`y` contínuo) | Regressão Linear/Logística, Árvores de Decisão, *Random Forest*, *k*-NN, SVM, *Naive Bayes*, Redes Neurais |
| **Não Supervisionado** | Apenas entradas `(x_i)` sem rótulos | Descobrir estrutura oculta: **Agrupamento (*Clustering*)**, **Redução de Dimensionalidade**, **Associação** | *k*-Means, DBSCAN, Agrupamento Hierárquico, PCA, Apriori |
| **Semissupervisionado** | Poucos dados rotulados + muitos não rotulados | Aproveitar grande volume não rotulado para melhorar fronteiras de decisão | *Self-training*, *Label Propagation* |
| **Por Reforço (*RL*)** | Interação agente-ambiente com **recompensas/punições** | Aprender uma **política `π(s)`** que maximize a recompensa acumulada futura | *Q-Learning*, SARSA, DQN, PPO |

### 5.2 Principais Algoritmos Supervisionados e Não Supervisionados

* **Árvores de Decisão (ID3, C4.5, CART):** particionam o espaço de atributos selecionando os atributos de maior **Ganho de Informação** (redução de Entropia) ou menor **Impureza de Gini**. São altamente interpretáveis, mas propensas a *overfitting* sem poda.
* **Comitês (*Ensembles*) — Bagging vs. Boosting:**
  * ***Bagging* (ex.: *Random Forest*):** treina múltiplas árvores em paralelo com amostras *bootstrap* e agrega por votação/média, **reduzindo variância**.
  * ***Boosting* (ex.: AdaBoost, XGBoost, LightGBM):** treina modelos sequencialmente, onde cada novo modelo foca nos erros dos anteriores, **reduzindo viés**.
* ***k*-NN (*k-Nearest Neighbors*):** aprendizado baseado em instâncias (*lazy learning* — sem fase de treino explícita); classifica um ponto pela maioria dos `k` vizinhos mais próximos (exige normalização de escalas).
* **SVM (*Support Vector Machines*):** busca o hiperplano que maximiza a **margem** entre classes; usa o **truque do kernel** (*kernel trick*) para separar dados não lineares em dimensões superiores.
* **Naive Bayes:** classificador probabilístico baseado no Teorema de Bayes assumindo **independência condicional** entre os atributos dada a classe. Rápido e eficaz em filtragem de spam/texto.
* ***k*-Means:** particiona os dados em `k` grupos minimizando a distância quadrática aos **centroides**. Exige definir `k` a priori (ex.: Método do Cotovelo) e é sensível a *outliers* e inicialização.

### 5.3 Generalização, *Overfitting*, *Underfitting* e Validação

* ***Underfitting* (Subajuste / Alto Viés):** modelo simples demais que não captura os padrões nem nos dados de treino nem nos de teste.
* ***Overfitting* (Sobreajuste / Alta Variância):** modelo complexo demais que "decora" ruídos do conjunto de treinamento (erro de treino baixíssimo, mas erro alto em dados novos/teste). Combate-se com **mais dados, regularização (L1/L2), poda, *dropout*, *early stopping* e validação cruzada**.
* **Divisão e Validação Cruzada (*k-Fold Cross-Validation*):** nunca avaliar desempenho final no conjunto de treino! Na validação cruzada `k-fold`, os dados são divididos em `k` partições: em `k` rodadas, `k - 1` servem para treino e 1 para validação, reduzindo a dependência da partição escolhida (mantendo um conjunto de **teste** separado para avaliação final).

### 5.4 Métricas de Avaliação de Modelos

Para classificação binária, a **Matriz de Confusão** organiza os resultados em **Verdadeiro Positivo (VP)**, **Falso Positivo (FP)**, **Falso Negativo (FN)** e **Verdadeiro Negativo (VN)**:

| Métrica | Fórmula | Quando Priorizar (Foco ENADE) |
| :--- | :--- | :--- |
| **Acurácia** | `(VP + VN) / (VP + VN + FP + FN)` | Apenas quando classes são **balanceadas**. (Enganosa em bases desbalanceadas, ex.: 99% negativos!) |
| **Precisão (*Precision*)** | `VP / (VP + FP)` | Quando **Falso Positivo** é caro (ex.: filtro de spam marcando e-mail importante, bloqueio indevido de cartão). |
| **Revocação / Sensibilidade (*Recall*)** | `VP / (VP + FN)` | Quando **Falso Negativo** é crítico/fatal (ex.: triagem de câncer, detecção de fraude grave ou ataque cibernético). |
| **F1-Score** | `2 × (Precisão × Recall) / (Precisão + Recall)` | Média harmônica entre Precisão e Recall; ideal para **classes desbalanceadas**. |
| **Especificidade** | `VN / (VN + FP)` | Taxa de acerto sobre a classe negativa real. |

* **Curva ROC e AUC:** relaciona Taxa de Verdadeiros Positivos (*Recall*) contra Taxa de Falsos Positivos (`FP / (FP + VN)`) variando o limiar de decisão. Quanto maior a **AUC** (próxima de `1,0`), melhor a capacidade discriminativa do classificador (`0,5` equivale a chute aleatório).
* **Métricas de Regressão:** **MAE** (Erro Absoluto Médio), **MSE** (Erro Quadrático Médio — penaliza erros grandes), **RMSE** (Raiz do MSE, na mesma unidade da variável alvo) e **$R^2$** (Coeficiente de Determinação).

---

## Módulo 6: Redes Neurais Artificiais, Deep Learning e IA Generativa

### 6.1 Do Perceptron às Redes Multicamadas (MLP)

* **Perceptron (Rosenblatt):** neurônio artificial que calcula a soma ponderada das entradas mais um viés (`z = Σ w_i*x_i + b`) e aplica uma função degrau. **Limitação clássica:** só resolve problemas **linearmente separáveis** (falha na porta lógica **XOR**).
* **MLP (*Multilayer Perceptron*):** adiciona **camadas ocultas** e **funções de ativação não lineares**, permitindo aproximar qualquer função contínua (Teorema da Aproximação Universal) e resolver problemas não lineares como XOR.
* **Funções de Ativação Comuns:**
  * **Sigmoide:** saída em `(0, 1)`; usada em classificação binária na saída (sofre de desvanecimento do gradiente em camadas profundas).
  * **Tanh:** saída em `(-1, 1)`, centrada em zero.
  * **ReLU (`max(0, z)`):** padrão em camadas ocultas profundas pela eficiência computacional e mitigação do desvanecimento do gradiente.
  * **Softmax:** camada de saída para classificação multiclasse (converte *logits* em distribuição de probabilidades que soma `1`).
* **Treinamento via *Backpropagation* e Gradiente Descendente:**
  1. *Forward pass*: calcula predições e a **função de perda (*loss*)**.
  2. *Backward pass*: aplica a regra da cadeia para propagar o erro da saída até as camadas iniciais, obtendo o gradiente da perda em relação a cada peso.
  3. Atualização dos pesos na direção oposta ao gradiente multiplicado pela **taxa de aprendizado `η`** (`w <- w - η * ∂L/∂w`).

### 6.2 Arquiteturas de Deep Learning e IA Generativa

| Arquitetura | Especialidade / Domínio | Mecanismo-Chave |
| :--- | :--- | :--- |
| **CNN (*Convolutional Neural Networks*)** | Visão computacional, imagens, vídeos | Camadas convolucionais (filtros locais com compartilhamento de pesos) + *Pooling* (redução espacial). |
| **RNN / LSTM / GRU** | Dados sequenciais, séries temporais, texto | Conexões recorrentes (memória temporal); **LSTM/GRU** usam portões (*gates*) para evitar perda de contexto longo. |
| **Transformers** | PLN moderno, modelos fundacionais, multimodalidade | Mecanismo de **Autoatenção (*Self-Attention*)**: processa tokens em paralelo capturando dependências de longo alcance. |
| **LLMs e RAG** | Geração de texto, código e assistentes corporativos | Grandes Modelos de Linguagem pré-treinados; **RAG (*Retrieval-Augmented Generation*)** injeta documentos externos confiáveis no contexto para reduzir **alucinações** e atualizar conhecimento sem retreinar o modelo. |

---

## Módulo 7: Ética, Explicabilidade (XAI) e Governança em IA

No ENADE atual, questões técnicas de IA frequentemente conectam modelos a **impactos sociais, conformidade legal e riscos éticos**:

### 7.1 Principais Desafios Éticos e Técnicos

1. **Viés Algorítmico (*Bias*) e Equidade (*Fairness*):** modelos treinados com dados históricos enviesados reproduzem e amplificam discriminações (raça, gênero, CEP, idade) em decisões de crédito, recrutamento ou segurança pública. Exige auditoria de dados, balanceamento e métricas de equidade.
2. **Transparência e Explicabilidade (XAI — *Explainable AI*):** modelos "caixa-preta" (*black-box*), como redes profundas e comitês complexos, têm alta acurácia mas baixa interpretabilidade. Técnicas como **LIME** e **SHAP** ajudam a explicar quais atributos pesaram em cada decisão (ex.: por que um empréstimo foi negado).
3. **Privacidade e Proteção de Dados (LGPD — Lei nº 13.709/2018):** exige base legal, minimização de dados, consentimento, segurança contra ataques de inferência/inversão de modelo e **direito à revisão de decisões automatizadas** (Art. 20 da LGPD).
4. **Alucinações, Desinformação e Propriedade Intelectual:** em IA Generativa, modelos podem fabricar fatos plausíveis porém falsos (*hallucinations*) ou gerar *deepfakes*, exigindo validação humana (*human-in-the-loop*), marcas d'água e governança.
5. **Responsabilidade (*Accountability*) e Sustentabilidade:** definição clara de quem responde por falhas de sistemas autônomos e atenção ao alto consumo energético/hídrico no treinamento de grandes modelos.

### 7.2 Marcos Normativos e Governança de IA

* **EU AI Act (União Europeia):** abordagem baseada em **níveis de risco** (risco inaceitável/proibido, alto risco com auditoria rigorosa, risco limitado e risco mínimo).
* **NIST AI RMF:** framework de gerenciamento de riscos de IA focado em *Govern, Map, Measure, Manage*.
* **ISO/IEC 42001:** primeira norma internacional para **Sistema de Gestão de Inteligência Artificial (AIMS)**, integrável a frameworks como **COBIT 2019** e **CMMI AIM**.

---

## Módulo 8: Resumo Estratégico e Checklist de Revisão ENADE

### Checklist de Ouro para a Prova

1. **Agentes e PEAS:** Reativo simples não tem memória (falha em ambiente parcialmente observável); baseado em modelo guarda estado interno; baseado em utilidade resolve conflitos de trade-off.
2. **Busca Cega:** **BFS** é completa e ótima (custo unitário), mas gasta memória exponencial `O(b^d)`. **DFS** gasta memória linear `O(b*m)`, mas não é completa nem ótima. **IDS (Aprofundamento Iterativo)** une completude/otimalidade da BFS com economia de memória da DFS.
3. **A\* e Admissibilidade:** `f(n) = g(n) + h(n)`. Para garantir otimalidade, `h(n)` **jamais pode superestimar** o custo real (`h(n) <= h*(n)`). Busca Gulosa usa só `h(n)` e não garante caminho ótimo.
4. **Minimax e Poda Alfa-Beta:** A poda Alfa-Beta **nunca altera o valor final escolhido pelo Minimax**; apenas corta ramos irrelevantes quando `α >= β`.
5. **Supervisionado vs. Não Supervisionado:** Tem rótulo de saída `y`? É supervisionado (classificação se `y` é categoria; regressão se `y` é número contínuo). Não tem rótulo? É não supervisionado (ex.: *k*-Means para agrupamento, PCA para redução de dimensão).
6. **Métricas em Bases Desbalanceadas:** Nunca confie apenas na **Acurácia** quando uma classe é rara (ex.: 98% normal, 2% fraude). Avalie **Recall** (não perder positivos reais), **Precisão** (evitar falsos alarmes) e **F1-Score**.
7. **Overfitting:** Erro muito baixo no treino e alto no teste = *overfitting* (alta variância). Soluções: regularização, mais dados, reduzir complexidade do modelo, validação cruzada.
8. **Ética e LGPD:** Viés vem frequentemente dos dados de treinamento; modelos caixa-preta demandam **XAI**; a **LGPD** garante ao titular explicação e revisão de decisões automatizadas.
