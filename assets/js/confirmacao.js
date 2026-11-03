// ======================================================
// CONFIRMAÇÃO DE PRESENÇA
//
// Cada pessoa confirma a si mesma, uma por uma. Não há campo de
// acompanhante: é isso que faz a contagem da planilha bater com
// o número real de pessoas na festa.
//
// Qualquer nome é aceito. O convite é enviado por casa, com os
// nomes das pessoas convidadas na própria mensagem, então o site
// não precisa conferir nome contra uma lista.
//
// Fluxo: nome → confirmar ou recusar → mensagem → enviar.
//
// A resposta vai para a planilha do Google (lista automática) e
// para o Formspree (aviso por e-mail). Basta uma das duas
// funcionar para a resposta ser dada como registrada.
// ======================================================

// Endereço do App da Web do Apps Script, terminado em /exec.
// O passo a passo está em _ferramentas/COMO-CONFIGURAR.md
const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbwYhozXKjN40H7AXrDzzUmhURJaRo1HTfuZTXegHCklbuXFqsQQWuwTlJii51VG2JU/exec";

const URL_FORMSPREE = "https://formspree.io/f/xaqqdzwd";

// Mínimo para o campo valer como nome preenchido
const MINIMO_CARACTERES = 3;

// ======================================================
// TEXTO
// ======================================================

// Tira espaços repetidos mas preserva a grafia de quem digitou
function arrumarNome(texto) {
    return String(texto || "").trim().replace(/\s+/g, " ");
}

function nomeValido(texto) {
    const nome = arrumarNome(texto);

    // Precisa ter ao menos uma letra: evita linha só com números
    return nome.length >= MINIMO_CARACTERES && /[a-zA-ZÀ-ÿ]/.test(nome);
}

function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = String(texto || '');
    return div.innerHTML;
}

// ======================================================
// ESTADO
// ======================================================

let convidadoAtual = null;
let statusPresenca = null; // 'confirmado' ou 'recusado'

// ELEMENTOS DO DOM
const nomeInput = document.getElementById('nomeInput');
const statusMessage = document.getElementById('statusMessage');
const namePreview = document.getElementById('namePreview');
const previewNome = document.getElementById('previewNome');
const confirmationButtons = document.getElementById('confirmationButtons');
const mensagemForm = document.getElementById('mensagemForm');
const confirmationResult = document.getElementById('confirmationResult');
const loading = document.getElementById('loading');

// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener('DOMContentLoaded', function () {
    // No celular, focar o campo abre o teclado e esconde metade da
    // página antes de a pessoa entender onde está.
    if (window.matchMedia('(min-width: 769px)').matches) {
        nomeInput.focus();
    }

    // Os botões aparecem assim que há um nome digitado
    nomeInput.addEventListener('input', aoDigitarNome);

    nomeInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') e.preventDefault();
    });
});

function aoDigitarNome() {
    const nome = arrumarNome(nomeInput.value);

    // Só vale enquanto a pessoa ainda não escolheu sim/não
    if (statusPresenca) return;

    if (!nomeValido(nome)) {
        convidadoAtual = null;
        namePreview.style.display = 'none';
        confirmationButtons.style.display = 'none';
        return;
    }

    convidadoAtual = nome;
    statusMessage.style.display = 'none';
    previewNome.textContent = nome;
    namePreview.style.display = 'block';
    confirmationButtons.style.display = 'flex';
}

function mostrarMensagem(texto, tipo) {
    statusMessage.innerHTML = texto;
    statusMessage.className = `status-message status-${tipo}`;
    statusMessage.style.display = 'block';

    if (tipo === 'error') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 6000);
    }
}

// ======================================================
// CONFIRMAR OU RECUSAR
// ======================================================

function conferirNomeAntesDeSeguir() {
    const nome = arrumarNome(nomeInput.value);

    if (!nomeValido(nome)) {
        mostrarMensagem('Por favor, digite seu nome completo antes de responder.', 'error');
        nomeInput.focus();
        return false;
    }

    convidadoAtual = nome;
    nomeInput.value = nome;
    previewNome.textContent = nome;
    namePreview.style.display = 'block';
    return true;
}

function confirmarPresenca() {
    if (!conferirNomeAntesDeSeguir()) return;

    statusPresenca = 'confirmado';
    confirmationButtons.style.display = 'none';
    mensagemForm.style.display = 'block';
}

function recusarPresenca() {
    if (!conferirNomeAntesDeSeguir()) return;

    statusPresenca = 'recusado';
    confirmationButtons.style.display = 'none';
    mensagemForm.style.display = 'block';
}

// ======================================================
// ENVIO
// ======================================================

