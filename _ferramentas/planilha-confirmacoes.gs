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
 *   - Se a pessoa responder de novo COM O MESMO NOME, ATUALIZA a
 *     linha dela em vez de criar outra. É assim que dá para
 *     desconfirmar ou mudar de ideia.
 *   - Guarda toda resposta na aba "Histórico", para vocês verem
 *     quem mudou de ideia e quando.
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

var CABECALHO_LISTA = [
  'Número', 'Nome', 'Confirmação', 'Acompanhantes', 'Mensagem', 'Data e hora'
];

var CABECALHO_HISTORICO = [
  'Data e hora', 'Nome', 'Confirmação', 'Acompanhantes', 'Mensagem'
];

var FUSO = 'America/Sao_Paulo';

// Limites de tamanho. O endereço do script é público (fica no
// código do site), então sem a lista de convidados estes limites
// são o que impede alguém de encher a planilha de lixo.
var MAX_NOME = 80;
var MAX_ACOMPANHANTES = 400;
var MAX_MENSAGEM = 1000;
var MIN_NOME = 3;

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
    var acompanhantes = limpar(dados.acompanhantes).slice(0, MAX_ACOMPANHANTES);
    var mensagem = limpar(dados.mensagem).slice(0, MAX_MENSAGEM);

    if (nome.length < MIN_NOME || nome.length > MAX_NOME || !temLetra(nome)) {
      return responder({ ok: false, erro: 'nome inválido' });
    }

    if (status !== 'SIM' && status !== 'NAO') {
      return responder({ ok: false, erro: 'confirmação inválida' });
    }

    if (temLink(nome) || temLink(acompanhantes) || temLink(mensagem)) {
      return responder({ ok: false, erro: 'conteúdo não permitido' });
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
