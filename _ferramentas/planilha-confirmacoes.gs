/**
 * PLANILHA DO CASAMENTO — Ester & Amauri
 * =====================================
 *
 * Este arquivo NÃO faz parte do site. Ele é colado dentro de uma
 * Planilha Google (Extensões → Apps Script) e é o que recebe tudo
 * o que acontece no site e preenche a planilha sozinho.
 *
 * O passo a passo da instalação está em COMO-CONFIGURAR.md,
 * nesta mesma pasta.
 *
 * ABAS QUE ELE MANTÉM
 *
 *   Resumo        Totais de tudo, por fórmula, sempre atualizados.
 *
 *   Confirmações  Uma linha por pessoa:
 *                 Número | Nome | Confirmação | Mensagem | Data e hora
 *                 A coluna "Número" numera APENAS quem confirmou, então
 *                 o maior número é o total de pessoas na festa. Responder
 *                 de novo com o mesmo nome ATUALIZA a linha, e é assim
 *                 que dá para desconfirmar.
 *
 *   Presentes     Quem presenteou, o que deu e quanto somou.
 *
 *   Mensagens     Recados deixados na página inicial.
 *
 *   Acessos       Uma linha por página visitada, para contar as visitas.
 *
 *   Histórico     Toda confirmação enviada, inclusive mudanças de ideia.
 *
 * NÃO HÁ ACOMPANHANTES: cada pessoa confirma a si mesma, uma por uma.
 * QUALQUER NOME É ACEITO: o convite vai por casa, com os nomes escritos
 * na própria mensagem.
 */

// ---------------------------------------------------------------
// CONFIGURAÇÃO
// ---------------------------------------------------------------

var ABA_LISTA = 'Confirmações';
var ABA_HISTORICO = 'Histórico';
var ABA_RESUMO = 'Resumo';
var ABA_MENSAGENS = 'Mensagens';
var ABA_PRESENTES = 'Presentes';
var ABA_ACESSOS = 'Acessos';

var CABECALHO_LISTA = [
  'Número', 'Nome', 'Confirmação', 'Mensagem', 'Data e hora', 'Observação'
];

var CABECALHO_HISTORICO = [
  'Data e hora', 'Nome', 'Confirmação', 'Mensagem'
];

var CABECALHO_MENSAGENS = [
  'Número', 'Data e hora', 'Nome', 'E-mail', 'Mensagem'
];

var CABECALHO_PRESENTES = [
  'Número', 'Data e hora', 'Nome', 'Presentes escolhidos', 'Valor total', 'Qtd.'
];

var CABECALHO_ACESSOS = [
  'Data e hora', 'Página', 'Aparelho'
];

// Colunas da aba "Confirmações"
var COL_NUMERO = 1;
var COL_NOME = 2;
var COL_CONFIRMACAO = 3;
var COL_OBSERVACAO = 6;

var FUSO = 'America/Sao_Paulo';

// Limites de tamanho. O endereço do script é público (fica no código
// do site), então estes limites são o que impede alguém de encher a
// planilha de lixo.
var MIN_NOME = 3;
var MAX_NOME = 80;
var MAX_MENSAGEM = 1000;
var MAX_PRESENTES = 1500;
var MAX_VALOR = 1000000;

// Versão do desenho da aba Resumo. Mudou o desenho, muda o número e
// a aba é refeita na próxima resposta.
var VERSAO_RESUMO = 'v4';

// ---------------------------------------------------------------
// ENTRADA: é aqui que o site entrega tudo
// ---------------------------------------------------------------

