# Lógica Matemática

> **Foco ENADE:** O Exame Nacional de Desempenho dos Estudantes (ENADE) cobra em Lógica Matemática a formalização de sentenças em linguagem natural, a construção e leitura de tabelas-verdade, a identificação de tautologias, contradições e contingências, o domínio das principais equivalências lógicas (Leis de De Morgan, condicional e contrapositiva), a verificação da validade de argumentos por regras de inferência, equivalência e *tableaux* semânticos, bem como a interpretação de quantificadores e cláusulas na programação em lógica.

---

## Módulo 1: Fundamentos da Lógica Proposicional e Conectivos

### 1.1 Conceito de Proposição e Axiomas Fundamentais

Chama-se **proposição** todo conjunto de palavras ou símbolos que exprime um pensamento de sentido completo, isto é, uma sentença declarativa à qual faz sentido atribuir um valor lógico: **Verdade (`V`)** ou **Falsidade (`F`)**. Sentenças interrogativas, exclamativas, imperativas ou sentenças abertas sem atribuição de valor (como `x + 2 = 5` sem especificar `x`) não são proposições lógicas.

A Lógica Matemática clássica é uma **lógica bivalente** regida por dois princípios (axiomas) fundamentais:

1. **Princípio da Não Contradição:** Uma proposição não pode ser verdadeira e falsa ao mesmo tempo.
2. **Princípio do Terceiro Excluído:** Toda proposição ou é verdadeira ou é falsa, verificando-se sempre um desses casos e nunca um terceiro.

**Notação:** O valor lógico de uma proposição `p` é denotado por `V(p)`. Se `p` é verdadeira, escreve-se `V(p) = V`; se falsa, `V(p) = F`.

* **Proposição simples (ou atômica):** Não contém nenhuma outra proposição como parte integrante de si mesma. É representada por letras latinas minúsculas (`p, q, r, s, ...`). Exemplo: `p`: "O número 25 é quadrado perfeito" (`V(p) = V`).
* **Proposição composta (ou molecular):** Formada pela combinação de duas ou mais proposições por meio de conectivos lógicos. É representada por letras maiúsculas (`P, Q, R, ...`) ou na forma funcional `P(p, q, r, ...)`.

### 1.2 Operações Lógicas sobre Proposições

As operações lógicas fundamentais obedecem às regras do cálculo proposicional. Na literatura, utilizam-se notações equivalentes: `~` ou `¬` para negação; `∧`, `.` ou `&` para conjunção; `∨` para disjunção; `→` ou `⊃` para condicional; e `↔` para bicondicional.

| Operação Lógica | Símbolo | Leitura Usual | Condição para resultar em Verdade (`V`) |
| :--- | :---: | :--- | :--- |
| **Negação** | `~p` (ou `¬p`) | "não `p`", "é falso que `p`" | Quando `p` é falsa (`F`) |
| **Conjunção** | `p ∧ q` | "`p` e `q`" | Somente quando `p` e `q` são ambas verdadeiras (`V`) |
| **Disjunção (inclusiva)** | `p ∨ q` | "`p` ou `q`" | Quando ao menos uma entre `p` e `q` é verdadeira (`V`) |
| **Disjunção Exclusiva** | `p ∨̲ q` (ou `p ⊕ q`) | "`p` ou `q`, mas não ambos" | Quando `p` e `q` têm valores lógicos distintos |
| **Condicional** | `p → q` | "se `p`, então `q`" | Sempre, exceto quando `p` é `V` e `q` é `F` |
| **Bicondicional** | `p ↔ q` | "`p` se e somente se `q`" | Quando `p` e `q` têm valores lógicos iguais (`V` e `V`, ou `F` e `F`) |

### 1.3 Tabelas-Verdade dos Conectivos Fundamentais

| `p` | `q` | `~p` | `p ∧ q` | `p ∨ q` | `p ⊕ q` | `p → q` | `p ↔ q` |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `V` | `V` | `F` | `V` | `V` | `F` | `V` | `V` |
| `V` | `F` | `F` | `F` | `V` | `V` | `F` | `F` |
| `F` | `V` | `V` | `F` | `V` | `V` | `V` | `F` |
| `F` | `F` | `V` | `F` | `F` | `F` | `V` | `V` |

### 1.4 Condição Suficiente e Condição Necessária

Na condicional `p → q`, `p` é chamado de **antecedente** e `q` de **consequente**. É fundamental dominar suas leituras equivalentes:

