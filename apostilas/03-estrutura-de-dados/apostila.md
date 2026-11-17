# Estrutura de Dados e Algoritmos

O estudo de **Estrutura de Dados e Algoritmos** é o alicerce da eficiência computacional: trata de como organizar, armazenar e manipular informações na memória principal para que operações de busca, inserção, remoção, ordenação e percurso sejam executadas com o menor consumo possível de tempo de processamento e de espaço de memória.

> **Foco ENADE:** Nas provas do ENADE, Estrutura de Dados aparece frequentemente conectada a situações-problema reais (análise de arrays/matrizes, escolha do TAD adequado para um requisito de negócio, simulação de algoritmos de ordenação e tabelas hash, implementação de busca binária em questões discursivas e análise de complexidade assintótica pela Notação Big-O). Saber **justificar a escolha** de uma estrutura de dados pelo seu custo de tempo e espaço é tão importante quanto saber codificá-la.

---

## Módulo 1: Análise de Complexidade de Algoritmos e Notação Big-O

Medir a eficiência de um algoritmo contando segundos em um computador específico é impreciso, pois depende de hardware, compilador e carga do sistema. Por isso, utiliza-se a **análise assintótica**, que expressa o número de operações fundamentais executadas em função do tamanho `n` da entrada.

### Casos de Análise e Notação Big-O (`O`)

- **Melhor caso:** configuração de entrada que exige o menor número de operações (ex.: encontrar o elemento já na primeira posição).
- **Caso médio:** comportamento esperado considerando uma distribuição de entradas igualmente prováveis.
- **Pior caso (`O` — Big-O):** limite assintótico **superior** para o tempo de execução (ou espaço) quando `n` cresce. É o critério padrão em engenharia de software e no ENADE por oferecer **garantia máxima de desempenho**.

Formalmente, dizemos que `f(n) = O(g(n))` se existem constantes positivas `c` e `n₀` tais que `f(n) ≤ c · g(n)` para todo `n ≥ n₀`. Na prática, mantemos apenas o termo de maior ordem de crescimento e descartamos constantes multiplicativas (ex.: `3n² + 5n + 10 = O(n²)`).

### Hierarquia de Classes de Complexidade

Em ordem crescente de custo computacional (da mais eficiente para a mais lenta):

1. **`O(1)` — Constante:** independe de `n` (ex.: acesso a um índice de vetor `v[i]`, `empilha`, `desempilha`).
2. **`O(log n)` — Logarítmica:** o problema é reduzido à metade a cada passo (ex.: busca binária em vetor ordenado). Para `n = 1.000.000.000` (1 bilhão), `log₂(10⁹) ≈ 30` comparações!
3. **`O(n)` — Linear:** percorre os `n` elementos proporcionalmente (ex.: busca sequencial, leitura de arquivo linha a linha — ENADE 2014, Q10).
4. **`O(n log n)` — Linearítmica:** típica dos algoritmos eficientes de ordenação por divisão e conquista (ex.: *Merge Sort*, *Quick Sort* no caso médio).
5. **`O(n²)` — Quadrática:** comum em laços aninhados comparando pares de elementos (ex.: *Bubble*, *Selection*, *Insertion Sort*, interseção ingênua de dois arrays).
6. **`O(n³)` — Cúbica:** três laços aninhados (ex.: multiplicação clássica de matrizes).
7. **`O(2ⁿ)` e `O(n!)` — Exponencial / Fatorial (Intratáveis para `n` grande):** tempo explode rapidamente mesmo para entradas pequenas (ex.: força bruta do Caixeiro Viajante ou Fibonacci recursivo sem memorização).

### Impacto Prático do Crescimento Assintótico (1 operação = 1 µs)

| `n` | `O(1)` | `O(log₂ n)` | `O(n)` | `O(n log₂ n)` | `O(n²)` | `O(n³)` | `O(2ⁿ)` |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **100** | 1 µs | ~7 µs | 100 µs | ~0,7 ms | 10 ms | 1 ms (10⁶ µs = 1 s) | ~4 × 10¹⁶ anos |
| **500** | 1 µs | ~9 µs | 500 µs | ~4,5 ms | 250 ms | 125 s (~2,1 min) | Incomputável |
| **1.000** | 1 µs | ~10 µs | 1.000 µs (1 ms) | ~10,0 ms | 1.000 ms (1 s) | 1.000 s (~16,7 min) | Incomputável |
| **1.400** | 1 µs | ~10 µs | 1.400 µs | ~14,6 ms | 1.960 ms (~2 s) | ~2.744 s (~46 min) | Incomputável |

