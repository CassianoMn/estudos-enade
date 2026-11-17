# Organização e Arquitetura de Computadores

> **Foco ENADE:** Em Organização e Arquitetura de Computadores (OAC), o ENADE cobra representação numérica (binário, complemento de 2 e IEEE 754), lógica digital e circuitos combinacionais/sequenciais, modelo de Von Neumann, características RISC/CISC e linguagem de máquina, funcionamento e riscos (*hazards*) de *pipeline*, hierarquia de memória e técnicas de mapeamento/escrita em *cache*, níveis RAID, barramentos, técnicas de E/S (Polling, Interrupções e DMA), além de cálculo de desempenho, utilização de recursos e escalabilidade em *clusters*.

---

## Módulo 1: Sistemas de Numeração, Aritmética Binária e Ponto Flutuante

### 1.1 Conversão entre Bases Numéricas

Um número `N` na base `b` com parte inteira e fracionária tem seu valor decimal dado pela forma polinomial:

`N_b = ∑ aᵢ · bⁱ` (com `i ≥ 0` para a parte inteira e `i < 0` para a parte fracionária).

* **Binário → Decimal:** `101101₂ = 1·2⁵ + 0·2⁴ + 1·2³ + 1·2² + 0·2¹ + 1·2⁰ = 32 + 8 + 4 + 1 = 45₁₀`.
* **Binário Fracionário → Decimal:** `101,101₂ = 1·2² + 0·2¹ + 1·2⁰ + 1·2⁻¹ + 0·2⁻² + 1·2⁻³ = 4 + 1 + 0,5 + 0,125 = 5,625₁₀`.
* **Decimal → Binário (ou base `b`):**
  * **Parte inteira:** Divisões sucessivas por `2`, lendo os restos de baixo para cima.
  * **Parte fracionária:** Multiplicações sucessivas por `2`, recolhendo a parte inteira de cima para baixo até a fração zerar (ou atingir a precisão desejada).
  * *Exemplo (`8,375₁₀` → binário):*
    * Parte inteira (`8`): `8 ÷ 2 = 4 (r=0)`, `4 ÷ 2 = 2 (r=0)`, `2 ÷ 2 = 1 (r=0)`, `1 ÷ 2 = 0 (r=1)` → `1000₂`.
    * Parte fracionária (`0,375`): `0,375 × 2 = 0,750` (int **`0`**); `0,750 × 2 = 1,500` (int **`1`**); `0,500 × 2 = 1,000` (int **`1`**) → `0,011₂`.
    * Resultado: **`8,375₁₀ = 1000,011₂`**.
* **Binário ↔ Octal / Hexadecimal:** Agrupa-se de **3 em 3 bits** para octal (`2³ = 8`) e de **4 em 4 bits** para hexadecimal (`2⁴ = 16`), a partir da vírgula. Ex.: `1101 1010₂ = DA₁₆`.

### 1.2 Representação de Inteiros com Sinal e Sem Sinal

Em uma palavra de `n` bits:
* **Sem sinal (*unsigned*):** Representa inteiros de `0` até `2ⁿ − 1`.
* **Com sinal:** O bit mais significativo (MSB, à esquerda) indica o sinal (`0` para positivo, `1` para negativo):

| Representação | Regra para Negativos | Zero único? | Faixa em `n` bits |
| :--- | :--- | :---: | :--- |
| **Sinal e Magnitude** | Mantém magnitude nos `n−1` bits e muda o MSB para `1` | Não (`+0` e `−0`) | `−(2ⁿ⁻¹ − 1)` a `+(2ⁿ⁻¹ − 1)` |
| **Complemento de 1** | Inverte todos os bits (`NOT` bit a bit) | Não (`0000` e `1111`) | `−(2ⁿ⁻¹ − 1)` a `+(2ⁿ⁻¹ − 1)` |
| **Complemento de 2** | Inverte todos os bits e soma `1` | **Sim** (único `0`) | **`−2ⁿ⁻¹` a `+(2ⁿ⁻¹ − 1)`** |

