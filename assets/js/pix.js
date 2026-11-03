// ======================================================
// PIX COM O VALOR JÁ PREENCHIDO
//
// O "copia e cola" do Pix é uma sequência de campos no formato
// tag + tamanho + conteúdo (padrão EMV do Banco Central). O código
// fixo que estava no site não trazia valor nenhum, então quem
// escolhia um presente de R$ 1.600,00 tinha de digitar o valor à
// mão no aplicativo do banco.
//
// Aqui o código é remontado com o campo 54 (valor da transação) já
// dentro, e o CRC do fim é recalculado — sem isso o banco recusa o
// código como inválido.
//
// O QR também é desenhado na hora, a partir do mesmo texto, para a
// imagem e o copia e cola nunca mostrarem valores diferentes.
// ======================================================

// Copia e cola da conta do Mercado Pago, sem valor, como veio do
// aplicativo. A chave é o e-mail. Antes daqui havia uma chave
// aleatória que caía no Nubank; os noivos querem tudo numa conta só.
const PIX_BASE =
    '00020126480014br.gov.bcb.pix0126eng.amaurimourao@gmail.com' +
    '5204000053039865802BR5921Amauri Mourao Pereira6009Sao Paulo' +
    '62240520daqr210415759083406363047D54';

const TAG_VALOR = '54';
const TAG_CRC = '63';

// CRC-16/CCITT-FALSE, que é o que o padrão do Pix exige
function crcPix(texto) {
    let crc = 0xFFFF;

    for (let i = 0; i < texto.length; i++) {
        crc ^= texto.charCodeAt(i) << 8;

        for (let bit = 0; bit < 8; bit++) {
            crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF
                                 : (crc << 1) & 0xFFFF;
        }
    }

    return crc.toString(16).toUpperCase().padStart(4, '0');
}

function lerCampos(codigo) {
    const campos = [];
    let i = 0;

    while (i + 4 <= codigo.length) {
        const tag = codigo.substr(i, 2);
        const tamanho = parseInt(codigo.substr(i + 2, 2), 10);

        if (!(tamanho >= 0)) return campos;      // código malformado

        campos.push({ tag: tag, conteudo: codigo.substr(i + 4, tamanho) });
        i += 4 + tamanho;
    }

    return campos;
}

function montarCampo(tag, conteudo) {
    return tag + String(conteudo.length).padStart(2, '0') + conteudo;
}

// Devolve o copia e cola com o valor dentro. Valor zero ou ausente
// devolve o código original, que deixa o banco perguntar o valor.
function pixComValor(valor) {
    const campos = lerCampos(PIX_BASE)
        .filter(c => c.tag !== TAG_CRC && c.tag !== TAG_VALOR);

    if (valor > 0) {
        campos.push({ tag: TAG_VALOR, conteudo: valor.toFixed(2) });
    }

    // Os campos vão em ordem crescente de tag: é como os bancos
    // esperam ler, e é onde o 54 cai entre o 53 e o 58.
    campos.sort((a, b) => a.tag.localeCompare(b.tag));

    const corpo = campos.map(c => montarCampo(c.tag, c.conteudo)).join('') +
                  TAG_CRC + '04';

    return corpo + crcPix(corpo);
}

// Desenha o QR dentro de um elemento, em SVG, para ficar nítido em
// qualquer tela e na impressão.
function desenharQrPix(elemento, codigo) {
    if (!elemento || typeof qrcode !== 'function') return false;

    try {
        // Nível M de correção de erro: o que o Banco Central recomenda
        const qr = qrcode(0, 'M');
        qr.addData(codigo);
        qr.make();

        elemento.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });

        const svg = elemento.querySelector('svg');
        if (svg) {
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-label', 'QR Code do Pix');
        }

        return true;

    } catch (erro) {
        return false;
    }
}