function doPost(e) {
  var dados;

  try {
    dados = JSON.parse(e.postData.contents);
  } catch (erro) {
    return responder({ ok: false, erro: 'dados inválidos' });
  }

  var tipo = limpar(dados.tipo).toLowerCase();

  // Visita de página: é o caso mais frequente de longe, então passa
  // antes de tudo e sem trava, para não segurar fila.
  if (tipo === 'acesso') {
    return guardarAcesso(dados);
  }

  var trava = LockService.getScriptLock();

  // Sem isto, duas pessoas respondendo no mesmo segundo podem
  // escrever na mesma linha.
  try {
    trava.waitLock(20000);
  } catch (erro) {
    return responder({ ok: false, erro: 'ocupado' });
  }

  try {
    if (tipo === 'mensagem') return guardarMensagem(dados);
    if (tipo === 'presente') return guardarPresente(dados);
    return guardarConfirmacao(dados);

  } catch (erro) {
    return responder({ ok: false, erro: String(erro) });

  } finally {
    trava.releaseLock();
  }
}

// Só serve para testar se a publicação deu certo. Não devolve nada
// da planilha: ela é particular de vocês.
function doGet() {
  return responder({ ok: true, servico: 'casamento' });
}

// ---------------------------------------------------------------
// CONFIRMAÇÃO DE PRESENÇA
// ---------------------------------------------------------------

