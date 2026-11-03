/* ============================================================
   SCRIPT COMUM A TODAS AS PÁGINAS
   - Menu lateral (com rótulo "MENU" no monograma)
   - Player de música que continua de onde parou ao trocar de página
   ============================================================ */

// ---------- ARMAZENAMENTO (à prova de navegação privada) ----------

function lerSessao(chave) {
    try {
        return sessionStorage.getItem(chave);
    } catch (e) {
        return null;
    }
}

function gravarSessao(chave, valor) {
    try {
        sessionStorage.setItem(chave, valor);
    } catch (e) {
        /* navegação privada ou armazenamento bloqueado: segue sem persistir */
    }
}

function lerLocal(chave) {
    try {
        return localStorage.getItem(chave);
    } catch (e) {
        return null;
    }
}

function gravarLocal(chave, valor) {
    try {
        localStorage.setItem(chave, valor);
    } catch (e) {
        /* idem */
    }
}

// ---------- PLANILHA DO GOOGLE ----------
// Endereço do App da Web do Apps Script, terminado em /exec.
// Recebe tanto as confirmações de presença quanto as mensagens
// para os noivos, cada uma na sua aba.
// O passo a passo está em _ferramentas/COMO-CONFIGURAR.md

const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbwYhozXKjN40H7AXrDzzUmhURJaRo1HTfuZTXegHCklbuXFqsQQWuwTlJii51VG2JU/exec";

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

// ---------- TRAVA DE ROLAGEM DA PÁGINA ----------
// Usada pelo menu lateral e pelo carrinho de presentes: enquanto um
// painel está aberto, a página de trás não pode rolar no lugar dele.
// O contador permite que dois painéis abertos não se atrapalhem.

let travasDeRolagem = 0;
let posicaoAntesDaTrava = 0;

function travarRolagem() {
    if (travasDeRolagem === 0) {
        posicaoAntesDaTrava = window.scrollY || document.documentElement.scrollTop || 0;
        document.body.style.top = (-posicaoAntesDaTrava) + 'px';
        document.body.classList.add('rolagem-travada');
    }
    travasDeRolagem++;
}

function liberarRolagem() {
    if (travasDeRolagem === 0) return;

    travasDeRolagem--;
    if (travasDeRolagem > 0) return;

    document.body.classList.remove('rolagem-travada');
    document.body.style.top = '';
    window.scrollTo(0, posicaoAntesDaTrava);
}

// Disponíveis para os scripts das páginas (ex.: presentes.js)
window.travarRolagem = travarRolagem;
window.liberarRolagem = liberarRolagem;

// ---------- MENU LATERAL ----------

function inicializarMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menuLateral = document.getElementById('menuLateral');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuClose = document.getElementById('menuClose');

    if (!menuToggle || !menuLateral || !menuOverlay) return;

    // Deixa evidente que o monograma é o botão do menu
    menuToggle.classList.add('com-rotulo');
    menuToggle.setAttribute('role', 'button');
    menuToggle.setAttribute('tabindex', '0');
    menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('title', 'Clique aqui para abrir o menu');

    // Pulsa até o visitante abrir o menu pela primeira vez
    const CHAVE_JA_ABRIU = 'menu.jaAbriu';
    if (lerLocal(CHAVE_JA_ABRIU) !== '1') {
        menuToggle.classList.add('chamar-atencao');
    }

    let menuAberto = false;

    function abrirMenu() {
        if (menuAberto) return;
        menuAberto = true;

        menuLateral.classList.add('active');
        menuOverlay.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.classList.remove('chamar-atencao');
        menuToggle.classList.add('menu-aberto');
        menuLateral.scrollTop = 0;
        travarRolagem();
        gravarLocal(CHAVE_JA_ABRIU, '1');
    }

    function fecharMenu() {
        if (!menuAberto) return;
        menuAberto = false;

        menuLateral.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('menu-aberto');
        liberarRolagem();
    }

    menuToggle.addEventListener('click', abrirMenu);

    menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            abrirMenu();
        }
    });

    if (menuClose) menuClose.addEventListener('click', fecharMenu);

    menuOverlay.addEventListener('click', fecharMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharMenu();
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.menu-lateral a').forEach(link => {
        link.addEventListener('click', fecharMenu);
    });
}

// ---------- PLAYER DE MÚSICA ----------

const MUSICAS = [
    'musicas/musica1.mp3',
    'musicas/musica2.mp3',
    'musicas/musica3.mp3',
    'musicas/musica4.mp3',
    'musicas/musica5.mp3',
    'musicas/musica6.mp3',
    'musicas/musica7.mp3',
    'musicas/musica8.mp3',
    'musicas/musica9.mp3',
    'musicas/musica10.mp3'
];

