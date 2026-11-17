# Redes de Computadores

> **Foco ENADE:** Na prova de Sistemas de Informação, Redes de Computadores exige domínio integrado entre a pilha de protocolos (modelos OSI e TCP/IP), endereçamento IPv4/CIDR e NAPT, roteamento intra-AS e inter-AS (OSPF vs. BGP), semântica de transporte confiável no TCP (números de sequência, ACK acumulativo, janela deslizante e controle de congestionamento), serviços essenciais de aplicação (DNS, DHCP, HTTP, SMTP/IMAP) e mecanismos de segurança em rede (criptografia simétrica/assimétrica, certificação digital, firewalls e VPNs).

---

## Módulo 1: Arquiteturas de Redes — Modelos OSI e TCP/IP

Uma arquitetura de rede organiza hardware e software de comunicação em **camadas hierárquicas**, nas quais cada camada oferece serviços à camada imediatamente superior e utiliza os serviços da camada inferior por meio de interfaces bem definidas. Na comunicação entre dois hospedeiros, os dados descem a pilha na origem recebendo cabeçalhos de controle (**encapsulamento**) e sobem no destino removendo-os (**desencapsulamento**).

### Comparativo entre o Modelo OSI e a Arquitetura TCP/IP

Embora frequentemente comparados, o **modelo OSI** (ISO, 7 camadas) é um modelo de referência conceitual criado antes dos protocolos comerciais, enquanto a **arquitetura TCP/IP** (4 camadas na formulação clássica de Tanenbaum/RFC 1122, ou 5 camadas na abordagem híbrida de Kurose) nasceu da prática da Internet. **Atenção:** a arquitetura TCP/IP **não** é uma implementação literal de 7 camadas do modelo OSI.

| Camada OSI (7 camadas) | Camada TCP/IP (4 camadas) | Unidade de Dados (PDU) | Principais Funções e Protocolos |
| :--- | :--- | :--- | :--- |
| **7. Aplicação** | **4. Aplicação** | Dados / Mensagem | Interface com aplicações do usuário: HTTP, HTTPS, DNS, DHCP, SMTP, IMAP, FTP, SSH. |
| **6. Apresentação** | *(absorvida na Aplicação)* | Dados | Conversão de formatos, codificação (UTF-8), compressão e criptografia em nível de aplicação. |
| **5. Sessão** | *(absorvida na Aplicação)* | Dados | Estabelecimento, sincronização (pontos de verificação) e gerenciamento de diálogo entre sessões. |
| **4. Transporte** | **3. Transporte** | Segmento (TCP) / Datagrama (UDP) | Comunicação processo a processo (portas), multiplexação, controle de fluxo e recuperação de erros fim a fim (TCP, UDP). |
| **3. Rede** | **2. Inter-rede (Rede)** | Pacote / Datagrama IP | Endereçamento lógico global, roteamento entre redes distintas e fragmentação/remontagem (IPv4, IPv6, ICMP, OSPF, BGP). |
| **2. Enlace de Dados** | **1. Interface de Rede (Acesso à Rede)** | Quadro (*Frame*) | Delimitação de quadros, endereçamento físico (MAC), controle de acesso ao meio (MAC/CSMA) e detecção de erros (CRC). |
| **1. Física** | *(absorvida na Interface de Rede)* | Bit | Transmissão bruta de bits em meios guiados ou não guiados, sinais elétricos/ópticos, modulação e conectores. |

### Dispositivos de Interconexão e Camadas de Atuação

Um erro clássico cobrado no ENADE envolve associar equipamentos às camadas erradas ou confundir **domínio de colisão** com **domínio de broadcast (difusão)**.