* **Por que Complemento de 2 é universal?** Elimina a duplicidade do zero e permite realizar subtrações (`A − B`) usando o mesmo circuito somador da ULA (`A + (−B)`).
* ***Overflow* em Complemento de 2:** Ocorre quando a soma de dois números positivos gera resultado negativo, ou a soma de dois negativos gera resultado positivo (equivale a `Carry_in ≠ Carry_out` no bit de sinal). Soma de sinais opostos **nunca** gera *overflow*.

### 1.3 Ponto Flutuante (Padrão IEEE 754)

Para representar números reais muito pequenos ou muito grandes, utiliza-se notação científica binária normalizada:

`V = (−1)^S × (1 + F) × 2^(E − Bias)`

| Precisão | Total de Bits | Sinal (`S`) | Expoente (`E`) | Mantissa / Fração (`F`) | Excesso (*Bias*) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Simples (`float`)** | 32 bits | 1 bit | 8 bits | 23 bits | **127** |
| **Dupla (`double`)** | 64 bits | 1 bit | 11 bits | 52 bits | **1023** |

* **Trade-off fundamental:** Mais bits na **fração (mantissa)** aumentam a **precisão**; mais bits no **expoente** aumentam a **faixa de valores (range)**.
* **Expoente com excesso (*bias*):** Não usa complemento de 2 para facilitar a comparação numérica direta em hardware. Em precisão simples, o expoente real é `E − 127` (ex.: se `E = 130₁₀`, o fator é `2^(130−127) = 2³`).
* **Bit implícito:** Na forma normalizada, o `1` antes da vírgula binária (`1,xxxx₂`) é implícito e não é armazenado nos 23 (ou 52) bits da fração.

---

## Módulo 2: Álgebra Booleana, Portas Lógicas e Circuitos Digitais

### 2.1 Álgebra Booleana e Portas Lógicas

Os circuitos digitais operam sobre variáveis binárias (`0` = Falso/nível baixo; `1` = Verdadeiro/nível alto) por meio de portas lógicas:

| Porta Lógica | Expressão | Saída = `1` quando... | Observação Importante |
| :--- | :---: | :--- | :--- |
| **NOT (Inversora)** | `Ā` ou `A'` | `A = 0` | Inverte o nível lógico |
| **AND (E)** | `A · B` | Todas as entradas são `1` | Elemento neutro: `1`; absorvente: `0` |
| **OR (OU)** | `A + B` | Ao menos uma entrada é `1` | Elemento neutro: `0`; absorvente: `1` |
| **NAND** | `(A · B)'` | Ao menos uma entrada é `0` | **Porta universal** (implementa qualquer função) |
| **NOR** | `(A + B)'` | Todas as entradas são `0` | **Porta universal** (implementa qualquer função) |
| **XOR (OU-Exclusivo)** | `A ⊕ B` | As entradas têm valores **diferentes** | Base para somadores e detecção de paridade |
| **XNOR (Coincidência)** | `(A ⊕ B)'` | As entradas têm valores **iguais** | Funciona como comparador de 1 bit |

**Tabela-Verdade das Portas Básicas (2 entradas):**

| `A` | `B` | `A · B` (AND) | `A + B` (OR) | `(A · B)'` (NAND) | `(A + B)'` (NOR) | `A ⊕ B` (XOR) | `(A ⊕ B)'` (XNOR) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `0` | `0` | `0` | `0` | `1` | `1` | `0` | `1` |
| `0` | `1` | `0` | `1` | `1` | `0` | `1` | `0` |
| `1` | `0` | `0` | `1` | `1` | `0` | `1` | `0` |
| `1` | `1` | `1` | `1` | `0` | `0` | `0` | `1` |

**Leis de De Morgan em Circuitos:** `(A · B)' = A' + B'` e `(A + B)' = A' · B'`. Para minimizar expressões booleanas visando menor número de portas lógicas e menor atraso de propagação, utilizam-se identidades algébricas ou **Mapas de Karnaugh** (agrupando células adjacentes em potências de 2: `1, 2, 4, 8...` em código Gray).

### 2.2 Circuitos Combinacionais vs. Circuitos Sequenciais

