// DADOS DO CASAMENTO
const dataCasamento = new Date("2027-06-12T10:00:00");

// O menu lateral e o player de música ficam no common.js,
// para funcionarem igual em todas as páginas do site.

document.addEventListener('DOMContentLoaded', function () {
    // Contador regressivo
    atualizarContador();
    setInterval(atualizarContador, 1000);

    // Inicializar animações
    animarAoRolar();
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
    const mensagem = formulario.querySelector('textarea[name="mensagem"]').value.trim();

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
    const email = document.getElementById('email').value.trim();

    const dados = {
        tipo: 'mensagem',
        nome: nome,
        email: email,
        mensagem: mensagem,
        data_hora: new Date().toLocaleString('pt-BR')
    };

    // A planilha é a via principal: é onde vocês leem os recados.
    // O e-mail é só aviso, e não pode segurar a tela — quando o
    // formsubmit.co está fora do ar ele leva ~20 s para devolver
    // erro, e nesse tempo o convidado fica olhando "Enviando...".
    // Por isso ele sai sem espera quando a planilha já deu certo.
    const planilha = await enviarParaPlanilha(dados);

    let correio = { ok: false, erro: 'não aguardado' };
    if (planilha.ok) {
        enviarMensagemPorEmail(dados);
    } else {
        correio = await enviarMensagemPorEmail(dados);
    }

    loading.style.display = 'none';

    if (planilha.ok || correio.ok) {
        msgSuccess.style.display = 'block';
        formulario.reset();

        setTimeout(() => {
            window.location.href = 'obrigado-mensagem.html';
        }, 3000);

    } else {
        console.error('Erro ao enviar mensagem:', planilha.erro, correio.erro);
        msgError.style.display = 'block';
    }

    // Reabilitar botão após 3 segundos
    setTimeout(() => {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar mensagem';
        formulario.classList.remove('form-loading');
    }, 3000);
}

// Teto de 10 s: sem isso, um serviço fora do ar deixa a chamada
// pendurada e, quando ela é a reserva da planilha, a tela trava.
const ESPERA_MAXIMA_EMAIL = 10000;

async function enviarMensagemPorEmail(dados) {
    const corte = new AbortController();
    const relogio = setTimeout(() => corte.abort(), ESPERA_MAXIMA_EMAIL);

    try {
        const resposta = await fetch('https://formsubmit.co/ajax/casamentoamaurieester@gmail.com', {
            method: 'POST',
            signal: corte.signal,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                nome: dados.nome,
                email: dados.email || 'Não informado',
                mensagem: dados.mensagem,
                data_envio: dados.data_hora,
                _subject: `💌 Mensagem para os Noivos - ${dados.nome}`,
                _template: 'table',
                _captcha: 'false'
            })
        });

        return resposta.ok ? { ok: true } : { ok: false, erro: 'HTTP ' + resposta.status };

    } catch (erro) {
        return { ok: false, erro: String(erro) };

    } finally {
        clearTimeout(relogio);
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