| Dispositivo | Camada Máxima de Atuação | Endereço Utilizado | Domínio de Colisão | Domínio de Broadcast | Comportamento Típico |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Repetidor / Hub** | Camada 1 (Física) | Nenhum | Único (compartilhado entre todas as portas) | Único | Regenera e replica sinais elétricos/bits para todas as demais portas. |
| **Bridge / Switch (L2)** | Camada 2 (Enlace) | Endereço MAC (48 bits) | Um por porta (segmentado) | Único (salvo se houver VLANs) | Aprende endereços MAC dinamicamente e encaminha quadros seletivamente; quadros de broadcast (`FF:FF:FF:FF:FF:FF`) são enviados a todas as portas do segmento. |
| **Roteador** | Camada 3 (Rede) *(opera também Enlace e Física nas interfaces)* | Endereço IP (IPv4/IPv6) | Um por interface | Um por interface (separa domínios de broadcast) | Interliga redes distintas (mesmo com camadas físicas diferentes), consulta tabelas de roteamento e filtra/encaminha pacotes IP. |
| **Gateway (de Aplicação)** | Todas as camadas (até Camada 7) | Depende da aplicação / IP + Porta | Separado por rede | Separado por rede | Realiza tradução completa entre arquiteturas, formatos de dados ou protocolos de aplicação distintos. |

> **Pegadinha clássica de prova:** Comutadores (*switches*) tradicionais de Camada 2 realizam encaminhamento seletivo de quadros com base no **endereço MAC**, **nunca** no endereço IP. Apenas roteadores (ou switches L3 multicamada com função de roteamento) inspecionam cabeçalhos IP.

---

## Módulo 2: Camada Física, Enlace de Dados e Ethernet (IEEE 802.3)

A camada de enlace garante a entrega de quadros entre nós adjacentes conectados a um mesmo enlace físico. O padrão dominante em redes locais cabeadas é o **Ethernet (IEEE 802.3)**, enquanto redes locais sem fio utilizam **Wi-Fi (IEEE 802.11)**.

### Subcamadas do Enlace, Endereçamento MAC e ARP

O IEEE 802 divide a camada de enlace em duas subcamadas:
1. **LLC (*Logical Link Control* — 802.2):** interface com a camada de rede, identificando o protocolo encapsulado (ex.: IPv4, IPv6, ARP).
2. **MAC (*Media Access Control*):** controla quando e como as estações acessam o meio físico e identifica interfaces por um **endereço MAC de 48 bits** (6 bytes em hexadecimal, ex.: `00:1A:2B:3C:4D:5E`), gravado na placa de rede.

Como a camada de rede trabalha com IP e o enlace entrega quadros via MAC, o protocolo **ARP (*Address Resolution Protocol*)** resolve um endereço IPv4 conhecido na rede local para o respectivo endereço MAC, enviando uma requisição em **broadcast** na LAN e recebendo uma resposta em **unicast**.

### Protocolos de Controle de Acesso ao Meio (MAC)

* **CSMA/CD (*Carrier Sense Multiple Access with Collision Detection* — IEEE 802.3 com hubs/barramento):** utilizado em segmentos Ethernet compartilhados (half-duplex). A estação escuta o meio antes de transmitir (*carrier sense*); se duas estações transmitirem simultaneamente, ocorre colisão, ambas abortam a transmissão, emitem sinal de *jam* e aguardam tempo aleatório (*backoff* exponencial binário) antes de tentar novamente. **Importante:** na Ethernet clássica, há detecção de colisão e verificação de integridade via **FCS/CRC** no quadro, porém **não há envio de quadros de confirmação (ACK) de recebimento** na camada de enlace. Em switches modernos *full-duplex*, colisões são eliminadas porque cada porta forma um enlace ponto a ponto dedicado.
* **CSMA/CA (*Carrier Sense Multiple Access with Collision Avoidance* — IEEE 802.11 Wi-Fi):** em redes sem fio, detectar colisões durante a própria transmissão é inviável devido ao problema do terminal oculto e à atenuação do sinal. Por isso, usa-se prevenção de colisões com tempos de espera aleatórios, confirmações explícitas (ACK no enlace sem fio) e troca opcional de **RTS/CTS**.
* **Passagem de Token (*Token Ring* — IEEE 802.5):** protocolo determinístico livre de colisões, no qual apenas a estação que possui o quadro especial (*token*) pode transmitir.

---

## Módulo 3: Camada de Rede — IPv4, Sub-redes CIDR, NAT/NAPT e IPv6

A camada de rede promove a comunicação **hospedeiro a hospedeiro** através de múltiplas redes interconectadas. Na Internet, o protocolo central é o **IP (*Internet Protocol*)**, que provê um serviço de entrega de melhor esforço (**best-effort**), **não orientado a conexão** e **sem garantia de entrega, ordem ou integridade dos dados** (essa confiabilidade é delegada às camadas superiores, como o TCP, quando necessária).

