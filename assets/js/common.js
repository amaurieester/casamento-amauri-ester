/* ============================================================
   SCRIPT COMUM A TODAS AS PÁGINAS
   - Barra superior com o menu
   - Player de música recolhido, que continua tocando ao trocar
     de página
   - Contagem de visitas na planilha
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
// Recebe confirmações, mensagens, presentes e visitas, cada um na
// sua aba. O passo a passo está em _ferramentas/COMO-CONFIGURAR.md

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
            ? { ok: true, corpo: corpo }
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

// ---------- BARRA SUPERIOR ----------

const PAGINAS = [
    { arquivo: 'index.html', rotulo: 'Início' },
    { arquivo: 'evento.html', rotulo: 'Evento' },
    { arquivo: 'dicas-instrucoes.html', rotulo: 'Dicas e Instruções' },
    { arquivo: 'confirmacao.html', rotulo: 'Confirmação' },
    { arquivo: 'presentes.html', rotulo: 'Presentes' }
];

function paginaAtual() {
    const nome = (location.pathname.split('/').pop() || '').toLowerCase();
    return nome === '' ? 'index.html' : nome;
}

function montarBarra() {
    // Só nas páginas que têm o menu lateral. As de agradecimento e a
    // de erro têm os próprios botões de voltar.
    if (!document.getElementById('menuLateral')) return null;
    if (document.querySelector('.barra-topo')) return document.querySelector('.barra-topo');

    const atual = paginaAtual();

    const links = PAGINAS.map(p => {
        const ativo = (p.arquivo === atual) ? ' class="ativo" aria-current="page"' : '';
        return `<a href="${p.arquivo}"${ativo}>${p.rotulo}</a>`;
    }).join('');

    const barra = document.createElement('header');
    barra.className = 'barra-topo';
    barra.innerHTML =
        '<div class="barra-interna">' +
        '<a class="barra-marca" href="index.html">' +
        '<img src="fotos/monograma-amauri-ester.png" alt="Monograma Ester e Amauri">' +
        '<span class="barra-titulo">' +
        '<span class="barra-nome">Ester &amp; Amauri</span>' +
        '<span class="barra-data">12 · 06 · 2027</span>' +
        '</span>' +
        '</a>' +
        '<nav class="barra-nav">' + links + '</nav>' +
        // A barra nao leva botao de confirmar: o link ja esta no menu
        // ao lado, e na pagina inicial virava o terceiro botao igual.
        '<div class="barra-acoes" id="barraAcoes"></div>' +
        '<button class="barra-menu" id="barraMenu" type="button" aria-label="Abrir menu" aria-expanded="false">' +
        '<span></span><span></span><span></span>' +
        '</button>' +
        '</div>';

    document.body.insertBefore(barra, document.body.firstChild);
    document.body.classList.add('com-barra');

    return barra;
}

// ---------- MENU LATERAL ----------

function inicializarMenu() {
    const menuLateral = document.getElementById('menuLateral');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuClose = document.getElementById('menuClose');
    const menuToggle = document.getElementById('menuToggle');
    const barraMenu = document.getElementById('barraMenu');

    if (!menuLateral || !menuOverlay) return;

    let aberto = false;

    function abrirMenu() {
        if (aberto) return;
        aberto = true;

        menuLateral.classList.add('active');
        menuOverlay.classList.add('active');
        menuLateral.scrollTop = 0;
        if (barraMenu) barraMenu.setAttribute('aria-expanded', 'true');
        travarRolagem();
    }

    function fecharMenu() {
        if (!aberto) return;
        aberto = false;

        menuLateral.classList.remove('active');
        menuOverlay.classList.remove('active');
        if (barraMenu) barraMenu.setAttribute('aria-expanded', 'false');
        liberarRolagem();
    }

    if (barraMenu) barraMenu.addEventListener('click', abrirMenu);

    // O monograma solto some quando a barra existe, mas continua
    // funcionando se o JavaScript da barra não rodar
    if (menuToggle) menuToggle.addEventListener('click', abrirMenu);

    if (menuClose) menuClose.addEventListener('click', fecharMenu);
    menuOverlay.addEventListener('click', fecharMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharMenu();
    });

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

function montarPlayer() {
    if (document.getElementById('musicaBotao')) return;

    const painel = document.createElement('div');
    painel.className = 'musica-painel';
    painel.id = 'musicaPainel';
    painel.innerHTML =
        '<div class="musica-controles">' +
        '<button class="musica-btn" id="musicaAnterior" type="button" aria-label="Música anterior">⏮</button>' +
        '<button class="musica-btn" id="musicaTocar" type="button" aria-label="Tocar ou pausar">▶</button>' +
        '<button class="musica-btn" id="musicaProxima" type="button" aria-label="Próxima música">⏭</button>' +
        '<button class="musica-btn fechar" id="musicaFechar" type="button" aria-label="Fechar">✕</button>' +
        '</div>' +
        '<input type="range" class="musica-volume" id="musicaVolume" min="0" max="1" step="0.05" aria-label="Volume">';

    const botao = document.createElement('button');
    botao.className = 'musica-botao';
    botao.id = 'musicaBotao';
    botao.type = 'button';
    botao.setAttribute('aria-label', 'Música do site');
    botao.innerHTML = '<span class="musica-onda"><i></i><i></i><i></i><i></i><i></i></span>';

    document.body.appendChild(painel);
    document.body.appendChild(botao);
}

function inicializarPlayerMusica() {
    montarPlayer();

    const botao = document.getElementById('musicaBotao');
    const painel = document.getElementById('musicaPainel');
    const btnTocar = document.getElementById('musicaTocar');
    const btnAnterior = document.getElementById('musicaAnterior');
    const btnProxima = document.getElementById('musicaProxima');
    const btnFechar = document.getElementById('musicaFechar');
    const volumeEl = document.getElementById('musicaVolume');

    const audio = new Audio();
    audio.preload = 'auto';

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

    const deveTocar = lerSessao(CHAVE_TOCANDO) !== '0';

    audio.volume = volume;
    volumeEl.value = volume;

    let alvoTempo = 0;
    let gestosArmados = false;

    // ----- controles -----

    function carregarFaixa(indice, segundos) {
        faixa = indice;
        alvoTempo = segundos > 0 ? segundos : 0;
        // O fragmento #t= faz o navegador já abrir na posição certa
        audio.src = MUSICAS[indice] + (alvoTempo > 0 ? '#t=' + alvoTempo.toFixed(2) : '');

        gravarSessao(CHAVE_FAIXA, indice);
        gravarSessao(CHAVE_TEMPO, alvoTempo.toFixed(2));
    }

    function tocar() {
        gravarSessao(CHAVE_TOCANDO, '1');
        const promessa = audio.play();
        if (promessa && promessa.catch) {
            promessa.then(pararDePedirToque).catch(pedirToque);
        }
    }

    function pausar() {
        gravarSessao(CHAVE_TOCANDO, '0');
        audio.pause();
        pararDePedirToque();
    }

    function proximaFaixa() {
        carregarFaixa((faixa + 1) % MUSICAS.length, 0);
        tocar();
    }

    function faixaAnterior() {
        carregarFaixa((faixa - 1 + MUSICAS.length) % MUSICAS.length, 0);
        tocar();
    }

    // ----- som bloqueado pelo navegador -----
    // Em iPhone e iPad o navegador só libera som depois de um toque.
    // Qualquer toque na página serve, então o botão só fica pulsando
    // como aviso enquanto isso não acontece.

    function pedirToque() {
        if (lerSessao(CHAVE_TOCANDO) === '0') return;
        botao.classList.add('pedindo-toque');
        armarGestos();
    }

    function pararDePedirToque() {
        botao.classList.remove('pedindo-toque');
    }

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
        botao.classList.add('tocando');
        btnTocar.textContent = '⏸';
        gravarSessao(CHAVE_TOCANDO, '1');
        pararDePedirToque();
    });

    // Só mexe no visual: gravar '0' aqui faria a música não voltar
    // depois de trocar de página, porque o navegador dispara 'pause'
    // ao descarregar o documento.
    audio.addEventListener('pause', () => {
        botao.classList.remove('tocando');
        btnTocar.textContent = '▶';
    });

    audio.addEventListener('ended', proximaFaixa);

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

    window.addEventListener('pagehide', registrarPosicao);
    window.addEventListener('beforeunload', registrarPosicao);
    document.addEventListener('visibilitychange', registrarPosicao);

    // ----- botões -----

    function abrirPainel() {
        painel.classList.add('aberto');
    }

    function fecharPainel() {
        painel.classList.remove('aberto');
    }

    botao.addEventListener('click', () => {
        // Se o som estava travado, o toque no botão já libera
        if (botao.classList.contains('pedindo-toque')) {
            tocar();
        }
        painel.classList.contains('aberto') ? fecharPainel() : abrirPainel();
    });

    btnFechar.addEventListener('click', fecharPainel);

    btnTocar.addEventListener('click', () => {
        audio.paused ? tocar() : pausar();
    });

    btnProxima.addEventListener('click', proximaFaixa);
    btnAnterior.addEventListener('click', faixaAnterior);

    volumeEl.addEventListener('input', (e) => {
        const valor = parseFloat(e.target.value);
        audio.volume = valor;
        gravarSessao(CHAVE_VOLUME, valor);
    });

    // Clicar fora fecha o painel
    document.addEventListener('click', (e) => {
        if (!painel.classList.contains('aberto')) return;
        if (painel.contains(e.target) || botao.contains(e.target)) return;
        fecharPainel();
    });

    // ----- partida -----

    carregarFaixa(faixa, tempoInicial);

    if (deveTocar) {
        tocar();
    } else {
        btnTocar.textContent = '▶';
    }
}

// ---------- CONTAGEM DE VISITAS ----------
// Uma linha na planilha por página aberta, no máximo uma vez por
// página a cada visita. Vai depois do carregamento para não
// disputar banda com as imagens.

function registrarAcesso() {
    const pagina = paginaAtual();
    const chave = 'visita.' + pagina;

    if (lerSessao(chave)) return;
    gravarSessao(chave, '1');

    const aparelho = window.matchMedia('(max-width: 820px)').matches
        ? 'Celular'
        : 'Computador';

    enviarParaPlanilha({ tipo: 'acesso', pagina: pagina, aparelho: aparelho });
}

// ---------- PARTIDA ----------

document.addEventListener('DOMContentLoaded', () => {
    montarBarra();
    inicializarMenu();
    inicializarPlayerMusica();

    if (window.requestIdleCallback) {
        requestIdleCallback(registrarAcesso, { timeout: 6000 });
    } else {
        setTimeout(registrarAcesso, 2500);
    }
});
