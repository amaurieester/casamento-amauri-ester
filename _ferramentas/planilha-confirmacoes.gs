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
 *   - Mantém a aba "Confirmações", com UMA LINHA POR PESSOA:
 *     Número | Nome | Confirmação | Mensagem | Data e hora
 *   - A coluna "Número" numera APENAS quem confirmou. Quem não vai
 *     fica sem número. Assim o último número da lista é o total de
 *     pessoas confirmadas para a festa.
 *   - Se a pessoa responder de novo COM O MESMO NOME, ATUALIZA a
 *     linha dela em vez de criar outra. É assim que dá para
 *     desconfirmar ou mudar de ideia — e a contagem se ajusta.
 *   - Mantém a aba "Resumo" com os totais sempre atualizados.
 *   - Guarda toda resposta na aba "Histórico", para vocês verem
 *     quem mudou de ideia e quando.
 *
 * NÃO HÁ ACOMPANHANTES: cada pessoa confirma a si mesma, uma por
 * uma. É isso que faz a contagem bater com o número real de
 * pessoas na festa.
 *
 * QUALQUER NOME É ACEITO. O convite é enviado por casa, com os
 * nomes dos convidados escritos na própria mensagem, então não faz
 * sentido o site conferir nome contra uma lista fechada.
 */

// ---------------------------------------------------------------
// CONFIGURAÇÃO
// ---------------------------------------------------------------

var ABA_LISTA = 'Confirmações';
var ABA_HISTORICO = 'Histórico';
var ABA_RESUMO = 'Resumo';

var CABECALHO_LISTA = [
  'Número', 'Nome', 'Confirmação', 'Mensagem', 'Data e hora'
];

var CABECALHO_HISTORICO = [
  'Data e hora', 'Nome', 'Confirmação', 'Mensagem'
];

// Colunas da aba "Confirmações"
var COL_NUMERO = 1;
var COL_NOME = 2;
var COL_CONFIRMACAO = 3;

var FUSO = 'America/Sao_Paulo';

// Limites de tamanho. O endereço do script é público (fica no
// código do site), então sem lista de convidados estes limites são
// o que impede alguém de encher a planilha de lixo.
var MIN_NOME = 3;
var MAX_NOME = 80;
var MAX_MENSAGEM = 1000;

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

    var nome = arrumarNome(dados.nome);
    var status = limpar(dados.status).toUpperCase();
    var mensagem = limpar(dados.mensagem).slice(0, MAX_MENSAGEM);

    if (nome.length < MIN_NOME || nome.length > MAX_NOME || !temLetra(nome)) {
      return responder({ ok: false, erro: 'nome inválido' });
    }

    if (status !== 'SIM' && status !== 'NAO') {
      return responder({ ok: false, erro: 'confirmação inválida' });
    }

    if (temLink(nome) || temLink(mensagem)) {
      return responder({ ok: false, erro: 'conteúdo não permitido' });
    }

    var agora = Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm:ss');
    var confirmacao = (status === 'SIM') ? 'Sim' : 'Não';

    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = pegarAba(planilha, ABA_LISTA, CABECALHO_LISTA);

    var linha = procurarLinha(aba, nome);
    var novo = (linha === -1);

    if (novo) {
      linha = aba.getLastRow() + 1;
    }

    // O número sai da renumeração logo abaixo
    aba.getRange(linha, 1, 1, CABECALHO_LISTA.length).setValues([[
      '', nome, confirmacao, mensagem, agora
    ]]);

    var confirmados = renumerar(aba);
    var numero = aba.getRange(linha, COL_NUMERO).getValue();

    var historico = pegarAba(planilha, ABA_HISTORICO, CABECALHO_HISTORICO);
    historico.appendRow([agora, nome, confirmacao, mensagem]);

    montarResumo(planilha);

    return responder({
      ok: true,
      numero: numero === '' ? null : numero,
      confirmados: confirmados,
      atualizado: !novo
    });

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
// NUMERAÇÃO
//
// Numera só quem respondeu "Sim", na ordem em que as linhas estão.
// Quem não vai fica com a célula vazia. Logo, o maior número da
// coluna é quantas pessoas estarão na festa.
//
// É refeita a cada resposta porque alguém pode desconfirmar: nesse
// caso os números seguintes andam para trás e o total cai sozinho.
// ---------------------------------------------------------------

