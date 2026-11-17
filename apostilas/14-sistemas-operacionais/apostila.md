# Sistemas Operacionais

> **Foco ENADE:** Em Sistemas Operacionais, o ENADE cobra com forte ênfase o **ciclo de vida e estados de processos** (especialmente quais transições são causadas pelo escalonador), **threads e Lei de Amdahl**, **algoritmos de escalonamento de CPU** (FCFS, SJF, SRTN, Round-Robin, Prioridades, RM e EDF), **sincronização e deadlocks** (condição de corrida, semáforos, condições de Coffman e Algoritmo do Banqueiro), **gerência de memória e memória virtual** (alocação contígua, paginação, *page fault*, substituição FIFO/Ótimo/LRU), **entrada/saída e armazenamento** (DMA, interrupções, escalonamento de disco, i-nodes/FAT) e **virtualização** (hipervisores Tipo 1 e Tipo 2 vs. contêineres).

---

## Módulo 1: Arquitetura de SO, Chamadas de Sistema, Processos e Threads

Um **Sistema Operacional (SO)** atua como intermediário entre os programas de usuário e o hardware, exercendo dois papéis fundamentais: fornecer uma **máquina estendida** (abstração amigável via chamadas de sistema) e atuar como **gerenciador de recursos** (CPU, memória, dispositivos de E/S e arquivos).

### Modos de Execução e Chamadas de Sistema (*System Calls*)

Processadores modernos operam com pelo menos dois modos de execução protegidos por hardware:
* **Modo Usuário (*User Mode*):** executa aplicações comuns com acesso restrito às instruções privilegiadas e ao espaço de endereçamento de outros processos.
* **Modo Núcleo (*Kernel Mode* / Supervisor):** executa o núcleo do SO com acesso irrestrito ao hardware. Quando uma aplicação precisa abrir um arquivo, alocar memória ou criar um processo, ela executa uma instrução especial (*trap* / interrupção de software) invocando uma **chamada de sistema** (ex.: `fork()`, `exec()`, `read()`, `write()`, `exit()`), alternando temporariamente para o modo núcleo.

### Processos, BCP e Ciclo de Vida (Estados)

Um **processo** é um programa em execução, composto em memória por: **código (texto)**, **dados** (variáveis globais/estáticas), **pilha (*stack*)** (chamadas de função e variáveis locais) e **heap** (alocação dinâmica). O SO mantém os metadados de cada processo (PID, estado, registradores, contador de programa, ponteiros de memória e arquivos abertos) no **Bloco de Controle de Processo (BCP / PCB)**.

Na multiprogramação clássica (Tanenbaum), um processo transita por três estados principais:
1. **Executando (*Running*):** utilizando efetivamente a CPU neste instante.
2. **Pronto (*Ready*):** apto a executar, aguardando na fila pelo escalonador de CPU.
3. **Bloqueado (*Blocked / Waiting*):** suspenso aguardando um evento externo (ex.: conclusão de E/S ou liberação de semáforo).

```text
  [Pronto] <--- (2) Quantum expira / Preempção ---- [Executando]
     |                                                   |
     +--------- (3) Escalonador seleciona -------------->+
                                                         |
  [Pronto] <--- (4) E/S concluída --- [Bloqueado] <--- (1) Aguarda E/S
```

> **Pegadinha clássica do ENADE (2014 Q17):** No diagrama de três estados acima, apenas as transições **entre `Pronto` e `Executando`** (seleção do próximo processo para a CPU e preempção por fim de *quantum*) são causadas diretamente pelo **escalonador de processos**. A transição `Executando → Bloqueado` é causada pelo próprio processo ao requisitar E/S/sincronização, e `Bloqueado → Pronto` ocorre pela chegada da interrupção/evento externo.

### Threads, Modelos de Mapeamento e Lei de Amdahl

Uma **thread** (processo leve) é uma unidade básica de utilização da CPU dentro de um processo. Threads de um mesmo processo **compartilham** código, dados globais, heap e arquivos abertos, mas possuem **registradores, contador de programa e pilha próprios**. Benefícios: responsividade, compartilhamento econômico de recursos, menor custo de criação/troca de contexto e escalabilidade em arquiteturas *multicore*.

