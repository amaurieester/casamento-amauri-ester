menuClose.addEventListener('click', () => {
    menuLateral.classList.remove('active');
    menuOverlay.classList.remove('active');
});

menuOverlay.addEventListener('click', () => {
    menuLateral.classList.remove('active');
    menuOverlay.classList.remove('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.menu-lateral a').forEach(link => {
    link.addEventListener('click', () => {
        menuLateral.classList.remove('active');
        menuOverlay.classList.remove('active');
    });
});

// DADOS DO CASAMENTO
const dataCasamento = new Date("2027-06-12T10:00:00");

// PLAYER DE MÚSICA
const musicFiles = [
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

let currentTrack = 0;
let isPlaying = true; // Inicia tocando automaticamente
let audioPlayer = new Audio();

// Configurar volume inicial em 30% (médio-baixo)
audioPlayer.volume = 0.3;

// Elementos do player
const musicPlayer = document.getElementById('musicPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const closePlayer = document.getElementById('closePlayer');
const currentSong = document.getElementById('currentSong');
const playerStatus = document.getElementById('playerStatus');

// Funções do player
function loadTrack(trackIndex) {
    audioPlayer.src = musicFiles[trackIndex];
    currentSong.textContent = `Música ${trackIndex + 1}`;
    playerStatus.textContent = 'Tocando agora';
}

function playTrack() {
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸️';
    playerStatus.textContent = 'Tocando agora';
}

function pauseTrack() {
    audioPlayer.pause();
    isPlaying = false;
    playPauseBtn.textContent = '▶️';
    playerStatus.textContent = 'Pausado';
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % musicFiles.length;
    loadTrack(currentTrack);
    playTrack();
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + musicFiles.length) % musicFiles.length;
    loadTrack(currentTrack);
    playTrack();
}

// Event Listeners
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
});

closePlayer.addEventListener('click', () => {
    musicPlayer.style.display = 'none';
    pauseTrack();
});

nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value;
    audioPlayer.volume = volume;

    // Atualizar ícone do volume baseado no nível
    const volumeIcon = document.querySelector('.volume-icon');
    if (volume == 0) {
        volumeIcon.textContent = '🔇';
    } else if (volume < 0.3) {
        volumeIcon.textContent = '🔈';
    } else if (volume < 0.6) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
});

// Quando a música terminar, tocar a próxima
audioPlayer.addEventListener('ended', nextTrack);

// Inicializar e começar a tocar automaticamente
document.addEventListener('DOMContentLoaded', function () {
    loadTrack(0);
    playTrack();

    // Contador regressivo
    atualizarContador();
    setInterval(atualizarContador, 1000);

    // Inicializar animações
    animarAoRolar();

    // Adicionar listener para quando o usuário interagir com a página
    document.addEventListener('click', function () {
        // Tenta tocar a música novamente se estiver pausada por política de autoplay
        if (audioPlayer.paused && isPlaying) {
            playTrack().catch(e => console.log("Autoplay bloqueado:", e));
        }
    }, { once: true });
});

// FUNÇÃO PARA ENVIAR MENSAGEM PARA OS NOIVOS
async function enviarMensagem(event) {
    event.preventDefault();

    const btnEnviar = document.getElementById('btnEnviar');
    const formulario = document.getElementById('formMensagem');
    const loading = document.getElementById('loading');
    const msgSuccess = document.getElementById('msgSuccess');
    const msgError = document.getElementById('msgError');

    // Validar campos
    const nome = document.getElementById('nome').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !mensagem) {
        alert('Por favor, preencha pelo menos o nome e a mensagem.');
        return;
    }

    // Desabilitar botão e mostrar loading
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';
    formulario.classList.add('form-loading');
    loading.style.display = 'block';
    msgSuccess.style.display = 'none';
    msgError.style.display = 'none';

    // Coletar dados do formulário
    const formData = {
        nome: nome,
        email: document.getElementById('email').value.trim() || 'Não informado',
        mensagem: mensagem,
        data: new Date().toLocaleString('pt-BR'),
        tipo: 'Mensagem para os Noivos'
    };

    try {
        // ENVIAR VIA FORMSUBMIT PARA casamentoamaurieester@gmail.com
        const response = await fetch('https://formsubmit.co/ajax/casamentoamaurieester@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                nome: formData.nome,
                email: formData.email,
                mensagem: formData.mensagem,
                data_envio: formData.data,
                _subject: `💌 Mensagem para os Noivos - ${formData.nome}`,
                _template: 'table',
                _captcha: 'false'
            })
        });

        if (response.ok) {
            // Sucesso!
            loading.style.display = 'none';
            msgSuccess.style.display = 'block';

            // Limpar formulário
            formulario.reset();

            // Redirecionar após 3 segundos
            setTimeout(() => {
                window.location.href = 'obrigado-mensagem.html';
            }, 3000);

        } else {
            throw new Error('Erro na resposta do servidor');
        }

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);

        // Mostrar mensagem de erro
        loading.style.display = 'none';
        msgError.style.display = 'block';

    } finally {
        // Reabilitar botão após 3 segundos
        setTimeout(() => {
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Enviar mensagem';
            formulario.classList.remove('form-loading');
        }, 3000);
    }
}

