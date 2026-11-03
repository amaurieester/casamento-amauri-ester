// ======================================================
// CONFIRMAÇÃO DE PRESENÇA
//
// Qualquer nome é aceito. O convite é enviado por casa, com os
// nomes das pessoas convidadas na própria mensagem — por isso o
// site não precisa (nem deve) conferir nome contra uma lista.
//
// Fluxo: nome → confirmar ou recusar → (se confirmou) quem mais
// vem → mensagem → enviar.
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

// Ignora maiúsculas, acentos e espaços repetidos, para
// "JOAO  silva" e "João Silva" contarem como a mesma pessoa.
function normalizar(texto) {
    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, " ");
}

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
let acompanhantes = [];
let teraAcompanhantes = false;
let statusPresenca = null; // 'confirmado' ou 'recusado'

// ELEMENTOS DO DOM
const nomeInput = document.getElementById('nomeInput');
const statusMessage = document.getElementById('statusMessage');
const namePreview = document.getElementById('namePreview');
const previewNome = document.getElementById('previewNome');
const confirmationButtons = document.getElementById('confirmationButtons');
const acompanhanteQuestion = document.getElementById('acompanhanteQuestion');
const acompanhantesForm = document.getElementById('acompanhantesForm');
const acompanhantesList = document.getElementById('acompanhantesList');
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
    acompanhanteQuestion.style.display = 'block';
}

function recusarPresenca() {
    if (!conferirNomeAntesDeSeguir()) return;

    statusPresenca = 'recusado';
    teraAcompanhantes = false;
    confirmationButtons.style.display = 'none';
    acompanhanteQuestion.style.display = 'none';
    acompanhantesForm.style.display = 'none';
    mensagemForm.style.display = 'block';
}

function respostaAcompanhante(resposta) {
    teraAcompanhantes = resposta;
    acompanhanteQuestion.style.display = 'none';

    if (resposta) {
        acompanhantesForm.style.display = 'block';
        adicionarCampoAcompanhante();
    } else {
        mensagemForm.style.display = 'block';
    }
}

// ======================================================
// ACOMPANHANTES
// ======================================================

function adicionarAcompanhante() {
    adicionarCampoAcompanhante();
}

function adicionarCampoAcompanhante() {
    const id = `acompanhante-${Date.now()}-${acompanhantes.length + 1}`;

    const div = document.createElement('div');
    div.className = 'acompanhante-item';
    div.id = `container-${id}`;
    div.innerHTML = `
        <div class="acompanhante-input-wrapper">
            <input
                type="text"
                class="form-input"
                id="${id}"
                placeholder="Nome completo..."
                autocomplete="off"
            >
            <div class="validacao-status" id="status-${id}"></div>
            <button class="remove-acompanhante" type="button" onclick="removerAcompanhante('${id}')">×</button>
        </div>
        <div class="acompanhante-error" id="error-${id}"></div>
    `;

    acompanhantesList.appendChild(div);
    acompanhantes.push({ id, nome: '', valido: false });

    const input = document.getElementById(id);
    input.addEventListener('input', () => validarAcompanhante(id, input.value));
    input.addEventListener('blur', () => validarAcompanhante(id, input.value));
    input.focus();
}