### Campos Críticos do Cabeçalho IPv4 e ICMP

* **TTL (*Time to Live* — 8 bits):** contador decrementado em 1 unidade a cada roteador atravessado. Quando chega a `0`, o roteador descarta o pacote e envia uma mensagem ICMP *Time Exceeded* à origem. Isso impede que pacotes fiquem em **loop infinito** caso haja inconsistência nas tabelas de roteamento. **Atenção:** o TTL **não** serve para garantir sequenciamento de pacotes!
* **Identificação, Flags e Deslocamento de Fragmento (*Fragment Offset*):** quando o tamanho do datagrama IPv4 excede a **MTU (*Maximum Transmission Unit*)** do enlace seguinte (ex.: Ethernet padrão = 1.500 bytes), qualquer roteador no caminho (ou a origem) pode **fragmentar** o datagrama em pacotes menores, que só serão remontados no **hospedeiro de destino** (no IPv6, roteadores não fragmentam; apenas o nó de origem fragmenta).
* **Protocolo (8 bits):** indica qual protocolo superior está encapsulado no payload (ex.: `1` = ICMP, `6` = TCP, `17` = UDP).
* **ICMP (*Internet Control Message Protocol*):** troca mensagens de erro e controle entre hosts e roteadores (ex.: *Echo Request/Reply* usado pelo `ping`, *Destination Unreachable*, *Time Exceeded* usado pelo `traceroute`). Mensagens ICMP trafegam **encapsuladas dentro de datagramas IP**.

### Endereçamento IPv4, Classes Históricas, Faixas Privadas e CIDR

Historicamente, os endereços IPv4 (32 bits = 4 octetos) eram divididos em classes fixas:
* **Classe A:** `0.0.0.0` a `127.255.255.255` (máscara padrão `/8` ou `255.0.0.0`).
* **Classe B:** `128.0.0.0` a `191.255.255.255` (máscara padrão `/16` ou `255.255.0.0`).
* **Classe C:** `192.0.0.0` a `223.255.255.255` (máscara padrão `/24` ou `255.255.255.0`).

Faixas reservadas fundamentais:
* **Endereços Privados (RFC 1918 — não roteáveis na Internet pública):** `10.0.0.0/8`, `172.16.0.0/12` (`172.16.0.0` a `172.31.255.255`) e `192.168.0.0/16`.
* **Loopback:** `127.0.0.0/8` (ex.: `127.0.0.1`).
* **APIPA (*Link-Local*):** `169.254.0.0/16` (atribuído automaticamente quando falha a obtenção via DHCP).

No roteamento moderno sem classes (**CIDR — *Classless Inter-Domain Routing***), utiliza-se a notação `/n`, onde `n` indica o número de bits da porção de **rede (prefixo)** e `32 - n` indica os bits de **host**:
* Total de endereços na sub-rede: `2^(32 - n)`
* Endereços utilizáveis por hosts: `2^(32 - n) - 2` (subtraem-se o primeiro endereço = **endereço de rede**, e o último = **endereço de broadcast**).

#### Exemplo Numérico 1: Divisão em Sub-redes CIDR e Teste de Mesma Sub-rede

**Problema A:** Uma organização recebeu o bloco `192.168.20.0/24` e precisa dividi-lo em **4 sub-redes** de igual tamanho. Determine a nova máscara, o número de hosts válidos por sub-rede e os endereços de cada sub-rede.

1. Para criar `4 = 2^2` sub-redes, emprestamos **2 bits** da parte de host: novo prefixo `24 + 2 = /26`.
2. Máscara `/26` em binário: `11111111.11111111.11111111.11000000` = `255.255.255.192` (pois `128 + 64 = 192`).
3. Bits de host restantes: `32 - 26 = 6` bits. Total de IPs por sub-rede: `2^6 = 64`. Hosts válidos: `64 - 2 = 62`.

