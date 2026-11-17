# Sistemas Distribuídos

> **Foco ENADE:** Em Sistemas Distribuídos, o ENADE explora a escolha arquitetural diante de requisitos de escalabilidade, consistência e tolerância a falhas (**Cliente-Servidor**, **P2P/DHT**, **Microsserviços**, **Replicação Primária/Passiva**), protocolos de comunicação (**RPC/RMI**, **REST**, **gRPC** e **Mensageria**), ordenação de eventos (**Relógios Lógicos de Lamport**), **Exclusão Mútua Distribuída**, **Teorema CAP e Consenso**, além de **Computação em Nuvem** (**IaaS**, **PaaS**, **SaaS**, modelos de implantação, SLAs e restrições legais de dados).

---

## Módulo 1: Fundamentos e Transparências de Sistemas Distribuídos

Segundo Andrew Tanenbaum e George Coulouris, um **sistema distribuído** é um conjunto de computadores autônomos interconectados em rede que se apresentam ao usuário como um **sistema único e coerente**, coordenando ações exclusivamente pela **troca de mensagens** (sem memória física compartilhada).

### Objetivos e Graus de Transparência (ISO/ODP)

A camada de **middleware** oculta a heterogeneidade de hardware, sistemas operacionais e redes, oferecendo diferentes tipos de **transparência de distribuição**:

| Tipo de Transparência | O que Oculta do Usuário / Aplicação | Exemplo Prático |
| :--- | :--- | :--- |
| **Acesso** | Diferenças na representação de dados e na forma como recursos são acessados (endianness, SO). | Acessar arquivos ou APIs independentemente do sistema operacional do servidor. |
| **Localização** | Onde o recurso reside fisicamente na rede. | URLs/nomes DNS ou chaves em uma tabela hash distribuída (DHT). |
| **Migração** | Movimentação de um recurso para outro nó sem mudar seu identificador. | Mover um objeto/documento em uma rede P2P com DHT mantendo o mesmo identificador lógico. |
| **Relocação** | Movimentação de um recurso **enquanto está em uso** sem interromper sessões ativas. | Migração a quente (*live migration*) de máquinas virtuais ou serviços em nuvem. |
| **Replicação** | Existência de múltiplas cópias de um mesmo dado ou serviço. | Réplicas de leitura em bancos distribuídos ou nós de CDN. |
| **Concorrência** | Compartilhamento simultâneo de um recurso por múltiplos usuários/processos. | Bloqueios distribuídos e controle de transações sem interferência mútua. |
| **Falha** | Quedas e recuperações parciais de nós ou enlaces de comunicação. | *Failover* automático para uma réplica secundária transparente ao cliente. |

---

## Módulo 2: Comunicação em Sistemas Distribuídos

Sem memória compartilhada, processos distribuídos comunicam-se por **IPC em rede** (Sockets TCP/UDP), chamadas remotas síncronas ou mensageria assíncrona.

### Comparativo entre Paradigmas de Comunicação

| Mecanismo | Acoplamento Temporal | Formato / Transporte | Características Principais |
| :--- | :--- | :--- | :--- |
| **Sockets (TCP/UDP)** | Síncrono / Baixo nível | Fluxo de bytes ou datagramas | Controle total ao programador; exige definir manualmente enquadramento, serialização e tratamento de erros. |
| **RPC / Java RMI** | Síncrono (em geral) | Stubs/Skeletons binários | Faz uma chamada remota parecer chamada local (transparência de acesso); *marshalling* e *unmarshalling* de parâmetros. |
| **REST (HTTP)** | Síncrono (Request/Reply) | JSON / XML sobre HTTP/1.1+ | Orientado a recursos (URI + verbos `GET`, `POST`, `PUT`, `DELETE`), *stateless*, cacheável, interoperável na Web. |
| **gRPC** | Síncrono ou *Streaming* | **Protocol Buffers** (binário) sobre **HTTP/2** | Altíssimo desempenho, contratos fortemente tipados (`.proto`), multiplexação de fluxos e geração automática de stubs. |
| **Mensageria (MOM)** | **Assíncrono** (desacoplado) | Filas (*Point-to-Point*) ou Tópicos (*Pub/Sub*) | Utiliza *brokers* (RabbitMQ, Apache Kafka); tolera picos de carga, desacopla produtor e consumidor no tempo. |

### Semânticas de Entrega em Falhas de Comunicação

