# Ligar a lista automática de confirmações

Guia para quem nunca mexeu nisso. São 6 passos.

**Faça no computador**, não no celular — no celular o menu que a gente
precisa não aparece.

**Enquanto você não fizer isso, nada quebra.** O site continua recebendo
as confirmações por e-mail, como já faz hoje.

Se travar em algum passo, **pare e me diga em qual** — não precisa terminar
sozinho. O passo 6 eu faço por você.

---

## Passo 1 — Criar a planilha

1. Abra o navegador e digite na barra de endereço: **`sheets.new`**
   (é um atalho do Google; não precisa do "www" nem do ".com")
2. Aperte Enter.
3. Se pedir login, entre com a conta Google de vocês.

**O que você deve estar vendo:** uma planilha em branco, com o nome
*Planilha sem título* no canto superior esquerdo.

4. Clique nesse nome *Planilha sem título* e digite:
   **Confirmações — Casamento Ester & Amauri**

Pronto. Não mexa em mais nada aqui. Não precisa criar colunas: elas
aparecem sozinhas depois.

---

## Passo 2 — Abrir o editor de script

Na barra de menus da planilha (onde está *Arquivo, Editar, Ver, Inserir,
Formatar, Dados, Ferramentas, **Extensões**, Ajuda*):

1. Clique em **Extensões**.
2. No menu que abrir, clique em **Apps Script**.

**O que você deve estar vendo:** abriu uma **aba nova** no navegador, com
cara de editor de programação. No alto à esquerda está escrito
*Projeto sem título*. No meio da tela tem um texto curto parecido com isto:

```
function myFunction() {

}
```

> **Não aparece "Extensões"?** Você provavelmente está no aplicativo do
> celular ou numa planilha que não é sua. Faça pelo computador, numa
> planilha criada por você.

---

## Passo 3 — Colar o script

Primeiro, **copiar**:

1. Aqui no VS Code, abra o arquivo `_ferramentas/planilha-confirmacoes.gs`.
2. Clique uma vez dentro do texto dele.
3. Aperte **Ctrl + A** (seleciona tudo) e depois **Ctrl + C** (copia).

Agora, **colar**:

4. Volte para a aba do navegador com o editor do Apps Script.
5. Clique uma vez em cima daquele texto `function myFunction() { }`.
6. Aperte **Ctrl + A** e depois a tecla **Delete**. A área tem que ficar
   **completamente vazia**.
7. Aperte **Ctrl + V** para colar.
8. Aperte **Ctrl + S** para salvar.

**O que você deve estar vendo:** uma tela cheia de texto que começa com
`/**` e `LISTA AUTOMÁTICA DE CONFIRMAÇÕES`. No alto à esquerda, o nome do
projeto parou de aparecer em itálico (sinal de que salvou).

---

## Passo 4 — Publicar

1. No **canto superior direito** da tela, clique no botão azul
   **Implantar**.
2. No menuzinho que cai, clique em **Nova implantação**.

**O que você deve estar vendo:** uma janela cinza no meio da tela,
escrito *Nova implantação*. Do lado esquerdo dela tem um **ícone de
engrenagem** (⚙️), ao lado das palavras *Selecionar tipo*.

3. Clique nessa **engrenagem**.
4. Na lista que abrir, clique em **Aplicativo da Web**
   (pode aparecer como *App da Web*).

**O que você deve estar vendo:** a janela cresceu e agora mostra três
campos: *Descrição*, *Executar como* e *Quem pode acessar*.

5. Preencha assim:

   | Campo | O que colocar |
   | --- | --- |
   | **Descrição** | `Confirmações do site` (pode deixar vazio também) |
   | **Executar como** | deixe como está (é o seu e-mail) |
   | **Quem pode acessar** | mude para **Qualquer pessoa** |

   > O campo *Quem pode acessar* quase sempre vem como **Apenas eu**.
   > **Você precisa trocar para "Qualquer pessoa"**, senão o site não
   > consegue enviar nada. Esse é o erro mais comum.

6. Clique no botão **Implantar**, embaixo à direita da janela.

---

## Passo 5 — Autorizar (a tela que assusta)

O Google vai pedir permissão. **Vai aparecer um aviso de "app não
verificado". Isso é normal** — acontece com todo script feito por conta
própria, e o "app" aqui é o seu próprio script, dentro da sua conta. Ele
não manda nada para fora nem dá acesso a mais ninguém.

1. Clique em **Autorizar acesso**.
2. Abre uma janelinha. Clique na **conta Google de vocês**.
3. Aparece uma tela escrito **"O Google não verificou este app"**.
   - Clique em **Avançado**, no canto **inferior esquerdo** (é um texto
     pequeno, fácil de não ver).
   - Aí embaixo aparece um link: **"Acessar Projeto sem título (não
     seguro)"**. Clique nele.
4. Na tela seguinte, role até o fim e clique em **Permitir**.

> **Por que "não seguro"?** O Google escreve isso em todo script que não
> passou pela revisão paga dele. Como o script é seu e roda dentro da sua
> conta, pode seguir.

---

## Passo 6 — Copiar o endereço e me mandar

**O que você deve estar vendo:** uma janela dizendo *Implantação atualizada*
ou *Nova implantação*, com um endereço bem longo embaixo de
**URL do app da Web**, terminando em **`/exec`**.

Algo assim:

```
https://script.google.com/macros/s/AKfycbx.../exec
```

1. Clique no botão **Copiar** ao lado desse endereço.
2. **Me mande esse endereço aqui no chat.** Eu coloco no site e publico.

Se quiser fazer você mesmo: abra `assets/js/confirmacao.js`, e na linha 15
troque

```js
const URL_PLANILHA = "";
```

por

```js
const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbx.../exec";
```

mantendo as aspas.

---

## ATUALIZAR o script depois de instalado

Sempre que o arquivo `planilha-confirmacoes.gs` mudar, é preciso levar a
mudança para dentro da planilha. **O endereço continua o mesmo** — você não
precisa mexer no site de novo.

1. Abra a planilha → **Extensões → Apps Script**.
2. Clique dentro do código, **Ctrl + A**, **Delete**.
3. No VS Code, abra `planilha-confirmacoes.gs`, **Ctrl + A**, **Ctrl + C**.
4. Volte ao navegador e **Ctrl + V**. Depois **Ctrl + S** para salvar.
5. Clique em **Implantar** (azul, canto superior direito) →
   **Gerenciar implantações**.
6. Clique no **ícone de lápis** ✏️ (canto superior direito da janela).
7. Em **Versão**, troque de *Versão 1* para **Nova versão**.
8. Clique em **Implantar** e depois em **Concluído**.

> **Não use "Nova implantação" aqui.** Aquilo cria um endereço diferente e
> o site pararia de gravar. Para atualizar é sempre
> *Gerenciar implantações → lápis → Nova versão*.

---

## Se a sua tela estiver em inglês

| Em português | Em inglês |
| --- | --- |
| Implantar | Deploy |
| Nova implantação | New deployment |
| Selecionar tipo | Select type |
| Aplicativo da Web | Web app |
| Executar como | Execute as |
| Quem pode acessar | Who has access |
| Qualquer pessoa | Anyone |
| Autorizar acesso | Authorize access |
| Avançado | Advanced |
| Acessar ... (não seguro) | Go to ... (unsafe) |
| Permitir | Allow |
| Executar | Run |

---

## Se der errado

| Problema | O que fazer |
| --- | --- |
| Não acho **Extensões** no menu | Você está no celular ou numa planilha que não é sua. Use o computador. |
| Não acho o botão **Implantar** | É azul, no canto **superior direito** da aba do Apps Script (não é a aba da planilha). |
| A janela não tem engrenagem | Role a janela para cima; a engrenagem fica à esquerda, perto do topo. |
| Travou em **"App bloqueado"** | Me avise — é diferente do aviso comum e precisa de outro caminho. |
| Publiquei mas o site não grava | Quase sempre é *Quem pode acessar* em "Apenas eu". Vá em **Implantar → Gerenciar implantações**, clique no lápis, corrija e salve. |

---

## Como a planilha vai ficar

São três abas.

**Aba "Resumo"** — os totais, sempre atualizados sozinhos:

| | |
| --- | --- |
| **Pessoas confirmadas** | 2 |
| Não poderão ir | 1 |
| Total de respostas | 3 |

**Aba "Confirmações"** — uma linha por pessoa:

| Número | Nome | Confirmação | Mensagem | Data e hora |
| --- | --- | --- | --- | --- |
| 1 | Maria Silva | Sim | Parabéns! | 03/11/2026 14:22:10 |
| | Rodrigo Batista de Assis | Não | Não vou conseguir | 03/11/2026 18:40:02 |
| 2 | João Lima | Sim | | 03/11/2026 19:05:44 |

**A coluna "Número" conta apenas quem vai.** Quem respondeu "Não" fica sem
número. Então o maior número da coluna é exatamente quantas pessoas estarão
na festa — no exemplo acima, 2.

Se alguém desconfirmar, os números seguintes andam para trás sozinhos e o
total cai. Por isso o número de cada pessoa pode mudar ao longo do tempo:
ele serve para contar, não para identificar ninguém.

Se a pessoa responder de novo **escrevendo o nome igual**, a linha dela é
**atualizada** — não cria linha repetida. É isso que permite desconfirmar.

A comparação ignora maiúsculas, acentos e espaços a mais: `JOAO  silva`
cai na mesma linha de `João Silva`. Mas se a pessoa escrever um nome
diferente na segunda vez (`João S.` em vez de `João Silva`), vira uma
linha nova — não tem como o site adivinhar que é a mesma pessoa. Se isso
acontecer, é só apagar a linha repetida na mão.

**Aba "Histórico"** — toda resposta enviada, inclusive as mudanças de ideia.

---

## Cada pessoa confirma a si mesma

Não existe campo de acompanhante. Quem for convidado precisa responder
no site, um por um — é isso que faz a contagem bater com o número real de
pessoas na festa.

Na mensagem de convite, vale deixar isso claro: *"cada pessoa da casa
precisa confirmar separadamente no site"*.

---

## Não existe lista de convidados

**Qualquer nome é aceito.** O convite vai por casa, com os nomes dos
convidados escritos na própria mensagem, então o site não confere nada —
não é preciso cadastrar ninguém em lugar nenhum.

Como o endereço do script é público (fica no código do site), o que
protege a planilha de lixo são limites de tamanho e um bloqueio de links,
já embutidos no script. Na prática ninguém tem o endereço sem procurar
por ele, mas se algum dia aparecer linha estranha, me avise.
