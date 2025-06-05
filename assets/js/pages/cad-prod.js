jQuery(document).ready(function ($) {
    const nomeFilial = localStorage.getItem('nomeFilial');
    const urlParams = new URLSearchParams(window.location.search);
    const idFichaUrl = urlParams.get('id_ficha');
    
    if (idFichaUrl) {
        detalhesFicha(idFichaUrl)
    }
    idFicha()

    $('[data-acao="buscar"]').on('click', function () {
        const btn = $(this);
        btn.attr('disabled', true);
        getFichas(btn);
    })

    $('#validade_indeterminada').on('click', function () {
        if ($(this).is(':checked')) {
            $('#validade').prop('disabled', true);
        } else {
            $('#validade').prop('disabled', false);
        }
    });

    $('.cadastro-produto .btn').on('click', function() {
        detalhesFicha()
        $('.modal[data-model="cadastro-produto"] .modal__heading h3 span').text(nomeFilial);
        $('.modal[data-model="cadastro-produto"]').addClass('modal--active');
    })

    $('.btn--anvisa').on('click', function () {
        const btn = $(this);
        btn.attr('disabled', true);
        let nomeProd = btn.parent().find('#nome-produto, #sub_item').val();
        if(nomeProd.length < 4) {
            alert('O nome do produto deve ter no minimo 4 caracteres.');
            btn.attr('disabled', false);
            return;
        }

        checkAnvisa(nomeProd, btn)
    })

    $('.modal[data-model="cadastro-produto"] .btn--adicionar').on('click', function () {
        const btn = $(this);
        btn.attr('disabled', true);
        checkProduto(btn);
        addProd(btn);
    })

    $(document).on('click', '[data-acao="add-sub-item"]', function() {
        const btn = $(this);
        btn.attr('disabled', true);
        const idConjunto = btn.closest('tr').data('conjunto');
        // getSubItems(idConjunto, btn)
        addSubItem(btn);
    })

    $(document).on('click', '[data-acao="excluir"]', function () {
        const btn = $(this);
        btn.attr('disabled', true);
        excluirProd(btn);
    })

    $(document).on('click', '[data-acao="editar"], [data-acao="add"]', function () {
        const btn = $(this);
        btn.attr('disabled', true);
        let idConjunto

        if(btn.data('acao') == 'editar') {
            idConjunto = btn.closest('tr').data('produto-id');
        }

        if(btn.data('acao') == 'add') {
            idConjunto = btn.closest('tr').data('conjunto');
        }

        getSubItems(idConjunto, btn)
    })

    $(document).on('click', '[data-acao="aprovar"]', function () {
        const btn = $(this);
        btn.attr('disabled', true);

        $('.modal--active').removeClass('modal--active');
        $('.modal[data-model="termos-condicoes"]').addClass('modal--active');
    })

    $('.modal[data-model="termos-condicoes"] #termos').on('click', function () {
        if($(this).is(':checked')) {
            $('.modal[data-model="termos-condicoes"] .btn').attr('disabled', false).toggleClass('btn--gray').toggleClass('btn--green');
        } else {
            $('.modal[data-model="termos-condicoes"] .btn').attr('disabled', true).toggleClass('btn--gray').toggleClass('btn--green');
            return
        }

        $('.modal[data-model="termos-condicoes"] [data-acao="confirmar"]').on('click', function () {
            $('.modal--active').removeClass('modal--active');
            $('.modal[data-model="assinatura"]').addClass('modal--active');
        })

        $('.modal[data-model="assinatura"] [data-acao="voltar"]').on('click', function () {
            $('.modal--active').removeClass('modal--active');
            $('.modal[data-model="termos-condicoes"]').addClass('modal--active');
        })

        $('.modal[data-model="assinatura"] [data-acao="salvar"]').on('click', function () {
            const btn = $(this);
            const idFicha = $('.modal[data-model="cadastro-produto"]').data('ficha');

            if(btn.closest('.modal').find('#nome').val() == '' || btn.closest('.modal').find('#cpf').val() == '') {
                alert('Preencha todos os campos para prosseguir.')
                return
            }

            let assinatura = {
                nome: btn.closest('.modal').find('#nome').val(),
                cpf: btn.closest('.modal').find('#cpf').val()
            }

            btn.attr('disabled', true);
            aprovarFicha(btn, idFicha, assinatura)
        })
    })

    $('.modal[data-model="cadastro-produto"] .modal__close').on('click', function () {
        $(this).closest('.modal').find('input, select, textarea').val('');
    })

    $('.modal[data-model="item-conjunto"] .modal__close').on('click', function () {
        $('.modal[data-model="cadastro-produto"]').addClass('modal--active');
    })
});