* **At-most-once (no máximo uma vez):** não retransmite ou deduplica; a operação executa 0 ou 1 vez (evita duplicidade, mas pode perder mensagens).
* **At-least-once (ao menos uma vez):** retransmite até confirmar; garante execução, mas pode duplicar mensagens — exige operações **idempotentes** no consumidor (ex.: usar `id_transacao` único).
* **Exactly-once (exatamente uma vez):** alcançada logicamente combinando entrega *at-least-once* com **deduplicação/idempotência** ou transações coordenadas.

---

## Módulo 3: Arquiteturas Distribuídas — Cliente-Servidor, P2P, Grid e Microsserviços

| Arquitetura | Organização e Papel dos Nós | Vantagens e Casos de Uso | Limitações / Pontos de Atenção |
| :--- | :--- | :--- | :--- |
| **Cliente-Servidor** | Separação clara entre solicitantes (clientes) e provedores (servidores). | Facilita governança, segurança centralizada e otimização de máquinas locais com poucos recursos (ex.: thin clients acessando servidores em nuvem). | Servidor central pode virar ponto único de falha (SPOF) ou gargalo sem replicação/balanceamento. |
| **Peer-to-Peer (P2P)** | Nós equivalentes (**peers**) atuam simultaneamente como clientes e servidores. | Excelente para distribuição massiva de leitura e redução de consumo de banda em servidores centrais; redes **DHT** oferecem transparência de localização e migração. | Difícil garantir consistência forte em escritas concorrentes frequentes. |
| **Grid Computing** | Federação de recursos heterogêneos em 4 camadas (**Rede**, **Recursos**, **Middleware**, **Ferramentas e Aplicações**). | Agrega poder computacional distribuído para processamento científico/pesado. | O **Middleware** provê interconectividade e comunicação; a camada **Rede** provê conectividade física/lógica entre membros. |
| **Microsserviços** | Decomposição do sistema em serviços pequenos, autônomos e com banco próprio por domínio. | Escalabilidade independente, implantação contínua e isolamento de falhas. | Maior complexidade operacional: exige *API Gateway*, *Service Discovery*, *Circuit Breaker* e padrão **Saga** para transações distribuídas. |

> **Atenção ao ENADE (Consistência em Edição Colaborativa):** Em sistemas cliente-servidor com **cache no cliente**, editar documentos concorrentemente em cache local **sem** protocolo de coerência/invalidação compromete a consistência dos dados!

---

## Módulo 4: Sincronização de Tempo, Relógios Lógicos e Exclusão Mútua

Em sistemas distribuídos não existe um relógio físico global perfeitamente sincronizado devido ao *clock drift* (deriva dos cristais) e ao atraso variável da rede.

### Relógios Físicos vs. Relógios Lógicos de Lamport

* **Sincronização de Relógios Físicos:**
  * **Algoritmo de Cristian:** cliente consulta servidor de tempo (UTC) e ajusta para `T_servidor + RTT/2`.
  * **Algoritmo de Berkeley:** servidor coordenador coleta diferenças de tempo de todos os nós, calcula a média (descartando discrepâncias) e envia ajustes relativos (não exige relógio externo UTC).
  * **NTP (*Network Time Protocol*):** hierarquia de estratos (*strata*) usada na Internet para sincronização com precisão de milissegundos.
* **Relógios Lógicos de Lamport:** definem uma ordenação causal parcial pela relação **"aconteceu antes" (`a → b`)**, sem depender de tempo físico:
  1. Cada processo `P_i` mantém um contador inteiro `C_i` inicializado em `0`.
  2. Antes de cada evento interno ou envio de mensagem, `P_i` incrementa `C_i = C_i + 1`.
  3. Ao enviar uma mensagem `m`, anexa o timestamp `t = C_i`.
  4. Ao receber `(m, t)`, o processo `P_j` atualiza seu relógio: `C_j = max(C_j, t) + 1`.
  * Propriedade: se `a → b`, então `C(a) < C(b)`. *(A recíproca não é garantida em relógios escalares simples; para detectar causalidade exata e concorrência usa-se **Relógios Vetoriais**).*

#### Exemplo Numérico 1: Execução dos Relógios Lógicos de Lamport

Considere três processos `P1`, `P2` e `P3` com relógios iniciais `C1 = 0, C2 = 0, C3 = 0`:
1. `P1` executa evento interno `e1`: `C1 = 0 + 1 = 1`.
2. `P1` envia mensagem `m1` para `P2`: `C1 = 1 + 1 = 2`, envia `(m1, t = 2)`.
3. `P2` executa evento interno `e2`: `C2 = 0 + 1 = 1`.
4. `P2` recebe `(m1, t = 2)`: `C2 = max(1, 2) + 1 = 3`.
5. `P2` envia `m2` para `P3`: `C2 = 3 + 1 = 4`, envia `(m2, t = 4)`.
6. `P3` recebe `(m2, t = 4)`: `C3 = max(0, 4) + 1 = 5`.
Observe que `C(e1)=1 < C(envio m1)=2 < C(recebimento m1)=3 < C(envio m2)=4 < C(recebimento m2)=5`, preservando toda a cadeia causal!

