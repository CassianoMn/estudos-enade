# Matemática Discreta

> **Foco ENADE:** Na área de Matemática Discreta, o ENADE avalia a capacidade de modelar e resolver problemas computacionais utilizando conjuntos e Princípio da Inclusão-Exclusão, relações e funções, demonstrações por indução matemática, técnicas de contagem e probabilidade discreta, divisibilidade, aritmética modular e equações diofantinas, além de conceitos estruturais da Teoria dos Grafos (vértices, arestas, adjacência, incidência e grau/valência).

---

## Módulo 1: Teoria dos Conjuntos e Princípio da Inclusão-Exclusão

### 1.1 Conceitos Básicos e Operações sobre Conjuntos

Um **conjunto** é uma coleção não ordenada de elementos distintos. Denota-se pertinência por `x ∈ A` e inclusão por `A ⊆ B` ("`A` é subconjunto de `B`", ou seja, `∀x (x ∈ A → x ∈ B)`).

* **Conjunto Vazio (`∅` ou `{}`):** Não possui elementos; é subconjunto de qualquer conjunto (`∅ ⊆ A`).
* **Conjunto das Partes (`P(A)`):** Conjunto de todos os subconjuntos de `A`. Se `|A| = n`, então **`|P(A)| = 2ⁿ`**.
* **Produto Cartesiano (`A × B`):** Conjunto de todos os pares ordenados `(a, b)` tais que `a ∈ A` e `b ∈ B`. Sua cardinalidade é `|A × B| = |A| · |B|`.

| Operação | Notação | Definição Formal |
| :--- | :---: | :--- |
| **União** | `A ∪ B` | `{ x ∈ U ∣ x ∈ A ou x ∈ B }` |
| **Interseção** | `A ∩ B` | `{ x ∈ U ∣ x ∈ A e x ∈ B }` |
| **Diferença** | `A − B` (ou `A \ B`) | `{ x ∈ U ∣ x ∈ A e x ∉ B }` |
| **Diferença Simétrica** | `A △ B` | `(A − B) ∪ (B − A) = (A ∪ B) − (A ∩ B)` |
| **Complementar** | `Aᶜ` (ou `Ā`) | `U − A = { x ∈ U ∣ x ∉ A }` |

**Leis de De Morgan para Conjuntos:**
* `(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ`
* `(A ∩ B)ᶜ = Aᶜ ∪ Bᶜ`

### 1.2 Princípio da Inclusão-Exclusão

Para evitar contagem duplicada de elementos pertencentes a interseções, utiliza-se o **Princípio da Inclusão-Exclusão**:

* **Para 2 conjuntos:**
  `|A ∪ B| = |A| + |B| − |A ∩ B|`
* **Para 3 conjuntos:**
  `|A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B| − |A ∩ C| − |B ∩ C| + |A ∩ B ∩ C|`

#### Exemplo Resolvido (Exercício 6 de `MD_exercicio_enade.pdf`)

Em uma pesquisa com 60 pessoas: 25 leem *Veja* (`V`), 26 leem *IstoÉ* (`I`), 26 leem *Exame* (`E`), 9 leem *Veja* e *Exame*, 11 leem *Veja* e *IstoÉ*, 8 leem *IstoÉ* e *Exame*, e 3 leem as três revistas.

Preenchendo o diagrama de Venn **da interseção central para as extremidades**:
1. As três (`V ∩ I ∩ E`): `3`
2. Apenas duas:
   * Apenas `V` e `E`: `9 − 3 = 6`
   * Apenas `V` e `I`: `11 − 3 = 8`
   * Apenas `I` e `E`: `8 − 3 = 5`
3. Apenas uma:
   * Apenas *Veja*: `25 − (8 + 3 + 6) = 8`
   * Apenas *IstoÉ*: `26 − (8 + 3 + 5) = 10`
   * Apenas *Exame*: `26 − (6 + 3 + 5) = 12`
4. Resultados:
   * **Pelo menos uma revista:** `25 + 26 + 26 − 9 − 11 − 8 + 3 = 52` pessoas.
   * **Apenas uma revista:** `8 + 10 + 12 = 30` pessoas.
   * **Nenhuma revista:** `60 − 52 = 8` pessoas.

---

## Módulo 2: Relações Binárias, Matrizes e Funções

### 2.1 Relações Binárias e Representação Matricial