| Característica | Circuitos Combinacionais | Circuitos Sequenciais |
| :--- | :--- | :--- |
| **Dependência da saída** | Apenas das **entradas atuais** | Das entradas atuais **e do estado anterior** |
| **Memória / *Clock*** | Não possuem elementos de memória | Possuem memória (*latches* / *flip-flops*) e geralmente sinal de *clock* |
| **Exemplos principais** | Somadores, Multiplexadores (MUX), Decodificadores, ULA | Registradores, Contadores, Máquinas de Estados Finitos (FSM) |

* **Meio-Somador (*Half Adder*):** Soma 2 bits (`A, B`): `Soma = A ⊕ B` e `Carry_out = A · B`.
* **Somador Completo (*Full Adder*):** Soma 3 bits (`A, B, Carry_in`): `Soma = A ⊕ B ⊕ C_in` e `C_out = (A · B) + (C_in · (A ⊕ B))`.
* **Multiplexador (MUX `2ⁿ × 1`):** Seleciona uma dentre `2ⁿ` entradas de dados usando `n` linhas de seleção.
* **Flip-Flops (D, JK, SR, T):** Elementos biestáveis sensíveis à borda de subida (ou descida) do *clock* que armazenam `1` bit de informação; formam a base de registradores e memórias SRAM.

---

## Módulo 3: Arquitetura de Von Neumann, Linguagem de Máquina e RISC vs. CISC

### 3.1 Arquitetura de Von Neumann e Componentes da CPU

Proposta por John von Neumann, baseia-se no conceito de **programa armazenado**: instruções e dados compartilham a mesma memória principal. Seus componentes centrais são:
1. **Memória Principal:** Armazena instruções e dados endereçáveis.
2. **Unidade Lógica e Aritmética (ULA / ALU):** Executa operações aritméticas (`+`, `−`) e lógicas (`AND`, `OR`, deslocamentos).
3. **Unidade de Controle (UC):** Busca instruções, decodifica o *opcode* e gera sinais de controle para coordenar ULA, registradores, memória e E/S.
4. **Registradores:** Memórias ultrarrápidas internas à CPU:
   * **PC (*Program Counter*):** Endereço da próxima instrução a ser buscada.
   * **IR (*Instruction Register*):** Instrução atualmente em decodificação/execução.
   * **MAR e MBR/MDR:** Registradores de endereço e de dados na interface com a memória.
5. **Dispositivos de Entrada e Saída (E/S).**

*(Nota: O compartilhamento de um único barramento para buscar instruções e acessar dados gera o chamado **Gargalo de Von Neumann**. Na **Arquitetura Harvard**, instruções e dados possuem memórias e barramentos separados — muito comum internamente nas caches L1 de instruções e L1 de dados dos processadores modernos.)*

### 3.2 O Processador MIPS e *Endianness*

O processador **MIPS** (referência clássica RISC) possui:
* **Tamanho fixo de instrução:** `32 bits` (1 palavra / *word* = 4 bytes).
* **Banco de registradores:** `32 registradores` de `32 bits` cada (ex.: `$t0–$t9`, `$s0–$s7`, `$zero`, `$sp`, `$ra`).
* **Arquitetura Load/Store com 3 operandos:** Instruções aritméticas e lógicas operam exclusivamente entre registradores (`add $t0, $t1, $t2`); apenas `lw` (*load word*) e `sw` (*store word*) acessam a memória.
* **Formatos de instrução MIPS (32 bits):**
  * **Tipo R (Registrador):** `op (6) | rs (5) | rt (5) | rd (5) | shamt (5) | funct (6)`
  * **Tipo I (Imediato / Load / Store / Branch):** `op (6) | rs (5) | rt (5) | imediato/deslocamento (16)`
  * **Tipo J (Jump):** `op (6) | endereço alvo (26)`

***Endianness* (Ordenação de Bytes na Memória):**
* **Big-Endian:** O byte mais significativo (MSB) é armazenado no **menor endereço** de memória (da esquerda para a direita).
* **Little-Endian:** O byte menos significativo (LSB) é armazenado no **menor endereço** de memória (adotado pela família x86/x64).

### 3.3 Comparativo RISC vs. CISC

