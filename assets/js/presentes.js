// ======================================================
// LISTA COMPLETA DE PRESENTES
// Formato: [nome, valor, imagem]
// ======================================================

const presentes = [
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

    ["Sal pra pressão da noiva não abaixar no dia da festa", 100.00, "sal-pressao.jpg"],
    ["Lixa para o calcanhar da noiva", 100.00, "lixa.jpg"],
    ["Ajude a noiva a comprar novos pijamas", 105.00, "pijamas-noiva.jpg"],
    ["Ajude o noivo a comprar pijamas novos", 105.00, "pijamas-noivo.jpg"],
    ["Ovo para não faltar mistura", 110.00, "mistura.jpg"],
    ["Rolo de macarrão caso o noivo não se comporte", 120.00, "rolo-macarrao.jpg"],
    ["Caneca eu avisei para momentos especiais", 120.00, "avisei.jpg"],
    ["Cobertor para a noiva estar sempre coberta de razão", 125.00, "cobertor-noiva.jpg"],
    ["Ajude a comprar uma Cafeteira elétrica", 130.00, "cafeteira.jpg"],
    ["Calendário com lembrete para o noivo não esquecer as datas especiais", 130.00, "calendario.jpg"],
    ["Estoque de café quentinho para o noivo", 140.00, "cafe-quentinho.jpg"],
    ["Controle remoto fake que funciona só com autorização da noiva", 140.00, "fake.jpg"],
    ["Bússola para achar coisas que o noivo perde", 140.00, "bussola.jpg"],
    ["Taxa pra noiva não jogar o buquê pra sua namorada", 150.00, "taxa-buque-nao.jpg"],
    ["Tapete de boas vindas para receber convidados", 150.00, "convidados.jpg"],
    ["Taxa para dar pitaco/falar mal da festa", 160.00, "pitaco.jpg"],
    ["Cobertor para o noivo estar sempre coberta de razão", 170.00, "cobertor-noivo.jpg"],
    ["Capacete contra o rolo de macarrão para o noivo", 180.00, "capacete-macarrao.jpg"],
    ["Dose de paciência para a noiva", 190.00, "paciencia.jpg"],
    ["Aspirador de pó", 195.00, "aspirador.jpg"],
    ["Taxa pra noiva jogar o buquê na sua direção", 200.00, "taxa-buque-sim.jpg"],
    ["Ajude os noivos a comprarem pijamas iguais", 210.00, "pijamas-iguais.jpg"],
    ["Drinks na piscina do hotel", 210.00, "drinks-hotel.jpg"],
    ["Ajude a comprar Roupas de cama", 220.00, "roupas-cama.jpg"],
    ["Alvará para meter o louco na festa", 230.00, "louco.jpg"],
    ["Acessório para cortar a unha do dedão do pé do noivo", 240.00, "corta-unha.jpg"],
    ["1 ano de Netflix para os noivos curtirem bons filmes", 240.00, "netflix.jpg"],
    ["Aluguel de um bebê para treinamento", 250.00, "bebe-treinamento.jpg"],
    ["Contribua com a mesa de doces", 260.00, "doces.jpg"],
    ["Vale um ano para a noiva não proibir o noivo de jogar futebol", 260.00, "futebol.jpg"],
    ["Montador de móveis pro noivo não quebrar tudo", 270.00, "montador-moveis.jpg"],
    ["Primeiro lugar na fila do Buffet", 280.00, "fila-buffet.jpg"],
    ["Vale compra pra noiva gastar na Shein", 280.00, "shein.jpg"],
    ["Vale um ano para a noiva não proibir o noivo de sair com os amigos", 290.00, "amigos.jpg"],
    ["Passeio na lua de mel", 290.00, "passeio.jpg"],
    ["Diária do pedreiro para construção da nossa casa", 300.00, "pedreiro.jpg"],
    ["Kit sobrevivência do noivo (café, cerveja e paciência)", 300.00, "kit-sobrevivencia.jpg"],
    ["Churrasco na casa nova", 310.00, "churrasco.jpg"],
    ["Ajude a comprar uma Churrasqueira", 320.00, "churrasqueira.jpg"],
    ["Contribua com o dia do noivo", 320.00, "dia-do-noivo.jpg"],
    ["Contribuição para a cerveja não acabar", 330.00, "cerveja.jpg"],
    ["Ajuda na primeira compra do mercado", 340.00, "mercado.jpg"],
    ["Curso de culinária para o noivo", 350.00, "culinaria.jpg"],
    ["Mensalidade da academia dos noivos", 360.00, "academia.jpg"],
    ["Alexa para a noiva não mandar só no noivo", 370.00, "Alexa.jpg"],
    ["Jantar na lua de mel", 380.00, "jantar-lua-de-mel.jpg"],
    ["Um ano de barbeiro para o noivo", 400.00, "barbeiro.jpg"],
    ["Curso intensivo para o noivo adivinhar porque a noiva tá bicuda", 410.00, "bicuda.jpg"],
    ["Dia extra no hotel", 420.00, "dia-hotel.jpg"],
    ["Contribua com o dia da noiva", 450.00, "dia-da-noiva.jpg"],
    ["Contribuição para pagar a fatura da lua de mel (SOCORRO)", 500.00, "lua-de-mel.jpg"],

    ["Prioridade de visita na casa dos noivos", 520.00, "prioridade.jpg"],
    ["Psicólogo pros noivos não surtarem nos preparativos", 550.00, "psicologo.jpg"],
    ["Patrocine a despedida do noivo", 550.00, "despedida.jpg"],
    ["Vale compras para a noiva ficar de bom humor", 580.00, "vale-compras.jpg"],
    ["Ajuda financeira para o futuro casal", 600.00, "ajuda-financeira.jpg"],
    ["Lookinhos novos para a lua de mel", 640.00, "lookinhos.jpg"],
    ["Hora extra do DJ na festa (sou inimigo do fim)", 650.00, "dj.jpg"],
    ["Eu vou dar o melhor presente porque eu sou o milior", 660.00, "milior.jpg"],
    ["Ajude a comprar uma Cama box de casal", 700.00, "cama-box.jpg"],
    ["Ajude a comprar um Fogão", 720.00, "fogao.jpg"],
    ["Cota amigos para sempre", 750.00, "sempre.jpg"],
    ["Seguro do carro", 750.00, "Seguro.jpg"],
    ["Adote os boletos dos primeiros meses juntos!", 780.00, "boletos.jpg"],
    ["Ajuda para mobiliar a casa", 800.00, "mobiliar-casa.jpg"],
    ["Ajude a comprar uma TV", 850.00, "tv.jpg"],
    ["Ajude a comprar um Guarda-roupa novo", 880.00, "guarda-roupa-grande.jpg"],
    ["Ajude o casal ter uma piscina em casa", 900.00, "piscina.jpg"],
    ["Primeiro aluguel", 900.00, "Aluguel.jpg"],
    ["Ajude a comprar uma Geladeira", 920.00, "geladeira.jpg"],
    ["Grande Oportunidade: Seja nosso parente/amigo favorito", 950.00, "favorito.jpg"],
    ["Ajude o noivo a comprar uma cervejeira", 950.00, "cervejeira.jpg"],
    ["Contribua para a compra das alianças", 980.00, "aliancas.jpg"],
    ["Ajuda para o casal sonhar com o carro elétrico", 1000.00, "carro-eletrico.jpg"],
    ["Passagem aérea para a lua de mel", 1000.00, "aerea.jpg"],

    ["Ajude a comprar uma Mesa de jantar", 1500.00, "mesa-jantar.jpg"],
    ["Ajuda para o gato parar de reclamar que a noiva gastou muito na festa", 1500.00, "gato.jpg"],
    ["Todo dinheiro que der para os noivos voltará em dobro para você", 2000.00, "dinheiro-dobro.jpg"],
    ["Ajuda para mobiliar a casa", 2500.00, "mobiliar-casa2.jpg"],
    ["Deus te iluminou e você resolveu ajudar na lua de mel", 3000.00, "lua-de-mel.jpg"],
    ["Ajude a comprar uma Máquina de lavar", 3800.00, "maquina-lavar.jpg"],
    ["Ajuda para a aposentadoria dos noivos", 5000.00, "aposentadoria.jpg"],
    ["Fundo emergencial para DRs com jantar caro de reconciliação", 5800.00, "dr-jantar.jpg"],
    ["Experiência gastronômica completa na lua de mel", 6000.00, "gastronomia.jpg"],
    ["Ajude o noivo a nunca deixar faltar sushi pra noiva (evitando crises e salvando o casamento)", 6500.00, "sushi-noiva.jpg"],
    ["Ajuda para pagar a festa", 8000.00, "quitar-festa.jpg"],
    ["Patrocine a suíte master da lua de mel (com direito a stories de agradecimento 😂)", 8500.00, "suite-master.jpg"],
    ["Cota Platinum: você basicamente está financiando nossa felicidade", 8800.00, "platinum.jpg"],
    ["Cota herdeiro: garantia de convite em todos os churrascos (e talvez no testamento)", 8900.00, "herdeiro.jpg"],
    ["Taxa para ir de branco no casamento", 25000.00, "branco.jpg"]
];