Uma **relação binária `R` de `A` em `B`** é qualquer subconjunto do produto cartesiano: `R ⊆ A × B`. Quando `(a, b) ∈ R`, escreve-se `a R b`.

**Representação na forma de matriz (`M_R`):** Sendo `A = {a₁, ..., aₘ}` e `B = {b₁, ..., bₙ}`, a matriz booleana `M_R` de ordem `m × n` tem entradas:
* `mᵢⱼ = 1`, se `(aᵢ, bⱼ) ∈ R`
* `mᵢⱼ = 0`, se `(aᵢ, bⱼ) ∉ R`

### 2.2 Propriedades de Relações em um Conjunto (`R ⊆ A × A`)

| Propriedade | Condição Formal (`∀x, y, z ∈ A`) | Característica na Matriz `M_R` |
| :--- | :--- | :--- |
| **Reflexiva** | `(x, x) ∈ R` | Diagonal principal toda igual a `1` |
| **Irreflexiva** | `(x, x) ∉ R` | Diagonal principal toda igual a `0` |
| **Simétrica** | `(x, y) ∈ R → (y, x) ∈ R` | Matriz simétrica (`M_R = M_Rᵀ`) |
| **Antissimétrica** | `(x, y) ∈ R ∧ (y, x) ∈ R → x = y` | Se `mᵢⱼ = 1` (`i ≠ j`), então `mⱼᵢ = 0` |
| **Transitiva** | `(x, y) ∈ R ∧ (y, z) ∈ R → (x, z) ∈ R` | `M_R² ≤ M_R` (produto booleano) |

* **Relação de Equivalência:** Reflexiva, **simétrica** e transitiva. Particiona `A` em classes de equivalência disjuntas (ex.: congruência módulo `m`).
* **Relação de Ordem Parcial:** Reflexiva, **antissimétrica** e transitiva (ex.: divisibilidade `a | b` em `ℕ⁺` ou inclusão `⊆` em `P(A)`).

### 2.3 Funções: Injetora, Sobrejetora e Bijetora

Uma relação `f ⊆ A × B` é uma **função** (`f: A → B`) se e somente se **todo** elemento `x ∈ A` (domínio) está associado a **exatamente um** elemento `y ∈ B` (contradomínio):
1. **Existência:** Para todo `x ∈ A`, existe `y ∈ B` com `(x, y) ∈ f` (na matriz, toda linha tem ao menos um `1`).
2. **Unicidade:** Se `(x, y₁) ∈ f` e `(x, y₂) ∈ f`, então `y₁ = y₂` (na matriz, cada linha tem **exatamente um** `1`).

| Classificação | Definição Formal | Significado Prático |
| :--- | :--- | :--- |
| **Injetora (1-para-1)** | `f(x₁) = f(x₂) → x₁ = x₂` | Elementos distintos do domínio têm imagens distintas |
| **Sobrejetora** | `∀y ∈ B, ∃x ∈ A tal que f(x) = y` | O conjunto imagem coincide com o contradomínio (`Im(f) = B`) |
| **Bijetora** | Injetora **e** sobrejetora | Correspondência biunívoca; possui função inversa `f⁻¹: B → A` |

---

## Módulo 3: Indução Matemática e Recorrências

### 3.1 Princípio da Indução Matemática (Indução Fraca)

O **Princípio da Indução Matemática** permite provar que uma propriedade `P(n)` vale para todo número natural `n ≥ n₀`:

1. **Caso Base:** Verifica-se que `P(n₀)` é verdadeira.
2. **Hipótese de Indução (HI):** Supõe-se que `P(k)` seja verdadeira para um inteiro arbitrário `k ≥ n₀`.
3. **Passo Indutivo:** Demonstra-se, utilizando a HI, que `P(k + 1)` também é verdadeira.

#### Exemplo Resolvido: Soma dos `n` Primeiros Ímpares

Provar que `1 + 3 + 5 + ... + (2n − 1) = n²` para todo `n ≥ 1`:
* **Base (`n = 1`):** `2(1) − 1 = 1 = 1²` (Verdadeiro).
* **HI:** Assuma para `n = k` que `1 + 3 + ... + (2k − 1) = k²`.
* **Passo Indutivo (`n = k + 1`):**
  `[1 + 3 + ... + (2k − 1)] + (2(k + 1) − 1) = k² + (2k + 1) = (k + 1)²`.
  Logo, a fórmula é válida para todo `n ≥ 1`.

