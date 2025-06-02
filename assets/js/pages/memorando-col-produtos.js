jQuery(document).ready(function ($) {
    getProdutos()
    $('#produto').on('change', function () {
        
    })

    $('.btn--blue').on('click', function () {
        $('.modal[data-model="novo-memorando"]').addClass('modal--active');
    })

    $('.btn--green').on('click', function () {
        if($(this).data('action') === 'continuar') {
            // Step 1 - Novo Memorando
            if($(this).closest('.modal__step').data('step') == '1' && $(this).closest('.modal').data('model') == 'novo-memorando') {
                novoMemorando($(this))
            }
        }

        if($(this).data('action') === 'adicionar-item') {
            novoProduto($(this))
        }

        if($(this).data('action') === 'finalizar') {
            $('.modal--active').removeClass('modal--active')
            $('.modal[data-model="finalizar"]').addClass('modal--active')
        }

        if($(this).data('action') === 'enviar') {
            finalizar($(this))
        }
    })

    $('.modal[data-model="novo-memorando"] [data-action="voltar"], .modal[data-model="novo-memorando"] .modal__close, [data-action="cancelar"]').on('click', function () {
        let step = $(this).closest('.modal').find('.modal__step--active').data('step')

        if(step > 1) {
            if($('.modal__fields--2').hasClass('modal__fields--active')) {
                $('.modal__fields').find('input, textarea, select').val('');
                $('.modal__fields').find('input:not(#coleta), textarea, select').prop('disabled', false);

                let date = new Date();
                let coletaDate = date.getFullYear() + '-' +
                    ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                    ('0' + date.getDate()).slice(-2) + ' ' +
                    ('0' + date.getHours()).slice(-2) + ':' +
                    ('0' + date.getMinutes()).slice(-2) + ':' +
                    ('0' + date.getSeconds()).slice(-2);
                
                let coletaDateFormatado =  date.getDate() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
                $('#coleta').val(coletaDateFormatado);

                $('.modal__fields--2').removeClass('modal__fields--active');    

                return
            } else {
                $('.modal__step--active').removeClass('modal__step--active');
                $('.modal__step[data-step="1"]').addClass('modal__step--active');
                return
            }

            $('.modal__step--active').removeClass('modal__step--active');
            $('.modal__step[data-step="' + step-- + '"]').addClass('modal__step--active');
        }
    })

    $('#codigomarcacao').on('change', function () {
        if(!$(this).val()) { getProdutos(); return; }
        getProdutosMarcacao($(this).val())
    })

    $(document).on('click', '[data-function="remove-item"]', function () {
        removeItem($(this))
    })
});

async function getProdutos() {
    const codCli = localStorage.getItem('codCli');
    const baseUrl = 'https://cmexxfab.com.br/api-homol';
    const endpoint = `/api/produto/codcli?codcli=${codCli}&gruposEspeciais=N`;
    const url = baseUrl + endpoint;

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

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const result = await response.json();
        if (result.length === 0) {
            alert('Nenhum produto encontrado.');
            return;
        }

        result.forEach(item => {
            const option = $('<option>');
            option.val(item.codprod);
            option.text(item.nomeprod);
            option.data('codgrp', item.codgrp);
            $('#produto').append(option);
        })
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        alert('Erro ao buscar produtos. Por favor, tente novamente.');
    }
}

async function getProdutosMarcacao(etiqueta) {
    const codCli = localStorage.getItem('codCli');
    const baseUrl = 'https://cmexxfab.com.br/api-homol';
    const endpoint = `/api/produto/keydot?etiqueta=${etiqueta}&cliente=${codCli}`;
    const url = baseUrl + endpoint;

    try {
        // Fazer a requisição GET com o token Bearer
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

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const result = await response.json();
        if (result.length === 0) {
            alert('Nenhum dado encontrado.');
            return;
        }

        $('#produto').empty();
        const option = $('<option>');
        option.val(result.codprod);
        option.text(result.nomeprod);
        option.data('codgrp', result.codgrp);
        option.data('id_conjunto', result.id_conjunto);
        option.data('id_etiqueta', result.idetiqueta);
        $('#produto').append(option);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Por favor, tente novamente.');
    }
}

