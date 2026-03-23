// ESTADO DO CARRINHO
let carrinho = JSON.parse(localStorage.getItem('casamento_carrinho')) || [];

document.addEventListener('DOMContentLoaded', function() {
    renderizarResumo();
});

function renderizarResumo() {
    const checkoutContent = document.getElementById('checkoutContent');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotalValue = document.getElementById('checkoutTotalValue');

    if (carrinho.length === 0) {
        checkoutContent.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        return;
    }

    checkoutContent.style.display = 'flex';
    emptyCartMessage.style.display = 'none';
    
    let total = 0;
    checkoutItems.innerHTML = '';
    
    carrinho.forEach((item, index) => {
        total += item.valor;
        
        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `
            <div class="summary-item-title">${item.titulo}</div>
            <div class="summary-item-price">R$ ${item.valor.toFixed(2).replace('.', ',')}</div>
        `;
        checkoutItems.appendChild(div);
    });

    checkoutTotalValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Mostrar Pix por padrão
    mostrarPix();
}

// FUNÇÕES DE PAGAMENTO (Copiadas do presentes.js e adaptadas)
function mostrarPix() {
    document.getElementById('btnPix').classList.add('active');
    document.getElementById('btnCartao').classList.remove('active');
    document.getElementById('pixContainer').style.display = 'block';
    if(document.getElementById('cartaoContainer')) {
        document.getElementById('cartaoContainer').style.display = 'none';
    }
}

function abrirCartao() {
    document.getElementById('btnCartao').classList.add('active');
    document.getElementById('btnPix').classList.remove('active');
    document.getElementById('pixContainer').style.display = 'none';
    if(document.getElementById('cartaoContainer')) {
        document.getElementById('cartaoContainer').style.display = 'block';
    }
}

function copiarPix() {
    const pixKey = document.getElementById('pixKey').textContent.trim();
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(pixKey).then(() => {
            mostrarSucessoCopia();
        }).catch(err => {
            copiarFallback(pixKey);
        });
    } else {
        copiarFallback(pixKey);
    }
}

function copiarFallback(texto) {
    const textArea = document.createElement("textarea");
    textArea.value = texto;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        mostrarSucessoCopia();
    } catch (err) {
        console.error('Falha ao copiar: ', err);
        alert('Não foi possível copiar a chave Pix. Por favor, copie manualmente.');
    }
    
    textArea.remove();
}

function mostrarSucessoCopia() {
    const successMsg = document.getElementById('copySuccess');
    const copyBtn = document.getElementById('copyBtn');
    
    successMsg.style.display = 'block';
    copyBtn.textContent = 'Chave Copiada!';
    copyBtn.style.background = 'linear-gradient(135deg, var(--sucesso, #45a049), #45a049)';
    
    setTimeout(() => {
        successMsg.style.display = 'none';
        copyBtn.textContent = 'Copiar Chave Pix';
        copyBtn.style.background = 'linear-gradient(135deg, var(--laranja), var(--laranja-claro))';
    }, 3000);
}