### 3.2 Indução Forte e Relações de Recorrência

Na **Indução Forte**, a Hipótese de Indução assume que `P(n₀), P(n₀ + 1), ..., P(k)` são **todas** verdadeiras para provar `P(k + 1)`. Ela é especialmente útil na análise de algoritmos recursivos (como *Merge Sort*, Busca Binária e sequência de Fibonacci) e na prova do Teorema Fundamental da Aritmética.

**Exemplo de Recorrência em Algoritmos:** A busca binária em vetor de tamanho `n` satisfaz `T(n) = T(⌊n/2⌋) + c`, com `T(1) = d`. Por indução forte, prova-se que `T(n) = O(log₂ n)`. Já uma torre de Hanói com `n` discos satisfaz `H(n) = 2·H(n − 1) + 1`, com `H(1) = 1`, cuja solução fechada é **`H(n) = 2ⁿ − 1`**.

---

## Módulo 4: Análise Combinatória e Probabilidade Discreta

### 4.1 Princípios de Contagem e Agrupamentos

* **Princípio Aditivo:** Se dois eventos `A` e `B` são mutuamente exclusivos, o total de escolhas de `A` ou `B` é `|A| + |B|`.
* **Princípio Multiplicativo (PFC):** Se uma decisão se compõe de `k` etapas sucessivas com `n₁, n₂, ..., nₖ` opções independentes, o total de escolhas é `n₁ · n₂ · ... · nₖ`.
* **Princípio da Casa dos Pombos (Dirichlet):** Se `n + 1` objetos são distribuídos em `n` caixas, ao menos uma caixa conterá `2` ou mais objetos. De forma geral, distribuindo `N` objetos em `k` caixas, ao menos uma caixa terá pelo menos `⌈N/k⌉` objetos.

| Agrupamento | A ordem importa? | Elementos podem repetir? | Fórmula |
| :--- | :---: | :---: | :--- |
| **Permutação Simples** | Sim (todos os `n`) | Não | `Pₙ = n!` |
| **Permutação com Repetição** | Sim (todos os `n`) | Sim (`n₁, ..., nₖ` repetições) | `Pₙ^(n₁,...,nₖ) = n! / (n₁! · ... · nₖ!)` |
| **Arranjo Simples** | Sim (`p` de `n`) | Não | `A(n, p) = n! / (n − p)!` |
| **Combinação Simples** | **Não** (`p` de `n`) | Não | `C(n, p) = n! / [p! · (n − p)!]` |
| **Combinação com Repetição** | **Não** (`p` de `n`) | Sim | `CR(n, p) = C(n + p − 1, p)` |

### 4.2 Probabilidade Discreta e Tabelas de Contingência

Em um espaço amostral finito e equiprovável `Ω`, a probabilidade de um evento `E ⊆ Ω` é:

`P(E) = |E| / |Ω|`

* **Complementar:** `P(Eᶜ) = 1 − P(E)`
* **União:** `P(A ∪ B) = P(A) + P(B) − P(A ∩ B)`
* **Probabilidade Condicional:** `P(A | B) = P(A ∩ B) / P(B)`, para `P(B) > 0`.
* **Eventos Independentes:** `P(A ∩ B) = P(A) · P(B)`.

#### Conexão ENADE (2014 — Questão 11 e 2017 — Questão 24)

No ENADE, probabilidade discreta frequentemente aparece em **tabelas de contingência** (cruzamento de categorias) ou em medidas de tendência central sobre distribuições de frequência discretas:
* Na tabela de erros do ENADE 2014 (total de `180` erros): operadores com `< 2 anos` cometeram `90` erros e com `2 a 4 anos` cometeram `30` erros. A probabilidade de um erro ter sido cometido por operador com `4 anos ou menos` é `(90 + 30) / 180 = 120 / 180 = 2/3 ≈ 66,7%` (`67%`).
* Em distribuições de frequência discreta (ENADE 2017 Q24), lembre-se de ponderar pelas frequências absolutas `fᵢ` ao calcular média, identificar a posição central para a mediana e os quartis (`Q₁` em 25%), e identificar a moda como o(s) valor(es) de maior frequência absoluta.

---