* **`p` é condição suficiente para `q`:** Basta que `p` seja verdadeiro para garantir que `q` também seja verdadeiro.
* **`q` é condição necessária para `p`:** É indispensável que `q` seja verdadeiro para que `p` possa ser verdadeiro (se `q` for falso, `p` obrigatoriamente é falso).
* Na **bicondicional `p ↔ q`**, diz-se que `p` é **condição necessária e suficiente** para `q` (e vice-versa). Ela equivale à conjunção das duas condicionais `(p → q) ∧ (q → p)`.

> **Atenção:** Uma condicional `p → q` não exige relação causal entre `p` e `q` na linguagem natural, mas apenas uma relação verofuncional entre seus valores lógicos. Sempre que o antecedente `p` é falso (`F`), a condicional `p → q` é automaticamente verdadeira (`V`).

---

## Módulo 2: Tabelas-Verdade, Precedência e Classificação de Fórmulas

### 2.1 Número de Linhas e Construção de Tabelas-Verdade

O valor lógico de qualquer proposição composta depende unicamente dos valores lógicos de suas proposições simples componentes.

* **Teorema do Número de Linhas:** A tabela-verdade de uma proposição composta com `n` proposições simples distintas possui exatamente **`2ⁿ` linhas** (arranjos com repetição dos dois valores `V` e `F` tomados `n` a `n`).
  * `n = 2` proposições (`p, q`): `2² = 4` linhas (alternância de 2 em 2 para `p` e de 1 em 1 para `q`).
  * `n = 3` proposições (`p, q, r`): `2³ = 8` linhas (alternância de 4 em 4 para `p`, de 2 em 2 para `q` e de 1 em 1 para `r`).
  * `n = 5` proposições (`p, q, r, s, t`): `2⁵ = 32` linhas.

**Exemplo resolvido (estilo ENADE 2017 — Questão 20):** Considere `S(p, q, r) = (p ∨ q) ∧ (q ∧ ~r)`. Construímos passo a passo:

| `p` | `q` | `r` | `~r` | `p ∨ q` | `q ∧ ~r` | `S = (p ∨ q) ∧ (q ∧ ~r)` |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `V` | `V` | `V` | `F` | `V` | `F` | **`F`** |
| `V` | `V` | `F` | `V` | `V` | `V` | **`V`** |
| `V` | `F` | `V` | `F` | `V` | `F` | **`F`** |
| `V` | `F` | `F` | `V` | `V` | `F` | **`F`** |
| `F` | `V` | `V` | `F` | `V` | `F` | **`F`** |
| `F` | `V` | `F` | `V` | `V` | `V` | **`V`** |
| `F` | `F` | `V` | `F` | `F` | `F` | **`F`** |
| `F` | `F` | `F` | `V` | `F` | `F` | **`F`** |

Abreviadamente, escrevemos: `S(VVV, VVF, VFV, VFF, FVV, FVF, FFV, FFF) = FVFFFVFF`.

### 2.2 Uso de Parênteses e Precedência de Conectivos

Para evitar ambiguidades na leitura de fórmulas sem parênteses excessivos, adota-se a seguinte **ordem de precedência** (da maior para a menor prioridade):

1. `~` (negação — maior precedência)
2. `∧` e `∨` (conjunção e disjunção — quando aparecem juntas sem parênteses, recomenda-se explicitar os parênteses)
3. `→` (condicional)
4. `↔` (bicondicional — menor precedência)

Quando o mesmo conectivo aparece sucessivamente repetido, associa-se à esquerda (por exemplo, `p ∧ q ∧ r` significa `(p ∧ q) ∧ r`). Assim, na fórmula `p → q ↔ s ∧ r`, o conectivo principal é `↔`, correspondendo a `(p → q) ↔ (s ∧ r)`.

### 2.3 Tautologia, Contradição e Contingência

A última coluna da tabela-verdade permite classificar qualquer proposição composta `P(p, q, r, ...)`:

| Classificação | Sinônimos | Definição pela Tabela-Verdade | Exemplos Clássicos |
| :--- | :--- | :--- | :--- |
| **Tautologia** | Proposição tautológica ou logicamente verdadeira | Última coluna contém **somente `V`** | `p ∨ ~p` (Terceiro Excluído), `~(p ∧ ~p)` (Não Contradição), `((p → q) ∧ (q → r)) → (p → r)` |
| **Contradição** | Proposição contraválida ou logicamente falsa | Última coluna contém **somente `F`** | `p ∧ ~p`, `p ↔ ~p`, `(p ∧ q) ∧ ~(p ∨ q)` |
| **Contingência** | Proposição contingente ou indeterminada | Última coluna contém **ao menos um `V` e ao menos um `F`** | `p → ~p`, `p ∧ q`, `p ∨ ~q` |