| Critério | Arquitetura RISC (ex.: MIPS, ARM, RISC-V) | Arquitetura CISC (ex.: x86, VAX) |
| :--- | :--- | :--- |
| **Conjunto de instruções** | Reduzido, simples, realiza uma única operação | Amplo, complexo; uma instrução faz múltiplas operações |
| **Tamanho das instruções** | **Fixo** (ex.: 32 bits), facilita decodificação | **Variável** (1 a vários bytes) |
| **Acesso à memória** | Modelo *Load/Store* (somente `lw`/`sw` acessam memória) | Instruções aritméticas podem operar direto na memória |
| **Registradores** | Banco grande de registradores de propósito geral | Menos registradores de propósito geral |
| **Pipeline** | Altamente favorecido pela regularidade e tamanho fixo | Mais complexo (microprogramação / tradução para micro-ops) |

---

## Módulo 4: Ciclo de Instrução, Execução Multiciclo e Pipeline

### 4.1 As 5 Etapas de Execução no MIPS

Em um processador MIPS multiciclo ou com *pipeline*, uma instrução atravessa até **5 estágios**:

1. **IF (*Instruction Fetch* — Busca):** Busca a instrução na memória usando o `PC` e calcula `PC + 4` (próxima instrução sequencial).
2. **ID (*Instruction Decode* — Decodificação e Leitura de Registradores):** Decodifica a instrução, lê os registradores `rs` e `rt` para os registradores auxiliares `A` e `B` e antecipa o cálculo do endereço de desvio em `ALUOut`.
3. **EX (*Execute* — Execução / Cálculo de Endereço):**
   * Se **Tipo R:** A ULA executa a operação lógica/aritmética e salva em `ALUOut`.
   * Se **`lw`/`sw`:** A ULA soma a base (`rs`) ao deslocamento (*offset*) e salva o endereço efetivo em `ALUOut`.
   * Se **desvio (`beq`, `j`):** Verifica igualdade (`A == B`) na ULA ou atualiza o `PC` com o endereço de destino.
4. **MEM (*Memory Access* — Acesso à Memória / Conclusão R):**
   * Se **Tipo R:** Escreve `ALUOut` no registrador destino (`rd`) — fim da instrução R (4 ciclos no multiciclo).
   * Se **`lw`:** Lê o dado da memória no endereço `ALUOut` e armazena no `MDR` (*Memory Data Register*).
   * Se **`sw`:** Grava o dado na memória no endereço `ALUOut` — fim da instrução `sw` (4 ciclos no multiciclo).
5. **WB (*Write Back* — Escrita de Retorno):** Conclui a instrução `lw`, gravando o valor lido no banco de registradores (5 ciclos no multiciclo).

### 4.2 Princípio do Pipeline

O ***pipeline*** aplica paralelismo temporal (como uma linha de montagem industrial: lavar, secar, passar e guardar): enquanto uma instrução está no estágio EX, a seguinte está em ID e outra está em IF.

* **Ganho:** Não reduz a latência individual de uma instrução, mas aumenta drasticamente a **vazão (*throughput*)**, idealmente aproximando o CPI (*Ciclos Por Instrução*) de `1`.
* **Speedup ideal:** Com `k` estágios balanceados e muitas instruções, o *speedup* tende a `k` (no MIPS de 5 estágios, até `5×`).

### 4.3 Riscos (*Hazards*) no Pipeline e Soluções

| Tipo de Risco (*Hazard*) | Causa | Soluções em Hardware / Compilador |
| :--- | :--- | :--- |
| **Risco Estrutural** | Conflito pelo uso simultâneo do mesmo recurso físico (ex.: memória única para IF e MEM) | Separar caches de instruções (L1-I) e dados (L1-D) — modelo Harvard |
| **Risco de Dados** | Uma instrução precisa do resultado de uma instrução anterior ainda não concluída (dependência RAW) | **Forwarding (*Bypassing*):** encaminhar o resultado direto da saída da ULA/MEM para a entrada da próxima instrução, sem esperar WB; **Stall (bolha):** quando há *load-use hazard* (`lw` seguido imediatamente de uso), insere-se 1 ciclo de parada (`nop`) |
| **Risco de Controle** | Instruções de desvio condicional (`beq`) alteram o fluxo; ainda não se sabe o próximo `PC` no estágio IF | **Inserir *stalls*** até resolver o desvio; **Predição de Desvio** (estática ou dinâmica) com descarte (*flush*) se errar; *Delayed Branch* |