| Modelo de Threads | Relação Usuário × Núcleo | Vantagens | Desvantagens |
| :--- | :--- | :--- | :--- |
| **Muitos-para-Um** | `N` threads de usuário → `1` thread de kernel | Troca de contexto rápida em espaço de usuário; funciona sem suporte do SO. | Se uma thread fizer chamada bloqueante, **bloqueia todo o processo**; não explora múltiplos núcleos. |
| **Um-para-Um** | `1` thread de usuário → `1` thread de kernel | Máxima utilização de múltiplos cores; uma thread bloqueada não trava as outras. | Maior sobrecarga de criação e chamadas ao kernel (Linux/Windows modernos usam este modelo). |
| **Muitos-para-Muitos** | `N` threads de usuário → `M` threads de kernel (`M <= N`) | Equilibra flexibilidade e concorrência controlada sem explodir threads de kernel. | Maior complexidade de implementação e escalonamento em dois níveis. |

* **Concorrência vs. Paralelismo:** **concorrência** permite que múltiplas tarefas progridam intercaladamente (mesmo em 1 único núcleo); **paralelismo** executa múltiplas tarefas simultaneamente em múltiplos núcleos físicos.

#### Exemplo Numérico 1: Lei de Amdahl

A **Lei de Amdahl** calcula o ganho máximo de desempenho (*speedup*) ao adicionar `N` núcleos a uma aplicação que possui fração sequencial `S` e fração paralelizável `(1 - S)`:

`Speedup(N) = 1 / (S + (1 - S) / N)`

Considere uma aplicação **75% paralela** (`1 - S = 0,75`) e **25% sequencial** (`S = 0,25`). Ao passar de 1 para **2 núcleos** e depois para **4 núcleos**:
* Com `N = 1`: `1 / (0,25 + 0,75 / 1) = 1,0`
* Com `N = 2`: `1 / (0,25 + 0,75 / 2) = 1 / (0,25 + 0,375) = 1 / 0,625 = 1,6` (**60% mais rápida**).
* Com `N = 4`: `1 / (0,25 + 0,75 / 4) = 1 / (0,25 + 0,1875) = 1 / 0,4375 ≈ 2,29`.
* Limite teórico (`N → ∞`): `1 / 0,25 = 4,0` (a parte sequencial sempre limita o ganho máximo!).

---

## Módulo 2: Escalonamento de CPU

O **escalonamento de processos** alterna o uso da CPU para maximizar a utilização e o **throughput** (processos concluídos por unidade de tempo) e minimizar **turnaround** (tempo total da chegada até a conclusão), **tempo de espera** (tempo na fila de prontos) e **tempo de resposta** (até a primeira resposta). O **Scheduler** aplica a política e seleciona o próximo processo; o **Dispatcher** realiza a troca de contexto e entrega a CPU ao escolhido.

### Algoritmos Clássicos e de Tempo Real

| Algoritmo | Preemptivo? | Critério de Seleção | Pontos Fortes e Riscos |
| :--- | :--- | :--- | :--- |
| **FCFS** (*First-Come, First-Served*) | Não | Ordem de chegada (fila FIFO) | Simples e justo na ordem; sofre com **efeito comboio** (processos longos atrasam curtos). |
| **SJF** (*Shortest Job First*) | Não | Menor tempo total de surto de CPU | Minimiza o tempo médio de espera para processos já prontos; risco de *starvation* para jobs longos. |
| **SRTN** (*Shortest Remaining Time Next*) | **Sim** | Menor tempo **restante** de CPU | Versão preemptiva do SJF; novo processo curto interrompe processo em execução se tiver tempo menor que o restante atual. |
| **Round-Robin (RR)** | **Sim** | Fila circular com **quantum** fixo | Excelente tempo de resposta e justiça em sistemas interativos; *quantum* muito pequeno gera excesso de trocas de contexto. |
| **Por Prioridades** | Sim ou Não | Maior prioridade numérica/definida | Pode causar *starvation* em baixa prioridade (resolvido com **envelhecimento / aging**). |
| **Filas Multinível c/ Retroalimentação** | **Sim** | Múltiplas filas com prioridades dinâmicas | Promove processos I/O-bound e rebaixa CPU-bound que consomem todo o *quantum*. |
| **Taxa Monotônica (RM)** | **Sim** | Tempo real, prioridade **fixa**: menor período = maior prioridade | Escalonamento periódico (Liu & Layland). |
| **Earliest Deadline First (EDF)** | **Sim** | Tempo real, prioridade **dinâmica**: *deadline* mais próximo | Alcança até 100% de utilização teórica da CPU em sistemas de tempo real. |