async function novoMemorando(btn) {    
    const manufaturado = $('#material').val();

    if(!manufaturado) {
        alert('Por favor, selecione o tipo de material.');
        return
    }

    btn.closest('.modal__step--active').removeClass('modal__step--active');
    btn.closest('.modal').find('[data-step="2"]').addClass('modal__step--active');
    btn.closest('.modal').find('[data-step="2"]').find('.modal__fields--active').removeClass('modal__fields--active');
    btn.closest('.modal').find('[data-step="2"]').find('.modal__fields:first-of-type').addClass('modal__fields--active');

    let coletaInput = btn.closest('.modal').find('[data-step="2"]').find('.modal__fields--active').find('input[name="coleta"]');
    let date = new Date();
    let coletaDate = date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2) + ' ' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2) + ':' +
        ('0' + date.getSeconds()).slice(-2);
    
    let coletaDateFormatado =  date.getDate() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
    coletaInput.val(coletaDateFormatado);

    $('.btn--green[data-action="adicionar-memorando"]').on('click', async function () {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const idFilial = localStorage.getItem('idFilial');
        const codCli = localStorage.getItem('codCli');

        let btn = $(this).attr('disabled', true);

        try {
            const idSetor = btn.closest('.modal__step').find('select[name="setor"]').val();
            const unidade = btn.closest('.modal__step').find('select[name="unidade"]').val();
            const coleta = coletaDate;
            const observacao = btn.closest('.modal__step').find('textarea[name="observacao"]').val();
    
            // Validação antes de enviar para a API
            if (!idSetor) {
                alert('Por favor, selecione o setor correspondente.');
                btn.attr('disabled', false);
                return;
            }
    
            const apiURL = `https://cmexxfab.com.br/api-homol/api/memorando_cliente/salvar`;
    
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Coligada: coligadaId,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'idfilial': idFilial,
                    'codcli': codCli,
                    'idsetor': idSetor,
                    'datamemo': coleta,
                    'obsMemo': observacao,
                    'manufaturado': manufaturado,
                })
            });
    
            // Se a resposta não for OK, capturar o erro detalhado
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
            }
    
            const { idmemo } = await response.json();
    
            if(idmemo) {
                $('.modal[data-model="novo-memorando"]').data('memo', idmemo);
                $('.id-memorando').text(idmemo);
                $('.id-memorando').parent().show()

                $('.modal__fields--active').find('input, select, textarea').attr('disabled', true);
                $('.modal__fields--2').addClass('modal__fields--active');
            }
    
        } catch (error) {
            console.error("Erro ao criar memorando:", error);
            alert("Erro ao criar memorando: " + error.message);
        }
    })
}