function renumerar(aba) {
  var ultima = aba.getLastRow();
  if (ultima < 2) return 0;

  var quantas = ultima - 1;
  var status = aba.getRange(2, COL_CONFIRMACAO, quantas, 1).getValues();

  var numeros = [];
  var conta = 0;

  for (var i = 0; i < quantas; i++) {
    if (limpar(status[i][0]).toLowerCase() === 'sim') {
      conta++;
      numeros.push([conta]);
    } else {
      numeros.push(['']);
    }
  }

  aba.getRange(2, COL_NUMERO, quantas, 1).setValues(numeros);

  return conta;
}

// ---------------------------------------------------------------
// RESUMO
// Aba com os totais, para não precisar contar na mão.
// As fórmulas se atualizam sozinhas.
// ---------------------------------------------------------------

function montarResumo(planilha) {
  var aba = planilha.getSheetByName(ABA_RESUMO);

  // Já existe e já está montada: não precisa refazer
  if (aba && limpar(aba.getRange(1, 1).getValue())) return aba;

  if (!aba) {
    aba = planilha.insertSheet(ABA_RESUMO, 0);
  }

  aba.getRange(1, 1, 3, 1).setValues([
    ['Pessoas confirmadas'],
    ['Não poderão ir'],
    ['Total de respostas']
  ]);

  aba.getRange(1, 2).setFormula("=COUNTIF('" + ABA_LISTA + "'!C2:C,\"Sim\")");
  aba.getRange(2, 2).setFormula("=COUNTIF('" + ABA_LISTA + "'!C2:C,\"Não\")");
  aba.getRange(3, 2).setFormula("=COUNTA('" + ABA_LISTA + "'!B2:B)");

  aba.getRange(1, 1, 3, 1).setFontWeight('bold');
  aba.getRange(1, 2, 3, 1).setFontSize(18).setFontWeight('bold');
  aba.getRange(1, 1).setBackground('#fbd362');
  aba.setColumnWidth(1, 220);
  aba.setColumnWidth(2, 110);

  return aba;
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

// Tira espaços repetidos mas preserva a grafia de quem digitou
function arrumarNome(valor) {
  return limpar(valor).replace(/\s+/g, ' ');
}

function temLetra(texto) {
  return /[a-zA-ZÀ-ÿ]/.test(texto);
}

function temLink(texto) {
  return /https?:\/\/|www\.|\.com|\.net|\.ru/i.test(texto);
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

function pegarAba(planilha, nome, cabecalho) {
  var aba = planilha.getSheetByName(nome);

  if (!aba) {
    aba = planilha.insertSheet(nome);
  }

  var refazer = (aba.getLastRow() === 0);

  // Se o cabeçalho for de uma versão antiga do script, corrige.
  // Sem isto os dados entrariam embaixo do título errado.
  if (!refazer) {
    var atual = aba.getRange(1, 1, 1, cabecalho.length).getValues()[0];
    refazer = (atual.join('|') !== cabecalho.join('|'));
  }

  if (refazer) {
    aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);

    // Limpa sobras de colunas que não existem mais
    var extras = aba.getMaxColumns() - cabecalho.length;
    if (extras > 0) {
      aba.getRange(1, cabecalho.length + 1, 1, extras).clearContent();
    }

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

  var nomes = aba.getRange(2, COL_NOME, ultima - 1, 1).getValues();
  var alvo = normalizar(nome);

  for (var i = 0; i < nomes.length; i++) {
    if (normalizar(nomes[i][0]) === alvo) {
      return i + 2;
    }
  }

  return -1;
}