// FUNÇÕES DO SITE
function atualizarContador() {
    const agora = new Date();
    const diferenca = dataCasamento - agora;

    if (diferenca > 0) {
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

        document.getElementById('dias').textContent = dias.toString().padStart(2, '0');
        document.getElementById('horas').textContent = horas.toString().padStart(2, '0');
        document.getElementById('minutos').textContent = minutos.toString().padStart(2, '0');
        document.getElementById('segundos').textContent = segundos.toString().padStart(2, '0');
    } else {
        document.querySelector('.countdown').innerHTML = '<p style="font-size: 1.5rem;">O grande dia chegou! 🎉</p>';
    }
}

// DETECTAR SCROLL PARA ANIMAÇÕES
function animarAoRolar() {
    const cards = document.querySelectorAll('.card, .foto-item');

    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (cardTop < windowHeight * 0.85) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

// ESTILOS INICIAIS PARA ANIMAÇÃO
document.querySelectorAll('.card, .foto-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// INICIALIZAR ANIMAÇÕES
window.addEventListener('scroll', animarAoRolar);

// LÓGICA DE DRAG / SWIPE PARA FLIP CARDS (Efeito de arrastar para o lado)
const flipCards = document.querySelectorAll('.flip-card');

flipCards.forEach(card => {
    let touchStartX = 0;
    let isDragging = false;
    
    // Touch (Mobile)
    card.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        isDragging = true;
    }, {passive: true});

    card.addEventListener('touchmove', e => {
        if (!isDragging || window.innerWidth > 768) return; // Evita conflito se preferir drag só no mobile, mas deixamos livre
        const currentX = e.changedTouches[0].screenX;
        const walk = currentX - touchStartX;
        
        const inner = card.querySelector('.flip-card-inner');
        if (inner) {
            const currentRot = card.classList.contains('active') ? 180 : 0;
            inner.style.transform = `rotateY(${currentRot + walk * 0.4}deg)`;
            inner.style.transition = 'none';
        }
    }, {passive: true});

    card.addEventListener('touchend', e => {
        if (!isDragging) return;
        isDragging = false;
        
        const touchEndX = e.changedTouches[0].screenX;
        const walk = touchEndX - touchStartX;
        const inner = card.querySelector('.flip-card-inner');
        
        if (inner) {
            inner.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            inner.style.transform = ''; // Removes inline, devolve o controle para a classe
        }

        if (Math.abs(walk) > 40) {
            card.classList.toggle('active');
        }
    }, {passive: true});
    
    // Mouse (Desktop)
    let startXMouse = 0;
    card.addEventListener('mousedown', e => {
        startXMouse = e.pageX;
        isDragging = true;
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const walk = e.pageX - startXMouse;
        
        const inner = card.querySelector('.flip-card-inner');
        if (inner) {
            const currentRot = card.classList.contains('active') ? 180 : 0;
            inner.style.transform = `rotateY(${currentRot + walk * 0.4}deg)`;
            inner.style.transition = 'none';
        }
    });

    document.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        
        const walk = e.pageX - startXMouse;
        const inner = card.querySelector('.flip-card-inner');
        
        if (inner) {
            inner.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            inner.style.transform = '';
        }

        if (Math.abs(walk) > 40) {
            // Pequeno delay para n conflitar com o onclick que é nativo
            setTimeout(() => {
                card.classList.toggle('active');
            }, 50);
        }
    });
});