**Exemplo de Risco de Dados (do material UFS):**
```assembly
sub $2, $1, $3      # Escreve $2 no estágio WB (ciclo 5)
and $12, $2, $5     # Lê $2 no estágio ID (ciclo 3) -> Risco RAW!
or  $13, $6, $2     # Lê $2 no estágio ID (ciclo 4) -> Risco RAW!
add $14, $2, $2     # Lê $2 no estágio ID (ciclo 5)
sw  $15, 100($2)    # Sem risco se WB ocorre na 1ª metade do ciclo
```
Inserir `nop` (bolhas) resolve, mas reduz o desempenho. A solução mais eficiente é o **Forwarding** (adiantamento), que repassa o valor calculado em EX/MEM diretamente para a entrada da ULA das instruções seguintes.

---

## Módulo 5: Hierarquia de Memória e Memória Cache

### 5.1 Tecnologias de Memória e Princípio da Localidade

A hierarquia de memória concilia velocidade (custo alto/bit) e capacidade (custo baixo/bit): **Registradores → Cache (L1, L2, L3) → Memória Principal (DRAM) → Armazenamento Secundário (SSD/HD)**.

* **SRAM (*Static RAM*):** Baseada em *flip-flops*; ultrarrápida, consome mais área/energia e dispensa *refresh*. Usada nas **memórias cache**.
* **DRAM (*Dynamic RAM*):** Baseada em capacitores; muito densa e barata, porém de 5 a 10 vezes mais lenta que a SRAM e exige *refresh* periódico. Usada na **memória principal**.

**Princípio da Localidade:** Justifica a eficiência da cache:
* **Localidade Temporal:** Se um item é referenciado agora, tende a ser referenciado novamente em breve (ex.: variáveis de laços `for`, contadores).
* **Localidade Espacial:** Se um endereço é referenciado, endereços próximos tendem a ser referenciados em breve (ex.: percurso sequencial de vetores/matrizes e instruções sequenciais).

### 5.2 Técnicas de Mapeamento de Cache

| Técnica | Como funciona | Vantagens | Desvantagens |
| :--- | :--- | :--- | :--- |
| **Mapeamento Direto** | Cada bloco da RAM mapeia para **exatamente uma** linha fixa da cache (`Índice = Bloco mod Nº_Linhas`) | Hardware simples, barato e rápido na busca | Alta taxa de **faltas por conflito** (*thrashing*) |
| **Totalmente Associativo** | Qualquer bloco da RAM pode ocupar **qualquer linha** livre da cache | Menor taxa de faltas por conflito; alta taxa de acerto | Hardware caro (exige comparadores paralelos em todas as linhas) |
| **Associativo por Conjunto (*k-way*)** | A cache é dividida em conjuntos; o bloco mapeia para **um conjunto único** (`Índice`), mas dentro dele pode ir para qualquer uma das `k` vias | Melhor compromisso entre custo/complexidade e taxa de acertos | Complexidade moderada (`k` comparadores por acesso) |

**Decomposição do Endereço Físico:** `[ Tag | Índice (Set) | Offset (Deslocamento no bloco) ]`
* `bits de Offset = log₂(Tamanho do bloco em bytes)`
* `bits de Índice = log₂(Número de conjuntos)` *(no totalmente associativo, `Índice = 0` bits)*
* `bits de Tag = Total de bits do endereço − (Índice + Offset)`.

### 5.3 Políticas de Substituição, Tipos de Falta e Políticas de Escrita

* **Políticas de Substituição (usadas no associativo por conjunto e totalmente associativo):**
  * **LRU (*Least Recently Used*):** Substitui o bloco menos recentemente utilizado (melhor taxa de acertos por explorar localidade temporal).
  * **FIFO (*First-In, First-Out*):** Substitui o bloco mais antigo carregado na cache.
  * **Randômica:** Escolhe o bloco aleatoriamente (hardware simples).