> **Regra prática de prova:** Algoritmos polinomiais (`O(1)` até `O(nᵏ)`) são considerados tratáveis; algoritmos exponenciais (`O(2ⁿ)`) tornam-se inviáveis rapidamente. Para `n = 10.000`, `n² = 100.000.000` operações contra cerca de `133.000` operações em `O(n log₂ n)` — diferença que separa segundos de horas!

---

## Módulo 2: Vetores, Matrizes e Tipos Abstratos de Dados (TADs)

### Vetores (Arranjos Unidimensionais) e Matrizes

Um **vetor (*array*)** armazena uma coleção homogênea de elementos em **posições contíguas de memória**. Graças à aritmética de endereços (`endereço(i) = base + i × tamanho_elemento`), o acesso aleatório a qualquer posição `i` ocorre em tempo **`O(1)`**.

Uma **matriz** é um arranjo multidimensional (geralmente bidimensional, com `linhas` e `colunas`) ideal para representar tabuleiros, imagens, mapas espaciais e grades (como a plantação de café com `y` linhas e `x` colunas cobrada no ENADE 2017, Discursiva 04).

**Exemplo didático — Contagem de ocorrências em matriz e interseção de vetores:**

```c
// Contar espaços vazios (valor 0) em uma matriz M[linhas][colunas] — Complexidade O(linhas * colunas)
int contarFalhas(int M[][100], int linhas, int colunas) {
    int falhas = 0;
    for (int i = 0; i < linhas; i++) {
        for (int j = 0; j < colunas; j++) {
            if (M[i][j] == 0) {
                falhas++;
            }
        }
    }
    return falhas;
}
```

Quando comparamos dois vetores não ordenados `a` (tamanho `m`) e `b` (tamanho `n`) para encontrar elementos comuns (ENADE 2014, Q09), o algoritmo com dois laços aninhados compara `a[i] == b[j]` para `0 ≤ i < m` e `0 ≤ j < n`, resultando em complexidade **`O(m · n)`**.

### Tipos Abstratos de Dados (TADs)

Um **TAD** define um **modelo matemático** composto por um conjunto de dados e pelas **operações permitidas** sobre esses dados, **ocultando os detalhes de implementação** (encapsulamento). Assim, um mesmo TAD (Lista, Pilha ou Fila) pode ser implementado internamente por meio de **arranjos (alocação estática/sequencial)** ou de **apontadores/ponteiros (alocação dinâmica/encadeada)** sem alterar sua interface para o código cliente.

| Critério | Implementação por Arranjos (Estática) | Implementação por Apontadores (Dinâmica) |
| :--- | :--- | :--- |
| **Alocação de memória** | Contígua e de tamanho fixo (`TMax`) | Não contígua; cresce e diminui sob demanda (`malloc`/`free`) |
| **Acesso por índice** | Direto: `O(1)` | Sequencial: `O(n)` (precisa percorrer nós) |
| **Inserção/Remoção no início** | `O(n)` (exige deslocamento de elementos) | `O(1)` (basta ajustar ponteiros) |
| **Uso de memória extra** | Pode desperdiçar espaço pré-alocado não usado | Espaço extra por nó para armazenar ponteiro(s) |

---

## Módulo 3: Listas Lineares, Pilhas e Filas

### 1. TAD Lista Linear

Uma **Lista Linear** é uma sequência de zero ou mais itens `x₁, x₂, ..., xₙ`, cuja propriedade fundamental é a ordem posicional relativa em uma dimensão (`xᵢ` precede `xᵢ₊₁`).

- **Lista Estática (por Arranjos):** mantém os campos `Item[TMax]`, `Primeiro` e `Ultimo` (apontando para a próxima posição livre). Inserir no final é `O(1)`, mas inserir ou remover no início/meio exige **deslocar os itens subsequentes**, custando `O(n)`.
- **Lista Simplesmente Encadeada (por Apontadores):** cada nó (`NodoLista`) armazena `Item` e um ponteiro `Proximo`. O uso de uma **célula cabeça** (nó sentinela apontado por `Primeiro`) simplifica inserções e remoções, eliminando casos especiais quando a lista está vazia.
- **Lista Duplamente Encadeada:** cada nó possui ponteiros `Anterior` e `Proximo`, permitindo caminhamento bidirecional (ex.: itinerários de viagem, histórico avançar/voltar e remoção em `O(1)` dado o ponteiro do nó).
- **Lista Circular:** o campo `Proximo` do último nó aponta de volta para o primeiro nó (ou para a célula cabeça), formando um ciclo contínuo (muito usada em escalonamento *Round-Robin* de sistemas operacionais).

