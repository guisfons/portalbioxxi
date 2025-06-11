$(document).ready(() => {
    init()
    $('.header__sair').on('click', logout)

    if ($('.splide').length) {
        new Splide('.splide', {
            type: 'loop',
            perPage: 3,
            // autoplay: true,
            // interval: 3000,
            pagination: false,
            gap: '6.2rem',
        }).mount();
    }

    if ($('select[name="setores"], select[name="setor"]').length) {
        setores()
    }

    if ($('select[name="clientes"], select[name="unidade"]').length) {
        clientes()

        $('select[name="clientes"], select[name="unidade"]').on('change', () => {
            setores($('select[name="clientes"], select[name="unidade"]').val(), $('select[name="clientes"] option:selected, select[name="unidade"] option:selected').text())
        })
    }

    modal()

    window.tableConfig = {
        "language": {
            "sEmptyTable": "Nenhum registro encontrado",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando de 0 até 0 de 0 registros",
            "sInfoFiltered": "(Filtrados de _MAX_ registros)",
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": "_MENU_ resultados por página",
            "sLoadingRecords": "Carregando...",
            "sProcessing": "Processando...",
            "sZeroRecords": "Nenhum registro encontrado",
            "sSearch": "Buscar:",
            "pageLength": 5,
            "oPaginate": {
                "sNext": "Próximo",
                "sPrevious": "Anterior",
            },
            "oAria": {
                "sSortAscending": ": Ordenar colunas de forma ascendente",
                "sSortDescending": ": Ordenar colunas de forma descendente"
            }
        }
    }
})

function logout() {
    localStorage.clear()
    window.location.href = '/login'
}

function setores(cliente, idCliente) {
    const accessToken = localStorage.getItem('access_token');

    let idFilial = localStorage.getItem('idFilial');
    let codCli = localStorage.getItem('codCli');

    if (typeof cliente !== 'undefined') {
        codCli = cliente;
        idFilial = idCliente;
    }
    
    if (!accessToken) {
        console.error('Token de acesso não encontrado!');
        return;
    }
    
    // URL da API para listar setores
    const apiURL = `https://cmexxfab.com.br/api-homol/api/setor/filial?codcli=${codCli}&idfilial=${idFilial}`;
    
    fetch(apiURL, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao buscar setores: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        const selectElement = $('select[name="setores"], select[name="setor"]');

        // Filtrar apenas setores ativos (descomentar a linha abaixo se necessário no futuro)
        // const setoresAtivos = data.filter(setor => setor.situa === "A");
        const setores = data;

        if (setores.length === 0) {
            selectElement.append('<option value="">Nenhum setor disponível</option>');
            return;
        }

        // Limpa o select
        selectElement.empty();
        // Adiciona a opção vazia
        selectElement.append('<option value="">Selecione um setor</option>');
        
        // Adiciona as opções ao select
        setores.forEach(setor => {
            const option = `<option value="${setor.idsetor}">${setor.nomeset}</option>`;
            selectElement.append(option);
        });

        // console.log('Setores carregados com sucesso.');
    }).catch(error => {
        alert('Erro ao carregar setores:', error);
    });
}