async function detalhesFicha( idFichaUrl = null ) {
    try {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const idFilial = localStorage.getItem('idFilial');
        let idFicha
        if(idFichaUrl) {
            idFicha = idFichaUrl;
        } else {
            idFicha = $('.modal[data-model="cadastro-produto"]').data('ficha')
        }

        const apiURL = `https://cmexxfab.com.br/api-homol/api/produto/previas/${idFicha}?cliente=${idFilial}`;

        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();

        let tabela = $('.modal[data-model="cadastro-produto"] .table')
        let dataTable = new DataTable(tabela.find('table'));

        if(idFichaUrl) {
            tabela = $('.table--lista')
            // dataTable = new DataTable(tabela);
        }
        
        tabela.find('tbody').empty();
        dataTable.clear()

        if(idFichaUrl == null) {
            tabela.find('table').DataTable().destroy();
        } else {
            // tabela.DataTable().destroy();
        }

        data.forEach(item => {
            let criticidade
            if(item.TpoCriticidade == 1) {
                criticidade = 'Não Crítico'    
            }
            if(item.TpoCriticidade == 2) {
                criticidade = 'Semicrítico'
            }
            if(item.TpoCriticidade == 3) {
                criticidade = 'Crítico'
            }

            let validade = new Date(item.dtvalfabr).toLocaleString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric' }).split('/').join('/')
            if(item.staDataIndeterminada == 'S') {
                validade = 'Indeterminada'
            }
            
            let status
            if(item.TpoSituacao == 1) {
                status = 'Pendente'
            }
            if(item.TpoSituacao == 2) {
                status = 'Aprovado pelo Cliente'
            }
            if(item.TpoSituacao == 3) {
                status = 'Reprovado'
            }
            if(item.TpoSituacao == 4) {
                status = 'Aprovado pela BIOXXI'
            }
            if(item.TpoSituacao == 5) {
                status = 'Contém item Reprovado'
            }

            let row = 
            `<tr data-produto-id="${item.Id}">
                <td>${item.nomeProduto}</td>
                <td>${item.NumRegistroAnvisa}</td>
                <td data-criticidade="${item.TpoCriticidade}">${criticidade}</td>
                <td>${validade}</td>
                <td data-status="${item.TpoSituacao}">${status}</td>
                <td>
                    <span data-acao="editar"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.74994 27.1254C1.62647 27.1261 1.50423 27.1007 1.39127 27.0509C1.27831 27.001 1.17718 26.9278 1.09454 26.8361C1.01189 26.7443 0.949596 26.6361 0.911748 26.5186C0.8739 26.4011 0.861356 26.2768 0.874941 26.1541L1.66244 19.0054C1.68451 18.8065 1.77407 18.6212 1.91619 18.4804L18.6112 1.79412C18.9007 1.50284 19.2449 1.27168 19.6241 1.11394C20.0033 0.956206 20.4099 0.875 20.8206 0.875C21.2312 0.875 21.6379 0.956206 22.017 1.11394C22.3962 1.27168 22.7404 1.50284 23.0299 1.79412L26.2499 4.97037C26.5412 5.25987 26.7724 5.60411 26.9301 5.98328C27.0879 6.36245 27.1691 6.76907 27.1691 7.17975C27.1691 7.59042 27.0879 7.99704 26.9301 8.37621C26.7724 8.75538 26.5412 9.09962 26.2499 9.38912L9.51994 26.0754C9.3791 26.2175 9.19381 26.3071 8.99494 26.3291L1.84619 27.1254H1.74994ZM3.37744 19.4954L2.73869 25.2616L8.50494 24.6229L24.9724 8.14662C25.2279 7.88788 25.3711 7.53894 25.3711 7.17537C25.3711 6.8118 25.2279 6.46286 24.9724 6.20412L21.7962 3.02787C21.5375 2.77245 21.1885 2.62923 20.8249 2.62923C20.4614 2.62923 20.1124 2.77245 19.8537 3.02787L3.37744 19.4954Z" fill="#0083CA"/><path d="M23.2049 12.023C22.9754 12.022 22.7554 11.9309 22.5924 11.7692L16.2312 5.40798C16.0676 5.23973 15.9775 5.01338 15.9808 4.77873C15.9841 4.54407 16.0804 4.32033 16.2487 4.15673C16.4169 3.99312 16.6433 3.90305 16.8779 3.90634C17.1126 3.90962 17.3363 4.00598 17.4999 4.17423L23.8262 10.5005C23.9892 10.6644 24.0806 10.8862 24.0806 11.1174C24.0806 11.3485 23.9892 11.5703 23.8262 11.7342C23.7474 11.8217 23.6517 11.8923 23.545 11.9419C23.4383 11.9915 23.3226 12.0191 23.2049 12.023Z" fill="#0083CA"/><path d="M16.225 10.5361L8.28064 18.4805L9.51808 19.7179L17.4624 11.7736L16.225 10.5361Z" fill="#0083CA"/></svg></span>
                    <span data-acao="excluir"><svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.78125 8.88086H8.46875V22.3809H6.78125V8.88086Z" fill="#0083CA"/><path d="M10.1562 8.88086H11.8438V22.3809H10.1562V8.88086Z" fill="#0083CA"/><path d="M13.5312 8.88086H15.2188V22.3809H13.5312V8.88086Z" fill="#0083CA"/><path d="M0.03125 3.81836H21.9688V5.50586H0.03125V3.81836Z" fill="#0083CA"/><path d="M15.1625 4.6625H13.5875V2.975C13.5875 2.46875 13.1938 2.075 12.6875 2.075H9.31252C8.80627 2.075 8.41252 2.46875 8.41252 2.975V4.6625H6.83752V2.975C6.83752 1.625 7.96252 0.5 9.31252 0.5H12.6875C14.0375 0.5 15.1625 1.625 15.1625 2.975V4.6625Z" fill="#0083CA"/><path d="M16.0625 27.4439H5.9375C4.5875 27.4439 3.40625 26.3189 3.29375 24.9689L1.71875 4.71894L3.40625 4.60645L4.98125 24.8564C5.0375 25.3627 5.4875 25.7564 5.9375 25.7564H16.0625C16.5688 25.7564 17.0187 25.3064 17.0187 24.8564L18.5938 4.60645L20.2812 4.71894L18.7062 24.9689C18.5937 26.3752 17.4125 27.4439 16.0625 27.4439Z" fill="#0083CA"/></svg></span>
                </td>
            </tr>`;

            if(idFichaUrl) {
                row =
                `<tr data-produto-id="${item.Id}">
                    <td>${item.nomeProduto}</td>
                    <td>${item.NumRegistroAnvisa}</td>
                    <td data-criticidade="${item.TpoCriticidade}">${criticidade}</td>
                    <td>${validade}</td>
                    <td data-status="${item.TpoSituacao}">${status}</td>
                    <td>${item.MotivoReprovacao}</td>
                </tr>`;

                $('body').find('hr').remove()
                $('.cadastro-produto').hide()
                $('.heading h1').text('Ficha: ' + idFichaUrl)
            }

            tabela.find('tbody').append(row);
        })

        tabela.find('table').DataTable(tableConfig);
    } catch (error) {
        console.error("Erro ao obter itens:", error);
        alert("Erro ao obter itens: " + error.message);
    }
}

