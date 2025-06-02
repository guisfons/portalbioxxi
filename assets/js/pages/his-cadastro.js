jQuery(document).ready(function ($) {
    // Handler para o botão "Buscar"
    $('.btn.btn--green').on('click', function () {
        const cliente = $('#cliente').val();
        const marcacao = $('#marcacao').val();
        const descartados = $('#descartados').val();
    
        // Validação simples para garantir que o campo Cliente seja preenchido
        if (!cliente) {
            alert('Por favor, preencha o campo Cliente.');
            return;
        }
    
        // Construir a URL com os parâmetros obrigatórios
        let url = `https://cmexxfab.com.br/api-homol/api/cliente/produto?cliente=${cliente}`;
    
        // Adicionar marcacao (opcional)
        if (marcacao) {
            url += `&marcacao=${marcacao}`;
        }
    
        // Adicionar descartados (opcional)
        if (descartados) {
            url += `&descartados=${descartados}`;
        }

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            alert('Usuário não autenticado. Por favor, faça login.');
            window.location.href = '/login';
            return;
        }
    
        // Requisição GET com os parâmetros
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Coligada': '1',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Preencher a tabela com os dados recebidos
            gerarLinhasTabela(data);
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
    });
});

function formatDate(dateString) {
    const date = new Date(dateString)

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

function gerarLinhasTabela(data) {
    const tbody = $('.table tbody');
    tbody.empty();  // Limpar o conteúdo anterior da tabela

    // Percorrer os dados e criar uma linha para cada item
    data.forEach(item => {
        const row = $('<tr>');

        // Adicionar cada célula com os dados
        row.append(`<td>${item.nomeprod}</td>`);
        row.append(`<td>${item.marcacao}</td>`);
        row.append(`<td>${item.IdProduto ? item.IdProduto : 'N/A'}</td>`);
        row.append(`<td>${item.NumRegistroAnvisa ? item.NumRegistroAnvisa : 'N/A'}</td>`);
        row.append(`<td>${item.dtvalfabr ? item.dtvalfabr : 'N/A'}</td>`);
        row.append(`<td>${item.DtDescarte ? item.DtDescarte : 'N/A'}</td>`);

        // Adicionar ação (verificar se há URL)
        const acao = item.url ? `<a href="${item.url}" target="_blank"><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.5 15C27.5 15 23.75 22.5 15 22.5C6.25 22.5 2.5 15 2.5 15C2.5 15 6.25 7.5 15 7.5C23.75 7.5 27.5 15 27.5 15Z" stroke="#0083CA" stroke-width="2" stroke-linecap="square"/><path d="M15 18.75C17.0711 18.75 18.75 17.0711 18.75 15C18.75 12.9289 17.0711 11.25 15 11.25C12.9289 11.25 11.25 12.9289 11.25 15C11.25 17.0711 12.9289 18.75 15 18.75Z" stroke="#0083CA" stroke-width="2" stroke-linecap="square"/></svg></a>` : '<span><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.5 15C27.5 15 23.75 22.5 15 22.5C6.25 22.5 2.5 15 2.5 15C2.5 15 6.25 7.5 15 7.5C23.75 7.5 27.5 15 27.5 15Z" stroke="#7E7E7E" stroke-width="2" stroke-linecap="square"/><path d="M15 18.75C17.0711 18.75 18.75 17.0711 18.75 15C18.75 12.9289 17.0711 11.25 15 11.25C12.9289 11.25 11.25 12.9289 11.25 15C11.25 17.0711 12.9289 18.75 15 18.75Z" stroke="#7E7E7E" stroke-width="2" stroke-linecap="square"/></svg></span>';
        row.append(`<td>${acao}</td>`);

        // Adicionar a linha na tabela
        tbody.append(row);
    });

    tbody.closest('table').DataTable(tableConfig);
}