// O estado fica na sessão do navegador: a música retoma de onde
// parou a cada página aberta e zera quando a aba é fechada.
const CHAVE_FAIXA = 'musica.faixa';
const CHAVE_TEMPO = 'musica.tempo';
const CHAVE_TOCANDO = 'musica.tocando';
const CHAVE_VOLUME = 'musica.volume';
const CHAVE_OCULTO = 'musica.oculto';

function montarPlayer() {
    let player = document.getElementById('musicPlayer');
    if (player) return player;

    player = document.createElement('div');
    player.id = 'musicPlayer';
    player.className = 'music-player';
    player.innerHTML =
        '<div class="music-controls">' +
        '<button id="prevBtn" class="music-btn" type="button" aria-label="Música anterior">⏮️</button>' +
        '<button id="playPauseBtn" class="music-btn" type="button" aria-label="Tocar ou pausar">▶️</button>' +
        '<button id="nextBtn" class="music-btn" type="button" aria-label="Próxima música">⏭️</button>' +
        '</div>' +
        '<div class="music-info">' +
        '<div class="music-title" id="currentSong">Música 1</div>' +
        '<div class="music-status" id="playerStatus">Tocando agora</div>' +
        '</div>' +
        '<div class="volume-control">' +
        '<span class="volume-icon">🔊</span>' +
        '<input type="range" id="volumeSlider" class="volume-slider" min="0" max="1" step="0.1" value="0.3" aria-label="Volume">' +
        '</div>' +
        '<button id="closePlayer" class="close-player" type="button" aria-label="Fechar player">✕</button>';

    document.body.appendChild(player);
    return player;
}

