jQuery(document).ready(function ($) {
    $('.btn--green').on('click', async function () {
        hisMemorando()
    });

    $(document).on('click', '[data-action="modal"]', async function () {
        let idFilial = $(this).data('idfilial');
        let codcli = $(this).data('codcli');
        let idsetor = $(this).data('idsetor');
        let idmemo = $(this).data('memo');
        
        hisMemorandoDetalhes(idFilial, codcli, idsetor, idmemo);
    })
});

async function hisMemorando() {
    const cliente = localStorage.getItem('codCli');
    const setor = $('#setores').val()?.trim().toLowerCase();
    const memorando = $('#num-memorando').val();
    const periodoInicio = $('#periodo-inicio').val();
    const periodoFim = $('#periodo-fim').val();

    // Verificar se os campos estão corretamente preenchidos
    if (!validarCampos(cliente, memorando, periodoInicio, periodoFim, setor)) {
        return;
    }

    const dataInicio = periodoInicio ? new Date(periodoInicio) : new Date();
    const dataFim = periodoFim ? new Date(periodoFim) : new Date();

    if(!memorando) {
        if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
            alert('Por favor, insira datas válidas.');
            return;
        }
    }

    const dataInicioFormatada = dataInicio.toISOString().split('T')[0];
    const dataFimFormatada = dataFim.toISOString().split('T')[0];
    const accessToken = localStorage.getItem('access_token');
    const coligada = localStorage.getItem('coligadaId');

    if (!accessToken) {
        alert('Usuário não autenticado. Por favor, faça login.');
        window.location.href = '/login';
        return;
    }

    const url = `https://cmexxfab.com.br/api-homol/api/memorando_cliente/codcli?codcli=${cliente}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligada
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

        const dadosFiltrados = result.filter(item => {
            const dataMemo = item.datamemo ? new Date(item.datamemo) : null;
            const dataColeta = item.dataColeta ? new Date(item.dataColeta) : null;

            if (!dataMemo || !dataColeta || isNaN(dataMemo) || isNaN(dataColeta)) {
                return false;
            }

            const dataMemoFormatada = dataMemo.toISOString().split('T')[0];
            const memorandoValido = memorando ? item.idmemo === memorando : true;
            const dentroDoIntervalo = !memorando || (dataMemoFormatada >= dataInicioFormatada && dataMemoFormatada <= dataFimFormatada);

            const setorItem = item.idsetor?.trim().toLowerCase() || '';
            const setorValido = setor ? setorItem === setor : true;

            if(!memorando) {
                return memorandoValido && dentroDoIntervalo && setorValido;
            } else {
                return memorandoValido;
            }
        });

        if(dadosFiltrados.length === 0) {
            alert('Nenhum dado encontrado.');
            return;
        }

        gerarLinhasTabela(dadosFiltrados);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Por favor, tente novamente.');
    }
}

function validarCampos(cliente, memorando, periodoInicio, periodoFim, setor) {
    // Se não tiver o ID do memorando, precisamos de cliente, setor e período
    if (!memorando) {
        if (!setor || !periodoInicio || !periodoFim) {
            alert('Por favor, preencha os campos obrigatórios: Cliente, Setor e Período.');
            return false;
        }
    } else {
        // Se tiver o ID do memorando, só precisamos de cliente
        if (!cliente) {
            alert('Por favor, preencha o campo Cliente.');
            return false;
        }
    }
    return true;
}

function gerarLinhasTabela(data) {
    const tabela = $('.table:not(.table--memorando)');
    const tbody = tabela.find('tbody');
    const dataTable = new DataTable(tabela.find('table'));
    dataTable.clear()
    tabela.find('table').DataTable().destroy();
    tbody.empty();

    data.forEach(item => {
        const row = $('<tr>');

        const refPedido = item.RefPedido || '';
        const baixa = item.Baixa ? 'Sim' : 'Não';

        row.append(`<td>${item.idmemo}</td>`);
        row.append(`<td>${item.idsetor}</td>`);
        row.append(`<td>${refPedido}</td>`);
        row.append(`<td>${item.datamemo}</td>`);
        // row.append(`<td>${item.dataColeta}</td>`);
        row.append(`<td>${baixa}</td>`);

        // const hasLink = refPedido !== '';
        // const iconColor = hasLink ? '#0083CA' : '#7E7E7E';
        const iconColor = '#0083CA';
        
        // const link = hasLink
        //     ? `<a href="${refPedido}" target="_blank">${getEyeIcon(iconColor)}</a>`
        //     : `<span>${getEyeIcon(iconColor)}</span>`;
        const link = `<span data-action="modal" data-idfilial="${item.idfilial}" data-codcli="${item.codcli}" data-idsetor="${item.idsetor}" data-memo="${item.idmemo}">${getEyeIcon(iconColor)}</span>`;

        row.append(`<td>${link}</td>`);

        tbody.append(row);
    });

    tbody.closest('table').DataTable(tableConfig);
}

async function hisMemorandoDetalhes(idFilial, codcli, idsetor, idmemo) {
    const baseUrl = 'https://cmexxfab.com.br/api-homol';
    const endpoint = `/api/memorando_cliente/item`;
    const queryParams = `?idfilial=${idFilial}&codcli=${codcli}&idsetor=${idsetor}&idmemo=${idmemo}`;
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

        gerarLinhasTabelaMemorandoDetalhes(result);
        $('.modal[data-model="memorando"]').find('#num-memorando').text(idmemo)
        $('.modal[data-model="memorando"]').addClass('modal--active');
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Por favor, tente novamente.');
    }
}

function gerarLinhasTabelaMemorandoDetalhes(data) {
    const tabela = $('.table.table--memorando');
    const tbody = $('.table.table--memorando tbody');
    const dataTable = new DataTable(tabela.find('table'));
    dataTable.clear()
    tabela.find('table').DataTable().destroy();
    tbody.empty();

    data.forEach(item => {
        const row = $('<tr>');

        row.append(`<td>${item.nomeprod}</td>`);
        row.append(`<td>${item.qtde}</td>`);
        row.append(`<td>${item.idped ? item.idped : 'Sem número pedido'}</td>`);

        tbody.append(row);
    })

    tbody.closest('table').DataTable(tableConfig);
}

function getEyeIcon(strokeColor) {
    return `
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.5 15C27.5 15 23.75 22.5 15 22.5C6.25 22.5 2.5 15 2.5 15C2.5 15 6.25 7.5 15 7.5C23.75 7.5 27.5 15 27.5 15Z" stroke="${strokeColor}" stroke-width="2" stroke-linecap="square"/>
            <path d="M15 18.75C17.0711 18.75 18.75 17.0711 18.75 15C18.75 12.9289 17.0711 11.25 15 11.25C12.9289 11.25 11.25 12.9289 11.25 15C11.25 17.0711 12.9289 18.75 15 18.75Z" stroke="${strokeColor}" stroke-width="2" stroke-linecap="square"/>
        </svg>
    `;
}