### Exclusão Mútua Distribuída e Eleição de Líder

| Algoritmo de Exclusão Mútua | Mensagens por Entrada/Saída | Ponto Único de Falha? | Funcionamento Resumido |
| :--- | :--- | :--- | :--- |
| **Centralizado** | `3` (Request, Grant, Release) | Sim (Coordenador) | Um coordenador concede permissão em fila FIFO; simples, mas vulnerável à queda do coordenador. |
| **Distribuído (Ricart-Agrawala)** | `2 × (N - 1)` | Não (mas qualquer nó offline trava o grupo) | Envia multicast com timestamp de Lamport para todos; entra na seção crítica após receber `OK` de todos os `N - 1` pares. |
| **Anel Lógico (Token Ring)** | `1` a `∞` (passagem contínua) | Perda do *token* | Um token circula em anel lógico; quem possui o token pode entrar na seção crítica. |

Para reeleger um coordenador após falha, usam-se algoritmos de **Eleição de Líder**, como **Bully (Valentão)** — o processo de maior ID assume após enviar mensagens `ELECTION` aos IDs maiores — e **Anel (Chang-Roberts)** — mensagem de eleição percorre o anel coletando IDs ativos até eleger o maior.

---

## Módulo 5: Replicação, Teorema CAP, Consenso e Tolerância a Falhas

Replicar dados e serviços melhora a **disponibilidade**, o **desempenho de leitura** (proximidade geográfica) e a **tolerância a falhas**, mas impõe o desafio de manter as réplicas consistentes.

### Estratégias de Replicação

* **Replicação Passiva (Primária-Backup / *Mirroring*):** um nó **primário** processa todas as atualizações e propaga o novo estado para os nós **backups**. Se o primário falhar, um backup assume (*failover*).
  * **Cópia Primária:** adequada inclusive para cenários de escrita concorrente global, pois serializa escritas em um coordenador primário por item/partição, escalando leituras sem sacrificar gravemente a consistência.
* **Replicação Ativa (Máquina de Estados Replicada):** todas as réplicas recebem e executam deterministicamente todas as requisições na mesma ordem (exige difusão atômica / consenso).

### Teorema CAP e Quórum de Leitura/Escrita

O **Teorema CAP** (Eric Brewer) estabelece que, diante de uma **partição de rede (`P`)**, um sistema de armazenamento distribuído deve escolher entre garantir:
* **Consistência (`C` — *Linearizability*):** toda leitura retorna a escrita mais recente ou um erro (sistema **CP**, ex.: ZooKeeper, etcd, HBase).
* **Disponibilidade (`A`):** todo nó não falho responde sem erro, mesmo que com dados eventualmente desatualizados (sistema **AP**, ex.: Cassandra em configuração padrão, Dynamo).

Como partições de rede são inevitáveis em sistemas distribuídos reais, a escolha prática na falha é **CP vs. AP** (expandida pelo modelo **PACELC**, que considera o trade-off Latência × Consistência mesmo sem partições).

#### Exemplo Numérico 2: Cálculo de Quórum (`R + W > N`)

Em um banco distribuído com **`N = 5` réplicas** de cada dado, deseja-se garantir **consistência forte por interseção de quóruns** (ou seja, toda leitura lê ao menos uma réplica que possui a escrita mais recente). A condição necessária é `R + W > N` (e `W > N / 2` para evitar conflitos entre duas escritas simultâneas):
* Como `N = 5`, precisamos `W > 2,5`, logo `W >= 3` (quórum de escrita = **3** réplicas confirmando).
* Se escolhermos `W = 3`, o quórum mínimo de leitura será `R = N - W + 1 = 5 - 3 + 1 = 3` (`3 + 3 = 6 > 5`), garantindo pelo menos **1 réplica em comum** entre escrita e leitura.
* Se quisermos priorizar leituras ultrarrápidas (`R = 1`), devemos exigir `W = 5` (`1 + 5 = 6 > 5`), tolerando zero falhas na escrita!

### Consenso e Tolerância a Falhas