* **Relação entre Tautologia e Contradição:** `P` é uma tautologia se e somente se `~P` é uma contradição (e vice-versa).
* **Princípio de Substituição:** Se `P(p, q, r, ...)` é uma tautologia (ou uma contradição), então substituir `p, q, r, ...` por quaisquer proposições compostas `P₀, Q₀, R₀, ...` preserva a propriedade: `P(P₀, Q₀, R₀, ...)` também será uma tautologia (ou contradição).

---

## Módulo 3: Implicação Lógica, Equivalência Lógica e Conectivos de Scheffer

### 3.1 Implicação Lógica (`⇒`)

Diz-se que uma proposição `P(p, q, r, ...)` **implica logicamente** `Q(p, q, r, ...)`, denotando-se **`P ⇒ Q`**, se e somente se `Q` assume valor lógico `V` todas as vezes que `P` assume valor lógico `V`.

* **Propriedades:** Reflexiva (`P ⇒ P`) e Transitiva (se `P ⇒ Q` e `Q ⇒ R`, então `P ⇒ R`).
* **Teorema Fundamental da Implicação Lógica:** `P ⇒ Q` se e somente se a condicional `P → Q` for uma **tautologia**.
* **Atenção à distinção:** `→` é um conectivo lógico (operação que forma uma nova proposição), enquanto `⇒` é uma **relação metalógica** entre duas proposições que afirma que `P → Q` é tautológica.

Exemplos importantes que fundamentam regras de inferência:
* `p ∧ q ⇒ p` e `p ∧ q ⇒ q` (Simplificação)
* `p ⇒ p ∨ q` (Adição)
* `(p → q) ∧ p ⇒ q` (Modus Ponens)
* `(p → q) ∧ ~q ⇒ ~p` (Modus Tollens)
* `(p ∨ q) ∧ ~p ⇒ q` (Silogismo Disjuntivo)

### 3.2 Equivalência Lógica (`⇔`)

Diz-se que `P(p, q, r, ...)` é **logicamente equivalente** a `Q(p, q, r, ...)`, denotando-se **`P ⇔ Q`**, se suas tabelas-verdade forem idênticas.

* **Propriedades:** Reflexiva (`P ⇔ P`), Simétrica (se `P ⇔ Q`, então `Q ⇔ P`) e Transitiva (se `P ⇔ Q` e `Q ⇔ R`, então `P ⇔ R`).
* **Teorema Fundamental da Equivalência Lógica:** `P ⇔ Q` se e somente se a bicondicional `P ↔ Q` for uma **tautologia**.

Equivalências clássicas frequentemente cobradas:
* **Dupla Negação:** `~~p ⇔ p`
* **Regra de Clavius:** `~p → p ⇔ p`
* **Transformação da Condicional:** `p → q ⇔ ~p ∨ q`
* **Redução ao Absurdo:** `(p ∧ ~q → c) ⇔ (p → q)`, onde `c` é uma contradição (`F`).
* **Exportação-Importação:** `(p ∧ q → r) ⇔ (p → (q → r))`

### 3.3 Proposições Associadas a uma Condicional

Dada a condicional direta **`p → q`**, definem-se três proposições associadas:

| Proposição | Fórmula | Relação de Equivalência |
| :--- | :---: | :--- |
| **Condicional Direta** | `p → q` | Equivalente à **contrapositiva** (`p → q ⇔ ~q → ~p`) |
| **Recíproca** | `q → p` | Equivalente à **contrária** (`q → p ⇔ ~p → ~q`) |
| **Contrária (ou Inversa)** | `~p → ~q` | Equivalente à **recíproca** (`~p → ~q ⇔ q → p`) |
| **Contrapositiva** | `~q → ~p` | Equivalente à **direta** (`~q → ~p ⇔ p → q`) |

| `p` | `q` | Direta (`p → q`) | Contrapositiva (`~q → ~p`) | Recíproca (`q → p`) | Contrária (`~p → ~q`) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| `V` | `V` | `V` | `V` | `V` | `V` |
| `V` | `F` | `F` | `F` | `V` | `V` |
| `F` | `V` | `V` | `V` | `F` | `F` |
| `F` | `F` | `V` | `V` | `V` | `V` |

