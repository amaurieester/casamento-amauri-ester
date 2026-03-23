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
        
        // LISTA DE CONVIDADOS (APENAS NO CÓDIGO, NÃO APARECE NO SITE)
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
            "~!~!teste!~!~",
            "Samuel Fernando Lima"
        ];

        // SISTEMA PARA EVITAR CONFIRMAÇÕES REPETIDAS
        // (Guarda no localStorage do navegador)
        function jaConfirmou(nome) {
            const confirmados = JSON.parse(localStorage.getItem('casamento_confirmados')) || [];
            return confirmados.includes(nome.toLowerCase());
        }

        function marcarComoConfirmado(nome) {
            const confirmados = JSON.parse(localStorage.getItem('casamento_confirmados')) || [];
            if (!confirmados.includes(nome.toLowerCase())) {
                confirmados.push(nome.toLowerCase());
                localStorage.setItem('casamento_confirmados', JSON.stringify(confirmados));
            }
        }

        // PARA TESTES: Função para limpar confirmações
        function limparConfirmacoesTeste() {
            localStorage.removeItem('casamento_confirmados');
            console.log('Confirmações de teste limpas!');
        }

        // VARIÁVEIS GLOBAIS
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

        // INICIALIZAÇÃO
        document.addEventListener('DOMContentLoaded', function() {
            nomeInput.focus();
            
            // Evento de input para o campo principal
            nomeInput.addEventListener('input', function() {
                const searchTerm = this.value.trim();
                
                if (searchTerm.length >= 2) {
                    buscarConvidados(searchTerm);
                } else {
                    esconderAutocomplete();
                }
            });
            
            // Fechar autocomplete ao clicar fora
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.search-container')) {
                    esconderAutocomplete();
                }
            });
        });

        // BUSCAR CONVIDADOS PARA AUTO-COMPLETE
        function buscarConvidados(termo) {
            const resultados = listaConvidados.filter(convidado => 
                convidado.toLowerCase().includes(termo.toLowerCase())
            );
            
            mostrarAutocomplete(resultados);
        }

        // MOSTRAR AUTO-COMPLETE (CORRIGIDO!)
        function mostrarAutocomplete(resultados) {
            if (resultados.length === 0) {
                esconderAutocomplete();
                return;
            }
            
            autocompleteResults.innerHTML = '';
            
            resultados.forEach(nome => {
                const div = document.createElement('div');
                div.className = 'autocomplete-result';
                div.innerHTML = `<div class="name">${nome}</div>`;  // CORRIGIDO: estava com aspas misturadas
                
                div.addEventListener('click', function() {
                    nomeInput.value = nome;
                    verificarNome(nome);
                    esconderAutocomplete();
                });
                
                autocompleteResults.appendChild(div);
            });
            
            autocompleteResults.style.display = 'block';
        }

        // ESCONDER AUTO-COMPLETE
        function esconderAutocomplete() {
            autocompleteResults.style.display = 'none';
        }

        // VERIFICAR NOME
        function verificarNome(nome) {
            // Verificar se está na lista
            if (listaConvidados.some(c => c.toLowerCase() === nome.toLowerCase())) {
                
                // Verificar se já confirmou antes
                if (jaConfirmou(nome)) {
                    mostrarMensagem(
                        `Você já confirmou sua presença anteriormente!<br>Obrigado por confirmar novamente seu interesse. 💖`,
                        "info"
                    );
                    return;
                }
                
                convidadoAtual = nome;
                mostrarPreviewConvidado(nome);
                mostrarPerguntaAcompanhante();
            } else {
                mostrarMensagem(
                    `Poxa... esse nome <strong>"${nome}"</strong> não está na lista de convidados.<br>Favor entrar em contato com os noivos.`,
                    "error"
                );
            }
        }

        // MOSTRAR MENSAGEM
        function mostrarMensagem(texto, tipo) {
            statusMessage.innerHTML = texto;
            statusMessage.className = `status-message status-${tipo}`;
            statusMessage.style.display = 'block';
            
            // Esconder após 5 segundos para mensagens de erro
            if (tipo === 'error') {
                setTimeout(() => {
                    statusMessage.style.display = 'none';
                }, 5000);
            }
        }

        // MOSTRAR PREVIEW DO CONVIDADO
        function mostrarPreviewConvidado(nome) {
            previewNome.textContent = nome;
            namePreview.style.display = 'block';
        }

        // MOSTRAR PERGUNTA SOBRE ACOMPANHANTES
        function mostrarPerguntaAcompanhante() {
            acompanhanteQuestion.style.display = 'block';
        }

        // RESPOSTA SOBRE ACOMPANHANTES
        function respostaAcompanhante(resposta) {
            teraAcompanhantes = resposta;
            acompanhanteQuestion.style.display = 'none';
            
            if (resposta) {
                mostrarFormularioAcompanhantes();
            } else {
                confirmationButtons.style.display = 'flex';
            }
        }

        // MOSTRAR FORMULÁRIO DE ACOMPANHANTES
        function mostrarFormularioAcompanhantes() {
            acompanhantesForm.style.display = 'block';
            adicionarCampoAcompanhante();
        }

        // ADICIONAR CAMPO DE ACOMPANHANTE
        function adicionarAcompanhante() {
            adicionarCampoAcompanhante();
        }

        function adicionarCampoAcompanhante() {
            const id = `acompanhante-${acompanhantes.length + 1}`;
            
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
                    <button class="remove-acompanhante" onclick="removerAcompanhante('${id}')">×</button>
                </div>
                <div class="acompanhante-error" id="error-${id}"></div>
                <div class="acompanhante-autocomplete" id="${id}-autocomplete"></div>
            `;
            
            acompanhantesList.appendChild(div);
            acompanhantes.push({ 
                id, 
                nome: '',
                valido: false 
            });
            
            // Configurar eventos para o novo input
            const input = document.getElementById(id);
            input.addEventListener('input', function() {
                const valor = this.value.trim();
                if (valor.length >= 2) {
                    buscarAcompanhantes(valor, id);
                } else {
                    const autocompleteDiv = document.getElementById(`${id}-autocomplete`);
                    if (autocompleteDiv) {
                        autocompleteDiv.style.display = 'none';
                    }
                    limparValidacaoAcompanhante(id);
                }
            });
            
            input.addEventListener('blur', function() {
                setTimeout(() => {
                    const autocompleteDiv = document.getElementById(`${id}-autocomplete`);
                    if (autocompleteDiv) {
                        autocompleteDiv.style.display = 'none';
                    }
                    validarAcompanhanteIndividual(id, this.value.trim());
                }, 200);
            });
            
            input.focus();
        }

        // BUSCAR ACOMPANHANTES
        function buscarAcompanhantes(termo, inputId) {
            const resultados = listaConvidados.filter(nome => 
                nome.toLowerCase().includes(termo.toLowerCase()) &&
                nome.toLowerCase() !== convidadoAtual.toLowerCase()
            );
            
            mostrarAutocompleteAcompanhantes(resultados, inputId);
        }

        // MOSTRAR AUTO-COMPLETE DE ACOMPANHANTES
        function mostrarAutocompleteAcompanhantes(resultados, inputId) {
            const autocompleteDiv = document.getElementById(`${inputId}-autocomplete`);
            if (!autocompleteDiv) return;
            
            if (resultados.length === 0) {
                autocompleteDiv.style.display = 'none';
                return;
            }
            
            autocompleteDiv.innerHTML = '';
            
            resultados.forEach(nome => {
                const div = document.createElement('div');
                div.className = 'acompanhante-autocomplete-item';
                div.textContent = nome;
                
                div.addEventListener('click', function() {
                    const input = document.getElementById(inputId);
                    input.value = nome;
                    validarAcompanhanteIndividual(inputId, nome);
                    autocompleteDiv.style.display = 'none';
                });
                
                autocompleteDiv.appendChild(div);
            });
            
            autocompleteDiv.style.display = 'block';
        }

        // LIMPAR VALIDAÇÃO
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

        // VALIDAR ACOMPANHANTE INDIVIDUAL
        function validarAcompanhanteIndividual(inputId, nome) {
            const index = acompanhantes.findIndex(a => a.id === inputId);
            if (index === -1) return;
            
            const statusDiv = document.getElementById(`status-${inputId}`);
            const errorDiv = document.getElementById(`error-${inputId}`);
            const input = document.getElementById(inputId);
            
            // Esconder autocomplete
            const autocompleteDiv = document.getElementById(`${inputId}-autocomplete`);
            if (autocompleteDiv) {
                autocompleteDiv.style.display = 'none';
            }
            
            if (!nome) {
                limparValidacaoAcompanhante(inputId);
                return;
            }
            
            // Verificar se o nome está na lista
            const nomeValido = listaConvidados.some(n => 
                n.toLowerCase() === nome.toLowerCase()
            );
            
            if (!nomeValido) {
                input.classList.remove('valido');
                input.classList.add('invalido');
                statusDiv.innerHTML = '❌';
                statusDiv.className = 'validacao-status status-erro';
                errorDiv.innerHTML = `Poxa... esse nome <strong>"${nome}"</strong> não está na lista de convidados.<br>Favor entrar em contato com os noivos.`;
                errorDiv.style.display = 'block';
                acompanhantes[index].valido = false;
                return;
            }
            
            // Verificar se não é o próprio convidado
            if (nome.toLowerCase() === convidadoAtual.toLowerCase()) {
                input.classList.remove('valido');
                input.classList.add('invalido');
                statusDiv.innerHTML = '❌';
                statusDiv.className = 'validacao-status status-erro';
                errorDiv.textContent = 'Este é o seu próprio nome. Informe um acompanhante diferente.';
                errorDiv.style.display = 'block';
                acompanhantes[index].valido = false;
                return;
            }
            
            // Nome válido!
            input.classList.remove('invalido');
            input.classList.add('valido');
            statusDiv.innerHTML = '✅';
            statusDiv.className = 'validacao-status status-ok';
            errorDiv.style.display = 'none';
            acompanhantes[index].nome = nome;
            acompanhantes[index].valido = true;
        }

        // REMOVER ACOMPANHANTE
        function removerAcompanhante(id) {
            const container = document.getElementById(`container-${id}`);
            if (container) {
                container.remove();
                acompanhantes = acompanhantes.filter(a => a.id !== id);
            }
        }

        // VALIDAR TODOS OS ACOMPANHANTES
        function validarAcompanhantes() {
            // Forçar validação de todos os campos
            let todosValidos = true;
            let algumPreenchido = false;
            
            acompanhantes.forEach(acompanhante => {
                const input = document.getElementById(acompanhante.id);
                if (input) {
                    const nome = input.value.trim();
                    if (nome) {
                        algumPreenchido = true;
                        validarAcompanhanteIndividual(acompanhante.id, nome);
                        if (!acompanhante.valido) {
                            todosValidos = false;
                        }
                    }
                }
            });
            
            if (!algumPreenchido) {
                mostrarMensagem(
                    "Por favor, informe pelo menos o nome de um acompanhante.",
                    "error"
                );
                return;
            }
            
            if (!todosValidos) {
                mostrarMensagem(
                    "Alguns acompanhantes não são válidos. Por favor, corrija os nomes antes de continuar.",
                    "error"
                );
                return;
            }
            
            // Verificar nomes duplicados
            const nomesAcompanhantes = acompanhantes
                .filter(a => a.valido)
                .map(a => a.nome.toLowerCase());
            const nomesUnicos = [...new Set(nomesAcompanhantes)];
            
            if (nomesAcompanhantes.length !== nomesUnicos.length) {
                mostrarMensagem(
                    "Há nomes duplicados na lista de acompanhantes. Por favor, verifique.",
                    "error"
                );
                return;
            }
            
            // Todos válidos!
            acompanhantesValidos = true;
            acompanhantesForm.style.display = 'none';
            confirmationButtons.style.display = 'flex';
        }

        // CONFIRMAR PRESENÇA
        function confirmarPresenca() {
            statusPresenca = 'confirmado';
            confirmationButtons.style.display = 'none';
            mensagemForm.style.display = 'block';
        }

        // RECUSAR PRESENÇA
        function recusarPresenca() {
            statusPresenca = 'recusado';
            confirmationButtons.style.display = 'none';
            mensagemForm.style.display = 'block';
        }

        // ENVIAR CONFIRMAÇÃO FINAL (COM FORMSPREE)
        async function enviarConfirmacaoFinal() {
            if (!convidadoAtual || !statusPresenca) return;
            
            const mensagem = document.getElementById('mensagemNoivos').value;
            
            mostrarLoading(true);
            
            // Preparar dados para Formspree
            const dados = {
                nome: convidadoAtual,
                status: statusPresenca === 'confirmado' ? 'CONFIRMADO' : 'RECUSADO',
                acompanhantes: '',
                mensagem: mensagem || 'Nenhuma mensagem',
                data_hora: new Date().toLocaleString('pt-BR')
            };
            
            // Adicionar acompanhantes se houver
            if (teraAcompanhantes && acompanhantesValidos && statusPresenca === 'confirmado') {
                const nomesAcompanhantes = acompanhantes
                    .filter(a => a.valido && a.nome.trim() !== '')
                    .map(a => a.nome)
                    .join(', ');
                
                dados.acompanhantes = nomesAcompanhantes || 'Nenhum';
            }
            
            try {
                // ENVIAR PARA FORMSPREE
                const resultado = await enviarParaFormspree(dados);
                
                if (resultado.success) {
                    // Marcar como confirmado no navegador
                    if (statusPresenca === 'confirmado') {
                        marcarComoConfirmado(convidadoAtual);
                    }
                    
                    mostrarLoading(false);
                    
                    // Mostrar resultado
                    let html = '';
                    if (statusPresenca === 'confirmado') {
                        html = `
                            <h3>Presença confirmada com sucesso</h3>
                            <p>Estamos ansiosos para aproveitar esse momento especial com você! 💖</p>
                            <span class="coracao">💖</span>
                            <p><strong>${convidadoAtual}</strong></p>
                        `;
                        
                        if (teraAcompanhantes && acompanhantes.length > 0) {
                            const nomesAcompanhantes = acompanhantes
                                .filter(a => a.valido && a.nome.trim() !== '')
                                .map(a => a.nome)
                                .join(', ');
                            
                            if (nomesAcompanhantes) {
                                html += `<p><strong>Acompanhantes confirmados:</strong> ${nomesAcompanhantes}</p>`;
                            }
                        }
                        
                        if (mensagem.trim()) {
                            html += `<p style="margin-top: 1rem; font-style: italic;">"${mensagem}"</p>`;
                        }
                        
                        html += `
                            <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--cinza-claro);">
                                <strong>Data:</strong> 29 de Maio de 2027<br>
                                <strong>Local:</strong> Várzea da Palma - MG
                            </p>
                        `;
                    } else {
                        html = `
                            <h3>Registramos que você não comparecerá</h3>
                            <p><strong>${convidadoAtual}</strong></p>
                            <p>Sua resposta foi registrada e enviada para os noivos.</p>
                            <p>Lamentamos sua ausência, mas entendemos.</p>
                            <p>Se mudar de ideia, entre em contato com os noivos.</p>
                            <p style="margin-top: 1rem; font-style: italic;">Atenciosamente,<br>Ester & Amauri</p>
                        `;
                    }
                    
                    confirmationResult.innerHTML = html;
                    confirmationResult.style.display = 'block';
                    mensagemForm.style.display = 'none';
                    
                    // Resetar após 10 segundos
                    setTimeout(() => {
                        resetarInterface();
                        nomeInput.value = '';
                        nomeInput.focus();
                    }, 10000);
                    
                } else {
                    throw new Error(resultado.error);
                }
                
            } catch (error) {
                mostrarLoading(false);
                mostrarMensagem(
                    `Erro ao enviar: ${error.message}. Por favor, tente novamente ou entre em contato diretamente com os noivos.`,
                    "error"
                );
            }
        }

        // FUNÇÃO PARA ENVIAR PARA FORMSPREE
        async function enviarParaFormspree(dados) {
            // SUBSTITUA ESTA URL PELA SUA URL DO FORMSPREE!
            const FORMSPREE_URL = "https://formspree.io/f/xaqqdzwd";
            
            try {
                const formData = new FormData();
                formData.append('nome', dados.nome);
                formData.append('status', dados.status);
                formData.append('acompanhantes', dados.acompanhantes);
                formData.append('mensagem', dados.mensagem);
                formData.append('data_hora', dados.data_hora);
                formData.append('_subject', `Confirmação de Presença - ${dados.nome}`);
                
                const response = await fetch(FORMSPREE_URL, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    return { success: true };
                } else {
                    throw new Error('Erro ao enviar para Formspree');
                }
                
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        // FUNÇÕES AUXILIARES
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

        // PARA TESTES: Adicione esta função no console do navegador para limpar confirmações
        console.log('Para limpar confirmações de teste, execute: limparConfirmacoesTeste()');