#### Exemplo Numérico 2: Cálculo de Turnaround e Espera (FCFS, SJF e Round-Robin)

Considere três processos chegando no instante `t = 0` na ordem `P1`, `P2`, `P3`, com tempos de CPU: `P1 = 24`, `P2 = 3`, `P3 = 3`.
* **FCFS (`P1 → P2 → P3`):**
  * Términos: `P1 = 24`, `P2 = 27`, `P3 = 30`.
  * Esperas: `P1 = 0`, `P2 = 24`, `P3 = 27` → Espera média = `(0 + 24 + 27) / 3 = 17,0`. Turnaround médio = `(24 + 27 + 30) / 3 = 27,0`.
* **SJF (`P2 → P3 → P1`):**
  * Términos: `P2 = 3`, `P3 = 6`, `P1 = 30`.
  * Esperas: `P2 = 0`, `P3 = 3`, `P1 = 6` → Espera média = `(0 + 3 + 6) / 3 = 3,0` (redução drástica!). Turnaround médio = `(3 + 6 + 30) / 3 = 13,0`.
* **Round-Robin com `quantum = 4`:**
  * Linha do tempo: `P1 [0..4]`, `P2 [4..7]` (termina!), `P3 [7..10]` (termina!), `P1 [10..30]` (executa restante contínuo pois é o único restante).
  * Términos: `P2 = 7`, `P3 = 10`, `P1 = 30`. Esperas: `P1 = 30 - 24 = 6`, `P2 = 7 - 3 = 4`, `P3 = 10 - 3 = 7` → Espera média = `17 / 3 ≈ 5,67`.

---

## Módulo 3: Sincronização de Processos e Deadlocks

Quando processos ou threads concorrentes acessam dados compartilhados sem coordenação (ex.: `counter++` e `counter--` no problema Produtor-Consumidor), a intercalação de instruções de máquina pode gerar resultados incorretos — fenômeno chamado **condição de corrida (*race condition*)**.

### Seção Crítica e Mecanismos de Sincronização

O trecho de código que acessa o recurso compartilhado é a **seção crítica**. Toda solução válida para o problema da seção crítica deve atender a três requisitos:
1. **Exclusão mútua:** no máximo um processo por vez na seção crítica.
2. **Progresso:** se ninguém está na seção crítica, a decisão de quem entra não pode ser adiada indefinidamente por processos fora dela.
3. **Espera limitada:** há um limite para quantas vezes outros processos entram após um processo solicitar entrada (evita *starvation*).

Principais mecanismos:
* **Algoritmo de Peterson:** solução clássica em software para dois processos usando `flag[]` e `turn` (usa espera ocupada).
* **Instruções Atômicas de Hardware:** `Test-and-Set` e `Compare-and-Swap` (base para *spinlocks* — espera ocupada).
* **Mutex (`acquire()` / `release()`):** bloqueio binário com propriedade de dono (*ownership*).
* **Semáforos (`P()` / `wait()` e `V()` / `signal()`):** contador inteiro atômico proposto por Dijkstra (binário ou contador); suspende o processo na fila sem espera ocupada quando o recurso está indisponível.
* **Monitores:** abstração de alto nível na linguagem (ex.: `synchronized` em Java) que encapsula dados compartilhados e garante exclusão mútua implícita em seus métodos, usando variáveis de condição.

### Deadlock vs. Starvation e Algoritmo do Banqueiro

