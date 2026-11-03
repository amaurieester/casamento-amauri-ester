// ======================================================
// CONFIRMAÇÃO DE PRESENÇA
//
// Fluxo: nome → confirmar ou recusar → (se confirmou)
// acompanhantes → mensagem → enviar.
//
// A resposta vai para a planilha do Google (lista automática)
// e para o Formspree (aviso por e-mail). Basta uma das duas
// funcionar para a resposta ser dada como registrada.
// ======================================================

// Endereço do App da Web do Apps Script, terminado em /exec.
// Vazio = o site usa só o e-mail, como antes.
// O passo a passo está em _ferramentas/COMO-CONFIGURAR.md
const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbwYhozXKjN40H7AXrDzzUmhURJaRo1HTfuZTXegHCklbuXFqsQQWuwTlJii51VG2JU/exec";

const URL_FORMSPREE = "https://formspree.io/f/xaqqdzwd";

// LISTA DE CONVIDADOS (não aparece no site; serve para o
// preenchimento automático e para validar o nome digitado).
// Ao incluir alguém, inclua também em _ferramentas/planilha-confirmacoes.gs
const listaConvidados = [
    "Amauri de Jesus Pereira",
    "Maria Rozângela Mourão Pereira",
    "Vinícius Mourão Pereira",
    "Deisy Aparecida Morais Benevides",
    "Evaldo Rezende Benevides",
    "Hélio Morais Benevides",
    "Pedro Henrique de Freitas Reis",
    "Rodrigo Batista de Assis",
    "Samuel Henrique Pinto",
    "Samuel Fernando Lima"
];

// ======================================================
// COMPARAÇÃO DE NOMES
// Ignora maiúsculas, acentos e espaços repetidos, para
// "JOAO  silva" encontrar "João Silva".
// ======================================================

function normalizar(texto) {
    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, " ");
}

function nomeDaLista(nome) {
    const alvo = normalizar(nome);
    return listaConvidados.find(c => normalizar(c) === alvo) || null;
}

// ======================================================
// ESTADO
// ======================================================

let convidadoAtual = null;
let acompanhantes = [];
let teraAcompanhantes = false;
let acompanhantesValidos = false;
let statusPresenca = null; // 'confirmado' ou 'recusado'

// ELEMENTOS DO DOM
const nomeInput = document.getElementById('nomeInput');
const autocompleteResults = document.getElementById('autocompleteResults');
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

    nomeInput.addEventListener('input', function () {
        const termo = this.value.trim();

        if (termo.length >= 2) {
            buscarConvidados(termo);
        } else {
            esconderAutocomplete();
            resetarInterface();
        }
    });

    nomeInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            esconderAutocomplete();
            verificarNome(this.value.trim());
        }
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-container')) {
            esconderAutocomplete();
        }
    });
});

// ======================================================
// PREENCHIMENTO AUTOMÁTICO DO NOME
// ======================================================

function buscarConvidados(termo) {
    const alvo = normalizar(termo);
    mostrarAutocomplete(listaConvidados.filter(c => normalizar(c).includes(alvo)));
}

function mostrarAutocomplete(resultados) {
    if (resultados.length === 0) {
        esconderAutocomplete();
        return;
    }

    autocompleteResults.innerHTML = '';

    resultados.forEach(nome => {
        const div = document.createElement('div');
        div.className = 'autocomplete-result';

        const interno = document.createElement('div');
        interno.className = 'name';
        interno.textContent = nome;
        div.appendChild(interno);

        div.addEventListener('click', function () {
            nomeInput.value = nome;
            esconderAutocomplete();
            verificarNome(nome);
        });

        autocompleteResults.appendChild(div);
    });

    autocompleteResults.style.display = 'block';
}

function esconderAutocomplete() {
    autocompleteResults.style.display = 'none';
}

// ======================================================
// VERIFICAR O NOME DIGITADO
// ======================================================