async function checkProduto(btn) {
    try {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const idFilial = localStorage.getItem('idFilial');
        const nomeProd = btn.closest('.modal__fields').find('#nome-produto').val();

        const apiURL = `https://cmexxfab.com.br/api-homol/api/produto/previa/importado?nomeProduto=${nomeProd}&cliente=${idFilial}`;

        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        btn.attr('disabled', false);
        const data = await response.json();
    } catch (error) {
        console.error("Erro ao obter itens:", error);
        alert("Erro ao obter itens: " + error.message);
    }
}

async function getFichas(btn) {
    try {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const idFilial = localStorage.getItem('idFilial');
        const dataIni = btn.parent().find('#periodo-inicio').val().split('-').reverse().join('/');
        const dataFim = btn.parent().find('#periodo-fim').val().split('-').reverse().join('/');
        let situacao = btn.parent().find('#situacao').val();

        if(situacao === null) {
            situacao = '';
        }

        const apiURL = `https://cmexxfab.com.br/api-homol/api/produto/fichas?cliente=${idFilial}&dt_ini=${dataIni}&dt_fim=${dataFim}&situacao=${situacao}`;

        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();
        const tabela = $('.table--lista')
        tabela.find('tbody').empty();
        tabela.find('table').DataTable().destroy();
        console.table("Itens recebidos:", data);

        data.forEach(item => {
            let status
            if(item.TpoSituacao == 1) {
                status = 'Pendente'
            }
            if(item.TpoSituacao == 2) {
                status = 'Aprovado pelo Cliente'
            }
            if(item.TpoSituacao == 3) {
                status = 'Reprovado'
            }
            if(item.TpoSituacao == 4) {
                status = 'Aprovado pela BIOXXI'
            }
            if(item.TpoSituacao == 5) {
                status = 'Contém item Reprovado'
            }
            tabela.find('tbody').append(`
            <tr data-ficha-id="${item.numero_ficha}">
                <td>${new Date(item.dt_cadastro).toLocaleString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric' }).split('/').reverse().join('/')}</td>
                <td>${item.numero_ficha}</td>
                <td>${new Date(item.dt_atualizacao).toLocaleString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric' }).split('/').reverse().join('/')}</td>
                <td>${status}</td>
            </tr>`)
        })

        tabela.find('table').DataTable(tableConfig);
        btn.attr('disabled', false);
    } catch (error) {
        console.error("Erro ao obter itens:", error);
        alert("Erro ao obter itens: " + error.message);
    }
}