```c
// Inserção no início em Lista Encadeada com Célula Cabeça — O(1)
void insereInicio(TLista *lista, TInfo item) {
    Apontador p = (Apontador) malloc(sizeof(struct NodoLista));
    p->Item = item;
    p->Proximo = lista->Primeiro->Proximo;
    lista->Primeiro->Proximo = p;
    if (p->Proximo == NULL) {
        lista->Ultimo = p;
    }
}
```

### 2. TAD Pilha (*Stack* — LIFO)

Uma **Pilha** é uma lista linear restrita na qual todas as inserções (**Empilha / `push`**) e remoções (**Desempilha / `pop`**) ocorrem em uma única extremidade chamada **Topo**. Segue a política **LIFO (*Last-In, First-Out*)**: o último elemento a entrar é o primeiro a sair (como uma pilha de pratos).

- **Implementação por Arranjos:** usa um cursor `Topo` (iniciado em `-1` ou `0`). `Empilha` faz `Pilha.Item[++Pilha.Topo] = Item` (`O(1)`); `Desempilha` decrementa `Pilha.Topo--` (`O(1)`), **sem nenhum deslocamento**.
- **Implementação por Apontadores:** exatamente como inserir e remover no início após a célula cabeça (`O(1)` para `push` e `pop`).
- **Aplicações clássicas (e de ENADE):** pilha de chamadas de sub-rotinas/recursão, verificação de parênteses balanceados, avaliação de expressões posfixas, botão "Desfazer" e registro cronológico com leitura dos itens mais recentes primeiro (ENADE 2017, Q35).

### 3. TAD Fila (*Queue* — FIFO) e Deque

Uma **Fila** é uma lista linear na qual as inserções (**Enfileira / `enqueue`**) ocorrem no final (`Ultimo`) e as remoções (**Desenfileira / `dequeue`**) ocorrem no início (`Primeiro`). Segue a política **FIFO (*First-In, First-Out*)**: o primeiro que chega é o primeiro a ser atendido.

- **O problema do caminhamento na fila por arranjo:** se avançarmos `Primeiro` e `Ultimo` linearmente, a fila "caminha" até atingir `TMax`, mesmo havendo posições livres no início do vetor.
- **Solução — Fila Circular:** tratamos o vetor como um círculo usando aritmética modular: `pos = (pos + 1) % TMax`, acompanhada de um contador `Total` (ou deixando uma posição vazia) para diferenciar fila cheia de fila vazia. Todas as operações ficam em **`O(1)`**.
- **Implementação por Apontadores:** `enqueue` insere após `Fila.Ultimo` (`O(1)`); `dequeue` remove `Fila.Primeiro->Proximo` (`O(1)`).
- **Deque (*Double-Ended Queue*):** generalização da fila que permite inserções e remoções em **ambas** as extremidades (início e fim).

**Exemplo clássico (Fila vs. Pilha):** dada a sequência de entrada `T, T, G, A, C, T, G, A`:
- Se inserida e removida em uma **Fila (FIFO)**, a saída preserva a ordem: `T, T, G, A, C, T, G, A`.
- Se inserida e removida em uma **Pilha (LIFO)**, a saída é invertida: `A, G, T, C, A, G, T, T`.

---

## Módulo 4: Recursividade e Algoritmos de Busca

### Recursividade

Uma função é **recursiva** quando chama a si mesma para resolver uma instância menor do mesmo problema. Toda recursão válida exige dois componentes:
1. **Caso base (condição de parada):** instância trivial resolvida diretamente sem novas chamadas recursivas.
2. **Passo recursivo:** reduz o problema em direção ao caso base.

Cada chamada recursiva empilha um novo registro de ativação (*stack frame*) na **pilha de execução** da memória; por isso, recursões profundas sem caso base ou com profundidade `O(n)` consomem `O(n)` de espaço em pilha (risco de *Stack Overflow*). A recursividade é a base do paradigma **Divisão e Conquista**, usado em Busca Binária, *Merge Sort*, *Quick Sort* e percursos em árvores.