> **Dica de Prova:** Se o enunciado afirma "Se Carlos é engenheiro, então sabe lógica" (`p → q`), a sentença equivalente é sua contrapositiva: "Se Carlos não sabe lógica, então não é engenheiro" (`~q → ~p`), ou a disjunção `~p ∨ q` ("Carlos não é engenheiro ou sabe lógica"). Cuidado: a recíproca (`q → p`) e a contrária (`~p → ~q`) **não** são equivalentes à condicional original!

### 3.4 Conectivos de Scheffer (`↓` e `↑`)

* **Negação Conjunta (NOR / flecha de Peirce `↓`):** `p ↓ q ⇔ ~p ∧ ~q ⇔ ~(p ∨ q)`. Resulta `V` somente quando `p` e `q` são ambas `F`.
* **Negação Disjunta (NAND / barra de Scheffer `↑`):** `p ↑ q ⇔ ~p ∨ ~q ⇔ ~(p ∧ q)`. Resulta `F` somente quando `p` e `q` são ambas `V`.

Ambos os conectivos são **funcionalmente completos** isoladamente, ou seja, qualquer fórmula do cálculo proposicional pode ser expressa usando apenas `↓` ou apenas `↑`. Por exemplo:
* `~p ⇔ p ↓ p` e `~p ⇔ p ↑ p`
* `p ∧ q ⇔ (p ↓ p) ↓ (q ↓ q)` e `p ∧ q ⇔ (p ↑ q) ↑ (p ↑ q)`
* `p ∨ q ⇔ (p ↓ q) ↓ (p ↓ q)` e `p ∨ q ⇔ (p ↑ p) ↑ (q ↑ q)`

---

## Módulo 4: Álgebra das Proposições, Método Dedutivo e Formas Normais

### 4.1 Propriedades da Álgebra das Proposições

Sejam `p, q, r` proposições quaisquer, `t` uma tautologia (`V`) e `c` uma contradição (`F`):

| Lei / Propriedade | Para a Conjunção (`∧`) | Para a Disjunção (`∨`) |
| :--- | :--- | :--- |
| **Idempotência** | `p ∧ p ⇔ p` | `p ∨ p ⇔ p` |
| **Comutatividade** | `p ∧ q ⇔ q ∧ p` | `p ∨ q ⇔ q ∨ p` |
| **Associatividade** | `(p ∧ q) ∧ r ⇔ p ∧ (q ∧ r)` | `(p ∨ q) ∨ r ⇔ p ∨ (q ∨ r)` |
| **Identidade (Elemento Neutro)** | `p ∧ t ⇔ p` | `p ∨ c ⇔ p` |
| **Elemento Absorvente** | `p ∧ c ⇔ c` | `p ∨ t ⇔ t` |
| **Complemento** | `p ∧ ~p ⇔ c` | `p ∨ ~p ⇔ t` |
| **Distributividade** | `p ∧ (q ∨ r) ⇔ (p ∧ q) ∨ (p ∧ r)` | `p ∨ (q ∧ r) ⇔ (p ∨ q) ∧ (p ∨ r)` |
| **Absorção** | `p ∧ (p ∨ q) ⇔ p` | `p ∨ (p ∧ q) ⇔ p` |
| **Leis de De Morgan** | `~(p ∧ q) ⇔ ~p ∨ ~q` | `~(p ∨ q) ⇔ ~p ∧ ~q` |

### 4.2 Negação da Condicional e da Bicondicional

Estas duas regras estão entre os tópicos mais cobrados em provas objetivas:

* **Negação da Condicional:** Como `p → q ⇔ ~p ∨ q`, aplicando De Morgan e Dupla Negação obtém-se:
  **`~(p → q) ⇔ p ∧ ~q`**
  *(Para negar "Se chove, então levo guarda-chuva", afirma-se: "Chove **e não** levo guarda-chuva". Jamais use "se... então" para negar uma condicional!)*
* **Negação da Bicondicional:**
  **`~(p ↔ q) ⇔ (p ∧ ~q) ∨ (~p ∧ q) ⇔ p ⊕ q`**

### 4.3 Método Dedutivo e Redução de Conectivos

O **Método Dedutivo** demonstra implicações e equivalências por manipulações algébricas sucessivas, sem construir tabelas-verdade completas (o que evita o crescimento exponencial `2ⁿ`).

**Exemplo de demonstração dedutiva:** Provar que `(p → r) ∧ (q → r) ⇔ (p ∨ q) → r`:
```text
(p → r) ∧ (q → r)
  ⇔ (~p ∨ r) ∧ (~q ∨ r)       [Equivalência da Condicional]
  ⇔ (~p ∧ ~q) ∨ r             [Distributividade inversa]
  ⇔ ~(p ∨ q) ∨ r              [De Morgan]
  ⇔ (p ∨ q) → r               [Equivalência da Condicional]
```

