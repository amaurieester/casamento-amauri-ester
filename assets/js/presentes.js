
        // LISTA DE PRESENTES COMPLETA (50+ itens)
        const presentes = [
            // Até R$ 100
            ["Toma aqui uns 50 reais", 50.00, "50-reais.jpg"],
            ["Só pra dizer que não te dei nada", 55.90, "nada.jpg"],
            ["Lenço para a noiva não borrar toda a maquiagem", 56.99, "lenco-maquiagem.jpg"],
            ["Ajude a noiva a comprar lingeries novas", 60.21, "lingeries.jpg"],
            ["Ajude o noivo a comprar cuecas novas", 60.21, "cuecas.jpg"],
            ["Ajude a comprar um Jogo de taças", 62.99, "tacas.jpg"],
            ["Kit calmante para a noiva não se estressar com o noivo", 75.64, "kit-calmante.jpg"],
            ["Ajude a comprar um Jogo de panelas", 82.61, "panelas.jpg"],
            ["Ajude o casal a comer mais saudável", 86.21, "comer-saudavel.jpg"],
            ["Ajude a noiva a renovar o guarda-roupa", 93.06, "guarda-roupa.jpg"],
            ["Ajude os noivos a comprarem pijamas iguais", 93.06, "pijamas-iguais.jpg"],
            ["Primeiro lugar na fila do Buffet", 93.25, "fila-buffet.jpg"],
            ["Acessório para cortar a unha do dedão do pé do noivo", 97.71, "corta-unha.jpg"],
            
            // R$ 100 - 500
            ["Sal pra pressão da noiva não abaixar no dia da festa", 101.54, "sal-pressao.jpg"],
            ["Ajude a comprar uma Cafeteira elétrica", 110.21, "cafeteira.jpg"],
            ["Ajude a comprar uma Churrasqueira", 120.90, "churrasqueira.jpg"],
            ["Cobertor para a noiva estar sempre coberta de razão", 129.52, "cobertor-noiva.jpg"],
            ["Ajude a noiva a comprar novos pijamas", 131.38, "pijamas-noiva.jpg"],
            ["Ajude o noivo a comprar pijamas novos", 131.38, "pijamas-noivo.jpg"],
            ["Aspirador de pó", 131.38, "aspirador.jpg"],
            ["Taxa pra noiva não jogar o buquê pra sua namorada", 154.70, "taxa-buque-nao.jpg"],
            ["Rolo de macarrão caso o noivo não se comporte", 155.42, "rolo-macarrao.jpg"],
            ["Capacete contra o rolo de macarrão para o noivo", 155.42, "capacete-macarrao.jpg"],
            ["Taxa pra noiva jogar o buquê na sua direção", 160.61, "taxa-buque-sim.jpg"],
            ["Aluguel de um bebê para treinamento", 164.22, "bebe-treinamento.jpg"],
            ["Estoque de café quentinho para o noivo", 165.79, "cafe-quentinho.jpg"],
            ["Cobertor para o noivo estar sempre coberta de razão", 165.79, "cobertor-noivo.jpg"],
            ["Diária do pedreiro para construção da nossa casa", 176.15, "pedreiro.jpg"],
            ["Ajude a comprar Roupas de cama", 162.89, "roupas-cama.jpg"],
            ["Calendário com lembrete para o noivo não esquecer as datas especiais", 195.42, "calendario.jpg"],
            ["Vale compra pra noiva gastar na Shein", 212.41, "shein.jpg"],
            ["Ajude a comprar um Fogão", 264.86, "fogao.jpg"],
            ["Ajude a comprar um Guarda-roupa novo", 341.25, "guarda-roupa-grande.jpg"],
            ["Um ano de barbeiro para o noivo", 331.57, "barbeiro.jpg"],
            ["1 ano de Netflix para os noivos curtirem bons filmes", 341.93, "netflix.jpg"],
            
            // R$ 500 - 1.000
            ["Ajuda financeira para o futuro casal", 405.08, "ajuda-financeira.jpg"],
            ["Ajude a comprar uma Cama box de casal", 486.87, "cama-box.jpg"],
            ["Ajuda para mobiliar a casa", 547.40, "mobiliar-casa.jpg"],
            ["Psicólogo pros noivos não surtarem nos preparativos", 538.80, "psicologo.jpg"],
            ["Ajude o casal ter uma piscina em casa", 656.88, "piscina.jpg"],
            ["Ajude a comprar uma TV", 671.07, "tv.jpg"],
            ["Ajuda para o casal sonhar com o carro elétrico", 744.46, "carro-eletrico.jpg"],
            ["Ajude a comprar uma Geladeira", 781.92, "geladeira.jpg"],
            ["Adote os boletos dos primeiros meses juntos!", 821.10, "boletos.jpg"],
            ["Ajude o noivo a comprar uma cervejeira", 920.51, "cervejeira.jpg"],
            
            // Acima de R$ 1.000
            ["Ajude a comprar uma Máquina de lavar", 400.25, "maquina-lavar.jpg"],
            ["Ajude a comprar uma Mesa de jantar", 230.90, "mesa-jantar.jpg"],
            ["Ajuda para mobiliar a casa", 1204.28, "mobiliar-casa2.jpg"],
            ["Deus te iluminou e você resolveu ajudar na lua de mel", 1554.24, "lua-de-mel.jpg"],
            ["Ajuda para a aposentadoria dos noivos", 3612.84, "aposentadoria.jpg"],
            ["Taxa para levar alguém que não foi convidado", 6652.99, "taxa-convidado.jpg"]
        ];

        // Ordenar por preço (do mais barato para o mais caro)
        presentes.sort((a, b) => a[1] - b[1]);
        
        let presenteSelecionado = { titulo: "", valor: 0 };

        // FUNÇÃO PARA RENDERIZAR PRESENTES
        function renderizarPresentes(filtro = 'todos') {
            const container = document.getElementById('lista-presentes');
            container.innerHTML = '';
            
            // Filtrar presentes
            let presentesFiltrados = presentes;
            
            if (filtro === 'ate100') {
                presentesFiltrados = presentes.filter(p => p[1] <= 100);
            } else if (filtro === '100a500') {
                presentesFiltrados = presentes.filter(p => p[1] > 100 && p[1] <= 500);
            } else if (filtro === '500a1000') {
                presentesFiltrados = presentes.filter(p => p[1] > 500 && p[1] <= 1000);
            } else if (filtro === 'acima1000') {
                presentesFiltrados = presentes.filter(p => p[1] > 1000);
            }
            
            // Verificar se há presentes no filtro
            if (presentesFiltrados.length === 0) {
                container.innerHTML = `
                    <div class="no-presentes">
                        <h3>Nenhum presente encontrado nesta faixa de preço.</h3>
                        <p>Selecione outra faixa de preço para ver mais opções.</p>
                    </div>
                `;
                return;
            }
            
            // Renderizar cada presente
            presentesFiltrados.forEach((presente, index) => {
                const [titulo, valor, imagem] = presente;
                
                const card = document.createElement('div');
                card.className = 'presente-card';
                
                if (imagem) {
                    card.innerHTML = `
                        <div class="presente-imagem-container">
                            <img src="presentes/${imagem}" alt="${titulo}" class="presente-imagem" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=placeholder-imagem><span>🎁</span><span>${titulo}</span></div>'">
                        </div>
                        <div class="presente-info">
                            <h3 class="presente-titulo">${titulo}</h3>
                            <p class="presente-valor">R$ ${valor.toFixed(2).replace('.', ',')}</p>
                            <button class="btn" onclick="selecionarPresente('${titulo.replace(/'/g, "\\'")}', ${valor})">
                                Presentear
                            </button>
                        </div>
                    `;
                } else {
                    card.innerHTML = `
                        <div class="presente-imagem-container">
                            <div class="placeholder-imagem">
                                <span>🎁</span>
                                <span>${titulo}</span>
                            </div>
                        </div>
                        <div class="presente-info">
                            <h3 class="presente-titulo">${titulo}</h3>
                            <p class="presente-valor">R$ ${valor.toFixed(2).replace('.', ',')}</p>
                            <button class="btn" onclick="selecionarPresente('${titulo.replace(/'/g, "\\'")}', ${valor})">
                                Presentear
                            </button>
                        </div>
                    `;
                }
                
                container.appendChild(card);
            });
        }

        // FUNÇÃO PARA FILTRAR PRESENTES
        function filtrarPresentes(filtro, btnElement) {
            renderizarPresentes(filtro);
            
            // Atualizar estado dos botões de filtro
            const botoesFiltro = document.querySelectorAll('.filtro-btn');
            botoesFiltro.forEach(botao => {
                botao.classList.remove('active');
            });
            
            // Ativar o botão clicado
            if (btnElement) {
                btnElement.classList.add('active');
            } else if (window.event && window.event.target) {
                window.event.target.classList.add('active');
            }
        }

        // ESTADO DO CARRINHO
        let carrinho = JSON.parse(localStorage.getItem('casamento_carrinho')) || [];
        
        // ELEMENTOS DO CARRINHO
        const cartToggleBtn = document.getElementById('cartToggleBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        const cartClose = document.getElementById('cartClose');
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotalValue = document.getElementById('cartTotalValue');
        
        // CONTROLES DO CARRINHO
        function abrirCarrinho() {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            atualizarCarrinhoDOM();
        }
        
        function fecharCarrinho() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if(cartToggleBtn) cartToggleBtn.addEventListener('click', abrirCarrinho);
        if(cartClose) cartClose.addEventListener('click', fecharCarrinho);
        if(cartOverlay) cartOverlay.addEventListener('click', fecharCarrinho);

        // FUNÇÃO DE ADICIONAR AO CARRINHO (Substitui selecionarPresente)
        // Como o onclick original usa selecionarPresente, vamos mantê-lo com esse nome para não quebrar os cards gerados dinamicamente
        function selecionarPresente(titulo, valor) {
            // Verificar se já existe no carrinho
            const existe = carrinho.find(item => item.titulo === titulo);
            
            if (existe) {
                // Como não tem quantidade nos presentes de casamento geralmente, podemos só avisar ou ignorar
                abrirCarrinho();
                return;
            }
            
            carrinho.push({ titulo, valor });
            salvarCarrinho();
            abrirCarrinho();
            atualizarCarrinhoDOM();
            
            // Opcional: Efeito no botão flutuante
            cartToggleBtn.classList.add('pulse');
            setTimeout(() => cartToggleBtn.classList.remove('pulse'), 500);
        }
        
        function removerDoCarrinho(index) {
            carrinho.splice(index, 1);
            salvarCarrinho();
            atualizarCarrinhoDOM();
        }
        
        function salvarCarrinho() {
            localStorage.setItem('casamento_carrinho', JSON.stringify(carrinho));
        }
        
        function atualizarCarrinhoDOM() {
            cartCount.textContent = carrinho.length;
            
            if (carrinho.length === 0) {
                cartItems.innerHTML = `
                    <div class="cart-empty">
                        <p>Seu carrinho está vazio.</p>
                        <p style="font-size: 0.9rem; margin-top: 10px; color: var(--cinza-claro);">Escolha um presente para os noivos!</p>
                    </div>
                `;
                cartTotalValue.textContent = 'R$ 0,00';
                cartToggleBtn.style.display = 'none';
                return;
            }
            
            cartToggleBtn.style.display = 'flex';
            
            let total = 0;
            cartItems.innerHTML = '';
            
            carrinho.forEach((item, index) => {
                total += item.valor;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.titulo}</h4>
                        <p>R$ ${item.valor.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button class="cart-item-remove" onclick="removerDoCarrinho(${index})" aria-label="Remover item">
                        🗑️
                    </button>
                `;
                cartItems.appendChild(cartItem);
            });
            
            cartTotalValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }
        
        function finalizarCompra() {
            if (carrinho.length === 0) return;
            // Redireciona para a página de checkout
            window.location.href = 'checkout.html';
        }

        // INICIALIZAR
        document.addEventListener('DOMContentLoaded', function() {
            renderizarPresentes();
            atualizarCarrinhoDOM();
        });