### Algoritmos de Pesquisa (Busca)

#### 1. Pesquisa Sequencial (Linear)
Percorre os elementos um a um comparando cada chave com o valor procurado. **Não exige** que os dados estejam ordenados.
- **Melhor caso:** `O(1)` (elemento na 1ª posição).
- **Caso médio (chaves equiprováveis presentes):** `(n + 1) / 2` comparações -> `O(n)`.
- **Pior caso:** `O(n)` (última posição ou elemento ausente).
- **Quando usar:** tabelas pequenas ou listas dinâmicas não ordenadas.

#### 2. Pesquisa Binária
Exige que os elementos estejam **previamente ordenados**. A cada passo, calcula-se o índice do meio `m = (inic + fim) / 2` e compara-se `v[m]` com a chave `x`, descartando metade do intervalo restante a cada iteração.

```c
// Busca Binária Iterativa em vetor ordenado v[0..n-1] — Tempo O(log n), Espaço O(1)
int buscaBinariaIterativa(int x, int n, int v[]) {
    int e = 0, d = n - 1;
    while (e <= d) {
        int m = e + (d - e) / 2; // evita overflow de (e + d)
        if (v[m] == x) return m;
        if (v[m] < x)  e = m + 1;
        else           d = m - 1;
    }
    return -1;
}

// Busca Binária Recursiva — Tempo O(log n), Espaço O(log n) na pilha
int buscaBinariaRecursiva(int x, int e, int d, int v[]) {
    if (e > d) return -1;
    int m = e + (d - e) / 2;
    if (v[m] == x) return m;
    if (v[m] < x)  return buscaBinariaRecursiva(x, m + 1, d, v);
    else           return buscaBinariaRecursiva(x, e, m - 1, v);
}
```

- **Complexidade:** Melhor caso `O(1)` (elemento exatamente no meio inicial); Caso médio e Pior caso **`O(log₂ n)`** (aproximadamente `⌊log₂ n⌋ + 1` comparações).
- **Ressalva crítica:** embora a busca seja ultrarrápida, **manter um array ordenado tem custo `O(n)` por inserção ou remoção** (deslocamentos). Por isso, a busca binária em vetor não é recomendada para aplicações muito dinâmicas (com muitas inserções/remoções frequentes), onde se preferem Árvores Balanceadas ou Tabelas Hash (ENADE 2014, Discursiva 03).

---

## Módulo 5: Algoritmos de Ordenação

Ordenar dados é frequentemente um passo preliminar para acelerar buscas e agregações. Abaixo estão os algoritmos clássicos, divididos entre **métodos simples `O(n²)`** e **métodos eficientes `O(n log n)` / subquadráticos**.

### Métodos Simples (`O(n²)`)

1. **Bubble Sort (Método da Bolha):** compara pares adjacentes `v[j]` e `v[j+1]` e troca-os se estiverem fora de ordem, fazendo o maior elemento "flutuar" para o fim a cada passagem.
   - Faz `N · (N - 1) / 2` comparações no pior caso (ex.: para `N = 10`, `45` comparações). Com flag de "houve troca", o melhor caso (vetor já ordenado) cai para `O(n)`.
2. **Selection Sort (Método de Seleção):** a cada posição `i`, percorre o restante do vetor para encontrar o **menor elemento** e realiza apenas **uma troca** com `v[i]`.
   - Sempre executa `N · (N - 1) / 2` comparações (`O(n²)` mesmo se já estiver ordenado!), porém realiza **no máximo `N - 1` trocas (`O(n)` trocas)** — vantajoso quando o custo de movimentar registros grandes na memória supera o de comparar chaves. Não é estável na implementação padrão.
3. **Insertion Sort (Método de Inserção):** mantém uma sublista ordenada à esquerda e insere o próximo elemento (`temp`) na posição correta deslocando os maiores à direita.
   - Muito eficiente para vetores **pequenos ou quase ordenados** (melhor caso `O(n)`), sendo tipicamente ~2× mais rápido que o Bubble Sort em dados aleatórios. É estável e *in-place*.

### Shell Sort

Proposto por Donald L. Shell (1959), aperfeiçoa o *Insertion Sort* permitindo trocas a longa distância por meio de um **incremento `h`** (reduzindo gradualmente o desordenamento global antes da passada final `h = 1`). Utilizando a **sequência de intervalos de Knuth** (`h = 3·h + 1`: `1, 4, 13, 40, 121, 364, ...`, e inversa `h = (h - 1) / 3`), obtém desempenho muito superior aos algoritmos `O(n²)` para vetores médios (tipicamente entre `O(n^(1,25))` e `O(n^(1,5))`).