**Teorema da Redução de Conectivos:** Entre os cinco conectivos usuais (`~, ∧, ∨, →, ↔`), todos podem ser expressos utilizando-se apenas um dos seguintes pares: `(1) ~ e ∨`, `(2) ~ e ∧`, ou `(3) ~ e →`. Entretanto, `∧`, `∨` e `→` **não** podem ser expressos utilizando apenas `~ e ↔`.

### 4.4 Formas Normais (FN, FNC e FND)

* **Forma Normal (FN):** Uma proposição está na FN se e somente se contém, quando muito, os conectivos `~`, `∧` e `∨` (elimina-se `→` por `~p ∨ q` e `↔` por `(~p ∨ q) ∧ (~q ∨ p)`).
* **Forma Normal Conjuntiva (FNC):** É uma **conjunção de cláusulas disjuntivas**, satisfazendo:
  1. Contém apenas `~`, `∧` e `∨`;
  2. `~` incide apenas sobre letras proposicionais (sem `~~` nem `~(...)`);
  3. `∨` **não** tem alcance sobre `∧` (isto é, não há `p ∨ (q ∧ r)`).
  * *Exemplo:* `(~p ∨ q) ∧ (~q ∨ ~r)`. Se cada cláusula disjuntiva contém um par complementar (como `p ∨ ~p`), a FNC representa uma tautologia.
* **Forma Normal Disjuntiva (FND):** É uma **disjunção de termos conjuntivos**, satisfazendo as condições 1 e 2 acima e:
  3. `∧` **não** tem alcance sobre `∨` (isto é, não há `p ∧ (q ∨ r)`).
  * *Exemplo:* `(p ∧ ~q) ∨ (~p ∧ ~q ∧ r)`.

**Procedimento padrão para obter FNC ou FND:**
1. Eliminar `→` e `↔`;
2. Eliminar duplas negações (`~~p ⇔ p`) e aplicar De Morgan para empurrar `~` até as variáveis atômicas;
3. Aplicar distributividade: para **FNC**, distribuir `∨` sobre `∧` (`p ∨ (q ∧ r) ⇔ (p ∨ q) ∧ (p ∨ r)`); para **FND**, distribuir `∧` sobre `∨` (`p ∧ (q ∨ r) ⇔ (p ∧ q) ∨ (p ∧ r)`).

---

## Módulo 5: Argumentos, Regras de Inferência e Simplificação da Conclusão

### 5.1 Definição e Critério de Validade

Um **argumento** é a afirmação de que uma sequência finita de proposições `P₁, P₂, ..., Pₙ` (chamadas **premissas**) tem como consequência lógica uma proposição final `Q` (chamada **conclusão**). Denota-se por:

`P₁, P₂, ..., Pₙ ⊢ Q`

* Um argumento com exatamente duas premissas e uma conclusão é chamado de **silogismo**.
* **Validade:** Um argumento é **válido** (correto, legítimo) se e somente se a conclusão `Q` é verdadeira em **todas** as interpretações em que todas as premissas `P₁, P₂, ..., Pₙ` são simultaneamente verdadeiras. Caso exista ao menos uma interpretação com premissas verdadeiras e conclusão falsa, o argumento é inválido (**sofisma** ou falácia).
* **Teorema da Condicional Associada:** O argumento `P₁, P₂, ..., Pₙ ⊢ Q` é válido se e somente se sua condicional associada `(P₁ ∧ P₂ ∧ ... ∧ Pₙ) → Q` for uma **tautologia**.

> **Importante:** A validade de um argumento depende exclusivamente de sua **forma lógica**, e não da veracidade empírica das premissas no mundo real. Um argumento pode ter premissas falsas e ainda assim ser logicamente válido (ex.: "Se 2 = 3, então 4 = 5; ora, 2 = 3; logo 4 = 5" é válido por *Modus Ponens*).

### 5.2 As 10 Regras de Inferência Fundamentais

Para argumentos com muitas variáveis (por exemplo, 5 variáveis = 32 linhas), a tabela-verdade torna-se trabalhosa. Usa-se então a **dedução natural** com regras de inferência válidas:

| Sigla | Regra de Inferência | Forma Simbólica | Descrição Intuitiva |
| :---: | :--- | :--- | :--- |
| **AD** | Adição | `p ⊢ p ∨ q` (ou `q ∨ p`) | De uma proposição verdadeira infere-se sua disjunção com qualquer outra |
| **SIMP** | Simplificação | `p ∧ q ⊢ p` (ou `q`) | De uma conjunção infere-se qualquer uma de suas parcelas |
| **CONJ** | Conjunção | `p, q ⊢ p ∧ q` | Duas proposições aceitas podem ser unidas em uma conjunção |
| **ABS** | Absorção | `p → q ⊢ p → (p ∧ q)` | Se `p` implica `q`, então `p` implica `p` e `q` juntos |
| **MP** | *Modus Ponens* | `p → q, p ⊢ q` | Afirmar o antecedente de uma condicional permite concluir o consequente |
| **MT** | *Modus Tollens* | `p → q, ~q ⊢ ~p` | Negar o consequente de uma condicional permite concluir a negação do antecedente |
| **SD** | Silogismo Disjuntivo | `p ∨ q, ~p ⊢ q` (ou `~q ⊢ p`) | Em uma disjunção, negar um termo obriga a aceitar o outro |
| **SH** | Silogismo Hipotético | `p → q, q → r ⊢ p → r` | Transitividade da condicional |
| **DC** | Dilema Construtivo | `p → q, r → s, p ∨ r ⊢ q ∨ s` | Se um dos antecedentes vale, um dos consequentes também vale |
| **DD** | Dilema Destrutivo | `p → q, r → s, ~q ∨ ~s ⊢ ~p ∨ ~r` | Se um dos consequentes falha, um dos antecedentes também falha |

**Exemplo de prova por Regras de Inferência:** Validar `p → ~q ∧ r, p, s → q, s ∨ t ⊢ t`:
```text
1. p → ~q ∧ r       (Premissa)
2. p                (Premissa)
3. s → q            (Premissa)
4. s ∨ t            (Premissa)
5. ~q ∧ r           (1, 2 – MP)
6. ~q               (5 – SIMP)
7. ~s               (3, 6 – MT)
8. t                (4, 7 – SD)
```

### 5.3 Simplificação da Conclusão

Quando a conclusão de um argumento é uma proposição composta, aplicam-se três artifícios:

1. **Conclusão da forma `p ∧ q`:** Deduz-se `p` e `q` separadamente e conclui-se `p ∧ q` por **CONJ**.
2. **Conclusão da forma `p → q` (Dedução da Condicional):** Pela equivalência Exportação-Importação (`(P ∧ p) → q ⇔ P → (p → q)`), **incorpora-se o antecedente `p` como premissa adicional** e deduz-se apenas `q`.
3. **Conclusão da forma `p ∨ q`:** Como `p ∨ q ⇔ ~p → q`, **incorpora-se `~p` como premissa adicional** e deduz-se `q` (ou incorpora-se `~q` e deduz-se `p`).

**Exemplo (Dedução da Condicional):** Provar `p ∨ q → r ∧ s, s ∨ t → u ⊢ p → u`:
Transformamos em `p ∨ q → r ∧ s, s ∨ t → u, p ⊢ u`:
```text
1. p ∨ q → r ∧ s    (Premissa)
2. s ∨ t → u        (Premissa)
3. p                (Premissa adicional – Dedução da Condicional)
4. p ∨ q            (3 – AD)
5. r ∧ s            (1, 4 – MP)
6. s                (5 – SIMP)
7. s ∨ t            (6 – AD)
8. u                (2, 7 – MP)
```

---

## Módulo 6: Validade por Regras de Equivalência e Tableau Semântico

### 6.1 Princípio da Substituição e as 10 Regras de Equivalência

Muitos argumentos não podem ser demonstrados apenas com as 10 regras de inferência. Recorre-se então à **Regra de Substituição de Proposição Equivalente**: qualquer proposição (ou subfórmula dentro dela) pode ser substituída por uma proposição logicamente equivalente, preservando a validade.

| Código | Regra de Equivalência | Formas |
| :---: | :--- | :--- |
| **ID** | Idempotência | `p ⇔ p ∧ p` ; `p ⇔ p ∨ p` |
| **COM** | Comutação | `p ∧ q ⇔ q ∧ p` ; `p ∨ q ⇔ q ∨ p` |
| **ASSOC** | Associação | `p ∧ (q ∧ r) ⇔ (p ∧ q) ∧ r` ; `p ∨ (q ∨ r) ⇔ (p ∨ q) ∨ r` |
| **DIST** | Distribuição | `p ∧ (q ∨ r) ⇔ (p ∧ q) ∨ (p ∧ r)` ; `p ∨ (q ∧ r) ⇔ (p ∨ q) ∧ (p ∨ r)` |
| **DN** | Dupla Negação | `p ⇔ ~~p` |
| **DM** | De Morgan | `~(p ∧ q) ⇔ ~p ∨ ~q` ; `~(p ∨ q) ⇔ ~p ∧ ~q` |
| **COND** | Condicional | `p → q ⇔ ~p ∨ q` |
| **BICOND** | Bicondicional | `p ↔ q ⇔ (p → q) ∧ (q → p)` ; `p ↔ q ⇔ (p ∧ q) ∨ (~p ∧ ~q)` |
| **CP** | Contraposição | `p → q ⇔ ~q → ~p` |
| **EI** | Exportação-Importação | `(p ∧ q) → r ⇔ p → (q → r)` |