async function checkAnvisa(nomeProd, btn) {
    const accessToken = localStorage.getItem('access_token');
    const apiURL = `https://cmexxfab.com.br/api-homol/api/produto/regularizado?q=${nomeProd}`;
        
    fetch(apiURL, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao buscar produtos: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        const prod = data; // Todos os setores, sem filtro
        let registrosUnicos = {};

        // Filtra os dados eliminando duplicatas
        $.each(prod, function(index, item) {
            registrosUnicos[item.numRegistroAnvisa] = item.nome_comercial;
        });

        $('.modal[data-model="produtos"] .modal__content').empty();
        // Insere os dados filtrados no HTML
        $.each(registrosUnicos, function(numRegistro, nome) {
            $('.modal[data-model="produtos"] .modal__content').append(`<span data-num="${numRegistro}" data-nome="${nome}"><span>${numRegistro}</span><span>${nome}</span></span>`);
        });

        $('.modal[data-model="produtos"]').addClass('modal--active');

        $('.modal[data-model="produtos"] .modal__content span').on('click', function () {
            const num = $(this).data('num');
            const nome = $(this).data('nome');

            btn.closest('.modal').find('#nome-produto, #sub_item').val(nome);
            btn.closest('.modal').find('#anvisa, #n_anvisa').val(num);

            $('.modal[data-model="produtos"]').removeClass('modal--active');
        });

        btn.attr('disabled', false);
    }).catch(error => {
        alert('Erro ao buscar produtos:', error);
    });
}