async function novoProduto(btn) {
    const accessToken = localStorage.getItem('access_token');
    const coligadaId = localStorage.getItem('coligadaId');
    const codCli = localStorage.getItem('codCli');
    const idFilial = localStorage.getItem('idFilial');
    const idMemo = $('.modal[data-model="novo-memorando"]').data('memo');

    btn.attr('disabled', true);

    try {
        const idSetor = btn.closest('.modal__step').find('select[name="setor"]').val();
        const codProd = btn.closest('.modal__fields').find('#produto').val();
        const codGrp = btn.closest('.modal__fields').find('#produto').find(':selected').data('codgrp');
        const idConjunto = btn.closest('.modal__fields').find('#produto').find(':selected').data('id_conjunto');
        const idEtiqueta = btn.closest('.modal__fields').find('#produto').find(':selected').data('id_etiqueta');
        const quantidade = btn.closest('.modal__fields').find('input[name="quantidade"]').val();
        const paciente = btn.closest('.modal__fields').find('input[name="paciente"]').val();
        const medico = btn.closest('.modal__fields').find('input[name="medico"]').val();
        const observacao = btn.closest('.modal__fields').find('textarea[name="observacao-item"]').val();

        // Validação antes de enviar para a API
        if (!codProd || !coleta) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            btn.attr('disabled', false);
            return;
        }

        const apiURL = `https://cmexxfab.com.br/api-homol/api/memorando_cliente/item`;

        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "idmemo": idMemo,
                'idfilial': idFilial,
                'codcli': codCli,
                'idsetor': idSetor,
                "codgrp": codGrp,
                "codprod": codProd,
                "qtde": quantidade,
                "idconjunto": idConjunto,
                "itensConjunto": null, 
                "codmarcacaoprod": null,
                "nomepaciente": paciente, 
                "nome_medico": medico,
                "observacao": observacao,
                "idetiqueta": idEtiqueta,
                "coligada": coligadaId,
                "statuscriador": "C"
            })
        });

        // Se a resposta não for OK, capturar o erro detalhado
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        memorando(idMemo, btn)

    } catch (error) {
        console.error("Erro ao adicionar item:", error);
        alert("Erro ao adicionar item: " + error.message);
    }
}

async function removeItem(btn) {
    const idmemo = btn.data('idmemo');
    const itmemo = btn.data('itmemo');

    const idFilial = btn.data('idfilial');
    const codCli = btn.data('codcli');
    const idSetor = btn.data('idsetor');
    const accessToken = localStorage.getItem('access_token');
    const coligadaId = localStorage.getItem('coligadaId');
    
    try {        
        const apiURL = `https://cmexxfab.com.br/api-homol/api/memorando_cliente/item`;
        
        const response = await fetch(apiURL, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'idfilial': idFilial,
                'codcli': Number(codCli),
                'idsetor': idSetor,
                'idmemo': Number(idmemo),
                'itmmemo': Number(itmemo)
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Item removido com sucesso:', data);
        
        alert('Item removido com sucesso!');
        memorando(idmemo);
    } catch (error) {
        console.error('Erro ao remover item:', error);
        alert('Erro ao remover item: ' + error.message);
    }
};

async function memorando(idmemo, btn) {
    const accessToken = localStorage.getItem('access_token');
    const coligadaId = localStorage.getItem('coligadaId');
    const idFilial = localStorage.getItem('idFilial');
    const idSetor = $('.modal__step').find('select[name="setor"]').val();
    const codCli = localStorage.getItem('codCli');

    const apiURL = `https://cmexxfab.com.br/api-homol/api/memorando_cliente/item?idfilial=${idFilial}&codcli=${codCli}&idsetor=${idSetor}&idmemo=${idmemo}`;

    fetch(apiURL, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Coligada: coligadaId,
        },
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao buscar setores: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        $('.btn--green[data-action="adicionar-item"]').attr('disabled', false);
        gerarLinhasTabela(data, btn)
    }).catch(error => {
        alert('Erro ao carregar itens do memorando:' + error);
    });
}