function guardarConfirmacao(dados) {
  var nome = arrumarNome(dados.nome);
  var status = limpar(dados.status).toUpperCase();
  var mensagem = limpar(dados.mensagem).slice(0, MAX_MENSAGEM);

  if (!nomeAceitavel(nome)) {
    return responder({ ok: false, erro: 'nome inválido' });
  }

  if (status !== 'SIM' && status !== 'NAO') {
    return responder({ ok: false, erro: 'confirmação inválida' });
  }

  if (temLink(nome) || temLink(mensagem)) {
    return responder({ ok: false, erro: 'conteúdo não permitido' });
  }

  var agora = carimbo();
  var confirmacao = (status === 'SIM') ? 'Sim' : 'Não';

  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = pegarAba(planilha, ABA_LISTA, CABECALHO_LISTA);

  var linha = procurarLinha(aba, nome);
  var novo = (linha === -1);

  // Nome repetido NÃO vira linha nova: a resposta cai em cima da
  // que já existia. É isso que impede uma pessoa que respondeu duas
  // vezes de ser contada duas vezes.
  //
  // Para a repetição não ficar invisível, a coluna Observação conta
  // quantas vezes aquele nome respondeu e avisa que o que vale é a
  // última. As respostas anteriores continuam todas no Histórico.
  var vezes = 1;
  var observacao = '';

  if (novo) {
    linha = aba.getLastRow() + 1;

  } else {
    var antes = limpar(aba.getRange(linha, COL_OBSERVACAO).getValue());
    var conta = antes.match(/(\d+)\s*vezes/);
    vezes = conta ? (parseInt(conta[1], 10) + 1) : 2;

    observacao = 'Respondeu ' + vezes + ' vezes — vale esta, de ' + agora +
                 '. Não foi contada duas vezes. As anteriores estão no Histórico.';
  }

  // O número sai da renumeração logo abaixo
  aba.getRange(linha, 1, 1, CABECALHO_LISTA.length).setValues([[
    '', nome, confirmacao, mensagem, agora, observacao
  ]]);

  if (observacao) {
    aba.getRange(linha, COL_OBSERVACAO).setWrap(true).setFontColor('#b06000');
  }

  var confirmados = renumerar(aba);
  var numero = aba.getRange(linha, COL_NUMERO).getValue();

  var historico = pegarAba(planilha, ABA_HISTORICO, CABECALHO_HISTORICO);
  historico.appendRow([agora, nome, confirmacao, mensagem]);

  montarResumo(planilha);

  return responder({
    ok: true,
    numero: numero === '' ? null : numero,
    confirmados: confirmados,
    atualizado: !novo,
    vezes: vezes
  });
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
// MENSAGENS PARA OS NOIVOS
//
// Vêm do formulário no fim da página inicial. Cada envio é SEMPRE
// uma linha nova: se a pessoa escrever duas vezes, são dois recados
// diferentes, e não uma correção.
// ---------------------------------------------------------------

function guardarMensagem(dados) {
  var nome = arrumarNome(dados.nome);
  var email = limpar(dados.email).slice(0, 120);
  var mensagem = limpar(dados.mensagem).slice(0, MAX_MENSAGEM);

  if (!nomeAceitavel(nome)) {
    return responder({ ok: false, erro: 'nome inválido' });
  }

  if (!mensagem) {
    return responder({ ok: false, erro: 'mensagem vazia' });
  }

  if (temLink(nome) || temLink(mensagem)) {
    return responder({ ok: false, erro: 'conteúdo não permitido' });
  }

  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = pegarAba(planilha, ABA_MENSAGENS, CABECALHO_MENSAGENS);
  var numero = aba.getLastRow();

  if (numero === 1) {
    aba.setColumnWidth(1, 70);
    aba.setColumnWidth(2, 150);
    aba.setColumnWidth(3, 200);
    aba.setColumnWidth(4, 200);
    aba.setColumnWidth(5, 600);
  }

  aba.appendRow([numero, carimbo(), nome, email, mensagem]);

  // Sem isto os recados longos viram uma linha só, ilegível
  aba.getRange(numero + 1, 5).setWrap(true);

  montarResumo(planilha);

  return responder({ ok: true, numero: numero });
}

// ---------------------------------------------------------------
// PRESENTES
//
// Vem da página de finalizar presente, onde a pessoa escreve o nome
// antes de ver as formas de pagamento.
//
// ATENÇÃO: isto registra o que a pessoa ESCOLHEU, não o que ela
// pagou. O site não tem como saber se o Pix caiu. Confira sempre
// contra o extrato do Mercado Pago.
// ---------------------------------------------------------------

function guardarPresente(dados) {
  var nome = arrumarNome(dados.nome);
  var itens = limpar(dados.itens).slice(0, MAX_PRESENTES);
  var total = Number(dados.total);
  var quantidade = Number(dados.quantidade);

  if (!nomeAceitavel(nome)) {
    return responder({ ok: false, erro: 'nome inválido' });
  }

  if (!itens) {
    return responder({ ok: false, erro: 'nenhum presente informado' });
  }

  if (!isFinite(total) || total < 0 || total > MAX_VALOR) {
    return responder({ ok: false, erro: 'valor inválido' });
  }

  if (!isFinite(quantidade) || quantidade < 1 || quantidade > 200) {
    quantidade = itens.split(';').length;
  }

  if (temLink(nome) || temLink(itens)) {
    return responder({ ok: false, erro: 'conteúdo não permitido' });
  }

  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = pegarAba(planilha, ABA_PRESENTES, CABECALHO_PRESENTES);
  var numero = aba.getLastRow();

  if (numero === 1) {
    aba.setColumnWidth(1, 70);
    aba.setColumnWidth(2, 150);
    aba.setColumnWidth(3, 210);
    aba.setColumnWidth(4, 520);
    aba.setColumnWidth(5, 130);
    aba.setColumnWidth(6, 70);
  }

  aba.appendRow([numero, carimbo(), nome, itens, total, quantidade]);

  var linha = numero + 1;
  aba.getRange(linha, 4).setWrap(true);
  aba.getRange(linha, 5).setNumberFormat('R$ #,##0.00');

  montarResumo(planilha);

  return responder({ ok: true, numero: numero, total: total });
}

// ---------------------------------------------------------------
// ACESSOS
//
// Uma linha por página aberta. O site manda no máximo uma vez por
// página a cada visita, então a conta é de visitas, não de recargas.
//
// Aqui não há trava nem Resumo: é o caminho mais usado e precisa ser
// o mais leve possível, para não gastar a cota do Apps Script.
// ---------------------------------------------------------------

function guardarAcesso(dados) {
  var pagina = limpar(dados.pagina).slice(0, 60);
  var aparelho = limpar(dados.aparelho).slice(0, 20);

  if (!pagina) pagina = '(desconhecida)';
  if (aparelho !== 'Celular' && aparelho !== 'Computador') aparelho = '(outro)';

  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = pegarAba(planilha, ABA_ACESSOS, CABECALHO_ACESSOS);

  aba.appendRow([carimbo(), pagina, aparelho]);

  return responder({ ok: true });
}

// ---------------------------------------------------------------
// RESUMO
// Aba com todos os totais, para não precisar contar na mão.
// As fórmulas se atualizam sozinhas.
// ---------------------------------------------------------------

function montarResumo(planilha) {
  var aba = planilha.getSheetByName(ABA_RESUMO);

  // Já está montada nesta versão: não precisa refazer
  if (aba && limpar(aba.getRange(14, 1).getValue()) === VERSAO_RESUMO) {
    return aba;
  }

  if (!aba) {
    aba = planilha.insertSheet(ABA_RESUMO, 0);
  }

  // As fórmulas apontam para estas abas, então todas precisam existir
  pegarAba(planilha, ABA_LISTA, CABECALHO_LISTA);
  pegarAba(planilha, ABA_PRESENTES, CABECALHO_PRESENTES);
  pegarAba(planilha, ABA_MENSAGENS, CABECALHO_MENSAGENS);
  pegarAba(planilha, ABA_ACESSOS, CABECALHO_ACESSOS);

  aba.clear();

  var L = "'" + ABA_LISTA + "'";
  var P = "'" + ABA_PRESENTES + "'";
  var M = "'" + ABA_MENSAGENS + "'";
  var A = "'" + ABA_ACESSOS + "'";

  // [rótulo, fórmula]. Fórmula nula = título de bloco.
  var blocos = [
    ['PRESENÇA', null],
    // SUMPRODUCT no lugar de COUNTIF de proposito: COUNTIF precisa
    // de virgula entre os argumentos, e em planilha configurada em
    // portugues o separador e ponto e virgula, o que dava #ERROR!.
    // Estas formulas nao usam separador nenhum, entao valem em
    // qualquer idioma.
    ['Pessoas confirmadas', '=SUMPRODUCT(--(' + L + '!C2:C="Sim"))'],
    ['Não poderão ir', '=SUMPRODUCT(--(' + L + '!C2:C="Não"))'],
    ['Total de respostas', '=COUNTA(' + L + '!B2:B)'],
    ['', ''],
    ['PRESENTES', null],
    ['Presentes registrados', '=COUNTA(' + P + '!C2:C)'],
    ['Valor total escolhido', '=SUM(' + P + '!E2:E)'],
    ['', ''],
    ['SITE', null],
    ['Visitas às páginas', '=COUNTA(' + A + '!A2:A)'],
    ['Recados recebidos', '=COUNTA(' + M + '!C2:C)']
  ];

  for (var i = 0; i < blocos.length; i++) {
    var linha = i + 1;
    var rotulo = blocos[i][0];
    var formula = blocos[i][1];

    if (!rotulo) continue;

    aba.getRange(linha, 1).setValue(rotulo);

    if (formula === null) {
      aba.getRange(linha, 1, 1, 2)
        .setFontWeight('bold')
        .setFontSize(10)
        .setFontColor('#8a5a00')
        .setBackground('#fbd362');
    } else {
      aba.getRange(linha, 2).setFormula(formula).setFontSize(16).setFontWeight('bold');
    }
  }

  // linha 8 é "Valor total escolhido"
  aba.getRange(8, 2).setNumberFormat('R$ #,##0.00');

  // marca da versão, em branco sobre branco para não poluir
  aba.getRange(14, 1).setValue(VERSAO_RESUMO).setFontColor('#ffffff');

  aba.setColumnWidth(1, 230);
  aba.setColumnWidth(2, 140);
  aba.setHiddenGridlines(true);

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

function carimbo() {
  return Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm:ss');
}

function limpar(valor) {
  if (valor === null || valor === undefined) return '';
  return String(valor).trim();
}

// Tira espaços repetidos mas preserva a grafia de quem digitou
function arrumarNome(valor) {
  return limpar(valor).replace(/\s+/g, ' ');
}

function nomeAceitavel(nome) {
  return nome.length >= MIN_NOME && nome.length <= MAX_NOME && temLetra(nome);
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