### Métodos Eficientes (`O(n log n)`)

#### Merge Sort (John von Neumann, 1945)
Baseado em **Divisão e Conquista** e recursão:
1. Divide o vetor em duas metades até restarem subvetores unitários (tamanho 1 — já ordenados).
2. Ordena recursivamente cada metade.
3. **Intercala (*merge*)** duas metades ordenadas em um vetor resultante ordenado.

**Trace completo (exemplo do material):** vetor `[64, 21, 33, 70, 12, 85, 44, 3]`:
- *Divisão:* `[64, 21, 33, 70]` | `[12, 85, 44, 3]` -> `[64, 21] [33, 70]` | `[12, 85] [44, 3]` -> unitários.
- *Intercalação nível 1:* `[21, 64]`, `[33, 70]`, `[12, 85]`, `[3, 44]`.
- *Intercalação nível 2:* `[21, 33, 64, 70]` e `[3, 12, 44, 85]`.
- *Intercalação final:* compara os inícios de cada bloco (`3 < 21`, `12 < 21`, `21 < 44`, `33 < 44`, `44 < 64`, `64 < 85`, `70 < 85`, sobra `85`) -> `[3, 12, 21, 33, 44, 64, 70, 85]`.

- **Garantia:** **`O(n log n)`** no melhor, médio e pior casos; **estável**.
- **Limitação principal:** **não é *in-place*** — exige vetor auxiliar de tamanho `O(n)` na memória!

#### Quick Sort (C. A. R. Hoare)
Também usa **Divisão e Conquista**: escolhe um elemento **pivô**, **particiona** o vetor colocando chaves menores à esquerda do pivô e maiores à direita, e ordena recursivamente as duas partições.
- Na prática, costuma ser o mais rápido em memória por excelente localidade de cache e por ser ***in-place*** (usa apenas `O(log n)` de pilha média).
- **Atenção ao pior caso:** se o pivô escolhido for sempre o menor ou maior elemento (ex.: pivô fixo no primeiro/último elemento em vetor já ordenado), degenera para **`O(n²)`**. Estratégias como pivô aleatório ou mediana de três evitam esse cenário.

### Tabela Comparativa dos Algoritmos de Ordenação

| Algoritmo | Melhor Caso | Caso Médio | Pior Caso | Espaço Auxiliar | Estável? | Observação Chave |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Bubble Sort** | `O(n)`* | `O(n²)` | `O(n²)` | `O(1)` | Sim | *Com flag de otimização; didático, lento |
| **Selection Sort** | `O(n²)` | `O(n²)` | `O(n²)` | `O(1)` | Não | Mínimo de trocas (`≤ n - 1`) |
| **Insertion Sort** | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` | Sim | Ótimo para entradas pequenas ou quase ordenadas |
| **Shell Sort** | `O(n log n)` | ~`O(n^1.3)` | `O(n²)` / `O(n^1.5)` | `O(1)` | Não | Depende da sequência de `h` (Knuth) |
| **Merge Sort** | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` | Sim | Sempre `O(n log n)`, mas exige memória extra |
| **Quick Sort** | `O(n log n)` | `O(n log n)` | `O(n²)` | `O(log n)`* | Não | Muito rápido na prática; *pilha `O(n)` no pior caso |

---

## Módulo 6: Árvores Binárias, Árvores de Busca (ABB) e Árvores AVL

### Terminologia de Árvores

- **Nó raiz:** nó do topo da árvore, sem pai.
- **Nó interior (interno):** nó que possui pelo menos um filho (descendente).
- **Nó terminal (folha):** nó sem descendentes (grau 0).
- **Grau do nó / da árvore:** número de subárvores de um nó / grau máximo entre todos os nós da árvore.
- **Nível e Altura:** a raiz está no nível `0` (ou `1`, conforme convenção); a **altura da árvore** é o comprimento do maior caminho da raiz até uma folha.

### Árvore Binária e Caminhamentos

Em uma **Árvore Binária**, cada nó possui **no máximo dois filhos** (subárvore esquerda e subárvore direita — grau `≤ 2`). Uma aplicação clássica são as **árvores de expressão** (ex.: `A * (B + C)`):