function clientes() {    
    const accessToken = localStorage.getItem('access_token');
    const idFilial = localStorage.getItem('idFilial');
    
    if (!accessToken) {
        console.error('Token de acesso não encontrado!');
        return;
    }

    if (!idFilial) {
        console.error('ID da filial não encontrado!');
        return;
    }

    let apiURL = `https://cmexxfab.com.br/api-homol/api/cliente/nome?q=${idFilial}`;
    const titles = [
        'Histórico de Memorando de Coleta',
        'Memorando de Coleta de Produtos',
        'Boletos e Faturas',
        'Histórico de Produtos Cadastrados',
        'Histórico de Reprocessamento',
        'Ficha de Cadastro de Produto',
        'Rastreabilidade dos Produtos'
    ];
    
    if (titles.some(header => $('h1').text().includes(header))) {
        apiURL = 'https://cmexxfab.com.br/api-homol/api/usuario/profile';
    }

    fetch(apiURL, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Coligada: localStorage.getItem('coligadaId'),
        },
    })
        .then(response => {
            // console.log('Resposta da API:', response); // Loga a resposta para depuração
            if (!response.ok) {
                throw new Error(`Erro ao buscar clientes: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Dados retornados:', data); // Verifica se os dados estão vindo corretamente

            const selectElement = $('select[name="clientes"], select[name="unidade"]'); // Verifica se o seletor é válido
            if (!selectElement.length) {
                console.error('Elemento <select> com nome "clientes" não encontrado no DOM!');
                return;
            }

            // Filtrar apenas clientes ativos (descomentar a linha abaixo se necessário no futuro)
            // const clientesAtivos = data.filter(cliente => cliente.situa === "A");
            const clientes = data; // Todos os clientes, sem filtro
            const filiais = data.filiais

            if (titles.some(header => $('h1').text().includes(header))) {
                if (filiais.length === 0) {
                    console.warn('Nenhum cliente disponível.');
                    selectElement.append('<option value="">Nenhum cliente disponível</option>');
                    return;
                }
            } else {
                if (clientes.length === 0) {
                    console.warn('Nenhum cliente disponível.');
                    selectElement.append('<option value="">Nenhum cliente disponível</option>');
                    return;
                }
            }

            // Adiciona as opções ao select
            if (titles.some(header => $('h1').text().includes(header))) {
                filiais.forEach(filial => {
                    const option = `<option value="${filial.codcli.trim()}">${filial.idfilial}</option>`;
                    selectElement.append(option);
                });
            } else {
                clientes.forEach(cliente => {
                    const option = `<option value="${cliente.codalfa.trim()}">${cliente.codalfa}</option>`;
                    selectElement.append(option);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar clientes:', error); // Mostra o erro no console
            alert(`Erro ao carregar clientes: ${error.message}`);
        });
}

function modal() {
    $(document).on('click', '.modal__close', function () {
        const table = $(this).closest('.modal').find('table')
        table.find('tbody').empty();
        const dataTable = new DataTable($(this).closest('.modal').find('table'));
        dataTable.clear()
        
        $(this).closest('.modal').removeClass('modal--active');
    })
}

function modalSuccess(texto) {
    $('.modal--active').removeClass('modal--active');

    $('body').append(`
        <div class="modal modal--success modal--active">
            <div class="modal__heading">
                <button type="button" class="modal__close"><img src="/wp-content/themes/portalbioxxi/assets/img/icons/close.svg'"></button>
            </div>
            <div class="modal__content">${texto}</div>
            <figure><svg width="125" height="125" viewBox="0 0 125 125" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M121.354 62.5001C121.354 68.2293 113.541 72.9168 111.979 78.646C110.416 84.3751 113.541 92.7085 110.416 96.8751C106.771 101.563 97.9163 101.042 93.2288 104.167C88.5413 107.292 86.458 116.146 80.7288 118.229C75.5205 119.792 68.7497 114.063 62.4997 114.063C56.7705 114.063 49.9997 119.792 44.2705 118.229C38.5413 116.667 36.458 107.813 31.7705 104.167C27.083 100.521 18.2288 101.563 14.583 96.8751C11.458 92.1876 14.583 83.8543 13.0205 78.646C11.458 73.4376 3.64551 68.7501 3.64551 62.5001C3.64551 56.771 11.458 52.0835 13.0205 46.3543C14.583 40.6251 11.458 32.2918 14.583 28.1251C18.7497 23.4376 27.6038 23.9585 32.2913 20.8335C36.9788 17.7085 39.0622 8.85431 44.7913 6.77098C49.9997 5.20848 56.7705 10.9376 63.0205 10.9376C68.7497 10.9376 75.5205 5.20848 81.2497 6.77098C86.9788 8.33348 89.0622 17.1876 93.7497 20.8335C98.4372 24.4793 107.291 23.4376 110.937 28.1251C114.062 32.8126 110.937 41.146 112.5 46.3543C113.541 52.0835 121.354 56.771 121.354 62.5001Z" stroke="#41B17E" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M41.1455 63.0208L55.208 76.5625L83.8538 48.4375" stroke="#41B17E" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg></figure>
        </div>
    `)
}

function masks() {
    // $('input[name="data"]').mask('00/00/0000');
    // $('input[name="dataFinal"]').mask('00/00/0000');
    // $('input[name="periodo-inicio"]').mask('00/00/0000');
    // $('input[name="periodo-fim"]').mask('00/00/0000');
    $('input[type="tel"]:not(input[name="cartao"]):not(input[name="validade"]):not(input[name="cvv"]):not(input[name="cpf"]):not(input[name="anvisa"]):not(input[name="pedido"]):not(input[name="memorando"]):not(input[name="cpf-responsavel"])').mask('(00) 00000-0000')
    $('input[name="cartao"]').mask('0000 0000 0000 0000')
    $('input[name="validade_cartao"').mask('00/00')
    $('input[name="cvv"').mask('000')
    $('input[name="cpf"], input[name="cpf-responsavel"').mask('000.000.000-00')
    $('input[name="zip"]').mask('00000-000')
}

function init() {
    
    if(!localStorage.getItem('idFilial')) {
        selecionarFilial();
    } else {
        listarPagamento();
        notificacoes();
    }

    headerFiliais();
    masks();
}

async function notificacoes() {
    $('.header__bell').on('click', function() {
        $('.header__notification').toggleClass('header__notification--active');
    })

    const accessToken = localStorage.getItem('access_token');
    const coligada = localStorage.getItem('coligadaId')

    if (!accessToken) {
        return;
    }

    const url = 'https://cmexxfab.com.br/api-homol/api/notificacao';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Coligada: coligada,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar notificações: ${response.status}`);
        }

        const data = await response.json();
        notificacoesValues(data);
        
        setInterval(async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro ao atualizar notificações: ${response.status}`);
                }

                const updatedData = await response.json();
                notificacoesValues(updatedData);

            } catch (error) {
                console.error('Erro ao atualizar notificações:', error);
            }
        }, 10 * 60 * 1000);

    } catch (error) {
        console.error('Erro ao carregar notificações:', error);
    }

    function notificacoesValues(data) {
        const total = data.Total;
        const notificacoes = data.notificacoes || [];
        const produtosStatus = data.produtos_status || [];

        $('.header__bell').attr('data-total', total);

        const container = $('.header__notification-body');
        container.empty();

        function createNotificationItem(titulo, dataHora, mensagem, ficha = false) {
            if(titulo === 'FICHA DE CADASTRO') {
                return `
                    <a href="/produtos/ficha-de-cadastro-de-produto/?id_ficha=${ficha}" class="header__notification-item">
                        <span class="header__notification-item-title">${titulo}</span>
                        <span class="header__notification-item-date">${dataHora}</span>
                        <p>${mensagem}</p>
                    </a>
                `
            }
            return `
                <div class="header__notification-item">
                    <span class="header__notification-item-title">${titulo}</span>
                    <span class="header__notification-item-date">${dataHora}</span>
                    <p>${mensagem}</p>
                </div>
            `;
        }

        if (produtosStatus.length > 0) {
            produtosStatus.forEach(item => {
                if(item.cliente !== localStorage.getItem('idFilial')) {
                    return;
                }

                let situacao

                if(item.TpoSituacao === '3') {
                    situacao = 'Reprovado'
                }
                if(item.TpoSituacao === '4') {
                    situacao = 'Aprovado'
                }

                const dataFormatada = item.dtcadastro 
                    ? new Date(item.dtcadastro).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) 
                    : '';
                container.append(createNotificationItem('FICHA DE CADASTRO', dataFormatada, item.nomeProduto + ' - <strong>' + situacao + '</strong>' || '', item.numero_ficha));
            });
        }

        if (notificacoes.length > 0) {
            notificacoes.forEach(item => {
                const dataFormatada = item.dt_inclusao 
                    ? new Date(item.dt_inclusao).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) 
                    : '';
                container.append(createNotificationItem('NOTIFICAÇÕES', dataFormatada, item.descricao || ''));
            });
        }

        if (produtosStatus.length === 0 && notificacoes.length === 0) {
            container.append('<p class="header__notification-empty">Nenhuma notificação disponível.</p>');
        }
    }
}

async function selecionarFilial() {
    await oauth();
    const filiais = JSON.parse(localStorage.getItem('filiais'));
    const idFilial = filiais.length > 0 ? filiais[0].idfilial : null;
    
    if(filiais.length > 2) {
        $('.selecione-filial').addClass('selecione-filial--active');
        $('.header__top .header__wrapper .header__notifications').before('<select class="header__filiais"></select>')
        $('.header__wrapper--mobile .header__notifications').before('<select class="header__filiais"></select>')

        filiais.forEach(filial => {
            $('.selecione-filial__container select').append(`<option value="${filial.idfilial}">${filial.filial}</option>`);
            $('.header__filiais').append(`<option value="${filial.idfilial}">${filial.filial}</option>`);
        })

        $('.selecione-filial__container button').on('click', function() {
            const selectedFilial = $(this).closest('.selecione-filial').find('select').val();
            localStorage.setItem('idFilial', selectedFilial);
            localStorage.setItem('nomeFilial', $(this).closest('.selecione-filial').find('select option:selected').text());

            headerFiliais()

            $('.selecione-filial').removeClass('selecione-filial--active');
            $('.loader').addClass('loader--hidden');

            notificacoes();
            listarPagamento()
        })
    } else {
        localStorage.setItem('idFilial', idFilial);
        listarPagamento()
        $('.loader').addClass('loader--hidden');
    }
}

function headerFiliais() {
    if(!localStorage.getItem('filiais')) return;
    const filiais = JSON.parse(localStorage.getItem('filiais'));
    
    if(filiais.length > 2) {
        if ($('.header__filiais').length === 0) {
            $('.header__top .header__wrapper .header__notifications')
                .before('<select class="header__filiais"></select>');

            $('.header__wrapper--mobile .header__notifications')
                .before('<select class="header__filiais"></select>');
        }

        filiais.forEach(filial => {
            if(filial.idfilial === localStorage.getItem('idFilial')) {
                $('.header__filiais').append(`<option value="${filial.idfilial}" selected>${filial.filial}</option>`);
                return;
            }
            $('.header__filiais').append(`<option value="${filial.idfilial}">${filial.filial}</option>`);
        })

        $('.header__filiais').on('change', function() {
            const selectedFilial = $(this).val();
            localStorage.setItem('idFilial', selectedFilial);
            localStorage.setItem('nomeFilial', $(this).find('option:selected').text());
            $('.loader').removeClass('loader--hidden');

            setTimeout(() => {
                location.reload();
            }, 300);

            notificacoes();
        })
    }
}

window.listarPagamento = async function listarPagamento() {
    const idfilial = localStorage.getItem('idFilial');
    const codcli = localStorage.getItem('codCli');
    const baseUrl = 'https://cmexxfab.com.br/api-homol';
    const endpoint = `/api/cliente/financeiro/faturas`;
    const today = new Date();
    const dataIni = new Date(2024, 11, 1).toISOString().split('T')[0];
    const dataFim = new Date(2024, 11 + 1, 0).toISOString().split('T')[0];
    const queryParams = `?idfilial=${idfilial}&codcli=${codcli}&data_ini=${dataIni}&data_fim=${dataFim}`;
    const url = baseUrl + endpoint + queryParams;

    if (typeof checkCartao === 'function') checkCartao();

    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            alert('Usuário não autenticado. Por favor, faça login.');
            window.location.href = '/login';
            return;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: localStorage.getItem('coligadaId')
            }
        });

        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

        const result = await response.json();

        if (result.length === 0) {
            $('[data-servico]').text('Nenhum serviço encontrado.');
            $('.formas-pagamento__info:not(:first-of-type)').hide();
            return;
        }

        $('.formas-pagamento').data('idlan', result[0].IDLAN);
        $('[data-servico]').data('servico', result[0].Tipo).text(result[0].Tipo);

        let valorFormatado = parseFloat(result[0].Valor).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        $('[data-valor]').data('valor', valorFormatado).text(valorFormatado).mask('000.000.000.000.000,00', { reverse: true });

        const dataString = result[0].DataVencimento;
        const partes = dataString.split('/');
        const dataVencimento = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
        const dataVencimentoFormatada = dataVencimento.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

        $('[data-vencimento]').data('vencimento', result[0].DataVencimento).text(dataVencimentoFormatada);
        $('[data-inicio]').data('inicio', result[0].DataInicio).text(result[0].DataInicio);
        $('[data-fim]').data('fim', result[0].DataBaixa).text(result[0].DataBaixa);

        if($('.quadro-avisos__slider').length > 0) {
            if (!window.quadroAvisosSplide) {
                window.quadroAvisosSplide = new Splide('.quadro-avisos__slider', {
                    type: 'fade',
                    perPage: 1,
                    autoplay: true,
                }).mount();
            }
        
            // Cria um novo slide
            const novoSlide = document.createElement('li');
            const homeUrl = window.location.protocol + '//' + window.location.host + '/';
            novoSlide.classList.add('splide__slide');
            novoSlide.innerHTML = `
                <div class="quadro-avisos__card splide__slide">
                    <figure>
                        <img src="${homeUrl}/wp-content/themes/portalbioxxi/assets/img/icons/clip.svg" alt="Aviso">
                    </figure>
                    <p>Há um boleto no valor de R$ ${valorFormatado} vencido em ${dataVencimentoFormatada}. Acesse a página de Boletos e Faturas para pagar o boleto ou acesse <a href="/financeiro/formas-de-pagamento/" target="_self" title="Boletos e Faturas" style="text-decoration: underline">clicando aqui</a>.</p>
                </div>
            `;
        
            // Adiciona o slide ao final
            window.quadroAvisosSplide.add(novoSlide);
        }

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}