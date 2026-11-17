# Banco de Dados

Esta apostila unifica todo o material teórico, prático e de exercícios de **Banco de Dados** (Modelagem Conceitual e Lógica, Normalização, Álgebra Relacional, SQL completo, Visões, Índices e Transações), alinhando a base acadêmica às exigências do componente específico do ENADE em Sistemas de Informação.

> **Foco ENADE:** Nas provas oficiais de 2014, 2017 e 2021, Banco de Dados apareceu com alta frequência em questões que integram **mapeamento ER → Relacional** (incluindo generalização/especialização e tabelas associativas, como em *2017 Q11*), **restrições de participação e chaves estrangeiras** (*2014 Q30* e *2021 Q29*), **dependências funcionais e normalização** (*2014 Q30*) e **interpretação de consultas SQL com JOINs, OUTER JOINs e subconsultas** (*2014 Q31*, *2017 Q23*, *2021 Q21* e *2021 Q23*).

---

## Módulo 1: Conceitos Básicos, Arquitetura de SGBDs e Projeto de Banco de Dados

### Banco de Dados e SGBD

Um **Banco de Dados (BD)** representa uma coleção de dados relacionados com **significado implícito**. Segundo a abordagem clássica, os dados de um BD apresentam quatro propriedades fundamentais:
1. Representam uma porção do mundo real (**Mini-mundo** ou **Universo do Discurso**).
2. Servem a um propósito específico.
3. Possuem usuários ou aplicações interessadas em seu uso.
4. Estão organizados para facilitar operações de inclusão, recuperação e atualização.

Um **Sistema Gerenciador de Banco de Dados (SGBD)** é uma coleção de programas de propósito geral que permite ao usuário **definir, construir, manipular e manter** bancos de dados. Entre as propriedades essenciais da abordagem com SGBDs destacam-se:
- **Autocontenção:** o BD armazena não apenas os dados, mas também suas definições/metadados (catálogo do sistema).
- **Independência de dados:** alterações na estrutura física ou lógica isolam e protegem os programas de aplicação.
- **Abstração de dados:** ocultação de detalhes complexos de armazenamento físico para o usuário final.
- **Suporte a múltiplas visões:** diferentes usuários enxergam subconjuntos ou combinações personalizadas dos dados.
- **Controle de acesso concorrente:** múltiplos usuários acessam e atualizam o BD simultaneamente de forma consistente.

### Modelo de Dados, Esquema e Instância

- **Modelo de Dados:** conjunto de conceitos utilizados para descrever a estrutura de um banco de dados. Classifica-se em:
  1. **Conceitual (ou de Alto Nível):** próximo da percepção dos usuários (ex.: Modelo Entidade-Relacionamento).
  2. **Implementação (ou Representacional):** utilizado pelos SGBDs comerciais (ex.: Modelo Relacional).
  3. **Físico (ou de Baixo Nível):** descreve como os dados são armazenados em disco (estruturas de arquivos, índices, blocos).
- **Esquema (Intensão):** é a descrição estrutural do banco de dados (nomes de tabelas/registros, itens de dado, tipos e tamanhos), que muda com pouca frequência.
- **Instância (Extensão / Estado do BD):** é o conjunto de ocorrências (dados efetivamente gravados) em um determinado instante de tempo.

### Arquitetura ANSI/X3/SPARC (Três Esquemas)

Proposta em 1978 pela ANSI/X3/SPARC, define três níveis de abstração para garantir **independência entre programas e dados**, **suporte a múltiplas visões** e **autocontenção**:

| Nível / Esquema | Função Principal | Exemplo Típico |
| :--- | :--- | :--- |
| **Esquema Externo (Visões)** | Descreve a parte do BD de interesse de um grupo específico de usuários, ocultando o restante. | Visão `VW_LOJA` exibindo apenas código e nome para o setor comercial. |
| **Esquema Conceitual** | Descreve a estrutura global de todo o BD para a comunidade de usuários (entidades, tipos, relacionamentos, restrições), ocultando detalhes físicos. | Tabelas lógicas `TB_FUNCIONARIO`, `TB_DEPARTAMENTO` e suas chaves. |
| **Esquema Interno** | Descreve a estrutura física de armazenamento do BD e os caminhos de acesso (arquivos `.MDF`/`.LDF`, índices B-Tree). | Índice clusterizado na coluna `MATRICULA`, alocação de páginas em disco. |

### Linguagens para SGBDs