async function finalizar(btn) {
    try {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const idFilial = localStorage.getItem('idFilial');
        const idSetor = $('.modal__step').find('select[name="setor"]').val();
        const codCli = localStorage.getItem('codCli');
        const idMemo = $('[data-model="novo-memorando"]').data('memo')
        const obsMemo = $('[data-model="novo-memorando"]').find('textarea[name="observacao"]').val();
        const responsavel = $('#nome-responsavel').val()
        const cpf = $('#cpf-responsavel').val().replace(/[.-]/g, '');

        const apiURL = 'https://cmexxfab.com.br/api-homol/api/memorando_cliente/editar';

        const body = {
            idfilial: idFilial,
            codcli: codCli,
            idsetor: idSetor,
            idmemo: idMemo,
            obsMemo: obsMemo,
            responsavel: responsavel,
            cpf_envio: cpf
        };

        const response = await fetch(apiURL, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Coligada': coligadaId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();
        modalSuccess('memorando enviado com sucesso')
        $('.novo-memorando').after(`<section class="wrapper ultimo-memorando"><h2>Último memorando: <strong>${idMemo}</strong></h2></section>`)
        setTimeout(() => {
            $('.ultimo-memorando').addClass('ultimo-memorando--active');
        }, 600)
        
    } catch (error) {
        console.error('Erro ao editar memorando:', error);
        alert('Erro ao editar memorando: ' + error.message);
    }
}

function gerarLinhasTabela(data, btn) {
    const tabela = btn.closest('.modal__step').find('.modal__table').find('.table');
    const tbody = tabela.find('tbody');
    const dataTable = new DataTable(tabela.find('table'));
    dataTable.clear()
    tabela.find('table').DataTable().destroy();
    tbody.empty();

    data.forEach(item => {
        const row = $('<tr>');

        row.append(`<td>${item.IdProduto || ''}</td>`);
        row.append(`<td>${item.codmarcacaoprod || ''}</td>`);
        row.append(`<td>${item.nomeprod}</td>`);
        row.append(`<td>${item.qtde}</td>`);
        row.append(`<td>${item.nomepaciente || ''}</td>`);
        row.append(`<td>${item.nome_medico || ''}</td>`);

        // Adicionar ação (verificar se há URL)
        // const acao = `<span data-function="add-subitem"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 23C18.9706 23 23 18.9706 23 14C23 9.02944 18.9706 5 14 5C9.02944 5 5 9.02944 5 14C5 18.9706 9.02944 23 14 23Z" stroke="#0083CA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M27.0002 27L20.3662 20.366" stroke="#0083CA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 10V18" stroke="#0083CA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 14H18" stroke="#0083CA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
        const acao = `<span data-function="remove-item"
            data-id="${item.IdProduto}"
            data-idmemo="${item.idmemo}"
            data-itmemo="${item.itmmemo}"
            data-idfilial="${item.idfilial}"
            data-idsetor="${item.idsetor}"
            data-codcli="${item.codcli}"
            ><svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.78125 8.88123H8.46875V22.3812H6.78125V8.88123Z" fill="#0083CA"/><path d="M10.1562 8.88123H11.8438V22.3812H10.1562V8.88123Z" fill="#0083CA"/><path d="M13.5312 8.88123H15.2188V22.3812H13.5312V8.88123Z" fill="#0083CA"/><path d="M0.03125 3.81873H21.9688V5.50623H0.03125V3.81873Z" fill="#0083CA"/><path d="M15.1624 4.6625H13.5874V2.975C13.5874 2.46875 13.1936 2.075 12.6874 2.075H9.3124C8.80615 2.075 8.4124 2.46875 8.4124 2.975V4.6625H6.8374V2.975C6.8374 1.625 7.9624 0.5 9.3124 0.5H12.6874C14.0374 0.5 15.1624 1.625 15.1624 2.975V4.6625Z" fill="#0083CA"/><path d="M16.0625 27.4438H5.9375C4.5875 27.4438 3.40625 26.3188 3.29375 24.9688L1.71875 4.71876L3.40625 4.60626L4.98125 24.8563C5.0375 25.3625 5.4875 25.7563 5.9375 25.7563H16.0625C16.5688 25.7563 17.0187 25.3063 17.0187 24.8563L18.5938 4.60626L20.2812 4.71876L18.7062 24.9688C18.5937 26.375 17.4125 27.4438 16.0625 27.4438Z" fill="#0083CA"/></svg></span>`;
        row.append(`<td>${acao}</td>`);

        // Adicionar a linha na tabela
        tbody.append(row);
    });

    tbody.closest('table').DataTable(tableConfig);
}
