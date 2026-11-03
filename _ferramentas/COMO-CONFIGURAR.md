# Lista automática de confirmações

Isto liga a página de confirmação do site a uma planilha do Google que
se preenche sozinha. Leva uns 10 minutos e só precisa ser feito **uma vez**.

Enquanto não for configurado, o site continua funcionando normalmente e
mandando as confirmações por e-mail, como já fazia.

---

## 1. Criar a planilha

1. Abra <https://sheets.new> (cria uma planilha em branco na sua conta Google).
2. Dê um nome a ela no canto superior esquerdo, por exemplo
   **Confirmações — Casamento Ester & Amauri**.

Não precisa criar colunas nem abas. O script faz isso sozinho na primeira resposta.

---

## 2. Colar o script

1. Nessa mesma planilha, vá em **Extensões → Apps Script**.
2. Abre uma aba nova com um arquivo chamado `Código.gs`, contendo
   `function myFunction() { }`. **Apague tudo.**
3. Abra o arquivo `planilha-confirmacoes.gs` (está nesta mesma pasta),
   copie todo o conteúdo e cole ali.
4. Clique no ícone de disquete (**Salvar projeto**).

---

## 3. Publicar

1. No canto superior direito, clique em **Implantar → Nova implantação**.
2. Clique na engrenagem ao lado de "Selecionar tipo" e escolha **App da Web**.
3. Preencha:
   - **Descrição:** `Confirmações do site`
   - **Executar como:** `Eu (seu e-mail)`
   - **Quem pode acessar:** `Qualquer pessoa`
4. Clique em **Implantar**.

> **Sobre o "Qualquer pessoa":** isso libera apenas o *envio* de respostas,
> que é o que o site precisa. A planilha em si continua privada — ninguém
> além de você consegue ver a lista. O script também recusa qualquer nome
> que não esteja na lista de convidados.

5. O Google vai pedir autorização. Clique em **Autorizar acesso**, escolha
   sua conta e, na tela de aviso, clique em **Avançado → Acessar
   (nome do projeto)** e depois em **Permitir**.
6. No fim aparece um endereço terminado em **`/exec`**. **Copie esse endereço.**

---

## 4. Ligar no site

1. Abra o arquivo `assets/js/confirmacao.js`.
2. Logo no começo tem esta linha:

   ```js
   const URL_PLANILHA = "";
   ```

3. Cole o endereço entre as aspas:

   ```js
   const URL_PLANILHA = "https://script.google.com/macros/s/AKfy.../exec";
   ```

4. Salve e publique o site.

Se preferir, é só me mandar o endereço que eu faço esse passo e publico.

---

## 5. Ver também quem ainda NÃO respondeu (opcional, mas vale a pena)

Por padrão a planilha só mostra quem já respondeu. Para ela listar
**todos** os convidados — inclusive os que ainda não deram resposta:

1. Volte ao editor do Apps Script.
2. Na barra de cima, na caixa ao lado do ▶ **Executar**, escolha
   **`preencherConvidados`**.
3. Clique em **Executar**.

Cada convidado ganha uma linha com `Sem resposta`. Quem responder tem a
linha atualizada para `Sim` ou `Não`.

Assim dá para filtrar a coluna **Confirmação** por `Sem resposta` e saber
exatamente quem falta cobrar.

Pode rodar de novo depois de incluir convidados novos — quem já está na
planilha não é alterado.

---

## 6. Testar

Entre na página de confirmação do site, responda com um nome da lista e
confira se a linha apareceu na planilha.

Se não aparecer, abra a página no computador, aperte **F12**, vá na aba
**Console** e veja se há alguma mensagem em vermelho.

---

## Como a planilha fica

**Aba "Confirmações"** — uma linha por pessoa, sempre atualizada:

| Número | Nome | Confirmação | Acompanhantes | Mensagem | Data e hora |
|---|---|---|---|---|---|
| 1 | Samuel Fernando Lima | Sim | Maria Silva | Parabéns! | 03/11/2026 14:22:10 |
| 2 | Rodrigo Batista de Assis | Não | | Não vou conseguir | 03/11/2026 18:40:02 |

Se alguém responder de novo, a linha da pessoa é **atualizada** — não cria
linha repetida. É isso que permite desconfirmar.

**Aba "Histórico"** — toda resposta enviada, inclusive as mudanças de ideia.
Serve para vocês verem quem trocou de resposta e quando.

---

## Ao incluir um convidado novo

O nome precisa entrar em **dois lugares**:

1. `assets/js/confirmacao.js` — na lista `listaConvidados` (é o que aparece
   enquanto a pessoa digita).
2. `_ferramentas/planilha-confirmacoes.gs` — na lista `CONVIDADOS`, e depois
   **Implantar → Gerenciar implantações → editar → Nova versão**.

Se esquecer do segundo, a pessoa digita o nome, acha na lista e recebe erro
ao enviar.