* **Starvation (Inanição):** um processo espera indefinidamente por um recurso devido a políticas injustas de escalonamento/prioridade, embora o recurso fique livre periodicamente.
* **Deadlock (Impasse):** dois ou mais processos bloqueiam-se permanentemente, cada um esperando por um recurso mantido pelo outro. Ocorre **somente** quando as **quatro condições de Coffman** são satisfeitas simultaneamente:
  1. **Exclusão mútua** (recurso não compartilhável);
  2. **Posse e espera (*Hold and Wait*)** (segura ao menos um recurso enquanto solicita outro);
  3. **Não preempção** (recurso só é liberado voluntariamente);
  4. **Espera circular** (`P0` espera `P1`, ..., `Pn` espera `P0`).

Estratégias de tratamento: **Prevenção** (quebrar uma das 4 condições), **Evitação (*Avoidance*)** mantendo o sistema em **estado seguro** (**Algoritmo do Banqueiro**), **Detecção e Recuperação** (busca de ciclos no **Grafo de Alocação de Recursos** + término/preempção) ou **Ignorar** (*Algoritmo do Avestruz*, usado por UNIX/Windows para eventos raros).

#### Exemplo Numérico 3: Verificação de Estado Seguro no Algoritmo do Banqueiro

Considere 5 processos (`P0..P4`) e 3 tipos de recursos (`A, B, C`) com vetor **Disponível = `(3, 3, 2)`**:

| Processo | Alocação `(A B C)` | Máximo `(A B C)` | Necessário = Máx − Aloc `(A B C)` |
| :--- | :---: | :---: | :---: |
| `P0` | `0 1 0` | `7 5 3` | `7 4 3` |
| `P1` | `2 0 0` | `3 2 2` | `1 2 2` |
| `P2` | `3 0 2` | `9 0 2` | `6 0 0` |
| `P3` | `2 1 1` | `2 2 2` | `0 1 1` |
| `P4` | `0 0 2` | `4 3 3` | `4 3 1` |

Passo a passo para encontrar uma **sequência segura** (condição `Necessário_i <= Disponível`):
1. `P1` precisa de `(1, 2, 2) <= (3, 3, 2)` → executa e devolve `(2, 0, 0)` → Novo Disponível = `(5, 3, 2)`.
2. `P3` precisa de `(0, 1, 1) <= (5, 3, 2)` → executa e devolve `(2, 1, 1)` → Novo Disponível = `(7, 4, 3)`.
3. `P4` precisa de `(4, 3, 1) <= (7, 4, 3)` → executa e devolve `(0, 0, 2)` → Novo Disponível = `(7, 4, 5)`.
4. `P0` precisa de `(7, 4, 3) <= (7, 4, 5)` → executa e devolve `(0, 1, 0)` → Novo Disponível = `(7, 5, 5)`.
5. `P2` precisa de `(6, 0, 0) <= (7, 5, 5)` → executa e devolve `(3, 0, 2)` → Novo Disponível = `(10, 5, 7)`.
Como existe a sequência segura `<P1, P3, P4, P0, P2>`, o sistema está em **estado seguro (sem deadlock)**.

---

## Módulo 4: Gerência de Memória e Memória Virtual

### Alocação Contígua e Fragmentação

* **Fragmentação Externa:** espaço livre suficiente no total, mas quebrado em pequenos buracos não contíguos entre partições/processos.
* **Fragmentação Interna:** desperdício dentro de uma partição/bloco já alocado ao processo (ex.: última página parcialmente preenchida).
* Estratégias de alocação dinâmica em buracos (*holes*) livres:
  * **First-fit:** aloca no **primeiro** buraco suficientemente grande.
  * **Best-fit:** aloca no **menor** buraco suficientemente grande (minimiza sobra imediata, mas cria muitos micro-buracos).
  * **Worst-fit:** aloca no **maior** buraco livre (tenta deixar sobras ainda reutilizáveis).

**Exemplo:** Buracos livres na ordem `[10 KB, 4 KB, 20 KB, 18 KB, 7 KB, 9 KB, 12 KB, 15 KB]` para solicitações sequenciais de `12 KB`, `10 KB` e `9 KB`:
* **First-fit:** `12 KB → 20 KB` (sobra 8); `10 KB → 10 KB`; `9 KB → 18 KB` (sobra 9).
* **Best-fit:** `12 KB → 12 KB`; `10 KB → 10 KB`; `9 KB → 9 KB` (encaixe exato sem sobras!).
* **Worst-fit:** `12 KB → 20 KB` (sobra 8); `10 KB → 18 KB` (sobra 8); `9 KB → 15 KB` (sobra 6).