// ======================================================
// CLASSIFICAÇÃO DOS PRESENTES
// ======================================================

// Estes itens são produtos físicos reais.
const imagensPresentesFisicos = new Set([
    "tacas.jpg",
    "panelas.jpg",
    "cafeteira.jpg",
    "aspirador.jpg",
    "roupas-cama.jpg",
    "convidados.jpg",
    "churrasqueira.jpg",
    "Alexa.jpg",
    "cama-box.jpg",
    "fogao.jpg",
    "tv.jpg",
    "guarda-roupa-grande.jpg",
    "geladeira.jpg",
    "cervejeira.jpg",
    "mesa-jantar.jpg",
    "maquina-lavar.jpg"
]);

// Os demais presentes são cotas, contribuições, experiências
// ou presentes simbólicos e divertidos.
function pertenceAosPresentesFisicos(presente) {
    return imagensPresentesFisicos.has(presente[2]);
}

// Ordena os presentes pelo preço, do menor para o maior.
presentes.sort((a, b) => a[1] - b[1]);

let categoriaAtual = "fisicos";
let filtroPrecoAtual = "todos";

// ======================================================
// FORMATAÇÃO DE VALORES
// ======================================================

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ======================================================
// SELEÇÃO DAS ABAS
// ======================================================

function selecionarCategoria(categoria, botao) {
    categoriaAtual = categoria;

    document.querySelectorAll("#categorias-presentes .filtro-btn")
        .forEach(btn => btn.classList.remove("active"));

    if (botao) {
        botao.classList.add("active");
    }

    renderizarPresentes();
}