| Sub-rede | Endereço de Rede | Primeiro Host Válido | Último Host Válido | Endereço de Broadcast |
| :--- | :--- | :--- | :--- | :--- |
| **Sub-rede 1** | `192.168.20.0/26` | `192.168.20.1` | `192.168.20.62` | `192.168.20.63` |
| **Sub-rede 2** | `192.168.20.64/26` | `192.168.20.65` | `192.168.20.126` | `192.168.20.127` |
| **Sub-rede 3** | `192.168.20.128/26` | `192.168.20.129` | `192.168.20.190` | `192.168.20.191` |
| **Sub-rede 4** | `192.168.20.192/26` | `192.168.20.193` | `192.168.20.254` | `192.168.20.255` |

**Problema B:** Os hosts `192.168.20.70` e `192.168.20.130`, ambos com máscara `255.255.255.192` (`/26`), estão na mesma sub-rede?
* Aplicando a operação lógica **AND bit a bit** com a máscara `192` (`11000000` em binário) no último octeto:
  * `70` = `01000110` AND `11000000` = `01000000` (`64`) → Rede `192.168.20.64/26`.
  * `130` = `10000010` AND `11000000` = `10000000` (`128`) → Rede `192.168.20.128/26`.
* **Conclusão:** São sub-redes distintas; portanto, o host de origem enviará o pacote para o **gateway padrão (roteador)** em vez de tentar entrega direta na camada de enlace.

### NAT e NAPT (PAT)

Para contornar a escassez de endereços IPv4 públicos, redes internas utilizam endereços privados (ex.: `10.0.0.1` e `10.0.0.2`) atrás de um roteador com **NAPT (*Network Address Port Translation*)**, que possui um único IP público válido na interface externa (ex.: `138.76.28.4`).
* Quando os computadores internos A e B acessam simultaneamente um servidor Web externo, o roteador NAPT substitui o IP de origem privado de **ambos** os pacotes pelo **mesmo IP público da interface externa** (`138.76.28.4`), diferenciando os fluxos na tabela de tradução por meio de **números de porta de origem distintos**. Assim, o servidor externo enxerga `138.76.28.4` como IP de origem para ambos os acessos.

### IPv6

Projetado para substituir gradualmente o IPv4, o **IPv6** possui endereços de **128 bits** (representados em 8 grupos hexadecimais de 16 bits separados por dois-pontos, ex.: `2001:0db8:0000:0000:0000:ff00:0042:8329`, abreviado como `2001:db8::ff00:42:8329` suprimindo zeros à esquerda e usando `::` uma única vez para blocos consecutivos de zeros). Principais evoluções:
* Espaço de endereçamento de `2^128` endereços (elimina a necessidade prática de NAT para conservação de endereços).
* Cabeçalho básico fixo de **40 bytes** (sem campo de *checksum* na camada de rede e sem opções no cabeçalho fixo — movidas para cabeçalhos de extensão).
* Remoção de broadcast em favor de **multicast** e **anycast**; descoberta de vizinhos via **NDP** (substituindo o ARP).
* Suporte nativo à autoconfiguração sem estado (**SLAAC**) e segurança integrada (**IPsec**).

---

## Módulo 4: Roteamento Intra-AS e Inter-AS na Internet

A Internet é estruturada em milhares de **Sistemas Autônomos (AS — *Autonomous Systems*)**, conjuntos de redes e roteadores sob uma única administração técnica (operadoras, universidades, grandes empresas), identificados por um número único (**ASN**).

### Protocolos de Roteamento Interno (IGP) vs. Externo (EGP)

* **IGP (*Interior Gateway Protocol*):** roteia pacotes **dentro** de um mesmo Sistema Autônomo, buscando tipicamente o caminho de menor custo ou menor número de saltos:
  * **RIP (*Routing Information Protocol*):** baseado em **Vetor de Distância** (algoritmo de Bellman-Ford). Usa contagem de saltos como métrica (limite máximo de **15 saltos**; 16 = infinito/inalcançável), sujeito a convergência lenta em redes grandes.
  * **OSPF (*Open Shortest Path First*):** baseado em **Estado de Enlace** (*Link-State*, algoritmo de **Dijkstra**). Cada roteador conhece a topologia completa da área e calcula a árvore de caminho mínimo usando métricas baseadas em largura de banda/custo.
  * **IS-IS (*Intermediate System to Intermediate System*):** protocolo de estado de enlace amplamente usado em backbones de provedores.
  * **IGRP / EIGRP:** protocolos proprietários históricos/híbridos da Cisco para roteamento interno.