| Caminhamento | Ordem de Visita | Expressão de `A * (B + C)` | Uso Típico |
| :--- | :--- | :--- | :--- |
| **Pré-Ordem (`r-e-d`)** | **R**aiz -> **E**squerda -> **D**ireita | `* A + B C` (Notação Prefixa) | Clonar estrutura da árvore |
| **Em-Ordem / Central (`e-r-d`)** | **E**squerda -> **R**aiz -> **D**ireita | `A * B + C` (Infixa) | Em **ABB**, visita as chaves **em ordem crescente!** |
| **Pós-Ordem (`e-d-r`)** | **E**squerda -> **D**ireita -> **R**aiz | `A B C + *` (Posfixa / RPN) | Avaliar expressões e liberar memória de nós |

### Árvore Binária de Busca (ABB / ABP)

Uma **ABB** (Árvore Binária de Pesquisa) satisfaz para todo nó `x`:
- Todas as chaves da **subárvore esquerda** são **menores** que `x.chave`;
- Todas as chaves da **subárvore direita** são **maiores** que `x.chave`.

#### Operações na ABB
1. **Pesquisa e Inserção:** compara-se a chave com o nó atual; se menor, desce à esquerda; se maior, desce à direita, até encontrar a chave ou atingir `NULL` (ponto de inserção ou falha na busca).
2. **Remoção (3 casos):**
   - *Caso 1 (nó folha):* remove-se o nó diretamente.
   - *Caso 2 (nó com 1 filho):* o único filho assume o lugar do nó removido.
   - *Caso 3 (nó com 2 filhos):* substitui-se a chave do nó removido pelo **antecessor imediato** (nó mais à direita da subárvore esquerda) **ou** pelo **sucessor imediato** (nó mais à esquerda da subárvore direita), e remove-se recursivamente o substituto.

#### O Problema da Deterioração (Degeneração)
Se inserirmos chaves já ordenadas (`1, 2, 3, 4, 5, ...`) em uma ABB simples, ela cresce apenas para um lado, tornando-se uma **árvore degenerada** (equivalente a uma lista encadeada de altura `n`), o que degrada busca, inserção e remoção de `O(log n)` para **`O(n)`**!

> **Construção balanceada a partir de vetor ordenado (`CriaABP`):** se todos os dados já estão em um vetor ordenado `v[1..n]`, podemos construir uma ABB perfeitamente balanceada escolhendo recursivamente o elemento do meio `pos = (i + j) / 2` como raiz e criando as subárvores esquerda (`i..pos-1`) e direita (`pos+1..j`) — técnica explorada no material do Prof. Alcides!

### Árvores AVL (Adelson-Velsky e Landis)

Para evitar a degeneração em inserções e remoções dinâmicas, a **Árvore AVL** é uma ABB **autobalanceada** que garante altura **`O(log n)`** em todas as operações.

- **Critério de Balanceamento AVL:** para **todo nó**, as alturas das subárvores esquerda (`H_esq`) e direita (`H_dir`) diferem em **no máximo 1**:
  `|H_esq - H_dir| ≤ 1`  (ou seja, Fator de Balanceamento `FB = H_esq - H_dir ∈ {-1, 0, +1}`).

Quando uma inserção ou remoção faz algum ancestral atingir `|FB| = 2`, sobe-se do nó alterado até o **primeiro ancestral desbalanceado** e aplica-se uma **rotação** para restaurar o equilíbrio em `O(1)` ponteiros:

| Caso de Desequilíbrio | Condição (Sinais de `FB`) | Operação de Rebalanceamento |
| :--- | :--- | :--- |
| **Esquerda-Esquerda (EE / LL)** | Nó `FB = +2` e filho esquerdo `FB ≥ 0` | **Rotação Simples à Direita** |
| **Direita-Direita (DD / RR)** | Nó `FB = -2` e filho direito `FB ≤ 0` | **Rotação Simples à Esquerda** |
| **Esquerda-Direita (ED / LR)** | Nó `FB = +2` e filho esquerdo `FB = -1` | **Rotação Dupla Esquerda-Direita** (esq. no filho + dir. no nó) |
| **Direita-Esquerda (DE / RL)** | Nó `FB = -2` e filho direito `FB = +1` | **Rotação Dupla Direita-Esquerda** (dir. no filho + esq. no nó) |

---

## Módulo 7: Tabelas Hash (Espalhamento / Dispersão)