async function addProd(btn) {
    try {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const idFilial = localStorage.getItem('idFilial');

        // Garantindo que a ficha foi armazenada corretamente no modal
        const fichaId = btn.closest('.modal').data('ficha');
        
        if (!fichaId) {
            alert('Erro: ID da ficha não encontrado.');
            return;
        }

        const nomeProd = btn.closest('.modal__fields').find('#nome-produto').val();
        const numAnvisa = Number(btn.closest('.modal__fields').find('#anvisa').val()); // Convertendo para número
        const criticidade = Number(btn.closest('.modal__fields').find('#criticidade').val()); // Convertendo para número

        const validadeIndeterminada = btn.closest('.modal__fields').find('#validade_indeterminada').is(':checked');
        let dtvalfabr = btn.closest('.modal__fields').find('#validade').val().split('-').reverse().join('/');
        let dt_indeterminada = validadeIndeterminada ? 'S' : 'N';
        let staSubproduto = btn.closest('.modal__fields').find('#e_sub_item').is(':checked') ? 'S' : 'N';

        if (validadeIndeterminada == true) {
            dtvalfabr = null;
        }

        if(!criticidade) {
            alert('Por favor, selecione a criticidade do produto.');
            return
        }

        // Validação antes de enviar para a API
        if(criticidade == '1') {
            if (!nomeProd) {
                alert('Por favor, preencha o nome do produto.');
                btn.attr('disabled', false);
                return;
            }
        } else {
            if(!numAnvisa) {
                alert('Por favor, digite o código do produto da Anvisa.');
                return
            }

            if (!nomeProd || !numAnvisa) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                btn.attr('disabled', false);
                return;
            }
        }

        const apiURL = `https://cmexxfab.com.br/api-homol/api/produto/previa`;

        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "cliente": idFilial,
                "nomeProduto": nomeProd,
                "NumRegistroAnvisa": numAnvisa,
                "TpoCriticidade": criticidade,
                "dtvalfabr": dtvalfabr,
                "dt_indeterminada": dt_indeterminada,
                "StaSubproduto": staSubproduto,
                "numero_ficha": fichaId
            })
        });

        // Se a resposta não for OK, capturar o erro detalhado
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();

        // Adicionando o produto na tabela DataTables
        const tabela = btn.closest('.modal').find('.table')
        const tbody =  btn.closest('.modal').find('.table table tbody')
        const dataTable = new DataTable(tabela.find('table'));
        tabela.find('table').DataTable().destroy();

        tabela.find('tbody').append(`
            <tr data-conjunto="${data.Id}">
                <td>${data.nomeProduto}</td>
                <td>${data.NumRegistroAnvisa}</td>
                <td>${data.criticidade === 1 ? 'Não Crítico' : data.criticidade === 2 ? 'Semi Crítico' : 'Crítico'}</td>
                <td>${data.dt_indeterminada === 'S' ? data.dtvalfabr : 'Indeterminada'}</td>
                <td>Pendente</td>
                <td>
                    <span data-acao="add"><svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 26C10.4288 26 7.91543 25.2376 5.77759 23.8091C3.63975 22.3807 1.97351 20.3503 0.989572 17.9749C0.0056327 15.5995 -0.251811 12.9856 0.249797 10.4638C0.751405 7.94208 1.98953 5.6257 3.80762 3.80762C5.6257 1.98953 7.94208 0.751405 10.4638 0.249797C12.9856 -0.251811 15.5995 0.0056327 17.9749 0.989572C20.3503 1.97351 22.3807 3.63975 23.8091 5.77759C25.2376 7.91543 26 10.4288 26 13C26 16.4478 24.6304 19.7544 22.1924 22.1924C19.7544 24.6304 16.4478 26 13 26ZM13 2.00001C10.8244 2.00001 8.69767 2.64514 6.88873 3.85384C5.07979 5.06254 3.66989 6.7805 2.83733 8.79049C2.00477 10.8005 1.78693 13.0122 2.21137 15.146C2.63581 17.2798 3.68345 19.2398 5.22183 20.7782C6.76021 22.3166 8.72022 23.3642 10.854 23.7886C12.9878 24.2131 15.1995 23.9952 17.2095 23.1627C19.2195 22.3301 20.9375 20.9202 22.1462 19.1113C23.3549 17.3023 24 15.1756 24 13C24 10.0826 22.8411 7.28473 20.7782 5.22183C18.7153 3.15893 15.9174 2.00001 13 2.00001Z" fill="#0083CA"/><path d="M13 20C12.7348 20 12.4804 19.8946 12.2929 19.7071C12.1054 19.5196 12 19.2652 12 19V7C12 6.73478 12.1054 6.48043 12.2929 6.29289C12.4804 6.10536 12.7348 6 13 6C13.2652 6 13.5196 6.10536 13.7071 6.29289C13.8946 6.48043 14 6.73478 14 7V19C14 19.2652 13.8946 19.5196 13.7071 19.7071C13.5196 19.8946 13.2652 20 13 20Z" fill="#0083CA"/><path d="M19 14H7C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12H19C19.2652 12 19.5196 12.1054 19.7071 12.2929C19.8946 12.4804 20 12.7348 20 13C20 13.2652 19.8946 13.5196 19.7071 13.7071C19.5196 13.8946 19.2652 14 19 14Z" fill="#0083CA"/></svg></span>
                    <span data-acao="excluir"><svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.78125 8.88086H8.46875V22.3809H6.78125V8.88086Z" fill="#0083CA"/><path d="M10.1562 8.88086H11.8438V22.3809H10.1562V8.88086Z" fill="#0083CA"/><path d="M13.5312 8.88086H15.2188V22.3809H13.5312V8.88086Z" fill="#0083CA"/><path d="M0.03125 3.81836H21.9688V5.50586H0.03125V3.81836Z" fill="#0083CA"/><path d="M15.1625 4.6625H13.5875V2.975C13.5875 2.46875 13.1938 2.075 12.6875 2.075H9.31252C8.80627 2.075 8.41252 2.46875 8.41252 2.975V4.6625H6.83752V2.975C6.83752 1.625 7.96252 0.5 9.31252 0.5H12.6875C14.0375 0.5 15.1625 1.625 15.1625 2.975V4.6625Z" fill="#0083CA"/><path d="M16.0625 27.4439H5.9375C4.5875 27.4439 3.40625 26.3189 3.29375 24.9689L1.71875 4.71894L3.40625 4.60645L4.98125 24.8564C5.0375 25.3627 5.4875 25.7564 5.9375 25.7564H16.0625C16.5688 25.7564 17.0187 25.3064 17.0187 24.8564L18.5938 4.60645L20.2812 4.71894L18.7062 24.9689C18.5937 26.3752 17.4125 27.4439 16.0625 27.4439Z" fill="#0083CA"/></svg></span>
                </td>
            </tr>
        `);

    tbody.closest('table').DataTable(tableConfig);

    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        alert("Erro ao adicionar produto: " + error.message);
    }
}