async function enviarConfirmacaoFinal() {
    if (!convidadoAtual || !statusPresenca) return;

    const mensagem = document.getElementById('mensagemNoivos').value.trim();

    const dados = {
        nome: convidadoAtual,
        status: statusPresenca === 'confirmado' ? 'SIM' : 'NAO',
        mensagem: mensagem,
        data_hora: new Date().toLocaleString('pt-BR')
    };

    mostrarLoading(true);

    // As duas vias são tentadas em paralelo; basta uma dar certo.
    const [planilha, email] = await Promise.all([
        enviarParaPlanilha(dados),
        enviarParaFormspree(dados)
    ]);

    mostrarLoading(false);

    if (!planilha.ok && !email.ok) {
        mostrarMensagem(
            'Não conseguimos registrar sua resposta agora. Verifique sua internet e tente de novo, ou fale direto com os noivos.',
            'error'
        );
        console.error('Falha no envio:', planilha.erro, email.erro);
        return;
    }

    mostrarResultado(mensagem);
}

async function enviarParaPlanilha(dados) {
    if (!URL_PLANILHA) return { ok: false, erro: 'planilha não configurada' };

    try {
        // text/plain evita a requisição de verificação (preflight),
        // que o Apps Script não responde.
        const resposta = await fetch(URL_PLANILHA, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) return { ok: false, erro: 'HTTP ' + resposta.status };

        const corpo = await resposta.json();

        return corpo && corpo.ok
            ? { ok: true }
            : { ok: false, erro: (corpo && corpo.erro) || 'resposta inesperada' };

    } catch (erro) {
        return { ok: false, erro: String(erro) };
    }
}

async function enviarParaFormspree(dados) {
    try {
        const formData = new FormData();
        formData.append('nome', dados.nome);
        formData.append('confirmacao', dados.status === 'SIM' ? 'SIM, vai comparecer' : 'NÃO vai comparecer');
        formData.append('mensagem', dados.mensagem || 'Nenhuma mensagem');
        formData.append('data_hora', dados.data_hora);
        formData.append('_subject', `Confirmação de Presença - ${dados.nome}`);

        const resposta = await fetch(URL_FORMSPREE, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        return resposta.ok
            ? { ok: true }
            : { ok: false, erro: 'HTTP ' + resposta.status };

    } catch (erro) {
        return { ok: false, erro: String(erro) };
    }
}

// ======================================================
// RESULTADO
// ======================================================

function mostrarResultado(mensagem) {
    let html = '';

    if (statusPresenca === 'confirmado') {
        html = `
            <h3>Presença confirmada com sucesso</h3>
            <p>Estamos ansiosos para aproveitar esse momento especial com você! 💖</p>
            <span class="coracao">💖</span>
            <p><strong>${escaparHtml(convidadoAtual)}</strong></p>
        `;

        if (mensagem) {
            html += `<p style="margin-top: 1rem; font-style: italic;">"${escaparHtml(mensagem)}"</p>`;
        }

        html += `
            <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--cinza-claro);">
                <strong>Data:</strong> 12 de Junho de 2027<br>
                <strong>Local:</strong> Várzea da Palma - MG
            </p>
            <p style="margin-top: 1rem; font-weight: 600; color: var(--rosa);">
                Foi convidado mais alguém da sua casa? Peça para cada
                pessoa responder aqui também.
            </p>
        `;
    } else {
        html = `
            <h3>Registramos que você não poderá comparecer</h3>
            <p><strong>${escaparHtml(convidadoAtual)}</strong></p>
            <p>Sua resposta foi registrada e enviada para os noivos.</p>
            <p>Lamentamos sua ausência, mas entendemos.</p>
        `;

        if (mensagem) {
            html += `<p style="margin-top: 1rem; font-style: italic;">"${escaparHtml(mensagem)}"</p>`;
        }

        html += `<p style="margin-top: 1rem; font-style: italic;">Atenciosamente,<br>Ester & Amauri</p>`;
    }

    html += `
        <p style="margin-top: 1.5rem; font-size: 0.9rem; color: var(--cinza-claro);">
            Mudou de ideia? É só responder de novo nesta página, com o mesmo
            nome — a resposta mais recente substitui a anterior.
        </p>
        <button class="btn btn-send" style="margin-top: 1.5rem;" onclick="responderOutraPessoa()">
            Responder por outra pessoa
        </button>
    `;

    confirmationResult.innerHTML = html;
    confirmationResult.style.display = 'block';
    mensagemForm.style.display = 'none';
    namePreview.style.display = 'none';

    confirmationResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Volta ao começo sem recarregar, para a próxima pessoa da casa
function responderOutraPessoa() {
    convidadoAtual = null;
    statusPresenca = null;

    nomeInput.value = '';
    document.getElementById('mensagemNoivos').value = '';

    confirmationResult.style.display = 'none';
    confirmationResult.innerHTML = '';
    mensagemForm.style.display = 'none';
    namePreview.style.display = 'none';
    confirmationButtons.style.display = 'none';
    statusMessage.style.display = 'none';

    nomeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    nomeInput.focus();
}

// ======================================================
// AUXILIARES
// ======================================================

function mostrarLoading(mostrar) {
    loading.style.display = mostrar ? 'block' : 'none';
}