* **EGP (*Exterior Gateway Protocol*):** roteia pacotes **entre Sistemas Autônomos diferentes**. O padrão absoluto da Internet é o **BGP (*Border Gateway Protocol*, atualmente BGP-4)**, que opera por **vetor de caminho (*path-vector*)** sobre TCP (porta 179), permitindo que cada AS aplique **políticas de roteamento** comerciais e de segurança (e não apenas menor distância).

| Protocolo | Escopo | Algoritmo / Paradigma | Métrica Principal | Transporte | Uso Típico |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RIP** | Intra-AS (IGP) | Vetor de Distância (Bellman-Ford) | Contagem de saltos (máx. 15) | UDP (520) | Redes pequenas e simples |
| **OSPF** | Intra-AS (IGP) | Estado de Enlace (Dijkstra) | Custo inverso à largura de banda | Direto sobre IP (proto 89) | Redes corporativas e provedores (interno) |
| **IS-IS** | Intra-AS (IGP) | Estado de Enlace (Dijkstra) | Custo configurável | Direto sobre Enlace | Backbones de grandes operadoras |
| **BGP** | Inter-AS (EGP) | Vetor de Caminho (*Path-Vector*) | Políticas + comprimento do `AS-PATH` | TCP (179) | Interconexão global entre ASs na Internet |

---

## Módulo 5: Camada de Transporte — TCP vs. UDP

A camada de transporte entrega mensagens **entre processos de aplicação** executando em hospedeiros distintos, utilizando **números de porta (16 bits: 0 a 65535)** para multiplexação e demultiplexação. Um **soquete (*socket*)** TCP é identificado pela quádrupla `(IP origem, porta origem, IP destino, porta destino)`.

### Comparativo TCP vs. UDP

| Característica | TCP (*Transmission Control Protocol*) | UDP (*User Datagram Protocol*) |
| :--- | :--- | :--- |
| **Orientação a conexão** | **Sim** (estabelece conexão via *3-way handshake*: `SYN` → `SYN-ACK` → `ACK` e encerra com `FIN`/`ACK`). | **Não** (sem conexão; cada datagrama é independente). |
| **Unidade de dados** | Fluxo contínuo de bytes dividido em **segmentos**. | **Datagramas** com limites preservados. |
| **Confiabilidade** | **Alta**: garante entrega sem perdas, sem duplicações e em ordem (ACK acumulativo + retransmissão adaptativa). | **Não confiável**: não há ACK, nem retransmissão, nem ordenação. |
| **Controle de fluxo** | **Sim** (janela deslizante com campo `rwnd` anunciado pelo receptor). | **Não**. |
| **Controle de congestionamento** | **Sim** (*Slow Start*, *Congestion Avoidance*, *Fast Retransmit/Recovery*, janela `cwnd`). | **Não**. |
| **Cabeçalho mínimo** | 20 bytes. | 8 bytes. |
| **Impacto na programação** | **Libera o programador** da responsabilidade de detectar e corrigir erros de transmissão, simplificando a aplicação. | Exige que a própria aplicação trate perdas/ordem caso precise de confiabilidade. |
| **Aplicações típicas** | HTTP/HTTPS, SMTP, IMAP, FTP, SSH, BGP. | DNS, DHCP, VoIP, streaming em tempo real, SNMP, jogos on-line. |

### Mecanismos Internos do TCP e Exemplo Numérico de Sequenciamento

No TCP, cada byte transmitido recebe um **número de sequência** e o receptor envia confirmações **cumulativas (`ACK`)** indicando o **próximo byte que espera receber** em sequência contínua. Além disso, o protocolo calcula dinamicamente o **timeout** de retransmissão por meio de médias ponderadas do *RTT (Round-Trip Time)* medido e seu desvio, acomodando atrasos variáveis na rede.

#### Exemplo Numérico 2: Número de Sequência e ACK Acumulativo no TCP

Considere uma conexão TCP em que o processo **A** envia quatro segmentos consecutivos de **40 bytes** de dados cada um para o processo **B**, sendo o número de sequência do primeiro byte enviado igual a **20**. Suponha que o **1º, 3º e 4º segmentos** cheguem corretamente a B, mas o **2º segmento seja perdido** na rede. Qual será o valor do campo **ACK** enviado por B para A após receber esses segmentos?