* **Modelos de Falha:** *Crash-stop* (nó para e não volta), *Crash-recovery* (para e reinicia), *Omissão* (perde mensagens), *Temporização* (estoura prazos) e **Bizantina** (nó envia respostas arbitrárias ou maliciosas).
* **Protocolos de Consenso:** **Paxos** e **Raft** (baseado em eleição de líder, replicação de log por maioria simples `N = 2f + 1` para tolerar `f` falhas de parada). Para tolerar `f` **falhas bizantinas**, são necessários no mínimo `N = 3f + 1` nós (ex.: **PBFT**, redes blockchain).
* **Mecanismos de Tolerância a Falhas:** detecção via *heartbeat*, *timeouts*, mascaramento por redundância (TMR), *checkpointing* periódico combinado com *log* de mensagens para *rollback* consistente.

---

## Módulo 6: Computação em Nuvem (*Cloud Computing*)

Conforme a definição do **NIST**, a computação em nuvem fornece acesso sob demanda pela rede a um pool compartilhado de recursos computacionais configuráveis, com **5 características essenciais**: (1) autoatendimento sob demanda, (2) amplo acesso à rede, (3) pool de recursos multilocatário (*multi-tenant*), (4) **elasticidade rápida** (escalar para cima e para baixo conforme demanda) e (5) serviço mensurado (*pay-per-use*).

### Modelos de Serviço (IaaS, PaaS, SaaS)

| Modelo | O Cliente Gerencia | O Provedor Gerencia | Cenário Ideal e Restrições (Foco ENADE) |
| :--- | :--- | :--- | :--- |
| **IaaS** (*Infrastructure as a Service*) | Sistema operacional, middleware, runtime, dados e aplicações. | Servidores físicos, rede, storage e virtualização/hipervisor. | **Recomendado** para PMEs cujo crescimento de infraestrutura não acompanha a expansão e para sistemas com **demandas oscilantes** (ex.: e-commerce em Black Friday). Ex.: AWS EC2, Azure VMs. |
| **PaaS** (*Platform as a Service*) | Aplicações e dados. | Infraestrutura, SO, runtime, bancos gerenciados e escalonamento da plataforma. | **Indicado para equipes próprias de desenvolvedores** que querem focar no código sem gerenciar servidores. Ex.: Heroku, Azure App Service, Google App Engine. |
| **SaaS** (*Software as a Service*) | Apenas configurações de usuário e uso da aplicação. | Toda a pilha (infraestrutura até o software final). | Acesso pronto via navegador por assinatura (*pay-per-use*). **Não** é voltado a quem deseja comprar grandes volumes de licenças perpétuas locais, nem recomendado (assim como IaaS público) quando há **restrições legais rígidas** contra armazenamento ou terceirização externa de dados sensíveis/públicos. Ex.: Google Workspace, Microsoft 365. |

### Modelos de Implantação

* **Nuvem Pública:** infraestrutura compartilhada por múltiplos clientes, operada por provedor terceiro via Internet.
* **Nuvem Privada:** infraestrutura exclusiva para uma única organização (on-premises ou hospedada), ideal quando há exigências severas de conformidade, soberania de dados ou sigilo legal.
* **Nuvem Híbrida:** combina nuvem privada (dados sensíveis/legados) com nuvem pública (picos elásticos — *cloud bursting*).
* **Nuvem Comunitária:** compartilhada por organizações com interesses, políticas e requisitos regulatórios comuns (ex.: consórcio de universidades ou órgãos públicos).

---

## Resumo Estratégico para o ENADE

1. **Arquiteturas Distribuídas:** **Cliente-Servidor** permite que máquinas locais modestas consumam processamento remoto; **P2P com DHT** otimiza distribuição massiva de leitura e oferece transparência de migração; **cache local sem coerência** compromete escrita colaborativa concorrente; **cópia primária** e **replicação passiva** são estratégias-chave de escalabilidade e tolerância a falhas.
2. **Comunicação:** **REST** (HTTP/JSON, *stateless*); **gRPC** (HTTP/2 + Protobuf binário, alto desempenho); **Mensageria** (assíncrona, desacoplamento temporal, exige idempotência em *at-least-once*).
3. **Tempo e Consenso:** **Relógios de Lamport** ordenam causalmente (`C_j = max(C_j, t) + 1`), mas não detectam sozinhos eventos concorrentes (papel dos Relógios Vetoriais). No **Teorema CAP**, havendo partição (`P`), escolhe-se **CP** ou **AP**. Quórum forte requer `R + W > N`.
4. **Computação em Nuvem:** **IaaS** atende bem demandas oscilantes e PMEs em expansão; **PaaS** é ideal para times próprios de desenvolvedores; **SaaS** opera por assinatura/uso, não por compra tradicional de licenças; nuvens públicas (IaaS/SaaS) sofrem restrições quando há **impedimento legal** de terceirização ou guarda externa de dados.