// ======================================================
// FILTRO DE PREÇOS
// ======================================================

function filtrarPresentes(filtro, botao) {
    filtroPrecoAtual = filtro;

    document.querySelectorAll("#filtros-preco .filtro-btn")
        .forEach(btn => btn.classList.remove("active"));

    if (botao) {
        botao.classList.add("active");
    }

    renderizarPresentes();
}

function aplicarFiltroPreco(lista, filtro) {
    switch (filtro) {
        case "ate100":
            return lista.filter(p => p[1] <= 100);

        case "100a500":
            return lista.filter(p => p[1] > 100 && p[1] <= 500);

        case "500a1000":
            return lista.filter(p => p[1] > 500 && p[1] <= 1000);

        case "acima1000":
            return lista.filter(p => p[1] > 1000);

        default:
            return lista;
    }
}

// ======================================================
// CRIAÇÃO DOS CARTÕES
// ======================================================

function criarCartaoPresente(presente) {
    const [titulo, valor, imagem] = presente;

    const card = document.createElement("div");
    card.className = "presente-card";

    const imagemContainer = document.createElement("div");
    imagemContainer.className = "presente-imagem-container";

    const img = document.createElement("img");
    img.src = `presentes/${imagem}`;
    img.alt = titulo;
    img.className = "presente-imagem";
    img.loading = "lazy";

    img.onerror = function () {
        const placeholder = document.createElement("div");
        placeholder.className = "placeholder-imagem";

        const icone = document.createElement("span");
        icone.textContent = "🎁";

        const nome = document.createElement("span");
        nome.textContent = titulo;

        placeholder.appendChild(icone);
        placeholder.appendChild(nome);

        imagemContainer.replaceChildren(placeholder);
    };

    imagemContainer.appendChild(img);

    const info = document.createElement("div");
    info.className = "presente-info";

    const tituloElemento = document.createElement("h3");
    tituloElemento.className = "presente-titulo";
    tituloElemento.textContent = titulo;

    const valorElemento = document.createElement("p");
    valorElemento.className = "presente-valor";
    valorElemento.textContent = formatarMoeda(valor);

    const botao = document.createElement("button");
    botao.className = "btn";
    botao.type = "button";
    botao.textContent = "Presentear";
    botao.addEventListener("click", () => selecionarPresente(titulo, valor));

    info.appendChild(tituloElemento);
    info.appendChild(valorElemento);
    info.appendChild(botao);

    card.appendChild(imagemContainer);
    card.appendChild(info);

    return card;
}

// ======================================================
// RENDERIZAÇÃO DOS PRESENTES
// ======================================================

