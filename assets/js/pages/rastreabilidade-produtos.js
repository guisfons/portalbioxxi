jQuery(document).ready(function ($) {
    $('.heading__tab').on('click', function () {
        $('.heading__tab').removeClass('heading__tab--active');
        $(this).addClass('heading__tab--active');

        let tab = $(this).data('tab');

        $('.heading__filtro').removeClass('heading__filtro--active');
        $('.heading__filtro[data-tab="' + tab + '"]').addClass('heading__filtro--active');

        $('#pedido').on('change', function () {
            $('#ano-pedido').val($(this).val().slice(-4))
        })
    })

    $('.btn--green').on('click', async function () {
        if($(this).closest('.heading__filtro').data('tab') === 'cliente') {
            rastreamentoCliente($(this))
            return
        }

        if($(this).closest('.heading__filtro').data('tab') === 'pedido') {
            rastreamentoPedido($(this))
            return
        }

        if($(this).closest('.heading__filtro').data('tab') === 'memorando') {
            rastreamentoMemorando($(this))
            return
        }

        if($(this).closest('.heading__filtro').data('tab') === 'memorando-coleta') {
            rastreamentoMemorandoColeta($(this))
            return
        }
    })
});

async function rastreamentoCliente(btn) {
    const codCli = localStorage.getItem('codCli');
    const periodoInicio = btn.parent().find('#periodo-inicio').val();
    const periodoFim = btn.parent().find('#periodo-fim').val();
    const idFilial = localStorage.getItem('idFilial');
    const setor = btn.parent().find('#setor').val();

    // Validar se os campos obrigatórios estão preenchidos
    if (!codCli || !periodoInicio || !periodoFim || !setor) {
        alert('Por favor, preencha os campos obrigatórios: Cliente, Período e Setor.');
        return;
    }

    // Verificar se as datas são válidas
    const dataInicio = new Date(periodoInicio);
    const dataFim = new Date(periodoFim);

    if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
        alert('Por favor, insira datas válidas.');
        return;
    }

    // Formatar as datas
    const dataInicioFormatada = dataInicio.toISOString().split('T')[0];
    const dataFimFormatada = dataFim.toISOString().split('T')[0];

    // Montar a URL com os parâmetros
    const baseUrl = 'https://cmexxfab.com.br/api-homol';
    const endpoint = `/api/cliente/consulta/pedido`;
    const queryParams = `?codcli=${codCli}&datainicio=${dataInicioFormatada}&datafim=${dataFimFormatada}&idfilial=${idFilial}`;
    const url = baseUrl + endpoint + queryParams;

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

        const resultadosFiltrados = result.filter(item => {
            return item.idsetor && item.idsetor.trim() === setor;
        });

        if (resultadosFiltrados.length === 0) {
            alert('Nenhum dado encontrado para o setor informado.');
            return;
        }

        console.log(resultadosFiltrados);

        gerarLinhasTabela(resultadosFiltrados);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Por favor, tente novamente.');
    }
}

async function rastreamentoPedido() {
    const codCli = localStorage.getItem('codCli');
    const pedido = $('#pedido').val().slice(0, -4);
    const ano = $('#ano-pedido').val();

    // Validar se os campos obrigatórios estão preenchidos
    if (!pedido || !ano) {
        alert('Por favor, preencha os campos obrigatórios: Pedido e Ano pedido.');
        return;
    }

    // Montar a URL com os parâmetros
    const baseUrl = 'https://cmexxfab.com.br/api-homol';
    const endpoint = `/api/cliente/consulta/pedido`;
    const queryParams = `?codcli=${codCli}&idped=${pedido}&anoped=${ano}`;
    const url = baseUrl + endpoint + queryParams;

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

        gerarLinhasTabela(result);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Por favor, tente novamente.');
    }
}

async function rastreamentoMemorando() {
    const codCli = localStorage.getItem('codCli');
    const memorando = $('#memorando').val();

    // Validar se os campos obrigatórios estão preenchidos
    if (!memorando) {
        alert('Por favor, preencha o campo Memorando.');
        return;
    }

    // Montar a URL com os parâmetros
    const baseUrl = 'https://cmexxfab.com.br/api-homol';
    const endpoint = `/api/cliente/consulta/pedido`;
    const queryParams = `?codcli=${codCli}&memo=${memorando}`;
    const url = baseUrl + endpoint + queryParams;

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

        gerarLinhasTabela(result);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Por favor, tente novamente.');
    }
}

async function rastreamentoMemorandoColeta() {
    const codCli = localStorage.getItem('codCli');
    const memorando = $('#memorando-coleta').val();

    // Validar se os campos obrigatórios estão preenchidos
    if (!memorando) {
        alert('Por favor, preencha o campo Memorando.');
        return;
    }

    // Montar a URL com os parâmetros
    const baseUrl = 'https://cmexxfab.com.br/api-homol';
    const endpoint = `/api/cliente/consulta/pedido`;
    const queryParams = `?codcli=${codCli}&memo_coleta=${memorando}`;
    const url = baseUrl + endpoint + queryParams;

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

        gerarLinhasTabela(result);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Por favor, tente novamente.');
    }
}

function gerarLinhasTabela(data) {
    const tabela = $('.table');
    const tbody = $('.table tbody');
    const dataTable = new DataTable(tabela.find('table'));
    dataTable.clear()
    tabela.find('table').DataTable().destroy();
    tbody.empty();

    data.forEach(item => {
        const row = $('<tr>');

        row.append(`<td>${item.idped || ''}</td>`);
        row.append(`<td>${item.memoentrada || ''}</td>`);
        row.append(`<td>${item.idfilial || ''}</td>`);
        row.append(`<td>${item.sitped || ''}</td>`);
        row.append(`<td>${item.idsetor || ''}</td>`);
        row.append(`<td>${item.dtacli || ''}</td>`);
        row.append(`<td>${item.dtacol || ''}</td>`);
        row.append(`<td>${item.dtaped || ''}</td>`);
        row.append(`<td>${item.dtacheg || ''}</td>`);
        row.append(`<td>${item.cortesia ? 'Sim' : 'Não'}</td>`);
        row.append(`<td>${item.Idkit || ''}</td>`);

        tbody.append(row);
    });

    tbody.closest('table').DataTable(tableConfig);
    tbody[0].scrollIntoView({ behavior: 'smooth' });
}