1. **1º segmento:** transporta 40 bytes, cobrindo os bytes de sequência `20` a `59` (`20 + 40 - 1 = 59`). Ao recebê-lo sem falhas, B espera o próximo byte, que é o **60** (`ACK = 60`).
2. **2º segmento:** cobriria os bytes `60` a `99`, mas é **perdido**.
3. **3º segmento:** transporta os bytes `100` a `139`. Chega fora de ordem; como o TCP utiliza **ACK acumulativo**, B armazena o 3º segmento no buffer fora de ordem e reenvia `ACK = 60` (pois o byte `60` ainda não chegou!).
4. **4º segmento:** transporta os bytes `140` a `179`. B armazena e envia outro ACK duplicado `ACK = 60`. (A chegada de 3 ACKs duplicados dispara o mecanismo de **Fast Retransmit** em A antes mesmo do timeout expirar!)

**Resposta:** `ACK = 60`.

---

## Módulo 6: Protocolos da Camada de Aplicação

A camada de aplicação define como processos distribuídos trocam mensagens estruturadas.

| Protocolo | Porta(s) Padrão | Transporte | Função Principal e Características |
| :--- | :--- | :--- | :--- |
| **HTTP / HTTPS** | `80` / `443` | TCP (HTTP/1.1 e HTTP/2); QUIC/UDP (HTTP/3) | Transferência de hipertexto e APIs Web (REST). Modelo requisição-resposta sem estado (*stateless*). Métodos principais: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`. Respostas: `2xx` (sucesso), `3xx` (redirecionamento), `4xx` (erro do cliente), `5xx` (erro do servidor). |
| **DNS** | `53` | UDP (consultas padrão) e TCP (transferência de zona / respostas grandes) | Sistema hierárquico e distribuído (servidores Raiz → TLD → Autoritativos + resolvedores recursivos com cache) que traduz nomes de domínio em endereços IP. Registros: `A` (IPv4), `AAAA` (IPv6), `CNAME` (apelido), `MX` (servidor de e-mail), `NS` (servidor de nomes). |
| **DHCP** | `67` (servidor) / `68` (cliente) | UDP | Atribui dinamicamente endereço IP, máscara de sub-rede, gateway padrão e servidores DNS em quatro etapas (**DORA**: *Discover*, *Offer*, *Request*, *Ack*). |
| **SMTP** | `25` / `587` / `465` | TCP | Envio e retransmissão (*push*) de mensagens de correio eletrônico entre cliente e servidor ou entre servidores de e-mail. |
| **IMAP / POP3** | `143` (`993` TLS) / `110` (`995` TLS) | TCP | Recuperação (*pull*) de e-mails do servidor para o cliente. O **IMAP** mantém pastas e estado sincronizados no servidor; o **POP3** tipicamente baixa e remove do servidor. |
| **FTP / SSH / Telnet** | `21` e `20` / `22` / `23` | TCP | FTP transfere arquivos (canal de controle na 21 e dados na 20); Telnet emula terminal remoto em **texto claro** (inseguro); SSH provê terminal remoto e transferência segura (SFTP/SCP) com criptografia. |

---

## Módulo 7: Segurança de Redes, Criptografia, Firewalls e VPNs

A proteção de redes corporativas apoia-se na tríade clássica **CIA** (Confidencialidade, Integridade e Disponibilidade) ampliada por Autenticidade e Não Repúdio:

* **Confidencialidade:** garantir que apenas usuários/processos autorizados acessem a informação (violada por interceptação ou cópia/impressão sem controle de usuário responsável).
* **Integridade:** garantir que a informação seja exata, completa e não tenha sido alterada indevidamente no trânsito ou armazenamento.
* **Disponibilidade:** garantir que sistemas e dados estejam acessíveis aos usuários autorizados sempre que necessário (afetada por instabilidade de sistemas e ataques DDoS).
* **Autenticidade e Não Repúdio:** comprovar a identidade do emissor e impedir que ele negue posteriormente a autoria de uma transação.

### Criptografia Simétrica, Assimétrica, Hash, Assinatura e Certificado Digital

| Mecanismo | Chaves Utilizadas | Garantia Principal | Características e Exemplos |
| :--- | :--- | :--- | :--- |
| **Criptografia Simétrica** | **Mesma chave secreta** compartilhada entre emissor e receptor | Confidencialidade | Muito rápida para grandes volumes de dados; desafio na distribuição segura da chave. Ex.: **AES**, **ChaCha20**. |
| **Criptografia Assimétrica** | **Par de chaves** matematicamente ligado (**pública** e **privada**) | Confidencialidade ou Autenticidade | Mais lenta; se cifra com pública, só a privada decifra (sigilo); se assina com privada, qualquer um verifica com a pública. Ex.: **RSA**, **ECC**. |
| **Função Hash Criptográfica** | Nenhuma chave (unidirecional, tamanho fixo) | Integridade | Gera resumo único (*digest*); efeito avalanche e resistência a colisões. Ex.: **SHA-256**, **SHA-3**. |
| **Assinatura Digital** | Hash da mensagem cifrado com a **chave privada** do emissor | Autenticidade, Integridade e Não Repúdio | Análogo digital à assinatura manuscrita; verificada com a chave pública do emissor. |
| **Certificado Digital (X.509)** | Assinado pela chave privada de uma **Autoridade Certificadora (AC)** | Vinculação confiável entre identidade e chave pública | Documento eletrônico que garante que determinada chave pública pertence legitimamente à pessoa, empresa ou domínio (ex.: HTTPS/TLS, ICP-Brasil). |

### Mecanismos de Defesa de Perímetro e Túneis

* **Firewall:** dispositivo ou software que aplica políticas de segurança em determinado ponto da rede, filtrando tráfego por IPs, portas, estado das conexões (*stateful inspection*) ou conteúdo em camada de aplicação (WAF).
* **IDS / IPS:** sistemas de detecção (*Intrusion Detection System* — passivo, gera alertas) e prevenção (*Intrusion Prevention System* — ativo/inline, bloqueia tráfego malicioso).
* **DMZ (*Demilitarized Zone*):** sub-rede isolada entre dois firewalls (ou interfaces distintas) que hospeda serviços expostos à Internet (Web, DNS público, SMTP) sem expor diretamente a rede interna.
* **VPN (*Virtual Private Network*):** cria um **túnel lógico criptografado** (ex.: IPsec, WireGuard, OpenVPN) sobre uma rede pública não confiável (Internet), estendendo a rede privada com confidencialidade e integridade. **Atenção:** VPN é uma **tecnologia de tunelamento/rede virtual**, e **não** um dispositivo físico que aplica políticas de filtragem de borda (papel do firewall).

---

## Resumo Estratégico para o ENADE

1. **Camadas e Equipamentos:** Repetidor/Hub = Física (não separa colisão nem broadcast); Switch = Enlace/MAC (separa colisão, não encaminha por IP); Roteador = Rede/IP (separa broadcast); Gateway = todas as camadas.
2. **IPv4, TTL e Fragmentação:** O IP é *best-effort* e sem conexão. O **TTL** evita loops infinitos de roteamento (não ordena pacotes!). Roteadores fragmentam IPv4 conforme o **MTU**, e somente o destino remonta.
3. **Sub-redes e NAPT:** Em CIDR `/n`, há `2^(32 - n) - 2` hosts válidos. Em NAPT, múltiplos IPs privados saem para a Internet compartilhando o **mesmo IP público** da interface externa do roteador, diferenciados por portas.
4. **Roteamento:** Intra-AS usa IGP (**OSPF** com Dijkstra, **RIP** com Bellman-Ford e máx. 15 saltos); Inter-AS (entre Sistemas Autônomos distintos) usa obrigatoriamente **BGP**.
5. **TCP vs. UDP:** TCP é orientado a conexão, garante entrega em ordem, controla fluxo (janela deslizante) e congestionamento, usando **ACK acumulativo** (sempre aponta o próximo byte esperado em sequência contínua) e **timeout adaptativo** — liberando o programador de tratar erros de transmissão.
6. **Segurança:** Confidencialidade = sigilo; Integridade = não alteração; Disponibilidade = acesso quando necessário; Assinatura digital = hash + chave privada (autenticidade + integridade + não repúdio); Certificado digital = associa entidade a uma chave pública via AC; VPN = túnel criptografado (não confundir com firewall).