function verificarNome(nome) {
    const oficial = nomeDaLista(nome);

    if (!oficial) {
        mostrarMensagem(
            `Poxa... esse nome <strong>"${escaparHtml(nome)}"</strong> não está na lista de convidados.<br>Favor entrar em contato com os noivos.`,
            "error"
        );
        return;
    }

    statusMessage.style.display = 'none';

    // Guarda sempre a grafia oficial, para a planilha não encher
    // de variações do mesmo nome.
    convidadoAtual = oficial;
    nomeInput.value = oficial;

    previewNome.textContent = oficial;
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

function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = String(texto || '');
    return div.innerHTML;
}

// ======================================================
// CONFIRMAR OU RECUSAR
// ======================================================

function confirmarPresenca() {
    statusPresenca = 'confirmado';
    confirmationButtons.style.display = 'none';
    acompanhanteQuestion.style.display = 'block';
}

function recusarPresenca() {
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
                placeholder="Digite o nome completo do acompanhante..."
                autocomplete="off"
            >
            <div class="validacao-status" id="status-${id}"></div>
            <button class="remove-acompanhante" type="button" onclick="removerAcompanhante('${id}')">×</button>
        </div>
        <div class="acompanhante-error" id="error-${id}"></div>
        <div class="acompanhante-autocomplete" id="${id}-autocomplete"></div>
    `;

    acompanhantesList.appendChild(div);
    acompanhantes.push({ id, nome: '', valido: false });

    const input = document.getElementById(id);

    input.addEventListener('input', function () {
        const valor = this.value.trim();

        if (valor.length >= 2) {
            buscarAcompanhantes(valor, id);
        } else {
            const lista = document.getElementById(`${id}-autocomplete`);
            if (lista) lista.style.display = 'none';
            limparValidacaoAcompanhante(id);
        }
    });

    input.addEventListener('blur', function () {
        setTimeout(() => {
            const lista = document.getElementById(`${id}-autocomplete`);
            if (lista) lista.style.display = 'none';
            validarAcompanhanteIndividual(id, this.value.trim());
        }, 200);
    });

    input.focus();
}

function buscarAcompanhantes(termo, inputId) {
    const alvo = normalizar(termo);

    const resultados = listaConvidados.filter(nome =>
        normalizar(nome).includes(alvo) &&
        normalizar(nome) !== normalizar(convidadoAtual)
    );

    mostrarAutocompleteAcompanhantes(resultados, inputId);
}

function mostrarAutocompleteAcompanhantes(resultados, inputId) {
    const lista = document.getElementById(`${inputId}-autocomplete`);
    if (!lista) return;

    if (resultados.length === 0) {
        lista.style.display = 'none';
        return;
    }

    lista.innerHTML = '';

    resultados.forEach(nome => {
        const div = document.createElement('div');
        div.className = 'acompanhante-autocomplete-item';
        div.textContent = nome;

        div.addEventListener('click', function () {
            document.getElementById(inputId).value = nome;
            validarAcompanhanteIndividual(inputId, nome);
            lista.style.display = 'none';
        });

        lista.appendChild(div);
    });

    lista.style.display = 'block';
}

function limparValidacaoAcompanhante(inputId) {
    const index = acompanhantes.findIndex(a => a.id === inputId);
    if (index === -1) return;

    const statusDiv = document.getElementById(`status-${inputId}`);
    const errorDiv = document.getElementById(`error-${inputId}`);
    const input = document.getElementById(inputId);

    input.classList.remove('valido', 'invalido');
    statusDiv.innerHTML = '';
    statusDiv.className = 'validacao-status';
    errorDiv.style.display = 'none';
    acompanhantes[index].valido = false;
}

function validarAcompanhanteIndividual(inputId, nome) {
    const index = acompanhantes.findIndex(a => a.id === inputId);
    if (index === -1) return;

    const statusDiv = document.getElementById(`status-${inputId}`);
    const errorDiv = document.getElementById(`error-${inputId}`);
    const input = document.getElementById(inputId);

    const lista = document.getElementById(`${inputId}-autocomplete`);
    if (lista) lista.style.display = 'none';

    if (!nome) {
        limparValidacaoAcompanhante(inputId);
        return;
    }

    function recusar(texto) {
        input.classList.remove('valido');
        input.classList.add('invalido');
        statusDiv.innerHTML = '❌';
        statusDiv.className = 'validacao-status status-erro';
        errorDiv.innerHTML = texto;
        errorDiv.style.display = 'block';
        acompanhantes[index].valido = false;
    }

    const oficial = nomeDaLista(nome);

    if (!oficial) {
        recusar(`Poxa... esse nome <strong>"${escaparHtml(nome)}"</strong> não está na lista de convidados.<br>Favor entrar em contato com os noivos.`);
        return;
    }

    if (normalizar(oficial) === normalizar(convidadoAtual)) {
        recusar('Este é o seu próprio nome. Informe um acompanhante diferente.');
        return;
    }

    input.value = oficial;
    input.classList.remove('invalido');
    input.classList.add('valido');
    statusDiv.innerHTML = '✅';
    statusDiv.className = 'validacao-status status-ok';
    errorDiv.style.display = 'none';
    acompanhantes[index].nome = oficial;
    acompanhantes[index].valido = true;
}

function removerAcompanhante(id) {
    const container = document.getElementById(`container-${id}`);
    if (container) container.remove();

    acompanhantes = acompanhantes.filter(a => a.id !== id);
}

function validarAcompanhantes() {
    let todosValidos = true;
    let algumPreenchido = false;

    acompanhantes.forEach(acompanhante => {
        const input = document.getElementById(acompanhante.id);
        if (!input) return;

        const nome = input.value.trim();
        if (!nome) return;

        algumPreenchido = true;
        validarAcompanhanteIndividual(acompanhante.id, nome);

        if (!acompanhante.valido) todosValidos = false;
    });

    if (!algumPreenchido) {
        mostrarMensagem("Por favor, informe pelo menos o nome de um acompanhante.", "error");
        return;
    }

    if (!todosValidos) {
        mostrarMensagem(
            "Alguns acompanhantes não são válidos. Por favor, corrija os nomes antes de continuar.",
            "error"
        );
        return;
    }

    const nomes = acompanhantes.filter(a => a.valido).map(a => normalizar(a.nome));

    if (nomes.length !== new Set(nomes).size) {
        mostrarMensagem("Há nomes repetidos na lista de acompanhantes. Por favor, verifique.", "error");
        return;
    }

    acompanhantesValidos = true;
    acompanhantesForm.style.display = 'none';
    mensagemForm.style.display = 'block';
}

function listarAcompanhantes() {
    if (!teraAcompanhantes || !acompanhantesValidos || statusPresenca !== 'confirmado') {
        return '';
    }

    return acompanhantes
        .filter(a => a.valido && a.nome.trim() !== '')
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
            `Não conseguimos registrar sua resposta agora. Verifique sua internet e tente de novo, ou fale direto com os noivos.`,
            "error"
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
            html += `<p><strong>Acompanhantes confirmados:</strong> ${escaparHtml(nomesAcompanhantes)}</p>`;
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
            Mudou de ideia? É só responder de novo nesta página — a resposta
            mais recente substitui a anterior.
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

function resetarInterface() {
    statusMessage.style.display = 'none';
    namePreview.style.display = 'none';
    confirmationButtons.style.display = 'none';
    acompanhanteQuestion.style.display = 'none';
    acompanhantesForm.style.display = 'none';
    mensagemForm.style.display = 'none';
    confirmationResult.style.display = 'none';

    convidadoAtual = null;
    acompanhantes = [];
    acompanhantesList.innerHTML = '';
    acompanhantesValidos = false;
    statusPresenca = null;
    teraAcompanhantes = false;

    document.getElementById('mensagemNoivos').value = '';
}