**Exemplo:** Provar `t → p ∧ s, q → ~p, r → ~s, r ∨ q ⊢ ~t`:
```text
1. t → p ∧ s        (Premissa)
2. q → ~p           (Premissa)
3. r → ~s           (Premissa)
4. r ∨ q            (Premissa)
5. ~s ∨ ~p          (3, 2, 4 – DC)
6. ~p ∨ ~s          (5 – COM)
7. ~(p ∧ s)         (6 – DM)
8. ~t               (1, 7 – MT)
```

### 6.2 Método do Tableau Semântico

O **Tableau Semântico** é um método de **refutação** (prova por absurdo) baseado em árvores de decomposição semântica. Cada ramo da árvore representa um conjunto de interpretações possíveis das fórmulas.

#### Regras de Decomposição (`R1` a `R9`)

As regras dividem-se em:
* **Regras tipo α (não bifurcam — lineares):** Decompõem uma fórmula em duas fórmulas no **mesmo ramo**.
* **Regras tipo β (bifurcam — ramificam):** Dividem o ramo atual em **dois novos ramos**.

| Regra | Fórmula | Tipo | Resultado da Decomposição |
| :---: | :---: | :---: | :--- |
| **R1** | `A ∧ B` | α (linear) | Adiciona `A` e `B` no mesmo ramo |
| **R2** | `A ∨ B` | β (bifurca) | Abre dois ramos: um com `A` e outro com `B` |
| **R3** | `A → B` | β (bifurca) | Abre dois ramos: um com `~A` e outro com `B` |
| **R4** | `A ↔ B` | β (bifurca) | Abre dois ramos: um com `A ∧ B` e outro com `~A ∧ ~B` |
| **R5** | `~~A` | α (linear) | Adiciona `A` no mesmo ramo |
| **R6** | `~(A ∧ B)` | β (bifurca) | Abre dois ramos: um com `~A` e outro com `~B` |
| **R7** | `~(A ∨ B)` | α (linear) | Adiciona `~A` e `~B` no mesmo ramo |
| **R8** | `~(A → B)` | α (linear) | Adiciona `A` e `~B` no mesmo ramo |
| **R9** | `~(A ↔ B)` | β (bifurca) | Abre dois ramos: um com `~A ∧ B` e outro com `A ∧ ~B` |

* **Heurística fundamental:** **Adiar a bifurcação!** Sempre aplique primeiro todas as regras do tipo α (não ramificadas: R1, R5, R7, R8) antes de aplicar regras do tipo β. Isso gera árvores menores e menos ramos para analisar.

#### Ramo Fechado, Ramo Aberto e Prova de Validade

* **Ramo fechado:** Contém uma fórmula `B` e sua negação `~B` (contradição explícita, marcada com `×`).
* **Ramo aberto:** Não contém nenhuma contradição após exaurir as regras aplicáveis (indica uma valoração que satisfaz todas as fórmulas daquele ramo — um contraexemplo, caso se esteja testando refutação).
* **Prova de validade (consequência lógica):** Para provar `P₁, P₂, ..., Pₙ ⊢ Q`, constrói-se um tableau inicializando com a negação da condicional associada `~(P₁ ∧ P₂ ∧ ... ∧ Pₙ → Q)` — o que equivale, por R8 e R1, a colocar todas as premissas `P₁, ..., Pₙ` e a **negação da conclusão `~Q`** na raiz.
  * Se **todos** os ramos fecharem (**Tableau Fechado**), não existe contraexemplo: o argumento é **válido**.
  * Se restar ao menos um **ramo aberto saturado**, o argumento é **inválido** (os literais desse ramo aberto fornecem exatamente o contraexemplo).