function inicializarPlayerMusica() {
    const player = montarPlayer();

    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const closePlayer = document.getElementById('closePlayer');
    const currentSong = document.getElementById('currentSong');
    const playerStatus = document.getElementById('playerStatus');
    const volumeIcon = player.querySelector('.volume-icon');

    const audio = new Audio();
    audio.preload = 'auto';

    // Reserva espaço no fim da página para o player não cobrir conteúdo
    document.body.classList.add('com-player-musica');
    if (!document.querySelector('footer')) {
        document.body.classList.add('sem-rodape');
    }

    // ----- estado retomado da sessão -----

    let faixa = parseInt(lerSessao(CHAVE_FAIXA), 10);
    if (!(faixa >= 0 && faixa < MUSICAS.length)) faixa = 0;

    let tempoInicial = parseFloat(lerSessao(CHAVE_TEMPO));
    if (!(tempoInicial > 0)) tempoInicial = 0;

    let volume = parseFloat(lerSessao(CHAVE_VOLUME));
    if (!(volume >= 0 && volume <= 1)) volume = 0.3;

    // Na primeira visita o padrão é começar tocando
    const deveTocar = lerSessao(CHAVE_TOCANDO) !== '0';
    const estavaOculto = lerSessao(CHAVE_OCULTO) === '1';

    audio.volume = volume;
    volumeSlider.value = volume;
    atualizarIconeVolume(volume);

    // Posição a buscar logo após os metadados carregarem
    let alvoTempo = 0;

    // ----- aviso de toque (quando o navegador bloqueia o som) -----

    let avisoEl = null;
    let gestosArmados = false;

    function mostrarAviso() {
        // Se o visitante pausou de propósito, não insiste
        if (lerSessao(CHAVE_TOCANDO) === '0') return;
        if (lerSessao(CHAVE_OCULTO) === '1') return;

        if (!avisoEl) {
            avisoEl = document.createElement('button');
            avisoEl.type = 'button';
            avisoEl.className = 'aviso-musica';
            avisoEl.textContent = '🎵 Toque para ouvir a música';
            avisoEl.addEventListener('click', tocar);
            document.body.appendChild(avisoEl);
        }
        avisoEl.classList.add('visivel');
        armarGestos();
    }

    function esconderAviso() {
        if (avisoEl) avisoEl.classList.remove('visivel');
    }

    // Qualquer toque/clique/tecla na página libera o som.
    // Em iPhone e iPad o navegador só permite tocar som após um gesto,
    // então este é o caminho normal nesses aparelhos.
    function armarGestos() {
        if (gestosArmados) return;
        gestosArmados = true;

        const eventos = ['pointerdown', 'touchend', 'click', 'keydown'];

        const aoInteragir = () => {
            eventos.forEach(ev => document.removeEventListener(ev, aoInteragir, true));
            gestosArmados = false;
            if (lerSessao(CHAVE_TOCANDO) === '0') return;
            audio.play().catch(() => { });
        };

        eventos.forEach(ev => document.addEventListener(ev, aoInteragir, true));
    }

    // ----- controles -----

    function carregarFaixa(indice, segundos) {
        faixa = indice;
        alvoTempo = segundos > 0 ? segundos : 0;
        // O fragmento #t= faz o navegador já abrir o arquivo na posição certa
        audio.src = MUSICAS[indice] + (alvoTempo > 0 ? '#t=' + alvoTempo.toFixed(2) : '');
        currentSong.textContent = 'Música ' + (indice + 1);
        gravarSessao(CHAVE_FAIXA, indice);
        gravarSessao(CHAVE_TEMPO, alvoTempo.toFixed(2));
    }

    function tocar() {
        gravarSessao(CHAVE_TOCANDO, '1');
        const promessa = audio.play();
        if (promessa && promessa.catch) {
            promessa.then(esconderAviso).catch(mostrarAviso);
        }
    }

    function pausar() {
        gravarSessao(CHAVE_TOCANDO, '0');
        audio.pause();
        esconderAviso();
    }

    function proximaFaixa() {
        carregarFaixa((faixa + 1) % MUSICAS.length, 0);
        tocar();
    }

    function faixaAnterior() {
        carregarFaixa((faixa - 1 + MUSICAS.length) % MUSICAS.length, 0);
        tocar();
    }

    function atualizarIconeVolume(valor) {
        if (!volumeIcon) return;
        if (valor == 0) {
            volumeIcon.textContent = '🔇';
        } else if (valor < 0.3) {
            volumeIcon.textContent = '🔈';
        } else if (valor < 0.6) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }

    // ----- eventos do áudio -----

    audio.addEventListener('loadedmetadata', () => {
        // Se o navegador ignorou o #t=, posiciona na mão
        if (alvoTempo > 0 && alvoTempo < audio.duration &&
            Math.abs(audio.currentTime - alvoTempo) > 1) {
            try {
                audio.currentTime = alvoTempo;
            } catch (e) {
                /* alguns navegadores recusam o seek antes do buffer */
            }
        }
        alvoTempo = 0;
    });

    audio.addEventListener('play', () => {
        playPauseBtn.textContent = '⏸️';
        playerStatus.textContent = 'Tocando agora';
        gravarSessao(CHAVE_TOCANDO, '1');
        esconderAviso();
    });

    // Só mexe no visual: gravar '0' aqui faria a música não voltar
    // depois de uma troca de página, porque o navegador dispara
    // 'pause' ao descarregar o documento.
    audio.addEventListener('pause', () => {
        playPauseBtn.textContent = '▶️';
        playerStatus.textContent = 'Pausado';
    });

    audio.addEventListener('ended', proximaFaixa);

    audio.addEventListener('error', () => {
        playerStatus.textContent = 'Erro ao carregar';
    });

    // Guarda a posição ~1x por segundo para retomar na próxima página
    let ultimoRegistro = 0;
    audio.addEventListener('timeupdate', () => {
        const agora = Date.now();
        if (agora - ultimoRegistro < 1000) return;
        ultimoRegistro = agora;
        gravarSessao(CHAVE_TEMPO, audio.currentTime.toFixed(2));
    });

    function registrarPosicao() {
        if (audio.currentTime > 0) {
            gravarSessao(CHAVE_TEMPO, audio.currentTime.toFixed(2));
        }
    }

    // pagehide cobre celular melhor que beforeunload
    window.addEventListener('pagehide', registrarPosicao);
    window.addEventListener('beforeunload', registrarPosicao);
    document.addEventListener('visibilitychange', registrarPosicao);

    // ----- eventos dos botões -----

    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            tocar();
        } else {
            pausar();
        }
    });

    nextBtn.addEventListener('click', proximaFaixa);
    prevBtn.addEventListener('click', faixaAnterior);

    volumeSlider.addEventListener('input', (e) => {
        const valor = parseFloat(e.target.value);
        audio.volume = valor;
        gravarSessao(CHAVE_VOLUME, valor);
        atualizarIconeVolume(valor);
    });

    closePlayer.addEventListener('click', () => {
        player.style.display = 'none';
        gravarSessao(CHAVE_OCULTO, '1');
        pausar();
        mostrarBotaoReabrir();
    });

    // Botão redondo para reabrir o player depois de fechado
    let botaoReabrir = null;

    function mostrarBotaoReabrir() {
        if (!botaoReabrir) {
            botaoReabrir = document.createElement('button');
            botaoReabrir.type = 'button';
            botaoReabrir.className = 'music-toggle';
            botaoReabrir.textContent = '🎵';
            botaoReabrir.setAttribute('aria-label', 'Reabrir a música');
            botaoReabrir.setAttribute('title', 'Ouvir a música');
            botaoReabrir.addEventListener('click', () => {
                botaoReabrir.style.display = 'none';
                player.style.display = '';
                gravarSessao(CHAVE_OCULTO, '0');
                tocar();
            });
            document.body.appendChild(botaoReabrir);
        }
        botaoReabrir.style.display = '';
    }

    // ----- partida -----

    carregarFaixa(faixa, tempoInicial);

    if (estavaOculto) {
        player.style.display = 'none';
        mostrarBotaoReabrir();
    } else if (deveTocar) {
        tocar();
    } else {
        playPauseBtn.textContent = '▶️';
        playerStatus.textContent = 'Pausado';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarMenu();
    inicializarPlayerMusica();
});
