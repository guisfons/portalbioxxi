$(document).ready(() => {
    contrato()
})

function contrato() {
    const accessToken = localStorage.getItem('access_token');
    const coligadaId = localStorage.getItem('coligadaId');
    const userId = localStorage.getItem('user_id');
    const apiURL = `https://cmexxfab.com.br/api-homol/api/certidao/cliente/2434`;

    if (!accessToken || !coligadaId) {
        console.error('Erro: Token de acesso ou ID da coligada não encontrado.');
        return;
    }

    fetch(apiURL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Coligada': coligadaId
        },
    })
    .then(response => {
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
        return response.json(); 
    })
    .then(data => {
        if (!data || !data[0]?.url) {
            throw new Error('Erro: URL do PDF não encontrada na resposta da API.');
            alert('Erro: Contrato digital nao encontrado na resposta da API.')
        }
        
        // Transformar a URL relativa em absoluta
        const pdfUrl = new URL(data[0].url, 'https://storagebioxxiapp.blob.core.windows.net/').href;
    
        $('.contrato__iframe').attr('src', pdfUrl);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}