**Exemplo resolvido em Tableau:** Verificar `p ∨ q → r ∧ s, ~r ⊢ ~p`:
```text
1. ~(((p ∨ q → r ∧ s) ∧ ~r) → ~p)    [Negação do argumento]
2. (p ∨ q → r ∧ s) ∧ ~r               [R8 em 1]
3. ~~p                                [R8 em 1]
4. p                                  [R5 em 3]
5. p ∨ q → r ∧ s                      [R1 em 2]
6. ~r                                 [R1 em 2]
7.   ├── ~(p ∨ q)         (R3 em 5, ramo esquerdo)
     │   ├── ~p           (R7 em 7)  -> FECHADO (contradiz 4: p e ~p)
     │   └── ~q           (R7 em 7)
     └── r ∧ s            (R3 em 5, ramo direito)
         ├── r            (R1 em 7)  -> FECHADO (contradiz 6: r e ~r)
         └── s            (R1 em 7)
```
Como ambos os ramos fecharam, o tableau é fechado e o argumento é **válido**.

---

## Módulo 7: Introdução à Lógica de Predicados e Programação Lógica

### 7.1 Predicados, Termos e Quantificadores

A Lógica Proposicional analisa sentenças inteiras como átomos indivisíveis. Já a **Lógica de Predicados (ou Lógica de Primeira Ordem)** decompõe as sentenças em:
* **Constantes e Variáveis:** Representam objetos do domínio de discurso (ex.: `joão`, `maria`, `x`, `y`).
* **Predicados:** Propriedades ou relações entre objetos (ex.: `Humano(x)`, `Pai(x, y)`).
* **Quantificadores:**
  * **Quantificador Universal (`∀` — "para todo"):** `∀x P(x)` afirma que `P(x)` é verdadeiro para todos os elementos `x` do domínio.
  * **Quantificador Existencial (`∃` — "existe ao menos um"):** `∃x P(x)` afirma que há pelo menos um elemento `x` no domínio para o qual `P(x)` é verdadeiro.

* **Variáveis ligadas e livres:** Uma variável está **ligada** quando está sob o escopo de um quantificador (`∀x` ou `∃x`); caso contrário, está **livre**. Uma fórmula sem variáveis livres é chamada de **sentença fechada**.

### 7.2 Negação de Quantificadores

As regras de negação de quantificadores generalizam as Leis de De Morgan para domínios arbitrários:

* `~(∀x P(x)) ⇔ ∃x ~P(x)` *(Negar que "todos cumprem P" equivale a afirmar que "existe ao menos um que não cumpre P")*.
* `~(∃x P(x)) ⇔ ∀x ~P(x)` *(Negar que "existe algum que cumpre P" equivale a afirmar que "nenhum cumpre P", isto é, "todos não cumprem P")*.

**Cuidado clássico com quantificadores combinados:**
* `∀x ∃y Ama(x, y)` ("Para toda pessoa `x`, existe alguém `y` que `x` ama") **não é equivalente** a `∃y ∀x Ama(x, y)` ("Existe uma pessoa `y` que é amada por todos"). A ordem de `∀` e `∃` altera o sentido lógico!

### 7.3 Programação em Lógica (Cláusulas de Horn e Prolog)

Na Computação, a Lógica de Primeira Ordem fundamenta o **paradigma de programação declarativa em lógica** (exemplificado pela linguagem **Prolog** e cobrado no ENADE 2021 — Questão 20). Um programa lógico é uma base de conhecimento formada por **fatos** e **regras** (cláusulas de Horn):

* **Fatos:** Cláusulas sem condições (afirmam relações verdadeiras diretamente no domínio).
  ```prolog
  pai(joao, maria).   % joao é pai de maria
  mae(maria, luiz).   % maria é mãe de luiz
  ```
* **Regras:** Cláusulas condicionais no formato `Cabeça :- Corpo.`, lido como "A `Cabeça` (conclusão) é verdadeira **se** o `Corpo` (condições separadas por vírgula, que representa `∧`) for verdadeiro".
  ```prolog
  avo_materno(X, Y) :- pai(X, Z), mae(Z, Y).
  irmao(X, Y) :- pai(Z, X), pai(Z, Y).
  ```
  *(Note que `pai(X, Z), mae(Z, Y)` garante que `X` é pai de `Z` e `Z` é mãe de `Y`, logo `X` é avô materno de `Y`. Inverter os argumentos de `mae(Y, Z)` tornaria a regra incorreta!)*
* **Consultas (Queries):** Perguntas feitas ao motor de inferência (por unificação e *backtracking*), como `?- mae(maria, X).`, que busca instanciar a variável `X` (retornando `X = luiz`), e não apenas um booleano isolado quando há variáveis livres na consulta.
