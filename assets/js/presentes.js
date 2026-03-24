
        // LISTA DE PRESENTES COMPLETA (50+ itens)
        const presentes = [
            // Até R$ 100
            ["Toma aqui uns 50 reais", 50.00, "50-reais.jpg"],
            ["Só pra dizer que não te dei nada", 65.00, "nada.jpg"],
            ["Lenço para a noiva não borrar toda a maquiagem", 75.00, "lenco-maquiagem.jpg"],
            ["Ajude a noiva a comprar lingeries novas", 78.00, "lingeries.jpg"],
            ["Ajude o noivo a comprar cuecas novas", 81.00, "cuecas.jpg"],
            ["Ajude a comprar um Jogo de taças", 84.00, "tacas.jpg"],
            ["Kit calmante para a noiva não se estressar com o noivo", 88.00, "kit-calmante.jpg"],
            ["Ajude a comprar um Jogo de panelas", 92.00, "panelas.jpg"],
            ["Ajude o casal a comer mais saudável", 96.00, "comer-saudavel.jpg"],
            ["Ajude a noiva a renovar o guarda-roupa", 99.00, "guarda-roupa.jpg"],
            
            // R$ 100 - 500
            ["Acessório para cortar a unha do dedão do pé do noivo", 240.00, "corta-unha.jpg"],
            ["Primeiro lugar na fila do Buffet", 280.00, "fila-buffet.jpg"],
            ["Ajude os noivos a comprarem pijamas iguais", 210.00, "pijamas-iguais.jpg"],
            ["Sal pra pressão da noiva não abaixar no dia da festa", 100.00, "sal-pressao.jpg"],
            ["Ajude a comprar uma Cafeteira elétrica", 130.00, "cafeteira.jpg"],
            ["Ajude a comprar uma Churrasqueira", 320.00, "churrasqueira.jpg"],
            ["Cobertor para a noiva estar sempre coberta de razão", 125.00, "cobertor-noiva.jpg"],
            ["Ajude a noiva a comprar novos pijamas", 105.00, "pijamas-noiva.jpg"],
            ["Ajude o noivo a comprar pijamas novos", 105.00, "pijamas-noivo.jpg"],
            ["Aspirador de pó", 195.00, "aspirador.jpg"],
            ["Taxa pra noiva não jogar o buquê pra sua namorada", 150.00, "taxa-buque-nao.jpg"],
            ["Rolo de macarrão caso o noivo não se comporte", 120.00, "rolo-macarrao.jpg"],
            ["Capacete contra o rolo de macarrão para o noivo", 180.00, "capacete-macarrao.jpg"],
            ["Taxa pra noiva jogar o buquê na sua direção", 200.00, "taxa-buque-sim.jpg"],
            ["Aluguel de um bebê para treinamento", 250.00, "bebe-treinamento.jpg"],
            ["Estoque de café quentinho para o noivo", 140.00, "cafe-quentinho.jpg"],
            ["Cobertor para o noivo estar sempre coberta de razão", 170.00, "cobertor-noivo.jpg"],
            ["Diária do pedreiro para construção da nossa casa", 300.00, "pedreiro.jpg"],
            ["Ajude a comprar Roupas de cama", 220.00, "roupas-cama.jpg"],
            ["Calendário com lembrete para o noivo não esquecer as datas especiais", 130.00, "calendario.jpg"],
            ["Vale compra pra noiva gastar na Shein", 280.00, "shein.jpg"],
            ["Um ano de barbeiro para o noivo", 400.00, "barbeiro.jpg"],
            ["1 ano de Netflix para os noivos curtirem bons filmes", 240.00, "netflix.jpg"],
            ["Contribua com a mesa de doces", 260.00, "doces.jpg"],
            ["Contribuição para pagar a fatura da lua de mel (SOCORRO)", 500.00, "lua-de-mel.jpg"],
            ["Curso de culinária para o noivo", 350.00, "culinaria.jpg"],
            ["Contribua com o dia da noiva", 450.00, "dia-da-noiva.jpg"],
            ["Contribua com o dia do noivo", 320.00, "dia-do-noivo.jpg"],
            ["Drinks na piscina do hotel", 210.00, "drinks-hotel.jpg"],
            ["Jantar na lua de mel", 380.00, "jantar-lua-de-mel.jpg"],
            ["Montador de móveis pro noivo não quebrar tudo", 270.00, "montador-moveis.jpg"],
            ["Dia extra no hotel", 420.00, "dia-hotel.jpg"],
            ["Churrasco na casa nova", 310.00, "churrasco.jpg"],
            ["Passeio na lua de mel", 290.00, "passeio.jpg"],
            ["Ovo para não faltar mistura", 110.00, "mistura.jpg"],
            ["Lixa para o calcanhar da noiva", 100.00, "lixa.jpg"],
            ["Mensalidade da academia dos noivos", 360.00, "academia.jpg"],
            ["Alvará para meter o louco na festa", 230.00, "louco.jpg"],
            ["Contribuição para a cerveja não acabar", 330.00, "cerveja.jpg"],
            ["Dose de paciência para a noiva", 190.00, "paciencia.jpg"],
            ["Taxa para dar pitaco/falar mal da festa", 160.00, "pitaco.jpg"],
            ["Ajuda na primeira compra do mercado", 340.00, "mercado.jpg"],
            ["Alexa para a noiva não mandar só no noivo", 370.00, "Alexa.jpg"],
            ["Tapete de boas vindas para receber convidados", 150.00, "convidados.jpg"],
            ["Vale um ano para a noiva não proibir o noivo de jogar futebol", 260.00, "futebol.jpg"],
            ["Vale um ano para a noiva não proibir o noivo de sair com os amigos",290.00, "amigos.jpg"],
            ["Kit sobrevivência do noivo (café, cerveja e paciência)", 300.00, "kit-sobrevivencia.jpg"],
            ["Controle remoto fake que funciona só com autorização da noiva", 140.00, "fake.jpg"],
            ["Caneca eu avisei para momentos especiais", 120.00, "avisei.jpg"],
            ["Curso intensivo para o noivo adivinhar porque a noiva tá bicuda", 410.00, "bicuda.jpg"],
            ["Bússola para achar coisas que o noivo perde", 140.00, "bussola.jpg"]
                
        
            
            // R$ 500 - 1.000
           ["Ajuda financeira para o futuro casal", 600.00, "ajuda-financeira.jpg"],
           ["Grande Oportunidade: Seja nosso parente/amigo favorito", 950.00, "favorito.jpg"],
           ["Ajude a comprar uma Cama box de casal", 700.00, "cama-box.jpg"],
           ["Ajuda para mobiliar a casa", 800.00, "mobiliar-casa.jpg"],
           ["Psicólogo pros noivos não surtarem nos preparativos", 550.00, "psicologo.jpg"],
           ["Ajude o casal ter uma piscina em casa", 900.00, "piscina.jpg"],
           ["Ajude a comprar uma TV", 850.00, "tv.jpg"],
           ["Ajuda para o casal sonhar com o carro elétrico", 1000.00, "carro-eletrico.jpg"],
           ["Ajude a comprar uma Geladeira", 920.00, "geladeira.jpg"],
           ["Adote os boletos dos primeiros meses juntos!", 780.00, "boletos.jpg"],
           ["Ajude o noivo a comprar uma cervejeira", 950.00, "cervejeira.jpg"],
           ["Eu vou dar o melhor presente porque eu sou o milior", 660.00, "milior.jpg"],
           ["Hora extra do DJ na festa (sou inimigo do fim)", 650.00, "dj.jpg"],
           ["Ajude a comprar um Fogão", 720.00, "fogao.jpg"],
           ["Ajude a comprar um Guarda-roupa novo", 880.00, "guarda-roupa-grande.jpg"],
           ["Cota amigos para sempre", 750.00, "sempre.jpg"],
           ["Lookinhos novos para a lua de mel", 640.00, "lookinhos.jpg"],
           ["Passagem aérea para a lua de mel", 1000.00, "aerea.jpg"],
           ["Primeiro aluguel", 900.00, "Aluguel.jpg"],
           ["Prioridade de visita na casa dos noivos", 520.00, "prioridade.jpg"],
           ["Seguro do carro", 750.00, "Seguro.jpg"],
           ["Vale compras para a noiva ficar de bom humor", 580.00, "vale-compras.jpg"],
           ["Contribua para a compra das alianças", 980.00, "aliancas.jpg"],
           ["Patrocine a despedida do noivo", 550.00, "despedida.jpg"],
        
            
            // Acima de R$ 1.000
            ["Ajude a comprar uma Máquina de lavar", 3800.00, "maquina-lavar.jpg"],
            ["Ajude a comprar uma Mesa de jantar", 1500.00, "mesa-jantar.jpg"],
            ["Ajuda para mobiliar a casa", 2500.00, "mobiliar-casa2.jpg"],
            ["Deus te iluminou e você resolveu ajudar na lua de mel", 3000.00, "lua-de-mel.jpg"],
            ["Ajuda para a aposentadoria dos noivos", 5000.00, "aposentadoria.jpg"],
            ["Todo dinheiro que der para os noivos voltará em dobro para você", 2000.00, "dinheiro-dobro.jpg"],
            ["Taxa para ir de branco no casamento", 25000.00, "branco.jpg"],
            ["Ajuda para pagar a festa", 8000.00, "quitar-festa.jpg"],
            ["Ajuda para o gato parar de reclamar que a noiva gastou muito na festa", 1500.00, "gato.jpg"],
            ["Fundo emergencial para DRs com jantar caro de reconciliação", 5800.00, "dr-jantar.jpg"],
            ["Patrocine a suíte master da lua de mel (com direito a stories de agradecimento 😂)", 8500.00, "suite-master.jpg"],
            ["Experiência gastronômica completa na lua de mel", 6000.00, "gastronomia.jpg"],
            ["Cota Platinum: você basicamente está financiando nossa felicidade", 8800.00, "platinum.jpg"],
            ["Cota herdeiro: garantia de convite em todos os churrascos (e talvez no testamento)", 8900.00, "herdeiro.jpg"],
            ["Ajude o noivo a nunca deixar faltar sushi pra noiva (evitando crises e salvando o casamento)", 6500.00, "sushi-noiva.jpg"]
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