### Segmentação, Paginação e Memória Virtual

* **Segmentação:** divide o programa em unidades lógicas de tamanhos variáveis (código, pilha, heap, tabela de símbolos). Elimina fragmentação interna, mas sofre fragmentação externa.
* **Swapping:** move temporariamente um processo inteiro da RAM para o disco (área de *swap*) e vice-versa quando falta memória física.
* **Paginação e Memória Virtual:** o espaço lógico do processo é dividido em blocos fixos chamados **páginas**, mapeados para **molduras (*frames*)** de igual tamanho na RAM por meio da **MMU (*Memory Management Unit*)** e da **Tabela de Páginas** (acelerada pelo cache **TLB**; em espaços de 64 bits usam-se **tabelas multinível** ou **tabela invertida** para economizar RAM).
  * Quando o processo referencia uma página não residente na RAM (bit de validade = 0), ocorre uma interrupção (*trap*) chamada **Page Fault**: o SO suspende o processo, carrega a página do disco para uma moldura livre (aplicando substituição se a RAM estiver cheia) e reinicia a instrução. Excesso contínuo de *page faults* degrada o sistema no fenômeno chamado **Thrashing**.

### Algoritmos de Substituição de Páginas (Exemplo Numérico 4)

Considere **3 molduras** inicialmente vazias e a cadeia de referências: `7, 0, 1, 2, 0, 3, 0, 4` (8 referências). Compare **FIFO**, **Ótimo** e **LRU**:
* **FIFO** (remove a página mais antiga na memória):
  * `7` (F), `0` (F), `1` (F) → `[7, 0, 1]`
  * `2` (F, sai `7`) → `[0, 1, 2]`
  * `0` (hit)
  * `3` (F, sai `0`) → `[1, 2, 3]`
  * `0` (F, sai `1`) → `[2, 3, 0]`
  * `4` (F, sai `2`) → `[3, 0, 4]` → **Total: 7 page faults**. *(Nota: FIFO pode sofrer a **Anomalia de Belady**, aumentando faltas ao aumentar molduras).*
* **LRU (*Least Recently Used*)** (remove a página usada há mais tempo):
  * `7`(F), `0`(F), `1`(F) → `[7,0,1]`
  * `2`(F, sai `7`) → `[0,1,2]`
  * `0`(hit — `0` passa a ser a mais recente!)
  * `3`(F, sai `1`) → `[0,2,3]`
  * `0`(hit)
  * `4`(F, sai `2`) → `[0,3,4]` → **Total: 6 page faults**.
* **Ótimo (Belady)** (remove a página que demorará mais para ser usada no futuro — referência teórica):
  * `7,0,1`(3F); `2` substitui `7`(F); `0`(hit); `3` substitui `1`(F, pois `0` e `2` são mais próximos ou não usados; na sequência restante `0, 4`, nem `1` nem `2` aparecem, sai qualquer um diferente de `0`); `0`(hit); `4`(F) → **Total: 6 page faults**.

---

## Módulo 5: Gerência de Entrada/Saída (E/S) e Armazenamento

O subsistema de E/S oculta peculiaridades do hardware por meio de quatro camadas principais: **tratadores de interrupção**, **drivers de dispositivos**, **software de E/S independente de dispositivo** (bufferização, tamanho de bloco uniforme, tratamento de erros) e **software em espaço de usuário**.

### Categorias de Dispositivos e Técnicas de Comunicação

* **Categorias:** dispositivos de **bloco** (endereçáveis em blocos fixos, ex.: SSD/HDD), dispositivos de **caractere** (fluxo serial não endereçável, ex.: teclado, mouse), dispositivos de **rede** (interface *socket*) e **clocks/timers**.
* **Técnicas de Comunicação CPU ↔ Dispositivo:**
  * **Polling (Sondagem):** CPU testa repetidamente registradores de status em espera ocupada.
  * **Interrupções:** controlador avisa a CPU via linha de interrupção e **vetor de interrupções** quando o dispositivo termina.
  * **E/S Mapeada em Memória (*Memory-Mapped I/O*):** registradores do dispositivo ocupam endereços do espaço de memória física.
  * **DMA (*Direct Memory Access*):** um controlador dedicado transfere grandes blocos diretamente entre o dispositivo e a RAM sem ocupar a CPU byte a byte, gerando apenas **uma interrupção** ao final do bloco.

