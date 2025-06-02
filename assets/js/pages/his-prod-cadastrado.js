jQuery(document).ready(function ($) {
    // Handler para o botão "Buscar"
    $('.btn.btn--green').on('click', function () {
        const cliente = localStorage.getItem('codCli');
        const marcacao = $('#marcacao').val();
        const descartados = $('[name="descartados"]').val();

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
                'Coligada': localStorage.getItem('coligadaId'),
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Preencher a tabela com os dados recebidos
            if(data.length === 0) {
                alert('Nenhum dado encontrado.');
                return;
            }
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
        row.append(`<td>${item.IdProduto ? item.IdProduto : 'N/A'}</td>`);
        row.append(`<td>${item.nomeprod}</td>`);
        row.append(`<td>${item.marcacao}</td>`);
        row.append(`<td>${item.NumRegistroAnvisa ? item.NumRegistroAnvisa : 'N/A'}</td>`);
        row.append(`<td>${item.DtDescarte ? item.DtDescarte : 'N/A'}</td>`);
        row.append(`<td>${item.dtvalfabr ? item.dtvalfabr : 'N/A'}</td>`);

        // Adicionar a linha na tabela
        tbody.append(row);
    });

    tbody.closest('table').DataTable(tableConfig);
}