async function excluirProd(btn) {
    try {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const idFilial = localStorage.getItem('idFilial');
        let apiURL

        if(btn.closest('.modal').data('model') == 'cadastro-produto') {
            const idConjunto = $(btn).closest('tr').data('produto-id');
            
            apiURL = `https://cmexxfab.com.br/api-homol/api/produto/previa/${idConjunto}`;
        }

        if(btn.closest('.modal').data('model') == 'item-conjunto') {
            const idusubproduto = $(btn).closest('tr').data('subproduto-id');
            apiURL = `https://cmexxfab.com.br/api-homol/api/produto/previa/sub-item/${idusubproduto}`
        }

        const response = await fetch(apiURL, {
            method: 'DELETE', // Método DELETE
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "cliente": idFilial
            })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();

        // Remover a linha da tabela após a deleção
        const tabela = btn.closest('.modal').find('.table table')
        const dataTable = new DataTable(tabela);
        dataTable.row($(btn).parents('tr')).remove().draw();

        alert("Produto deletado com sucesso!");

    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        alert("Erro ao deletar produto: " + error.message);
    }
}

async function addSubItem(btn) {
    try {
        const idConjunto = $(btn).closest('.modal').data('conjunto-id');
        const subItem = $('.modal[data-model="item-conjunto"]').find('#sub_item').val();
        const nAnvisa = $('.modal[data-model="item-conjunto"]').find('#n_anvisa').val();

        const idFilial = localStorage.getItem('idFilial');
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
    
        const apiURL = `https://cmexxfab.com.br/api-homol/api/produto/previa/sub-item`;

        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "cliente": idFilial,
                "id_conjunto_prev": idConjunto,
                "nomeProduto": subItem,
                "NumRegistroAnvisa": nAnvisa
            })
        });

        // Se a resposta não for OK, capturar o erro detalhado
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();

        // Adicionando o produto na tabela DataTables
        const tabela = btn.closest('.modals').find('.modal[data-model="item-conjunto"] .table table')
        tabela.DataTable().destroy();

        tabela.find('tbody').append(`
            <tr data-subproduto-id="${data.idusubproduto}">
                <td>${data.nomeProduto}</td>
                <td>${data.NumRegistroAnvisa}</td>
                <td>
                    <span data-acao="excluir"><svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.78125 8.88086H8.46875V22.3809H6.78125V8.88086Z" fill="#0083CA"/><path d="M10.1562 8.88086H11.8438V22.3809H10.1562V8.88086Z" fill="#0083CA"/><path d="M13.5312 8.88086H15.2188V22.3809H13.5312V8.88086Z" fill="#0083CA"/><path d="M0.03125 3.81836H21.9688V5.50586H0.03125V3.81836Z" fill="#0083CA"/><path d="M15.1625 4.6625H13.5875V2.975C13.5875 2.46875 13.1938 2.075 12.6875 2.075H9.31252C8.80627 2.075 8.41252 2.46875 8.41252 2.975V4.6625H6.83752V2.975C6.83752 1.625 7.96252 0.5 9.31252 0.5H12.6875C14.0375 0.5 15.1625 1.625 15.1625 2.975V4.6625Z" fill="#0083CA"/><path d="M16.0625 27.4439H5.9375C4.5875 27.4439 3.40625 26.3189 3.29375 24.9689L1.71875 4.71894L3.40625 4.60645L4.98125 24.8564C5.0375 25.3627 5.4875 25.7564 5.9375 25.7564H16.0625C16.5688 25.7564 17.0187 25.3064 17.0187 24.8564L18.5938 4.60645L20.2812 4.71894L18.7062 24.9689C18.5937 26.3752 17.4125 27.4439 16.0625 27.4439Z" fill="#0083CA"/></svg></span>
                </td>
            </tr>
        `);

        tabela.DataTable(tableConfig);
        btn.attr('disabled', false);
        
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        alert("Erro ao adicionar produto: " + error.message);
    }
}