### Armazenamento Secundário, NAS vs. SAN e Escalonamento de Disco

| Tecnologia | Características de Acesso e Desempenho |
| :--- | :--- |
| **Discos Magnéticos (HDD)** | Partes móveis (5.400 a 15.000 RPM). Tempo de acesso aleatório = **Tempo de busca (*seek time*)** + **Latência rotacional** + tempo de transferência. |
| **SSDs (*Solid State Drives*)** | Memória flash não volátil sem partes móveis (`seek = 0`, sem latência rotacional); muito mais rápidos e confiáveis mecanicamente; adotam escalonamento simples **FCFS** (pois não há deslocamento de braço). |
| **Fitas Magnéticas** | Excelente custo/capacidade para backup e arquivamento sequencial; acesso aleatório muito lento. |
| **NAS vs. SAN** | **NAS (*Network Attached Storage*):** via Ethernet, enxergado pelo SO como **servidor de arquivos** (nível lógico/arquivo, bom para dados não estruturados). **SAN (*Storage Area Network*):** tipicamente via Fibre Channel, enxergado pelo SO como **disco local em nível de bloco** (bom para bancos de dados estruturados). |

#### Exemplo Numérico 5: Escalonamento de Disco (Fila Clássica `[0..199]`)

Fila de solicitações de cilindros: `98, 183, 37, 122, 14, 124, 65, 67`. Cabeça inicialmente no cilindro **`53`** (supondo movimento inicial em direção a `0` no SCAN, e em direção a `199` no C-SCAN/C-LOOK):
* **FCFS:** `53 → 98 → 183 → 37 → 122 → 14 → 124 → 65 → 67`.
  Movimento = `45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = 640 cilindros`.
* **SSTF (*Shortest Seek Time First*):** escolhe sempre o mais próximo da posição atual (risco de *starvation* para extremos!):
  `53 → 65 (12) → 67 (2) → 37 (30) → 14 (23) → 98 (84) → 122 (24) → 124 (2) → 183 (59)` = `236 cilindros`.
* **SCAN (Algoritmo do Elevador):** vai até a extremidade (`0`) e inverte até a última requisição (`183`):
  `53 → 37 → 14 → 0 → 65 → 67 → 98 → 122 → 124 → 183` = `53 + 183 = 236 cilindros`.
* **C-SCAN (*Circular SCAN*):** atende em uma única direção até a extremidade `199`, retorna imediatamente ao `0` e segue até `37` (tempo de espera mais uniforme):
  `53 → 65 → ... → 183 → 199 → 0 → 14 → 37` = `(199 - 53) + (199 - 0) + (37 - 0) = 146 + 199 + 37 = 382 cilindros` (ou `183` cilindros considerando apenas o percurso de atendimento até o último pedido em direção crescente).
* **LOOK / C-LOOK:** otimizações do SCAN/C-SCAN que não tocam as extremidades físicas `0` ou `199` se não houver pedidos lá, parando na requisição mais extrema (`14` ou `183`).

---

## Módulo 6: Sistemas de Arquivos

Um **sistema de arquivos** organiza e persiste dados em volumes formatados (após **formatação física** em setores e **formatação lógica** criando partições, **MBR**, **Boot Block**, **Superblock**, gerenciamento de espaço livre via **Mapa de Bits** ou lista ligada, e estruturas de diretórios). Sistemas modernos como **NTFS**, **EXT4**, **APFS** e **ZFS** utilizam **Journaling** (ou *Copy-on-Write*) para garantir integridade após quedas de energia, ao contrário de sistemas simples como **FAT32** (arquivo máx. 4 GB).

### Métodos de Alocação de Blocos de Arquivo