## Módulo 5: Divisibilidade, MDC, MMC e Aritmética Modular

### 5.1 Divisibilidade, MDC, MMC e Algoritmo de Euclides

Dados `a, b ∈ ℤ` com `a ≠ 0`, diz-se que `a` divide `b` (`a | b`) se existe `q ∈ ℤ` tal que `b = a · q`.

* **Algoritmo da Divisão:** Para quaisquer `a ∈ ℤ` e `b ∈ ℤ⁺`, existem únicos inteiros `q` (quociente) e `r` (resto) tais que `a = b · q + r`, com `0 ≤ r < b`.
* **MDC e MMC:**
  * O **Máximo Divisor Comum (`mdc(a, b)`)** é obtido eficientemente pelo **Algoritmo de Euclides**, aplicando divisões sucessivas até obter resto zero: `mdc(a, b) = mdc(b, a mod b)`.
  * Dois números são **primos entre si (coprimos)** quando `mdc(a, b) = 1`.
  * Relação fundamental: **`mdc(a, b) · mmc(a, b) = |a · b|`**.

### 5.2 Identidade de Bézout e Algoritmo de Euclides Estendido

Pelo **Teorema de Bézout**, para quaisquer inteiros `a` e `b` (não ambos nulos), existem inteiros `x` e `y` tais que:

`mdc(a, b) = a·x + b·y`

O **Algoritmo de Euclides Estendido** encontra `x` e `y` fazendo a substituição reversa dos restos obtidos nas divisões sucessivas.

### 5.3 Equações Diofantinas Lineares

Uma equação da forma **`a·x + b·y = c`**, com `a, b, c ∈ ℤ` e incógnitas inteiras `x, y ∈ ℤ`, possui solução inteira **se e somente se `d = mdc(a, b)` divide `c` (`d | c`)**.

Caso `(x₀, y₀)` seja uma solução particular, **todas** as soluções inteiras são dadas por:
* `x = x₀ + (b / d) · t`
* `y = y₀ − (a / d) · t`, para todo `t ∈ ℤ`.

### 5.4 Aritmética Modular e Congruências

Dados `a, b ∈ ℤ` e `m ∈ ℤ⁺` (`m ≥ 2`), diz-se que `a` é **congruente a `b` módulo `m`** (`a ≡ b (mod m)`) se `m` divide `(a − b)`, isto é, `a` e `b` deixam o mesmo resto quando divididos por `m`.

**Propriedades:** Se `a ≡ b (mod m)` e `c ≡ d (mod m)`, então:
1. `a + c ≡ b + d (mod m)`
2. `a · c ≡ b · d (mod m)`
3. `aᵏ ≡ bᵏ (mod m)` para todo `k ∈ ℕ`.

---

## Módulo 6: Teoria dos Grafos

### 6.1 Definições Fundamentais e Terminologia (Foco ENADE 2017 Q19)

Um **grafo** `G = (V, E)` é composto por um conjunto não vazio de **vértices** (nós) `V` e um conjunto de **arestas** `E` que conectam pares de vértices:

* **Grafo Não Direcionado:** Cada aresta é um par **não ordenado** `{u, v}` (ou `uv`).
* **Grafo Direcionado (Dígrafo):** Cada aresta (arco) é um par **ordenado** `(u, v)`, indicando direção de `u` para `v`.
* **Adjacência e Incidência (atenção à nomenclatura oficial!):**
  * Dois vértices `u` e `v` são **adjacentes** se existe uma aresta ligando `u` a `v`.
  * Uma aresta `e = {u, v}` é **incidente** aos vértices `u` e `v` (e os vértices `u` e `v` são extremos da aresta `e`; no uso informal/ENADE, diz-se que um vértice e uma aresta ou vértices ligados por uma aresta têm relação de incidência — lembre que no ENADE 2017 Q19 a banca considerou correta "Rio de Janeiro é incidente em São Paulo e Porto Alegre", diferenciando de "São Paulo é adjacente a Porto Alegre", que era falsa por não haver aresta direta entre eles!).
* **Grau ou Valência (`deg(v)` ou `g(v)`):** Número de arestas incidentes ao vértice `v` (laços contam duas vezes). Um vértice de grau `0` é isolado; de grau `1`, é folha (ou pendente).

**Teorema do Aperto de Mãos:** Em qualquer grafo não direcionado `G = (V, E)`:

`∑_{v ∈ V} deg(v) = 2 · |E|`

*Corolário:* Todo grafo possui uma quantidade **par** de vértices de grau ímpar.

### 6.2 Representações Computacionais de Grafos

| Representação | Espaço | Verificar se `(u, v) ∈ E` | Percorrer vizinhos de `u` | Melhor para |
| :--- | :---: | :---: | :---: | :--- |
| **Matriz de Adjacência** (`\|V\| × \|V\|`) | `O(\|V\|²)` | `O(1)` | `O(\|V\|)` | Grafos **densos** (`\|E\| ≈ \|V\|²`) |
| **Lista de Adjacência** | `O(\|V\| + \|E\|)` | `O(deg(u))` | `O(deg(u))` | Grafos **esparsos** (`\|E\| ≪ \|V\|²`) |

### 6.3 Caminhos, Conectividade, Árvores e Grafos Especiais

* **Caminho e Ciclo:** Um caminho é uma sequência de vértices conectados por arestas; um **ciclo** é um caminho fechado sem repetição de arestas (e sem repetir vértices intermediários).
* **Grafo Conexo:** Existe caminho entre qualquer par de vértices.
* **Grafo Completo (`Kₙ`):** Todo par de vértices distintos é adjacente; possui `n(n − 1)/2` arestas e todo vértice tem grau `n − 1`.
* **Árvore:** Grafo conexo e **acíclico**. Toda árvore com `n` vértices possui exatamente **`n − 1` arestas**.
* **Grafo Bipartido:** Seus vértices podem ser particionados em `V₁` e `V₂` de modo que toda aresta liga um vértice de `V₁` a um de `V₂` (equivalente a não possuir ciclos de comprimento ímpar).
* **Caminho/Ciclo Euleriano:** Percorre **todas as arestas** exatamente uma vez. Um grafo conexo admite ciclo euleriano se e somente se **todos** os vértices tiverem grau par (e caminho euleriano aberto se tiver exatamente `2` vértices de grau ímpar).
* **Caminho/Ciclo Hamiltoniano:** Visita **todos os vértices** exatamente uma vez (problema NP-completo em grafos gerais).

---

## Módulo 7: Caderno de Exercícios Comentados (`MD_exercicio_enade.pdf`)

Abaixo estão resoluções passo a passo dos 10 exercícios da lista oficial de Matemática Discreta:

### Exercício 1 — Luzes Piscando Juntas (MMC)
> *Enunciado:* Duas luzes piscam automaticamente: a primeira a cada 18 segundos e a segunda a cada 30 segundos. Após quanto tempo voltarão a piscar juntas?

**Resolução:** O reencontro ocorre no menor múltiplo comum dos períodos:
* Fatoração: `18 = 2¹ · 3²` e `30 = 2¹ · 3¹ · 5¹`.
* `mmc(18, 30) = 2¹ · 3² · 5¹ = 2 · 9 · 5 = 90` segundos.
* **Resposta:** Após **90 segundos** (1 minuto e 30 segundos).

---

### Exercício 2 — Produção de Meias (Equação Diofantina)
> *Enunciado:* Uma fábrica produz meias infantis (35g) e adultas (48g). Em um lote foram produzidos 1001g de meias. Quantas meias de cada modelo foram fabricadas?

**Resolução:** Sejam `x` (infantis) e `y` (adultas) inteiros não negativos (`x, y ≥ 0`): `35x + 48y = 1001`.
1. Calculamos `mdc(48, 35)` por Euclides: `48 = 1·35 + 13`; `35 = 2·13 + 9`; `13 = 1·9 + 4`; `9 = 2·4 + 1` → `mdc = 1` (existe solução).
2. Substituição reversa: `1 = 9 − 2·4 = 9 − 2·(13 − 9) = 3·9 − 2·13 = 3·(35 − 2·13) − 2·13 = 3·35 − 8·13 = 3·35 − 8·(48 − 35) = 11·35 − 8·48`.
3. Multiplicando por `1001`: `x' = 11011`, `y' = −8008`.
4. Solução geral: `x = 11011 − 48t`, `y = −8008 + 35t`.
5. Impondo `x ≥ 0` e `y ≥ 0`:
   * `11011 − 48t ≥ 0 ⇒ t ≤ 229,39`
   * `−8008 + 35t ≥ 0 ⇒ t ≥ 228,8`
   * Único inteiro no intervalo: **`t = 229`**.