* **Os 3 Tipos de Falta (*Cache Miss* — modelo 3Cs):**
  1. **Falta Compulsória (*Cold Miss*):** Ocorre no primeiro acesso ao bloco, quando a linha da cache ainda não possui dados.
  2. **Falta por Capacidade:** A cache está cheia e não comporta todos os blocos ativos do programa.
  3. **Falta por Conflito:** Dois ou mais blocos competem pela mesma linha/conjunto no mapeamento direto ou *k-way* (mesmo havendo espaço livre em outros conjuntos).
* **Políticas de Escrita (*Write Hit*):**
  * **Write-Back:** Atualiza apenas a cache (marcando o bloco como *dirty*); a memória principal só é atualizada quando o bloco for substituído. Mais rápida, menor tráfego de barramento.
  * **Write-Through:** Atualiza simultaneamente a cache e a memória principal (nível inferior). Garante coerência imediata, porém gera mais tráfego de escrita.
* **Políticas para Falta na Escrita (*Write Miss*):**
  * **Write-Allocate:** Carrega o bloco da memória principal para a cache e então realiza a escrita (comum com *Write-Back*).
  * **Write-Around (No-Write-Allocate):** Escreve diretamente na memória principal sem alocar o bloco na cache (comum com *Write-Through*).

---

## Módulo 6: Armazenamento (RAID), Barramentos e Entrada/Saída

### 6.1 Níveis RAID (*Redundant Array of Independent Disks*)

| Nível RAID | Mecanismo Principal | Redundância / Tolerância a Falhas | Característica-Chave |
| :---: | :--- | :--- | :--- |
| **RAID 0** | *Striping* (distribuição por faixas entre discos) | **Nenhuma** (falha de 1 disco perde tudo) | Máximo desempenho pelo paralelismo |
| **RAID 1** | Espelhamento (*Mirroring / Shadowing*) | Sim (tolera falha de 1 disco do par) | Usa o **dobro** de discos; leitura rápida, capacidade útil de 50% |
| **RAID 2** | Códigos corretores de erro (Hamming) por bit | Sim | Pouco utilizado na prática |
| **RAID 3** | Paridade intercalada **por bit** em disco dedicado | Sim (1 disco) | Leituras/escritas acessam todos os discos juntos |
| **RAID 4** | Paridade intercalada **por bloco** em disco dedicado | Sim (1 disco) | Permite leituras independentes, mas o disco de paridade vira gargalo na escrita |
| **RAID 5** | Paridade **distribuída** intercalada por bloco | Sim (1 disco) | Elimina o gargalo de escrita do RAID 4; exige mínimo de 3 discos |
| **RAID 6** | **Dupla paridade distribuída (`P + Q`)** | **Sim (até 2 discos simultâneos)** | Maior confiabilidade; exige mínimo de 4 discos |

### 6.2 Barramentos e Arbitragem

* **Barramento Síncrono:** Inclui uma linha de *clock* e protocolo fixo relativo ao ciclo (ex.: AMBA). Todos os dispositivos operam sincronizados pelo mesmo *clock*; quanto mais longo o barramento, menor a frequência máxima devido ao atraso/inclinação de sinal.
* **Barramento Assíncrono:** Não depende de *clock* global; utiliza **protocolo de *handshaking*** (sinais `ReadReq`, `Ack`, `DataRdy`) em que emissor e receptor avançam somente após confirmação mútua. Acomoda dispositivos com velocidades muito distintas.
* **Arbitragem:** Quando múltiplos dispositivos (ex.: CPU e controlador DMA) disputam o barramento, um **árbitro de barramento** decide qual mestre ganha o direito de uso e escalona o acesso.

### 6.3 Comunicação CPU–Dispositivos e Modos de Transferência

**Formas de Endereçamento de E/S:**
* **E/S Mapeada em Memória (*Memory-Mapped I/O*):** Registradores dos dispositivos ocupam endereços do próprio espaço de endereçamento da memória principal; instruções comuns (`lw`, `sw`) controlam a E/S.
* **E/S Isolada (Instruções Especiais):** Instruções dedicadas (`IN`, `OUT`) e espaço de endereçamento separado (restritas ao modo núcleo/supervisor).