Uma **Tabela Hash** permite acesso direto em tempo médio **`O(1)`** sem realizar comparações sucessivas como na busca binária ou em árvores. A posição no vetor `tabelaH[0..T-1]` é calculada diretamente pela **função hash (escrutínio)** `h(chave)`.

### Função Hash e Colisões

- **Método da Divisão:** `h(k) = k mod T` (onde `T` é o tamanho da tabela — preferencialmente um número primo não próximo de potências de 2 para reduzir agrupamentos).
- **Colisão:** ocorre quando duas chaves distintas produzem o mesmo índice: `h(k₁) = h(k₂)` com `k₁ ≠ k₂` (ex.: para `T = 9`, `h(13) = 4` e `h(22) = 4`). Pelo Princípio da Casa dos Pombos, colisões são inevitáveis sempre que o universo de chaves for maior que `T`.
- **Fator de Carga (`α = n / T`):** razão entre o número de elementos armazenados (`n`) e o tamanho da tabela (`T`). Quanto maior `α`, maior a probabilidade de colisões e menor o desempenho.

### Técnicas de Tratamento de Colisões

1. **Encadeamento Separado (*Separate Chaining*):** cada posição `tabelaH[i]` mantém uma lista encadeada (ou ponteiro `prox`) dos registros que colidiram no índice `i`.
   - **Vantagem:** `α` pode ser maior que 1; remoção é simples.
   - **Pior caso:** se todas as chaves caírem no mesmo índice, a busca degenera para `O(n)`.
2. **Endereçamento Aberto (*Open Addressing*):** todos os registros ficam diretamente dentro do próprio vetor `tabelaH` (`α ≤ 1`). Quando `h(k)` está ocupado, busca-se outro slot livre segundo uma sequência de sondagem:
   - **Sondagem Linear:** `(h(k) + i) mod T` — simples, mas sofre com **agrupamento primário** (blocos contíguos ocupados).
   - **Sondagem Quadrática:** `(h(k) + c₁·i + c₂·i²) mod T` — reduz agrupamento primário.
   - **Hash Duplo (*Double Hashing*):** `(h₁(k) + i · h₂(k)) mod T` — melhor distribuição entre os métodos abertos.

### Exemplo Comentado Estilo ENADE (ENADE 2021, Q33)

Considere uma tabela `tabelaH` de tamanho `T = 9` (índices `0` a `8`, inicializados com `chave = -1` e `prox = NULO`) com função `h(k) = k mod 9` e tratamento de colisão por lista encadeada ligada ao campo `prox` de cada posição:
Ao inserir em sequência `(13, 6)`, `(46, 7)`, `(20, 22)`, `(28, 25)`, `(19, 26)`, `(17, 9)`:
- `h(13) = 13 mod 9 = 4` -> ocupa `tabelaH[4]`
- `h(46) = 46 mod 9 = 1` -> ocupa `tabelaH[1]`
- `h(20) = 20 mod 9 = 2` -> ocupa `tabelaH[2]`
- `h(28) = 28 mod 9 = 1` -> colide em `1`! É encadeado em `tabelaH[1].prox`
- `h(19) = 19 mod 9 = 1` -> colide em `1`! Percorre `prox` até o fim e encadeia após `28`
- `h(17) = 17 mod 9 = 8` -> ocupa `tabelaH[8]`

Observe que os índices `0, 3, 5, 6, 7` permanecem livres (`-1`)! Rastrear passo a passo `k mod T` garante acerto rápido nesse tipo de questão.

---

## Módulo 8: Grafos, Caminhamentos (BFS/DFS) e Caminho Mínimo

Um **Grafo** `G = (V, E)` é formado por um conjunto de **vértices (nós)** `V` e um conjunto de **arestas** `E` que conectam pares de vértices. É a estrutura universal para modelar redes de computadores, mapas rodoviários, dependências de tarefas e redes sociais.

- **Grafo Não Dirigido vs. Dirigido (Dígrafo):** no não dirigido, aresta `(u, v)` é bidirecional; no dígrafo, o arco `u -> v` tem sentido único.
- **Grafo Ponderado:** cada aresta possui um peso/custo `w(u, v)` (distância, latência, custo).
- **Grau de um vértice:** número de arestas incidentes (em dígrafos: grau de entrada e grau de saída).

### Representação de Grafos na Memória