6. Substituindo `t = 229`: `x = 11011 − 48·229 = 19` e `y = −8008 + 35·229 = 7`. Conferência: `35·19 + 48·7 = 665 + 336 = 1001`.
* **Resposta:** **19 meias infantis** e **7 meias adultas** (solução única).

---

### Exercício 3 — Relação, Matriz e Função
> *Enunciado:* Dados `A = {a, b, c}` e `B = {1, 2, 3, 4}`, com associação `a → 1, b → 2, c → 3`, a relação `R ⊆ A × B` é definida por `x R y ⇔` o valor associado a `x` é múltiplo de `y`. (I) Escreva os pares ordenados; (II) Represente na forma de matriz; (III) Verifique se é função.

**Resolução:**
* **I. Pares ordenados:**
  * Para `a` (valor `1`): `1` é múltiplo apenas de `1` → `(a, 1)`
  * Para `b` (valor `2`): `2` é múltiplo de `1` e `2` → `(b, 1), (b, 2)`
  * Para `c` (valor `3`): `3` é múltiplo de `1` e `3` → `(c, 1), (c, 3)`
  * Logo, `R = {(a, 1), (b, 1), (b, 2), (c, 1), (c, 3)}`.
* **II. Matriz da relação `M_R` (linhas `a, b, c`; colunas `1, 2, 3, 4`):**

| `R` | `1` | `2` | `3` | `4` |
| :---: | :---: | :---: | :---: | :---: |
| **`a`** | `1` | `0` | `0` | `0` |
| **`b`** | `1` | `1` | `0` | `0` |
| **`c`** | `1` | `0` | `1` | `0` |

* **III. Verificação se é função:** **Não é função**, pois os elementos `b` e `c` do domínio `A` possuem **mais de uma imagem** em `B` (`(b, 1)` e `(b, 2)`; `(c, 1)` e `(c, 3)`), violando o critério de unicidade. *(Nota: mesmo sob a leitura inversa "`y` é múltiplo do valor associado a `x`", `R` seria `{(a,1), (a,2), (a,3), (a,4), (b,2), (b,4), (c,3)}`, o que tampouco seria função pelos mesmos motivos.)*

---

### Exercício 4 — Bomboniere (Múltiplas Soluções Diofantinas)
> *Enunciado:* Uma bomboniere vende barra de chocolate por R\$ 8,00 e balas avulsas por R\$ 3,00. Arrecadação final: R\$ 200,00. Quantas barras e balas foram vendidas?

**Resolução:** Equação `8x + 3y = 200`, com `x, y ≥ 0` inteiros.
* `mdc(8, 3) = 1`. Como `8·(−1) + 3·3 = 1`, multiplicando por `200` obtemos solução particular `x₀ = −200, y₀ = 600`.
* Solução geral: `x = −200 + 3t`, `y = 600 − 8t`.
* Para `x ≥ 0` e `y ≥ 0`: `66,67 ≤ t ≤ 75`, ou seja, `t ∈ {67, 68, 69, 70, 71, 72, 73, 74, 75}`.
* **Resposta:** Existem **9 soluções possíveis** `(x barras, y balas)`: `(1, 64)`, `(4, 56)`, `(7, 48)`, `(10, 40)`, `(13, 32)`, `(16, 24)`, `(19, 16)`, `(22, 8)` e `(25, 0)`.

---

### Exercícios 5 e 8 — Aniversário em `170` Dias (Aritmética Modular)
> *Enunciado:* O aniversário acontecerá daqui a 170 dias. Sabendo que hoje é quinta-feira, qual o dia da semana do aniversário?

**Resolução:** Como a semana possui ciclo de `7` dias, calculamos `170 mod 7`:
* `170 = 7 · 24 + 2`, logo `170 ≡ 2 (mod 7)`.
* Avançando `2` dias a partir de quinta-feira: sexta-feira (+1), **sábado (+2)**.
* **Resposta:** **Sábado**. *(Nota: na lista original, o exercício 8 repete exatamente este mesmo enunciado.)*

---