async function getSubItems(idConjunto, btn) {
    try {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const idFilial = localStorage.getItem('idFilial'); // O cliente é fixo, conforme a URL fornecida.

        const apiURL = `https://cmexxfab.com.br/api-homol/api/conjunto/previa/${idConjunto}?cliente=${idFilial}`;

        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();
        btn.closest('.modals').find('.modal[data-model="item-conjunto"]').data('conjunto-id', idConjunto);
        
        const tabela = btn.closest('.modals').find('.modal[data-model="item-conjunto"]').find('.table table')
        tabela.find('tbody').empty();
        tabela.DataTable().destroy();

        data.forEach(item => {
            tabela.find('tbody').append(`
            <tr data-subproduto-id="${item.idusubproduto}">
                <td>${item.nomeProduto}</td>
                <td>${item.NumRegistroAnvisa}</td>
                <td>
                    <span data-acao="excluir"><svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.78125 8.88086H8.46875V22.3809H6.78125V8.88086Z" fill="#0083CA"/><path d="M10.1562 8.88086H11.8438V22.3809H10.1562V8.88086Z" fill="#0083CA"/><path d="M13.5312 8.88086H15.2188V22.3809H13.5312V8.88086Z" fill="#0083CA"/><path d="M0.03125 3.81836H21.9688V5.50586H0.03125V3.81836Z" fill="#0083CA"/><path d="M15.1625 4.6625H13.5875V2.975C13.5875 2.46875 13.1938 2.075 12.6875 2.075H9.31252C8.80627 2.075 8.41252 2.46875 8.41252 2.975V4.6625H6.83752V2.975C6.83752 1.625 7.96252 0.5 9.31252 0.5H12.6875C14.0375 0.5 15.1625 1.625 15.1625 2.975V4.6625Z" fill="#0083CA"/><path d="M16.0625 27.4439H5.9375C4.5875 27.4439 3.40625 26.3189 3.29375 24.9689L1.71875 4.71894L3.40625 4.60645L4.98125 24.8564C5.0375 25.3627 5.4875 25.7564 5.9375 25.7564H16.0625C16.5688 25.7564 17.0187 25.3064 17.0187 24.8564L18.5938 4.60645L20.2812 4.71894L18.7062 24.9689C18.5937 26.3752 17.4125 27.4439 16.0625 27.4439Z" fill="#0083CA"/></svg></span>
                </td>
            </tr>`)
        })

        tabela.DataTable(tableConfig);
        $('.modal--active').removeClass('modal--active')
        $('.modal[data-model="item-conjunto"]').addClass('modal--active')
    } catch (error) {
        console.error("Erro ao obter itens:", error);
        alert("Erro ao obter itens: " + error.message);
    }
}

