/**
 * LISTA AUTOMÁTICA DE CONFIRMAÇÕES — Casamento Ester & Amauri
 * =========================================================
 *
 * Este arquivo NÃO faz parte do site. Ele é colado dentro de uma
 * Planilha Google (Extensões → Apps Script) e é o que recebe as
 * respostas da página de confirmação e preenche a planilha sozinho.
 *
 * O passo a passo da instalação está em COMO-CONFIGURAR.md,
 * nesta mesma pasta.
 *
 * O que ele faz:
 *   - Cria e mantém a aba "Confirmações", com uma linha por pessoa:
 *     Número | Nome | Confirmação | Acompanhantes | Mensagem | Data e hora
 *   - Se a pessoa responder de novo, ATUALIZA a linha dela em vez de
 *     criar outra. Assim dá para desconfirmar ou mudar de ideia.
 *   - Guarda toda resposta na aba "Histórico", para vocês verem
 *     quem mudou de ideia e quando.
 */

// ---------------------------------------------------------------
// CONFIGURAÇÃO
// ---------------------------------------------------------------

// Mesma lista que está em assets/js/confirmacao.js, no site.
// Serve para o endereço público não poder ser usado para inventar
// convidados. Ao incluir alguém novo, inclua NOS DOIS lugares.
// Deixando a lista vazia ([]), o script aceita qualquer nome.
var CONVIDADOS = [
  'Amauri de Jesus Pereira',
  'Maria Rozângela Mourão Pereira',
  'Vinícius Mourão Pereira',
  'Deisy Aparecida Morais Benevides',
  'Evaldo Rezende Benevides',
  'Hélio Morais Benevides',
  'Pedro Henrique de Freitas Reis',
  'Rodrigo Batista de Assis',
  'Samuel Henrique Pinto',
  'Samuel Fernando Lima'
];

var ABA_LISTA = 'Confirmações';
var ABA_HISTORICO = 'Histórico';

var CABECALHO_LISTA = [
  'Número', 'Nome', 'Confirmação', 'Acompanhantes', 'Mensagem', 'Data e hora'
];

var CABECALHO_HISTORICO = [
  'Data e hora', 'Nome', 'Confirmação', 'Acompanhantes', 'Mensagem'
];

var FUSO = 'America/Sao_Paulo';

// ---------------------------------------------------------------
// ENTRADA: é aqui que o site entrega as respostas
// ---------------------------------------------------------------

function doPost(e) {
  var trava = LockService.getScriptLock();

  // Sem isto, duas pessoas respondendo no mesmo segundo podem
  // escrever na mesma linha.
  try {
    trava.waitLock(20000);
  } catch (erro) {
    return responder({ ok: false, erro: 'ocupado' });
  }

  try {
    var dados = JSON.parse(e.postData.contents);

    var nome = limpar(dados.nome);
    var status = limpar(dados.status).toUpperCase();
    var acompanhantes = limpar(dados.acompanhantes);
    var mensagem = limpar(dados.mensagem);

    if (!nome) {
      return responder({ ok: false, erro: 'nome vazio' });
    }

    if (status !== 'SIM' && status !== 'NAO') {
      return responder({ ok: false, erro: 'confirmação inválida' });
    }

    if (!estaNaLista(nome)) {
      return responder({ ok: false, erro: 'nome fora da lista de convidados' });
    }

    var agora = Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm:ss');
    var confirmacao = (status === 'SIM') ? 'Sim' : 'Não';

    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = pegarAba(planilha, ABA_LISTA, CABECALHO_LISTA);

    var linha = procurarLinha(aba, nome);
    var novo = false;

    if (linha === -1) {
      linha = aba.getLastRow() + 1;
      novo = true;
    }

    var numero = novo ? (linha - 1) : aba.getRange(linha, 1).getValue();

    aba.getRange(linha, 1, 1, CABECALHO_LISTA.length).setValues([[
      numero, nome, confirmacao, acompanhantes, mensagem, agora
    ]]);

    var historico = pegarAba(planilha, ABA_HISTORICO, CABECALHO_HISTORICO);
    historico.appendRow([agora, nome, confirmacao, acompanhantes, mensagem]);

    return responder({ ok: true, numero: numero, atualizado: !novo });

  } catch (erro) {
    return responder({ ok: false, erro: String(erro) });

  } finally {
    trava.releaseLock();
  }
}

// Só serve para testar se a publicação deu certo. Não devolve a
// lista: ela é particular de vocês.
function doGet() {
  return responder({ ok: true, servico: 'confirmacoes' });
}

// ---------------------------------------------------------------
// PREENCHER A LISTA COM TODOS OS CONVIDADOS
//
// Rode esta função UMA VEZ, à mão, pelo editor do Apps Script
// (escolha "preencherConvidados" na caixa ao lado do ▶ e clique
// em Executar).
//
// Ela cria uma linha para cada convidado com "Sem resposta". Assim
// a planilha mostra também quem ainda NÃO respondeu, que é o que
// interessa para cobrar. Quem responder tem a linha atualizada.
//
// Pode rodar de novo depois de incluir convidados novos: quem já
// está na planilha não é mexido.
// ---------------------------------------------------------------

function preencherConvidados() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = pegarAba(planilha, ABA_LISTA, CABECALHO_LISTA);
  var incluidos = 0;

  for (var i = 0; i < CONVIDADOS.length; i++) {
    var nome = CONVIDADOS[i];

    if (procurarLinha(aba, nome) !== -1) continue;

    var linha = aba.getLastRow() + 1;
    aba.getRange(linha, 1, 1, CABECALHO_LISTA.length).setValues([[
      linha - 1, nome, 'Sem resposta', '', '', ''
    ]]);
    incluidos++;
  }

  SpreadsheetApp.getActiveSpreadsheet().toast(
    incluidos + ' convidado(s) incluído(s).', 'Lista preenchida', 5
  );
}

// ---------------------------------------------------------------
// APOIO
// ---------------------------------------------------------------

function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}

function limpar(valor) {
  if (valor === null || valor === undefined) return '';
  return String(valor).trim();
}

// Compara ignorando maiúsculas, acentos e espaços repetidos, para
// "JOAO  silva" encontrar "João Silva".
function normalizar(texto) {
  return limpar(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ');
}

function estaNaLista(nome) {
  if (!CONVIDADOS.length) return true;

  var alvo = normalizar(nome);

  for (var i = 0; i < CONVIDADOS.length; i++) {
    if (normalizar(CONVIDADOS[i]) === alvo) return true;
  }

  return false;
}

function pegarAba(planilha, nome, cabecalho) {
  var aba = planilha.getSheetByName(nome);

  if (!aba) {
    aba = planilha.insertSheet(nome);
  }

  if (aba.getLastRow() === 0) {
    aba.appendRow(cabecalho);
    aba.getRange(1, 1, 1, cabecalho.length)
      .setFontWeight('bold')
      .setBackground('#fbd362');
    aba.setFrozenRows(1);
  }

  return aba;
}

function procurarLinha(aba, nome) {
  var ultima = aba.getLastRow();
  if (ultima < 2) return -1;

  var nomes = aba.getRange(2, 2, ultima - 1, 1).getValues();
  var alvo = normalizar(nome);

  for (var i = 0; i < nomes.length; i++) {
    if (normalizar(nomes[i][0]) === alvo) {
      return i + 2;
    }
  }

  return -1;
}