**Mecanismos de Transferência:**
1. **Polling (E/S Programada / Espera Ocupada):** A CPU consulta periodicamente o bit de status do dispositivo. Desperdiça ciclos de CPU e exige participação direta da CPU na transferência.
2. **Interrupções:** O controlador envia um sinal de interrupção (IRQ) à CPU apenas quando o dispositivo está pronto. Libera a CPU da espera ativa, mas a CPU ainda participa da cópia de cada palavra de dados.
3. **DMA (*Direct Memory Access*):** Um controlador dedicado transfere blocos inteiros diretamente entre o dispositivo e a memória principal sem envolver a CPU durante a transferência:
   * (1) CPU configura o DMA (dispositivo, operação, endereço base e contagem de bytes);
   * (2) DMA assume o controle do barramento (arbitragem) e realiza a transferência;
   * (3) Ao concluir todo o bloco, o DMA envia **uma única interrupção** à CPU.

---

## Módulo 7: Métricas de Desempenho, Escalabilidade e Clusters (Foco ENADE)

### 7.1 Equação Clássica de Desempenho de CPU e Lei de Amdahl

* **Tempo de CPU:**
  `Tempo_CPU = Nº_Instruções × CPI × Período_Clock = (Nº_Instruções × CPI) / Frequência_Clock`
* **CPI Médio:** `CPI_médio = ∑ (CPIᵢ × Frequência_relativaᵢ)`.
* **Lei de Amdahl:** O ganho de desempenho (*Speedup*) obtido ao acelerar uma fração `f` do sistema por um fator `S` é limitado pela fração não acelerada `(1 − f)`:
  `Speedup_global = 1 / [ (1 − f) + (f / S) ]`

### 7.2 Utilização de Recursos, Vazão (*Throughput*) e Concorrência (ENADE 2014 Q19 e 2021 Q27)

Nos problemas de dimensionamento de servidores no ENADE, observe cuidadosamente as unidades e a sobreposição entre CPU e E/S:

* **Vazão (*Throughput*) e Utilização de Disco (padrão ENADE 2021 Q27):**
  * Se um sistema processa `7.200` transações em `1 hora` (`3.600 s`), a taxa de transações é `7.200 / 3.600 = 2 transações/s`.
  * Se cada transação faz `4,5` operações de I/O, a vazão do disco é `2 × 4,5 = 9 I/O por segundo` (ou `9` transações equivalentes de I/O/s, conforme a grandeza pedida).
  * Se cada I/O consome `20 ms = 0,02 s`, o tempo ocupado do disco por segundo é `9 × 0,02 s = 0,18 s/s`, resultando em **`18%` de utilização média do disco** (Lei da Utilização: `U = X · S`, onde `X` é a vazão e `S` o tempo de serviço).
* **Execução Simultânea *CPU-Bound* vs. *I/O-Bound* (padrão ENADE 2014 Q19):**
  * Em um servidor **monoprocessado (1 núcleo)** que **serializa acessos a disco**, programas *CPU-bound* competem pelo único núcleo (seu tempo conjunto é no mínimo a soma de seus tempos de CPU).
  * Já programas *I/O-bound* podem sobrepor a espera de disco de um com o uso de CPU de outro, desde que respeitem dois limites inferiores: a soma dos tempos de disco serializados (por ex., `70%` do tempo de cada programa *I/O-bound*) e a soma dos tempos totais de CPU.

### 7.3 Clusters de Computadores (ENADE 2017 Q34)

Um **cluster** é um conjunto de computadores independentes (chamados **nós**) interconectados por uma **rede de interconexão de alta velocidade** (e não por um barramento de controle interno único), trabalhando como um recurso unificado:
* **Alta Disponibilidade:** A falha em um nó **não** implica perda total do serviço, pois outros nós assumem a carga (*failover*).
* **Escalabilidade:** Superior à de um único processador multinúcleo (*multicore*), pois permite adicionar novos nós horizontalmente (*scale-out*).
* **Custo/Desempenho:** Um *cluster* construído com nós padronizados (*commodity hardware*) tipicamente apresenta relação custo/desempenho superior à de uma única máquina de grande porte (*mainframe* ou supercomputador monolítico).