### Exercício 6 — Pesquisa com Revistas
> *Resolvido integralmente no Módulo 1 (Seção 1.2).* Resumo: (a) **52** leem pelo menos uma; (b) **30** leem apenas uma; (c) **8** não leem nenhuma; (d) Apenas Veja: **8**, apenas IstoÉ: **10**, apenas Exame: **12**.

---

### Exercício 7 — Identidade de Bézout (`a = 540`, `b = 168`)
> *Enunciado:* Determine `x` e `y` tais que `d = ax + by`, onde `d = mdc(540, 168)`.

**Resolução:** Aplicando o Algoritmo de Euclides:
1. `540 = 3 · 168 + 36` → `36 = 540 − 3 · 168`
2. `168 = 4 · 36 + 24` → `24 = 168 − 4 · 36`
3. `36 = 1 · 24 + 12` → `12 = 36 − 1 · 24`
4. `24 = 2 · 12 + 0` → logo **`d = mdc(540, 168) = 12`**.

Substituição reversa:
* `12 = 36 − 1 · (168 − 4 · 36) = 5 · 36 − 1 · 168`
* `12 = 5 · (540 − 3 · 168) − 1 · 168 = 5 · 540 − 16 · 168`

Conferência: `540 · 5 + 168 · (−16) = 2700 − 2688 = 12`.
* **Resposta:** `d = 12`, **`x = 5`** e **`y = −16`** (solução particular principal).

---

### Exercício 9 — Congruência Módulo 13
> *Enunciado:* Ache os números entre `1` e `100`, inclusive, que são congruentes a `6` módulo `13`.

**Resolução:** Buscamos `n ∈ {1, ..., 100}` tal que `n ≡ 6 (mod 13)`, isto é, `n = 13k + 6` para `k ∈ ℤ`:
* `k = 0`: `6`
* `k = 1`: `19`
* `k = 2`: `32`
* `k = 3`: `45`
* `k = 4`: `58`
* `k = 5`: `71`
* `k = 6`: `84`
* `k = 7`: `97`
* (`k = 8` daria `110 > 100`).
* **Resposta:** **`{6, 19, 32, 45, 58, 71, 84, 97}`** (8 números).

---

### Exercício 10 — Entradas para o Teatro
> *Enunciado:* Homens e mulheres gastaram R\$ 1.100,00 em entradas para o teatro. Cada homem gastou R\$ 5,00 e cada mulher R\$ 4,00. Sabe-se que o número de cada gênero não foi inferior a 100 pessoas (`h ≥ 100` e `m ≥ 100`). Quantos homens e mulheres estavam no teatro?

**Resolução:** Equação `5h + 4m = 1100`, com `h ≥ 100`, `m ≥ 100`.
1. `mdc(5, 4) = 1`. Uma solução particular imediata para `5h + 4m = 1100` (tomando `5·1 − 4·1 = 1`) é `h₀ = 1100, m₀ = −1100`, ou observando diretamente `h = 100 ⇒ 500 + 4m = 1100 ⇒ m = 150`.
2. Solução geral a partir de `(100, 150)`:
   `h = 100 + 4k`, `m = 150 − 5k`, `k ∈ ℤ`.
3. Impondo `h ≥ 100` (`k ≥ 0`) e `m ≥ 100` (`150 − 5k ≥ 100 ⇒ k ≤ 10`), temos **`0 ≤ k ≤ 10`** (11 soluções possíveis):

| `k` | Homens (`h`) | Mulheres (`m`) | Total gasto (`5h + 4m`) |
| :---: | :---: | :---: | :---: |
| `0` | `100` | `150` | `500 + 600 = 1100` |
| `1` | `104` | `145` | `520 + 580 = 1100` |
| `2` | `108` | `140` | `540 + 560 = 1100` |
| `3` | `112` | `135` | `560 + 540 = 1100` |
| `4` | `116` | `130` | `580 + 520 = 1100` |
| `5` | `120` | `125` | `600 + 500 = 1100` |
| `6` | `124` | `120` | `620 + 480 = 1100` |
| `7` | `128` | `115` | `640 + 460 = 1100` |
| `8` | `132` | `110` | `660 + 440 = 1100` |
| `9` | `136` | `105` | `680 + 420 = 1100` |
| `10` | `140` | `100` | `700 + 400 = 1100` |

* **Resposta:** Qualquer um dos **11 pares `(h, m)`** listados acima satisfaz integralmente o enunciado.