function renderizarPresentes() {
    const container = document.getElementById("lista-presentes");

    if (!container) return;

    container.replaceChildren();

    let lista = presentes.filter(presente => {
        const fisico = pertenceAosPresentesFisicos(presente);

        return categoriaAtual === "fisicos" ? fisico : !fisico;
    });

    lista = aplicarFiltroPreco(lista, filtroPrecoAtual);

    // Garantir ordem crescente em cada aba.
    lista.sort((a, b) => a[1] - b[1]);

    if (lista.length === 0) {
        const mensagem = document.createElement("div");
        mensagem.className = "no-presentes";

        const titulo = document.createElement("h3");
        titulo.textContent = "Nenhum presente encontrado nesta faixa de preço.";

        const texto = document.createElement("p");
        texto.textContent = "Selecione outra faixa de preço ou confira a outra aba.";

        mensagem.appendChild(titulo);
        mensagem.appendChild(texto);
        container.appendChild(mensagem);

        return;
    }

    lista.forEach(presente => {
        container.appendChild(criarCartaoPresente(presente));
    });
}

// ======================================================
// CARRINHO DE PRESENTES
// ======================================================

function carregarCarrinho() {
    try {
        const dados = JSON.parse(localStorage.getItem("casamento_carrinho"));

        if (!Array.isArray(dados)) return [];

        return dados.filter(item =>
            item &&
            typeof item.titulo === "string" &&
            Number.isFinite(item.valor) &&
            item.valor >= 0
        );
    } catch (erro) {
        return [];
    }
}

let carrinho = carregarCarrinho();

const cartToggleBtn = document.getElementById("cartToggleBtn");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotalValue = document.getElementById("cartTotalValue");

function abrirCarrinho() {
    if (!cartSidebar || !cartOverlay) return;

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    atualizarCarrinhoDOM();
}

function fecharCarrinho() {
    if (!cartSidebar || !cartOverlay) return;

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

if (cartToggleBtn) {
    cartToggleBtn.addEventListener("click", abrirCarrinho);
}

if (cartClose) {
    cartClose.addEventListener("click", fecharCarrinho);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", fecharCarrinho);
}

// ======================================================
// ADICIONAR E REMOVER PRESENTES
// ======================================================

function selecionarPresente(titulo, valor) {
    const existe = carrinho.some(item => item.titulo === titulo);

    if (existe) {
        abrirCarrinho();
        return;
    }

    carrinho.push({ titulo, valor });

    salvarCarrinho();
    atualizarCarrinhoDOM();
    abrirCarrinho();

    if (cartToggleBtn) {
        cartToggleBtn.classList.add("pulse");

        setTimeout(() => {
            cartToggleBtn.classList.remove("pulse");
        }, 500);
    }
}

function removerDoCarrinho(index) {
    if (index < 0 || index >= carrinho.length) return;

    carrinho.splice(index, 1);

    salvarCarrinho();
    atualizarCarrinhoDOM();
}

function salvarCarrinho() {
    try {
        localStorage.setItem("casamento_carrinho", JSON.stringify(carrinho));
    } catch (erro) {
        console.error("Não foi possível salvar o carrinho.", erro);
    }
}

// ======================================================
// ATUALIZAÇÃO VISUAL DO CARRINHO
// ======================================================

function atualizarCarrinhoDOM() {
    if (!cartCount || !cartItems || !cartTotalValue) return;

    cartCount.textContent = carrinho.length;

    if (carrinho.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <p>Seu carrinho está vazio.</p>
                <p style="font-size: 0.9rem; margin-top: 10px; color: var(--cinza-claro);">
                    Escolha um presente para os noivos!
                </p>
            </div>
        `;

        cartTotalValue.textContent = formatarMoeda(0);

        if (cartToggleBtn) {
            cartToggleBtn.style.display = "none";
        }

        return;
    }

    if (cartToggleBtn) {
        cartToggleBtn.style.display = "flex";
    }

    cartItems.replaceChildren();

    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.valor;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const titulo = document.createElement("h4");
        titulo.textContent = item.titulo;

        const valor = document.createElement("p");
        valor.textContent = formatarMoeda(item.valor);

        const remover = document.createElement("button");
        remover.className = "cart-item-remove";
        remover.type = "button";
        remover.textContent = "🗑️";
        remover.setAttribute("aria-label", `Remover ${item.titulo}`);

        remover.addEventListener("click", () => removerDoCarrinho(index));

        info.appendChild(titulo);
        info.appendChild(valor);

        cartItem.appendChild(info);
        cartItem.appendChild(remover);

        cartItems.appendChild(cartItem);
    });

    cartTotalValue.textContent = formatarMoeda(total);
}

// ======================================================
// FINALIZAÇÃO DA COMPRA
// ======================================================

function finalizarCompra() {
    if (carrinho.length === 0) return;

    window.location.href = "checkout.html";
}

// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
    renderizarPresentes();
    atualizarCarrinhoDOM();
});