async function idFicha() {
    try {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const apiURL = `https://cmexxfab.com.br/api-homol/api/produto/novo-id-cadastro-previo/`;

        const response = await fetch(apiURL, {
            method: 'GET',
            headers: { 
                Authorization: `Bearer ${accessToken}`, 
                Coligada: coligadaId 
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar ficha: ${response.status}`);
        }

        const data = await response.text(); // Obtendo o número retornado pela API

        $('.modal[data-model="cadastro-produto"]').data('ficha', data);
    } catch (error) {
        alert('Erro ao receber ID da ficha de cadastro: ' + error.message);
    }
}

async function aprovarFicha(btn, idFicha, assinatura) {
    try {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const idFilial = localStorage.getItem('idFilial');
        
        if (!idFicha) {
            alert('Erro: ID da ficha não encontrado.');
            return;
        }

        const apiURL = `https://cmexxfab.com.br/api-homol/api/produto/previa/aprovar`;

        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "dados": [
                    {
                        "numero_ficha": idFicha,
                        "cliente": idFilial
                    }
                ],
                "assinatura": {
                    "nome_completo": assinatura.nome,
                    "cpf": assinatura.cpf
                }
            })
        });

        // Se a resposta não for OK, capturar o erro detalhado
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();

        btn.attr('disabled', true);
        $('input, textarea, select').val('');
        modalSuccess('Produto enviado com sucesso')
    } catch (error) {
        console.error("Erro ao aprovar ficha:", error);
        alert("Erro ao aprovar ficha: " + error.message);
    }
}