Na arquitetura original de três esquemas, previam-se quatro linguagens: **SDL** (*Storage Definition Language*), **DDL** (*Data Definition Language*), **VDL** (*View Definition Language*) e **DML** (*Data Manipulation Language*). Nos SGBDs relacionais modernos (como na linguagem **SQL**), essas camadas foram consolidadas em dois grandes níveis:
- **DDL:** engloba as antigas SDL e VDL, definindo tabelas, restrições, visões e índices (`CREATE`, `ALTER`, `DROP`).
- **DML:** subdividida em:
  - **Alto nível / Declarativa (Não Procedural):** especifica *o que* se deseja obter (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
  - **Baixo nível / Procedural:** especifica *como* navegar e processar os dados passo a passo (loops, cursores, estruturas condicionais em T-SQL, PL/SQL ou PL/pgSQL).

### Fases do Projeto de Banco de Dados

O projeto de um BD tem como objetivo definir as características dos dados a serem armazenados por um sistema de informação e segue três etapas sequenciais:
1. **Projeto Conceitual** $\rightarrow$ gera o **Esquema Conceitual** (ex.: Diagrama ER), independente de SGBD.
2. **Projeto Lógico** $\rightarrow$ gera o **Esquema Lógico** (ex.: Esquema Relacional normalizado), dependente do paradigma (relacional), mas ainda independente do fabricante.
3. **Projeto Físico** $\rightarrow$ gera o **Esquema Físico** (tipos exatos, índices, particionamento, arquivos em disco), dependente do SGBD escolhido.

---

## Módulo 2: Modelagem Conceitual (MER/DER) e Mapeamento para o Modelo Relacional

### O Modelo Entidade-Relacionamento (MER)

Definido por **Peter Chen em 1976**, o Modelo ER surgiu para abstrair as particularidades dos modelos existentes (rede, hierárquico e relacional), consagrando-se por sua técnica de diagramação (**Diagrama Entidade-Relacionamento — DER**). Ele descreve a estrutura do BD por meio de três elementos básicos:

1. **Entidades:** objetos ou conceitos do mini-mundo com existência independente (ex.: `EMPREGADO`, `DEPARTAMENTO`, `PROJETO`).
2. **Atributos:** propriedades que descrevem entidades ou relacionamentos. Podem ser:
   - *Simples* (ex.: `Idade`) vs. *Compostos* (ex.: `Nome` formado por `Primeiro Nome` e `Último Nome`);
   - *Monovalorados* (ex.: `Matrícula`) vs. *Multivalorados* (ex.: `Telefones`);
   - *Identificadores* (chave da entidade) e *Derivados* (ex.: `Idade` calculada a partir da `Data Nascimento`).
3. **Relacionamentos:** associações entre entidades que precisam ser armazenadas (ex.: *"João trabalha para o Recursos-Humanos"*, *"Patrícia gerencia o Projeto Alfa"*).

### Cardinalidade e Participação: Notação `(min, max)`

Para expressar com precisão as restrições de cardinalidade (número máximo de ocorrências) e participação (obrigatoriedade — mínima 0 = parcial; mínima $\ge 1$ = total), utiliza-se a notação **`(min, max)`**, onde $0 \le \text{min} \le \text{max}$ e $\text{max} \ge 1$:
- **`EMPREGADO` `(1,1)` — `trabalha para` — `(4,N)` `DEPARTAMENTO`:** todo empregado trabalha em exatamente 1 departamento (participação total), e cada departamento possui de 4 a N empregados.
- **`EMPREGADO` `(0,1)` — `gerencia` — `(1,1)` `PROJETO`:** um empregado pode gerenciar no máximo 1 projeto (participação parcial, pois nem todo empregado é gerente), e todo projeto tem obrigatoriamente 1 gerente (participação total).

### Conceitos Avançados do DER

- **Entidade Fraca:** entidade cuja existência depende da existência de outra entidade (entidade proprietária/forte) e cuja identificação parcial precisa ser combinada à chave da proprietária. Exemplo: `EMPREGADO` `(1)` — `possui` — `(N)` `DEPENDENTES`.
- **Relacionamentos Ternários:** associam três conjuntos de entidades simultaneamente (cardinalidades `1:1:1`, `1:1:N`, `1:N:N` ou `N:N:N`). Exemplo: `FORNECEDOR` — `FORNECE` — `PEÇA` — `PROJETO` (`N:N:N`), onde a associação só faz sentido considerando os três participantes juntos.
- **Agregação:** recurso utilizado quando precisamos modelar um relacionamento entre uma entidade e um **relacionamento já existente**. Exemplo: o relacionamento `TRABALHA` entre `EMPREGADO` e `PROJETO` é tratado como um conjunto agregado ao qual se associa a entidade `HABILIDADES` por meio do relacionamento `POSSUI`.
- **Generalização / Especialização (Superclasse e Subclasse):** relacionamento ***Is A* ("É um")**, onde subclasses herdam todos os atributos e relacionamentos da superclasse e acrescentam atributos próprios.
  - *Especialização* (top-down): classificar uma entidade genérica em subentidades específicas (ex.: `PESSOA` $\rightarrow$ `PESSOA FÍSICA`, `PESSOA JURÍDICA`; `CONTA` $\rightarrow$ `CONTA CORRENTE`, `CONTA POUPANÇA` com "data de aniversário").
  - *Generalização* (bottom-up): processo inverso de abstrair características comuns em uma superclasse.
  - **Restrições do relacionamento *Is A*:**
    - **Disjunção:** indica se uma instância da superclasse pode pertencer a no máximo uma subclasse (*disjunta*) ou a mais de uma (*sobreposta/overlapping*).
    - **Participação (Totalidade):** indica se toda instância da superclasse precisa obrigatoriamente pertencer a alguma subclasse (*total*) ou não (*parcial*).

### O Modelo Relacional e Restrições de Integridade

Proposto por **Edgar Frank Codd** no final da década de 1960 (*"A Relational Model of Data for Large Shared Data Banks"*), é o modelo representacional adotado pelos principais SGBDs comerciais (Oracle, SQL Server, MySQL, PostgreSQL).

| Conceito Formal (Modelo Relacional) | Equivalente Informal (Tabela) | Observação Importante |
| :--- | :--- | :--- |
| **Relação** $r(R)$ | Tabela | Subconjunto do produto cartesiano dos domínios: $r(R) \subseteq \text{dom}(A_1) \times \dots \times \text{dom}(A_n)$ |
| **Tupla** | Linha / Registro | Conjunto não ordenado de tuplas distintas |
| **Atributo** | Coluna / Campo | Possui nome e domínio associado |
| **Domínio** $\text{dom}(A)$ | Tipo de dado / conjunto de valores atômicos | Define nome, tipo de dado e formato |
| **Grau (ou Aridade)** | Número de atributos (colunas) | Ex.: `Empregado(Matricula, Nome, RG, DataNasc)` tem grau 4 |
| **Cardinalidade** | Número de tuplas (linhas) | Varia dinamicamente conforme inserções e remoções |

**Restrições de Integridade do Modelo Relacional:**
1. **Restrição de Chave:**
   - **Superchave:** conjunto de atributos que identifica unicamente uma tupla.
   - **Chave Candidata:** superchave mínima (sem atributos supérfluos).
   - **Chave Primária (PK):** chave candidata escolhida pelo projetista para identificar as tuplas da relação.
2. **Integridade de Entidade:** nenhum atributo que compõe a **chave primária** pode assumir valor nulo (`NULL`).
3. **Integridade Referencial (Chave Estrangeira — FK):** conjunto de atributos de uma relação que referencia a chave primária (ou chave única) de outra relação (ou dela própria). Os atributos devem ter o mesmo domínio, e qualquer valor não nulo na FK deve existir na relação referenciada (admitindo `NULL` apenas quando a participação for opcional/parcial).

### Regras de Mapeamento ER $\rightarrow$ Relacional (Projeto Lógico)

Considere na notação textual: `#` = Chave Primária e `@` = Chave Estrangeira.

| Elemento no DER | Regra de Mapeamento para o Esquema Relacional | Exemplo Prático (Estudo de Caso 01 do Drive) |
| :--- | :--- | :--- |
| **Entidade Forte** | Cria-se uma relação com seus atributos simples e chave primária (`#`). Atributos compostos são achatados em suas partes simples. | `TB_FUNCIONARIO(#matricula, nome)` / `TB_DEPARTAMENTO(#cod_dep, nm_dep)` / `TB_LIVRO(#cod_livro, titulo, isbn)` |
| **Atributo Multivalorado** | Cria-se uma **nova relação** contendo o atributo multivalorado + FK da entidade proprietária; a PK é composta por ambos. | `TB_TELEFONE(#@matricula, #telefone)` |
| **Entidade Fraca** | Cria-se uma relação com os atributos da entidade fraca + FK da entidade forte; a PK é composta por `(FK_forte, chave_parcial)`. | `DEPENDENTE(#@matricula_emp, #num_dependente, nome, parentesco)` |
| **Relacionamento 1:N** | Propaga-se a PK do lado `1` como FK (`@`) na tabela do lado `N` (junto com eventuais atributos do relacionamento). | `TB_FUNCIONARIO(#matricula, nome, @cod_dep)` |
| **Relacionamento 1:1** | Propaga-se a PK de uma entidade como FK na outra (preferencialmente na de participação total) ou fundem-se as tabelas se ambas forem totais. | `PROJETO(#cod_proj, nome, @mat_gerente)` |
| **Relacionamento N:N** | Cria-se uma **tabela associativa** contendo as FKs de todas as entidades envolvidas (que formam a PK composta, somada a atributos discriminantes como data, se necessário) + atributos do relacionamento. | `TB_EMPRESTIMO(#@matricula, #@cod_livro, #data_emprestimo, data_devolucao)` |
| **Generalização / Especialização** | (a) Tabela única com discriminador e nulos; (b) Apenas tabelas para subclasses repetindo atributos da superclasse; (c) **Tabela para a superclasse + tabela para cada subclasse com PK = FK** (mais fiel para preservar herança sem redundância, como cobrado no ENADE 2017 Q11). | `Obra(#cod, titulo)` + `Pintura(#@cod, tipo_tinta)` + `Escultura(#@cod, material)` |

---

## Módulo 3: Normalização de Dados (1FN, 2FN, 3FN e FNBC) e Dependências Funcionais

A **Normalização** é o processo de refinamento do projeto lógico com o objetivo de eliminar redundâncias desnecessárias e evitar **anomalias de atualização**:
- **Anomalia de Inserção:** impossibilidade de cadastrar um fato independente (ex.: cadastrar um departamento novo sem que exista ainda um empregado nele).
- **Anomalia de Remoção:** perda acidental de informações válidas ao excluir um registro (ex.: apagar o último jogador que praticava determinada habilidade faz sumir o registro da própria habilidade).
- **Anomalia de Modificação:** necessidade de alterar o mesmo dado em múltiplas linhas para não gerar inconsistência (ex.: atualizar o endereço de um atleta repetido em 4 linhas).

> **Observação de projeto:** Um bom DER bem mapeado já tende a gerar tabelas normalizadas, cabendo à normalização validar o esquema lógico. Além disso, existe um *trade-off*: normalização excessiva exige mais junções (`JOIN`), podendo impactar o desempenho de leitura.

### Dependência Funcional (DF) e Axiomas de Armstrong

Sejam $A$ e $B$ subconjuntos de atributos de uma relação $R$. Diz-se que **$B$ é funcionalmente dependente de $A$** ($A \rightarrow B$, onde $A$ é o **determinante**) se, para quaisquer duas tuplas de $R$ que possuam os mesmos valores em $A$, elas necessariamente possuem os mesmos valores em $B$.
Exemplo: em `CEP -> RUA, CIDADE`, o CEP determina a rua e a cidade; em `Funcionario(#Matricula, CPF, Nome, Endereço, Departamento)`, tanto `#Matricula` quanto `CPF` determinam todos os demais atributos.

**Classificação das Dependências Funcionais:**
- **DF Total:** $B$ depende de todo o conjunto $A$, e não de nenhum subconjunto próprio de $A$. Ex.: em `Inscrição(#Cd_Estudante, #Cd_Curso, Data_Inscrição)`, tem-se `(#Cd_Estudante, #Cd_Curso) -> Data_Inscrição`.
- **DF Parcial:** $B$ depende apenas de *parte* de uma chave primária composta. Ex.: em `Estoque(#Cd_Peça, #Cd_Depósito, Quantidade, Nome_Depósito)`, `Cd_Depósito -> Nome_Depósito` é parcial em relação à PK composta.
- **DF Transitiva:** existe $A \rightarrow B$ e $B \rightarrow C$ (onde $B$ não é chave nem parte de chave), gerando $A \rightarrow B \rightarrow C$. Ex.: `Curso(#Cd_Curso, Nm_Curso, Id_Professor, Sala_Professor)`, onde `#Cd_Curso -> Id_Professor` e `Id_Professor -> Sala_Professor`.

**Regras de Inferência (Axiomas de Armstrong):**
1. **Reflexão:** Se $B \subseteq A$, então $A \rightarrow B$.
2. **Aumento:** Se $A \rightarrow B$, então $AC \rightarrow BC$.
3. **Transitividade:** Se $A \rightarrow B$ e $B \rightarrow C$, então $A \rightarrow C$.
4. **Decomposição:** Se $A \rightarrow BC$, então $A \rightarrow B$ e $A \rightarrow C$.
5. **União:** Se $A \rightarrow B$ e $A \rightarrow C$, então $A \rightarrow BC$.
6. **Composição:** Se $A \rightarrow B$ e $C \rightarrow D$, então $AC \rightarrow BD$.

### Hierarquia das Formas Normais (1FN, 2FN, 3FN e FNBC)

| Forma Normal | Regra Exata | O que Elimina | Exemplo de Violação e Solução (Drive) |
| :--- | :--- | :--- | :--- |
| **1ª Forma Normal (1FN)** | Todos os atributos possuem **valores atômicos** (sem listas, grupos repetitivos ou atributos compostos). | Atributos multivalorados / não atômicos | `Produto(#codigo, nome, tamanhos)` com `tamanhos = "34, 36, 38"` viola 1FN. Solução: atomicidade por linha ou decomposição em `Produto(#codigo, nome)` e `Produto_Tamanho(#@codigo, #tamanho)`. |
| **2ª Forma Normal (2FN)** | Está na 1FN e **todo atributo não-chave é dependente funcional total** da chave primária. (Se a PK for simples, já está automaticamente na 2FN). | Dependências **parciais** da chave composta | `Sessao(#cinema, #filme, #dia, #hora, censura)` possui `filme -> censura` (parcial). Solução: `Sessao(#cinema, #@filme, #dia, #hora)` e `Filme(#filme, censura)`. |
| **3ª Forma Normal (3FN)** | Está na 2FN e **não há dependências transitivas** entre atributos não-chave. | Dependências **transitivas** (`PK -> X -> Y`) | `EMPREGADO(#Cd_Empregado, Nm_Empregado, Cd_Departamento, Local_Departamento)` possui `Cd_Departamento -> Local_Departamento`. Solução: `DEPARTAMENTO(#Cd_Departamento, Local_Departamento)` e `EMPREGADO(#Cd_Empregado, Nm_Empregado, @Cd_Departamento)`. |
| **Forma Normal Boyce-Codd (FNBC)** | Todo **determinante** de uma DF não trivial é uma **chave candidata**. | Anomalias residuais quando há múltiplas chaves candidatas sobrepostas | Garante que nenhum atributo (mesmo primo) seja determinado por um conjunto que não seja superchave. |

### Exercício Prático Resolvido (Normalização até a 3FN — Lista do Drive)

**Problema:** Dada a relação $R(A, B, C, D, E, F, G)$ com as dependências funcionais:
$AB \rightarrow C, D, E, F, G$; $\quad A \rightarrow E$; $\quad D \rightarrow G$. Normalize até a 3FN.

**Resolução:**
1. **Chave candidata:** $(A, B)$ determina todos os atributos de $R$, logo a chave primária é `#(A, B)`.
2. **Passagem para 2FN (remover dependência parcial):** `A -> E` depende apenas de `A` (parte da chave `(A, B)`). Separamos `R1(#A, E)` e mantemos `R(#A, #B, C, D, F, G)`.
3. **Passagem para 3FN (remover dependência transitiva):** em `R`, temos `(A, B) -> D` e `D -> G` (sendo `D` não-chave). Separamos `R2(#D, G)`.
4. **Esquema final na 3FN:**
   - `R(#A, #B, C, @D, F)`
   - `R1(#A, E)`
   - `R2(#D, G)`

---

## Módulo 4: Álgebra Relacional

A **Álgebra Relacional** é uma linguagem procedural formal composta por um conjunto de operações que recebem uma ou duas relações como entrada e produzem **sempre uma nova relação** como saída (permitindo composição de expressões). Ela constitui a base teórica da linguagem SQL.

### Operações Fundamentais e Derivadas

| Operação | Notação | Tipo | Descrição e Regras |
| :--- | :--- | :--- | :--- |
| **Seleção** | $\sigma_{\langle\text{condição}\rangle}(R)$ | Unária | Filtra **tuplas (linhas)** de $R$ que satisfazem a expressão booleana (`AND`, `OR`, `NOT`). Mantém a mesma aridade (colunas). Equivalente ao `WHERE` no SQL. |
| **Projeção** | $\pi_{\langle\text{atributos}\rangle}(R)$ | Unária | Seleciona **atributos (colunas)** específicos de $R$. Como uma relação é um conjunto, **remove duplicatas implicitamente**. Equivalente ao `SELECT DISTINCT` no SQL. |
| **Nomeação / Renomeação** | $\text{NovoNome}(A_1, \dots) \leftarrow \text{Expr}$ | Unária | Nomeia resultados intermediários ou renomeia atributos/relações (ex.: $\text{Emp}(\text{MtGerente}, \text{Nome}) \leftarrow \text{Empregado}$). |
| **União** | $R \cup S$ | Binária (Conjunto) | Tuplas que estão em $R$, em $S$, ou em ambas (sem duplicatas). **Exige *Union Compatibility***. |
| **Interseção** | $R \cap S$ | Binária (Conjunto) | Tuplas presentes simultaneamente em $R$ e em $S$. **Exige *Union Compatibility***. |
| **Diferença** | $R - S$ | Binária (Conjunto) | Tuplas que estão em $R$, mas **não** estão em $S$. Não é comutativa. **Exige *Union Compatibility***. |
| **Produto Cartesiano** | $R \times S$ | Binária | Combina cada tupla de $R$ com cada tupla de $S$. Se $R$ tem $m$ atributos / $p$ tuplas e $S$ tem $n$ atributos / $q$ tuplas, o resultado tem **$m + n$ atributos** e **$p \times q$ tuplas**. Atributos homônimos são qualificados como `R.A` e `S.A`. |
| **Theta-Junção** | $R \bowtie_{\langle\text{condição}\rangle} S$ | Binária (Derivada) | Equivale a $\sigma_{\langle\text{condição}\rangle}(R \times S)$ usando operadores $=, \le, <, \ge, >, \neq$. Quando usa apenas `=`, chama-se **Equi-Junção**. |
| **Junção Natural** | $R * S$ (ou $R \bowtie S$) | Binária (Derivada) | Equi-junção automática sobre atributos de **mesmo nome**, descartando a coluna repetida no resultado. |
| **Divisão** | $A \div B$ (ou $A / B$) | Binária (Derivada) | Retorna as tuplas de $A$ associadas a **todas** as tuplas de $B$, tal que $(A \div B) \times B \subseteq A$. |

> **Condição *Union Compatibility* (Compatibilidade de União):** Obrigatória para $R \cup S$, $R \cap S$ e $R - S$. Duas relações $R$ e $S$ são compatíveis quando: (a) possuem o **mesmo grau $n$** (mesmo número de atributos), e (b) $\text{dom}(A_i) = \text{dom}(B_i)$ para todo $1 \le i \le n$.

### Exemplo prático resolvido (Divisão Relacional — Drive)

Considere `Fornecimento(Fornecedor, Peça)` ($A$) e `PecasObrig(Peça)` ($B = \{p_1, p_2, p_3\}$). Queremos os fornecedores que fornecem **todas** as peças listadas em $B$:
- Se $F_1$ fornece $\{p_1, p_2, p_3\}$, $F_2$ fornece $\{p_1, p_2\}$ e $F_3$ fornece $\{p_2, p_3\}$, o resultado de $A \div B$ é apenas $\{F_1\}$.
- Expressão da Divisão usando apenas operadores básicos ($\pi$, $\times$, $-$):
  $$\pi_{\text{Fornecedor}}(A) - \pi_{\text{Fornecedor}}\big((\pi_{\text{Fornecedor}}(A) \times B) - A\big)$$
  *Lógica:* primeiro gera-se todas as combinações possíveis $(\pi_{\text{Fornecedor}}(A) \times B)$; subtraindo $A$, descobrem-se os pares que faltam (fornecedores **desqualificados**); por fim, subtraem-se os desqualificados do total de fornecedores.

---

## Módulo 5: Linguagem SQL — DDL, Integridade e Manipulação Básica (DML/DQL)

A **SQL (*Structured Query Language*)** é uma linguagem declarativa baseada em conjuntos, criada originalmente pela IBM sob o nome **SEQUEL** (1974, Donald Chamberlin e Ray Boyce, no projeto *System R*). Tornou-se padrão ANSI/ISO (SQL-86, SQL-92, SQL:1999 até SQL:2023) e possui dialetos comerciais como **T-SQL** (SQL Server), **PL/SQL** (Oracle) e **PL/pgSQL** (PostgreSQL).

*(Nota de ambiente SQL Server presente no material: um banco de dados é formado fisicamente por arquivos `.MDF` primário, `.NDF` secundários opcionais e `.LDF` de log de transações, além dos bancos de sistema `master`, `model`, `msdb` e `tempdb`.)*

### DDL — Definição de Tabelas e Restrições de Integridade

Os principais tipos de dados incluem inteiros (`bigint`, `int`, `smallint`, `tinyint`), numéricos exatos (`numeric(p,s)`, `decimal(p,s)`), aproximados (`float`, `real`), data/hora (`date`, `time`, `datetime`), texto (`char`, `varchar`, `nchar`, `nvarchar`) e binários (`binary`, `varbinary`).

```sql
CREATE TABLE Tb_Loja (
    cd_loja     INT NOT NULL CONSTRAINT PK_TB_LOJA PRIMARY KEY,
    nm_loja     VARCHAR(40) NOT NULL CONSTRAINT UQ_TB_LOJA_NOME UNIQUE,
    categoria   INT NOT NULL DEFAULT (1) CONSTRAINT CK_LOJA_CAT CHECK (categoria IN (1, 2)),
    estado      CHAR(2) NOT NULL DEFAULT ('SE') CHECK (estado IN ('AL', 'SE'))
);

CREATE TABLE Tb_Departamento (
    cd_departamento INT IDENTITY(1,1) NOT NULL PRIMARY KEY, -- autoincremento (semente 1, passo 1)
    nm_departamento VARCHAR(40) NOT NULL,
    cd_loja         INT NULL,
    CONSTRAINT FK_TB_DEP_LOJA FOREIGN KEY (cd_loja)
        REFERENCES Tb_Loja (cd_loja)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Exemplo de coluna calculada e alterações com ALTER TABLE
CREATE TABLE Tb_Estoque (
    cd_produto  INT NOT NULL PRIMARY KEY,
    qt_produto  INT NOT NULL,
    vl_unitario NUMERIC(15,2) NOT NULL,
    vl_estoque  AS (qt_produto * vl_unitario)
);

ALTER TABLE Tb_Estoque ADD nm_produto VARCHAR(40) NULL;
ALTER TABLE Tb_Estoque ALTER COLUMN nm_produto VARCHAR(50) NULL;
ALTER TABLE Tb_Estoque DROP COLUMN nm_produto;
```

**Resumo das Restrições Declarativas (`CONSTRAINT`):**
- **`PRIMARY KEY`:** unicidade + `NOT NULL` (pode ser simples ou composta).
- **`UNIQUE`:** garante unicidade para chaves candidatas alternativas. *(Observação: no SQL Server clássico, `UNIQUE` aceita apenas um único `NULL`, diferindo do padrão ANSI que permite múltiplos `NULL`s; a partir do SQL Server 2008 contorna-se com índice único filtrado `WHERE col IS NOT NULL`.)*
- **`FOREIGN KEY`:** referencia `PRIMARY KEY` ou `UNIQUE` de outra tabela. Ações referenciais em `ON DELETE` / `ON UPDATE`: `NO ACTION` (padrão), `CASCADE`, `SET NULL`, `SET DEFAULT`.
- **`DEFAULT`:** valor padrão aplicado apenas em comandos `INSERT` quando a coluna é omitida.
- **`CHECK`:** valida expressão booleana em `INSERT` e `UPDATE` (pode envolver uma ou mais colunas).
- No SQL Server, restrições `CHECK` e `FOREIGN KEY` podem ser desativadas/reativadas com `ALTER TABLE ... NOCHECK/CHECK CONSTRAINT` ou removidas com `DROP CONSTRAINT`.

### DML e DQL Básico (`INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `SELECT`)

```sql
-- Inserção explícita, implícita (valor DEFAULT) e via SELECT
INSERT INTO Tb_Loja (cd_loja, nm_loja, categoria, estado) VALUES (1, 'LOJA SUL', 2, 'SE');
INSERT INTO Tb_Departamento (nm_departamento, cd_loja) VALUES ('TI', 1); -- omite IDENTITY
INSERT INTO Tb_Departamento2 (nm_departamento, cd_loja)
SELECT nm_departamento, cd_loja FROM Tb_Departamento;

-- Atualização e remoção com filtro (cuidado para não omitir WHERE!)
UPDATE Tb_Loja SET nm_loja = 'LOJA SUDESTE', estado = 'AL' WHERE cd_loja = 1;
DELETE FROM Tb_Loja WHERE cd_loja = 1;
TRUNCATE TABLE Tb_Estoque; -- remove todas as linhas rapidamente sem log linha a linha

-- Consultas DQL: DISTINCT, Aliases, Filtros, LIKE, ORDER BY, TOP, UNION
SELECT DISTINCT estado AS 'SIGLA DO ESTADO'
FROM Tb_Loja
WHERE categoria IN (1, 2)
  AND nm_loja LIKE '%SUL%'       -- '%' = 0 ou mais chars; '_' = exatamente 1 char
ORDER BY estado DESC, nm_loja ASC;

-- Escapando caracteres curinga no LIKE
SELECT nm_loja FROM Tb_Loja WHERE nm_loja LIKE '%S%%' ESCAPE 'S';

-- Primeiras linhas (TOP no SQL Server; LIMIT em MySQL/PostgreSQL)
SELECT TOP 2 cd_loja, nm_loja FROM Tb_Loja ORDER BY nm_loja;

-- União de conjuntos (UNION remove duplicatas; UNION ALL preserva todas)
SELECT cd_loja, nm_loja FROM Tb_Loja1
UNION
SELECT cd_loja, nm_loja FROM Tb_Loja2;
```

> **Correspondência Álgebra Relacional $\leftrightarrow$ SQL:** Em uma consulta básica, `SELECT` corresponde à **Projeção** ($\pi$), `FROM` (com múltiplas tabelas) ao **Produto Cartesiano** ($\times$) ou **Junção** ($\bowtie$), e `WHERE` à **Seleção** ($\sigma$). Diferente da projeção formal, o `SELECT` SQL **não remove duplicatas** a menos que se use `DISTINCT`.

---

## Módulo 6: Linguagem SQL Avançada — Junções, Agregação, Subconsultas e `CASE`

### Junções (`JOIN`) e Tratamento de Nulos

Quando os dados estão distribuídos em múltiplas tabelas normalizadas, combinamos registros por meio de junções explícitas (`JOIN ... ON`):

| Tipo de Junção | Comportamento | Caso de Uso Típico |
| :--- | :--- | :--- |
| **`INNER JOIN` (ou `JOIN`)** | Retorna apenas as linhas que possuem correspondência em **ambas** as tabelas segundo a condição `ON`. | Listar apenas funcionários que estão efetivamente alocados em algum departamento. |
| **`LEFT OUTER JOIN` (`LEFT JOIN`)** | Retorna **todas** as linhas da tabela à esquerda + correspondências da direita (ou `NULL` à direita quando não houver par). | Listar todos os funcionários, mesmo aqueles sem departamento (`cd_departamento IS NULL`). |
| **`RIGHT OUTER JOIN` (`RIGHT JOIN`)** | Retorna **todas** as linhas da tabela à direita + correspondências da esquerda (ou `NULL` à esquerda se não houver par). | Listar todos os departamentos, inclusive departamentos vazios (sem funcionários). |
| **`FULL OUTER JOIN` (`FULL JOIN`)** | Combina `LEFT` + `RIGHT`: preserva todas as linhas de ambas as tabelas, preenchendo com `NULL` onde não houver correspondência. | Relatório completo de artistas e eventos, mesmo artistas sem evento e eventos sem artista (*ENADE 2014 Q31*). |

**Dica de prova (ENADE 2017 Q23):** Para encontrar registros da Tabela B que **não** possuem correspondência na Tabela A usando junção externa, faz-se:
```sql
SELECT *
FROM Tabela1 t1
RIGHT JOIN Tabela2 t2 ON t1.id = t2.fk
WHERE t1.id IS NULL; -- atenção: comparações com NULL exigem IS NULL / IS NOT NULL, nunca = NULL ou <> NULL!
```

### Funções de Agregação, `GROUP BY` e `HAVING`

As cinco funções de agregação clássicas são: `SUM()`, `AVG()`, `MAX()`, `MIN()` e `COUNT()`.
- `COUNT(*)` conta todas as linhas da tabela/grupo (incluindo nulos);
- `COUNT(coluna)` conta apenas os valores **não nulos** da coluna;
- `COUNT(DISTINCT coluna)` conta valores distintos não nulos.

```sql
SELECT d.nm_departamento,
       COUNT(f.matricula) AS qtd_func,
       SUM(f.salario)     AS folha_salarial
FROM Tb_Departamento d
LEFT JOIN Tb_Funcionario f ON f.cd_departamento = d.cd_departamento
WHERE f.ativo = 1                  -- filtra LINHAS ANTES do agrupamento
GROUP BY d.nm_departamento         -- agrupa por departamento
HAVING SUM(f.salario) > 2000.00;   -- filtra GRUPOS DEPOIS da agregação
```

> **Regra de ouro `WHERE` vs. `HAVING`:** Toda coluna presente no `SELECT` que **não** esteja dentro de uma função de agregação deve constar no `GROUP BY`. Condições sobre colunas individuais vão no `WHERE`; condições sobre funções agregadas (`SUM`, `COUNT`, `AVG`) vão obrigatoriamente no `HAVING`.

### Subconsultas (*Subqueries*) e Operadores `IN`, `ANY`, `ALL`, `EXISTS`

Uma subconsulta é um `SELECT` aninhado dentro de outro comando SQL:
1. **Subconsulta Escalar (`=`, `<`, `>`):** retorna exatamente 1 linha e 1 coluna.
   ```sql
   SELECT nome FROM Tb_Funcionario
   WHERE cd_departamento = (SELECT cd_departamento FROM Tb_Departamento WHERE nm_departamento = 'TI');
   ```
2. **Subconsulta de Múltiplas Linhas (`IN`, `ALL`, `ANY`):**
   - `IN`: pertence ao conjunto retornado.
   - `>= ALL (...)`: maior ou igual a **todos** os valores (equivalente a encontrar o maior salário).
   - `< ANY (...)`: menor que **pelo menos um** valor da subconsulta.
3. **Subconsulta Correlacionada (`EXISTS` / `NOT EXISTS`):** referencia colunas da consulta externa e testa existência lógica de tuplas, sendo altamente eficiente para verificar presença ou ausência de vínculos:
   ```sql
   SELECT l.nm_loja
   FROM Tb_Loja l
   WHERE NOT EXISTS (
       SELECT 1 FROM Tb_Departamento d WHERE d.cd_loja = l.cd_loja
   ); -- retorna lojas que não possuem nenhum departamento cadastrado
   ```

### Expressões Condicionais `CASE` (*Simple* e *Searched*)

O `CASE` implementa lógica condicional padrão ISO SQL dentro de `SELECT`, `ORDER BY` ou `UPDATE`:

```sql
-- Simple CASE (apenas igualdade direta)
SELECT matricula, nome,
       CASE estado
           WHEN 'SE' THEN 'NORDESTE'
           WHEN 'PA' THEN 'NORTE'
           ELSE 'OUTRA REGIAO'
       END AS regiao
FROM Tb_Funcionario;

-- Searched CASE (expressões booleanas complexas, inclusive em UPDATE)
UPDATE Tb_Funcionario
SET regiao = CASE
    WHEN estado IN ('SE', 'AL') THEN 'NORDESTE'
    WHEN estado = 'PA'          THEN 'NORTE'
    WHEN estado = 'SP'          THEN 'SUDESTE'
    ELSE 'SEM REGIAO'
END;
```
*(Sem a cláusula `ELSE`, caso nenhuma condição `WHEN` seja verdadeira, o `CASE` retorna `NULL`.)*

---

## Módulo 7: Visões, Índices, Transações ACID e Caderno Comentado de Questões

### Visões (*Views*)

Uma **Visão** é uma tabela virtual cuja definição é armazenada no catálogo do SGBD a partir de uma consulta SQL. Ela **não armazena dados fisicamente** (salvo visões materializadas específicas); seus dados são computados dinamicamente no momento da consulta.
- **Principais objetivos:**
  1. **Segurança:** ocultar colunas sensíveis (ex.: salários, CPF) ou linhas restritas de determinados perfis.
  2. **Transparência / Baixo Acoplamento:** proteger aplicações de mudanças na estrutura das tabelas base.
  3. **Simplicidade:** encapsular junções e agregações complexas em consultas reutilizáveis.
- **Comandos:**
  ```sql
  CREATE VIEW VW_LOJA (CODIGO, NOME, CATEGORIA) AS
  SELECT cd_loja, nm_loja, cd_categoria FROM Tb_Loja;

  ALTER VIEW VW_LOJA AS
  SELECT cd_loja, nm_loja, cd_categoria FROM Tb_Loja WHERE estado = 'SE';

  DROP VIEW VW_LOJA;
  ```
  *(Preferir `ALTER VIEW` a `DROP` + `CREATE` preserva permissões de acesso já concedidas à visão.)*

### Índices

Um **Índice** é uma estrutura auxiliar opcional associada a uma tabela que cria um caminho de acesso rápido, reduzindo drasticamente operações de **Entrada/Saída (E/S) em disco** (evitando varreduras completas — *full table scans* — em tabelas com milhares ou milhões de linhas) e acelerando cláusulas `WHERE`, `JOIN` e `ORDER BY`.

| Critério | Classificação | Características |
| :--- | :--- | :--- |
| **Lógico (Colunas)** | Simples vs. Composto | Indexa uma única coluna (`(NOME)`) ou múltiplas colunas na ordem declarada (`(CD_DVD, CD_CLIENTE, DT_ALUGUEL)`). |
| **Lógico (Unicidade)** | Único (`UNIQUE`) vs. Não Único | O índice único impede valores duplicados na chave indexada (usado automaticamente para PKs e `UNIQUE`). |
| **Físico (Armazenamento)** | *Clustered* (Clusterizado) vs. *Non-Clustered* | O **Clusterizado** define a própria ordenação física das linhas da tabela em disco (máximo **1 por tabela**). O **Não Clusterizado** mantém estrutura separada com ponteiros para as linhas. |

```sql
CREATE UNIQUE INDEX IN_TB_FUNCIONARIO_01 ON Tb_Funcionario (cpf);
CREATE INDEX IN_TB_FUNCIONARIO_02 ON Tb_Funcionario (nome);
CREATE CLUSTERED INDEX IN_TB_ALUNO_01 ON Tb_Aluno (matricula, curso);
DROP INDEX Tb_Aluguel.IN_TB_ALUGUEL_01; -- sintaxe SQL Server; no PostgreSQL/MySQL varia a qualificação
```
**Quando criar índices?** Em tabelas grandes, em colunas de **chaves estrangeiras** (alvos de `JOIN`) e em colunas frequentemente usadas em filtros (`WHERE`) e ordenações (`ORDER BY`). *(Evitar excesso de índices em tabelas com altíssima taxa de `INSERT`/`UPDATE`/`DELETE`, pois cada índice precisa ser mantido atualizado.)*

### Transações e Propriedades ACID

Uma **Transação** é uma unidade lógica de processamento que reúne uma ou mais operações de banco de dados, levando o BD de um **estado consistente** para outro **estado consistente**. Na SQL, seus limites são demarcados por `BEGIN TRANSACTION`, `COMMIT` (efetiva permanentemente) e `ROLLBACK` (desfaz todas as alterações em caso de falha).

```sql
BEGIN TRANSACTION;
    UPDATE Tb_Conta SET saldo = saldo - 500.00 WHERE numero = 100;
    UPDATE Tb_Conta SET saldo = saldo + 500.00 WHERE numero = 200;
    -- Se houver erro de negócio ou saldo insuficiente: ROLLBACK;
COMMIT;
```

Para garantir execução confiável e indivisível, toda transação deve satisfazer as quatro propriedades **ACID**:
1. **Atomicidade (*Atomicity*):** "tudo ou nada" — ou todas as operações da transação são concluídas com sucesso (`commit`), ou nenhuma delas produz efeito (`abort` / `rollback`).
2. **Consistência (*Consistency*):** a execução isolada da transação deve preservar todas as regras de integridade e restrições do BD (responsabilidade compartilhada entre o SGBD e a aplicação).
3. **Isolamento (*Isolation*):** transações executadas concorrentemente não devem interferir umas nas outras; resultados intermediários ficam protegidos conforme o nível de isolamento.
4. **Durabilidade (*Durability*):** após o `commit`, as alterações gravadas permanecem persistentes mesmo diante de falhas de sistema ou queda de energia (garantido via *logs* de transação).

### Resumo Comentado do Caderno de Questões do Drive (`03. Banco de Dados - Questões`)

O caderno de exercícios do Drive reúne 36 questões clássicas de concursos e provas sobre Projeto Conceitual, Modelo Relacional e SQL. Abaixo estão os pontos-chave comentados das questões com enunciado completo disponível no material:

- **Questão 2 (Modelagem de dados — Gabarito: a-E, b-E, c-E, d-C):** A modelagem de dados pode ser executada de forma independente da modelagem funcional, modela apenas dados **persistentes** (e não não-persistentes), sua complexidade depende da estrutura de entidades/relacionamentos (não da quantidade de registros) e depende diretamente de uma análise de requisitos correta.
- **Questão 4 (Entidade Fraca — Gabarito: Diagrama 3):** Uma entidade fraca (`Dependente`) possui participação total em relação à proprietária (`Principal`) e chave composta pela concatenação do identificador da proprietária (`Id_Principal`) com sua chave parcial (`Num_Dependente`).
- **Questão 7 (Atributo Multivalorado — Gabarito: D):** No mapeamento ER $\rightarrow$ Relacional, um atributo multivalorado gera **uma nova tabela** ligada por FK à entidade original (e nunca um número variável de colunas).
- **Questão 15 (DER vs. Fluxo de dados — Gabarito: Errado):** O DER modela entidades persistentes, atributos e relacionamentos; ele **não** especifica fluxos de entradas e saídas de um sistema (papel do DFD/casos de uso).
- **Questão 18 (Regras de Codd — Gabarito: B — I e II):** Regra da Informação (tudo representado logicamente em tabelas) e Regra do Acesso Garantido (acesso lógico via nome da tabela + PK + nome da coluna) são verdadeiras; a III é falsa porque valores nulos sistemáticos aplicam-se a qualquer tipo de dado, não apenas numéricos.
- **Questão 21 (Operações unárias da Álgebra Relacional — Gabarito: C):** As operações fundamentais primárias que operam sobre uma única relação são **seleção ($\sigma$), projeção ($\pi$) e renomeação (*rename*)**.
- **Questão 22 (SQL $\leftrightarrow$ Álgebra Relacional — Gabarito: D):** `SELECT`, `FROM` e `WHERE` correspondem, respectivamente, a **projeção, produto cartesiano e seleção**.
- **Questão 30 (Chaves em `R(Cidade, Rua, Número, CEP)` — Gabarito: B — ii e iii):** Dado `Cidade, Rua, Número -> CEP` e `CEP -> Cidade`, tanto `(Cidade, Rua, Número)` quanto `(Rua, Número, CEP)` determinam todos os atributos sem atributos excedentes; `CEP` sozinho não determina rua/número, e `(Cidade, Rua, CEP)` não determina `Número`.
- **Questão 31 (Axiomas de Armstrong — Gabarito: E — todas corretas):** A partir de `V -> W`, `W -> Y`, `Y -> Z` e `Z -> Y`, derivam-se: `V -> Z` (Transitividade), `YX -> ZX` (Aumento), `YZ -> Z` (Reflexão) e `V -> WZ` (União).
- **Questão 32 (Definição da 2FN — Gabarito: C):** Sem grupos repetitivos (= 1FN) e com PK simples ou todos os atributos não-chave dependentes de toda a chave (= 2FN), garante-se que a tabela está, no máximo, na **2FN** (pois ainda pode conter dependências transitivas).
- **Questões 34 e 35 (SQL básico — Gabarito: 34-A, 35-D):** O operador `LIKE '%único%'` busca substrings contendo `"único"` em qualquer posição; a sintaxe `WHERE column_name BETWEEN value1 AND value2` está inteiramente correta sem necessidade de parênteses ou `IS`.
