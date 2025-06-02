jQuery(document).ready(function ($) {
    $('.btn--green').on('click', async function () {
        hisReprocessamento()
    })

    $(document).on('click', '[data-action="modal"]', async function () {
        let idFilial = $(this).data('filial');
        let etiqueta = $(this).data('etiqueta');
        
        hisReprocessamentoDetalhes(idFilial, etiqueta);
    })
});

async function hisReprocessamento() {
    const cliente = localStorage.getItem('codCli');
    const idFilial = localStorage.getItem('idFilial');
    let setores = $('#setores').val();
    const periodoInicio = $('#periodo-inicio').val();
    const periodoFim = $('#periodo-fim').val();
    const artigo = $('#artigo').val();
    const marcacao = $('#marcacao').val();
    const qtdreprocessamento = $('#qtdreprocessamento').val();

    // Validar se os campos obrigatórios estão preenchidos
    if (!cliente || !periodoInicio || !periodoFim) {
        alert('Por favor, preencha os campos obrigatórios: Cliente e Período.');
        return;
    }

    if(!setores) {
        setores = localStorage.getItem('idFilial');
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
    const endpoint = `/api/cliente/consulta/reprocessamento`;
    const queryParams = `?cliente=${cliente}&idfilial=${idFilial}&numero_etiqueta=${marcacao}&qtdproc=${qtdreprocessamento}&idsetor=${setores}&dtapedInicio=${dataInicioFormatada}&dtapedFim=${dataFimFormatada}&nomeprod=${artigo}`;
    const url = baseUrl + endpoint + queryParams;
    // const url = baseUrl + '/api/cliente/consulta/reprocessamento?cliente=135&idfilial=CIU&numero_etiqueta&qtdproc&dtapedInicio=2024-01-05&dtapedFim=2024-02-01&nomeprod'

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

        gerarLinhasTabelaReprocessamento(result);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Por favor, tente novamente.');
    }
}

function gerarLinhasTabelaReprocessamento(data) {
    const tabela = $('.table.table--reprocessamento');
    const tbody = $('.table.table--reprocessamento tbody');
    const dataTable = new DataTable(tabela.find('table'));
    dataTable.clear()
    tabela.find('table').DataTable().destroy();
    tbody.empty();

    // Create a Map to keep only one entry per idetiqueta
    const uniqueData = new Map();

    data.forEach(item => {
        if (!uniqueData.has(item.idetiqueta)) {
            uniqueData.set(item.idetiqueta, item);
        }
    });

    // Convert the Map values to an array and generate table rows
    Array.from(uniqueData.values()).forEach(item => {
        const row = $('<tr>');

        row.append(`<td>${item.codcli}</td>`);
        row.append(`<td>${item.idetiqueta}</td>`);
        row.append(`<td>${item.nomeprod}</td>`);
        row.append(`<td>${item.QTDE_PROC}</td>`);
        row.append(`<td>${item.qtde_max_proc}</td>`);
        row.append(`<td>${item.DtDescarte ? item.DtDescarte : 'N/A'}</td>`);

        // Add action (check if RefPedido exists)
        const acao = `<span data-action="modal" data-etiqueta="${item.numero_etiqueta}" data-filial="${item.idfilial}"><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.5 15C27.5 15 23.75 22.5 15 22.5C6.25 22.5 2.5 15 2.5 15C2.5 15 6.25 7.5 15 7.5C23.75 7.5 27.5 15 27.5 15Z" stroke="#0083CA" stroke-width="2" stroke-linecap="square"/><path d="M15 18.75C17.0711 18.75 18.75 17.0711 18.75 15C18.75 12.9289 17.0711 11.25 15 11.25C12.9289 11.25 11.25 12.9289 11.25 15C11.25 17.0711 12.9289 18.75 15 18.75Z" stroke="#0083CA" stroke-width="2" stroke-linecap="square"/></svg></span>`;
        
        row.append(`<td>${acao}</td>`);

        // Append the row to the table
        tbody.append(row);
    });

    tbody.closest('table').DataTable(tableConfig);
    tbody[0].scrollIntoView({ behavior: 'smooth' });
}

async function hisReprocessamentoDetalhes(idFilial, etiqueta) {
    const baseUrl = 'https://cmexxfab.com.br/api-homol';
    const endpoint = `/api/cliente/consulta/reprocessamento/detalhes`;
    const queryParams = `?idfilial=${idFilial}&numero_etiqueta=${etiqueta}`;
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

        gerarLinhasTabelaReprocessamentoDetalhes(result);
        $('.modal[data-model="artigos-reprocessados"]').addClass('modal--active');
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Por favor, tente novamente.');
    }
}

function gerarLinhasTabelaReprocessamentoDetalhes(data) {
    const tabela = $('.table.table--reprocessamento-detalhes');
    const tbody = $('.table.table--reprocessamento-detalhes tbody');
    const dataTable = new DataTable(tabela.find('table'));
    dataTable.clear()
    tabela.find('table').DataTable().destroy();
    tbody.empty();

    data.forEach(item => {
        const row = $('<tr>');

        row.append(`<td>${item.anoped}</td>`);
        row.append(`<td>${item.idped}</td>`);
        row.append(`<td>${item.itmped}</td>`);
        row.append(`<td>${item.qtdproc}</td>`);
        row.append(`<td>${item.NomPaciente}</td>`);
        row.append(`<td>${item.numeroprontuario}</td>`)
        row.append(`<td>${item.complemt}</td>`)
        row.append(`<td>${item.dtaped}</td>`)

        tbody.append(row);
    })

    tbody.closest('table').DataTable(tableConfig);
}