| Método | Funcionamento | Vantagens | Desvantagens |
| :--- | :--- | :--- | :--- |
| **Alocação Contígua** | Arquivo ocupa sequência contígua de blocos no disco. | Implementação simples e leitura sequencial/aleatória muito rápida. | Sofre **fragmentação externa** e dificuldade ao crescer o arquivo. |
| **Lista Ligada** | Cada bloco guarda ponteiro para o próximo bloco do arquivo. | Elimina fragmentação externa; arquivo cresce facilmente. | **Acesso aleatório extremamente lento** (precisa percorrer ponteiros) e sobrecarga do ponteiro dentro do bloco. |
| **FAT (*File Allocation Table*)** | Lista ligada armazenada centralmente em uma tabela na memória RAM. | Bloco inteiro dedicado a dados; acesso aleatório rápido. | A tabela inteira cresce com o disco e ocupa bastante RAM (ex.: disco de 200 GB com blocos de 1 KB exige ~800 MB de tabela). |
| **I-nodes (UNIX/EXT)** | Estrutura por arquivo contendo metadados e ponteiros (diretos, indiretos simples/duplos/triplos) para os blocos. | Só fica em RAM quando o arquivo está aberto; acesso rápido a arquivos pequenos e médios. | Limite máximo de tamanho definido pelos níveis de indireção. |

---

## Módulo 7: Virtualização, Máquinas Virtuais e Contêineres

A **virtualização** permite executar múltiplos ambientes computacionais isolados sobre um único servidor físico, reduzindo custos de aquisição de hardware, consumo de energia e *downtime*, além de simplificar backup e recuperação rápida via *snapshots*. **Atenção ao ENADE (2014 Q16):** embora traga grandes ganhos, a virtualização (mesmo combinada com Cloud/GED) **não elimina todos os riscos associados à área de TI**!

| Aspecto | Hipervisor Tipo 1 (*Bare-Metal*) | Hipervisor Tipo 2 (*Hosted*) | Contêineres (Docker / OCI) |
| :--- | :--- | :--- | :--- |
| **Camada de execução** | Roda diretamente sobre o **hardware físico** (ex.: VMware ESXi, KVM, Hyper-V). | Roda como **processo sobre um SO hospedeiro** (ex.: VirtualBox, VMware Workstation). | Roda sobre o **kernel único do SO hospedeiro**, isolado via *namespaces* e *cgroups*. |
| **SO completo por instância?** | Sim (cada VM tem seu próprio SO convidado/visitante). | Sim (mantém estrutura dos SOs visitantes originais). | **Não** (compartilham o mesmo kernel do host; apenas bibliotecas/binários de usuário isolados). |
| **Segurança e Isolamento** | Alto isolamento; ideal para data centers corporativos. | **Atenção ENADE 2021 Q11:** um *malware* instalado no **SO hospedeiro** pode comprometer/infectar os SOs visitantes! | Menor overhead, inicialização em milissegundos; isolamento menor que VM completa por compartilhar kernel. |

---

## Resumo Estratégico para o ENADE

1. **Estados de Processos:** Apenas `Pronto → Executando` e `Executando → Pronto` são causadas pelo escalonador de CPU; bloqueio ocorre por E/S/espera do próprio processo.
2. **Threads e Amdahl:** Threads compartilham código, dados, heap e arquivos, mas têm pilha e registradores próprios. Na Lei de Amdahl, `Speedup = 1 / (S + (1 - S)/N)`.
3. **Escalonamento e Deadlock:** **SRTN** é a versão preemptiva do SJF; **RM** usa prioridade fixa (menor período) e **EDF** usa prioridade dinâmica (menor *deadline*). Deadlock exige as **4 condições simultâneas** (exclusão mútua, posse e espera, não preempção, espera circular); **Banqueiro** garante estado seguro.
4. **Memória e E/S:** **Page fault** é uma *trap* gerada quando a página não está na RAM; **DMA** libera a CPU durante transferências de blocos; **NAS** trabalha em nível de arquivo (Ethernet) e **SAN** em nível de bloco (Fibre Channel). Em **SSDs**, usa-se **FCFS**.
5. **Virtualização:** No **Hipervisor Tipo 2**, o VMM é um processo do SO hospedeiro, mantendo os SOs originais como visitantes, simplificando recuperação e economizando hardware — porém vulnerabilidades/malwares no SO hospedeiro afetam os visitantes.