function validarAcompanhante(inputId, texto) {
    const item = acompanhantes.find(a => a.id === inputId);
    if (!item) return;

    const input = document.getElementById(inputId);
    const statusDiv = document.getElementById(`status-${inputId}`);
    const errorDiv = document.getElementById(`error-${inputId}`);
    const nome = arrumarNome(texto);

    function limpar() {
        input.classList.remove('valido', 'invalido');
        statusDiv.innerHTML = '';
        statusDiv.className = 'validacao-status';
        errorDiv.style.display = 'none';
        item.nome = '';
        item.valido = false;
    }

    function recusar(mensagem) {
        input.classList.remove('valido');
        input.classList.add('invalido');
        statusDiv.innerHTML = '❌';
        statusDiv.className = 'validacao-status status-erro';
        errorDiv.textContent = mensagem;
        errorDiv.style.display = 'block';
        item.nome = '';
        item.valido = false;
    }

    if (!nome) {
        limpar();
        return;
    }

    if (!nomeValido(nome)) {
        // Enquanto está digitando as primeiras letras, não acusa erro
        limpar();
        return;
    }

    if (normalizar(nome) === normalizar(convidadoAtual)) {
        recusar('Este é o seu próprio nome. Informe outra pessoa.');
        return;
    }

    const repetido = acompanhantes.some(
        a => a.id !== inputId && a.valido && normalizar(a.nome) === normalizar(nome)
    );

    if (repetido) {
        recusar('Esse nome já foi informado.');
        return;
    }

    input.classList.remove('invalido');
    input.classList.add('valido');
    statusDiv.innerHTML = '✅';
    statusDiv.className = 'validacao-status status-ok';
    errorDiv.style.display = 'none';
    item.nome = nome;
    item.valido = true;
}

function removerAcompanhante(id) {
    const container = document.getElementById(`container-${id}`);
    if (container) container.remove();

    acompanhantes = acompanhantes.filter(a => a.id !== id);
}

function validarAcompanhantes() {
    let algumPreenchido = false;
    let algumErrado = false;

    acompanhantes.forEach(item => {
        const input = document.getElementById(item.id);
        if (!input) return;

        const nome = arrumarNome(input.value);
        if (!nome) return;

        algumPreenchido = true;
        validarAcompanhante(item.id, nome);
        if (!item.valido) algumErrado = true;
    });

    if (!algumPreenchido) {
        mostrarMensagem('Informe o nome de pelo menos uma pessoa, ou volte e responda que vem sozinho.', 'error');
        return;
    }

    if (algumErrado) {
        mostrarMensagem('Confira os nomes marcados em vermelho antes de continuar.', 'error');
        return;
    }

    acompanhantesForm.style.display = 'none';
    mensagemForm.style.display = 'block';
}

function listarAcompanhantes() {
    if (!teraAcompanhantes || statusPresenca !== 'confirmado') return '';

    return acompanhantes
        .filter(a => a.valido && a.nome)
        .map(a => a.nome)
        .join(', ');
}

// ======================================================
// ENVIO
// ======================================================

async function enviarConfirmacaoFinal() {
    if (!convidadoAtual || !statusPresenca) return;

    const mensagem = document.getElementById('mensagemNoivos').value.trim();
    const nomesAcompanhantes = listarAcompanhantes();

    const dados = {
        nome: convidadoAtual,
        status: statusPresenca === 'confirmado' ? 'SIM' : 'NAO',
        acompanhantes: nomesAcompanhantes,
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

    mostrarResultado(mensagem, nomesAcompanhantes);
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
        formData.append('acompanhantes', dados.acompanhantes || 'Nenhum');
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

function mostrarResultado(mensagem, nomesAcompanhantes) {
    let html = '';

    if (statusPresenca === 'confirmado') {
        html = `
            <h3>Presença confirmada com sucesso</h3>
            <p>Estamos ansiosos para aproveitar esse momento especial com você! 💖</p>
            <span class="coracao">💖</span>
            <p><strong>${escaparHtml(convidadoAtual)}</strong></p>
        `;

        if (nomesAcompanhantes) {
            html += `<p><strong>Também confirmados:</strong> ${escaparHtml(nomesAcompanhantes)}</p>`;
        }

        if (mensagem) {
            html += `<p style="margin-top: 1rem; font-style: italic;">"${escaparHtml(mensagem)}"</p>`;
        }

        html += `
            <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--cinza-claro);">
                <strong>Data:</strong> 12 de Junho de 2027<br>
                <strong>Local:</strong> Várzea da Palma - MG
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
    `;

    confirmationResult.innerHTML = html;
    confirmationResult.style.display = 'block';
    mensagemForm.style.display = 'none';
    namePreview.style.display = 'none';

    confirmationResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ======================================================
// AUXILIARES
// ======================================================

function mostrarLoading(mostrar) {
    loading.style.display = mostrar ? 'block' : 'none';
}