| Critério | Matriz de Adjacência (`V × V`) | Lista de Adjacência (`V` listas) |
| :--- | :---: | :---: |
| **Uso de memória** | `O(V²)` | `O(V + E)` |
| **Verificar se aresta `(u, v)` existe** | `O(1)` | `O(grau(u))` |
| **Percorrer todos os vizinhos de `u`** | `O(V)` | `O(grau(u))` |
| **Indicação ideal** | **Grafos densos** (`E ≈ V²`) | **Grafos esparsos** (`E ≪ V²`, maioria dos casos reais) |

### Algoritmos de Caminhamento: BFS vs. DFS

1. **Busca em Largura — BFS (*Breadth-First Search*):**
   - Explora o grafo em **camadas concêntricas** a partir do vértice de origem `s` (primeiro todos os vizinhos a distância 1, depois distância 2, etc.).
   - Utiliza uma **Fila (FIFO)** e vetor de `visitados`.
   - **Complexidade:** `O(V + E)` com lista de adjacência.
   - **Aplicação clássica:** encontra o **menor caminho em número de arestas** em grafos não ponderados.

2. **Busca em Profundidade — DFS (*Depth-First Search*):**
   - Avança o mais fundo possível por um ramo antes de retroceder (*backtracking*).
   - Utiliza uma **Pilha (LIFO)** (explicitamente ou via **recursão**) e vetor de `visitados`.
   - **Complexidade:** `O(V + E)` com lista de adjacência.
   - **Aplicações clássicas:** detecção de ciclos, contagem de componentes conexos, ordenação topológica em DAGs (grafos acíclicos dirigidos) e componentes fortemente conexos.

```python
# Esqueleto didático de BFS e DFS sobre Lista de Adjacência adj[u]
from collections import deque

def bfs(adj, inicio):
    visitado = {inicio}
    fila = deque([inicio])
    ordem = []
    while fila:
        u = fila.popleft()
        ordem.append(u)
        for v in adj[u]:
            if v not in visitado:
                visitado.add(v)
                fila.append(v)
    return ordem

def dfs(adj, u, visitado=None, ordem=None):
    if visitado is None:
        visitado, ordem = set(), []
    visitado.add(u)
    ordem.append(u)
    for v in adj[u]:
        if v not in visitado:
            dfs(adj, v, visitado, ordem)
    return ordem
```

### Caminho Mínimo e Árvore Geradora Mínima (Visão Comparativa)

- **Algoritmo de Dijkstra (Caminho Mínimo de Fonte Única):**
  - Encontra o caminho de menor custo de um vértice origem `s` até todos os demais vértices em grafos **ponderados com pesos não negativos (`w ≥ 0`)**.
  - Usa estratégia gulosa com **Fila de Prioridade (*Min-Heap*)**, executando em **`O((V + E) log V)`**. *(Atenção: não funciona corretamente se houver arestas com peso negativo!)*
- **Algoritmo de Bellman-Ford:** resolve caminho mínimo mesmo com **arestas de peso negativo** (e detecta ciclos negativos), ao custo de **`O(V · E)`**.
- **Árvore Geradora Mínima (AGM / MST):** conecta todos os `V` vértices de um grafo conexo não dirigido com o menor somatório total de pesos de arestas (algoritmos de **Prim** e **Kruskal**).

### Resumo Rápido de Estruturas para Decisão no ENADE

| Necessidade do Problema | Estrutura Mais Indicada | Complexidade Chave |
| :--- | :--- | :--- |
| Acesso instantâneo por índice em tamanho fixo / grade 2D | Vetor / Matriz | Acesso `O(1)` |
| Inserir e ler mais recentes primeiro (LIFO) / desfazer ações | Pilha | `push`/`pop` `O(1)` |
| Atender por ordem de chegada (FIFO) / buffer / BFS | Fila (ou Fila Circular) | `enqueue`/`dequeue` `O(1)` |
| Busca rápida em dados estáticos ordenados | Vetor Ordenado + Busca Binária | Busca `O(log n)` |
| Busca, inserção e remoção dinâmicas com dados ordenados | Árvore AVL (ou Rubro-Negra) | Tudo `O(log n)` garantido |
| Lookup direto por chave única sem necessidade de ordem | Tabela Hash | Média `O(1)` |
| Menor caminho em saltos (sem pesos) / Menor caminho com pesos `≥ 0` | BFS / Dijkstra | `O(V + E)` / `O((V + E) log V)` |
