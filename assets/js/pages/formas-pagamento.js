jQuery(document).ready(function ($) {
    listarPagamento()
    actions()
    cartao()
});

function actions() {
    $('.forma-pagamento__actions .btn').on('click', function () {
        const action = $(this).data('action');

        if (action === 'adicionar-cartao') {
            adicionarCartao();
        }

        if (action === 'atualizar-forma-pagamento') {
            atualizarFormaPagamento();
        }

        if(action === 'excluir-cartao') {
            excluirCartao()
        }
    });

    $('.modal[data-model="forma-pagamento"] .modal__action .btn').on('click', function () {
        const action = $(this).data('action');

        if(action === 'cancelar') {
            $('.modal__step--active').removeClass('modal__step--active');
            $('.modal').removeClass('modal--active');
            $('.modal__step[data-step="1"]').addClass('modal__step--active');

            return
        }

        if (action === 'continuar') {
            $('.modal__step--active').removeClass('modal__step--active');

            if($('.modal__formas-pagamento input:checked').val() === 'cartao-credito') {
                $('.modal__step[data-pagamento="cartao"]').addClass('modal__step--active');
            }

            if($('.modal__formas-pagamento input:checked').val() === 'boleto-bancario') {
                $('.modal__step[data-pagamento="boleto"]').addClass('modal__step--active');
            }
        }

        if(action === 'gerar-boleto') {
            const idlan = $('.formas-pagamento').data('idlan')
            gerarBoleto(idlan)
        }

        if (action === 'salvar-cartao') {
            salvarCartao()
        }
    })
}

function adicionarCartao() {
    $('.modal__step--active').removeClass('modal__step--active');
    $('.modal__step[data-step="2"][data-pagamento="cartao"]').addClass('modal__step--active');
    $('.modal[data-model="forma-pagamento"]').addClass('modal--active');
}

function atualizarFormaPagamento() {
    $('.modal__step--active').removeClass('modal__step--active');
    $('.modal__step[data-step="1"]').addClass('modal__step--active');
    $('.modal[data-model="forma-pagamento"]').addClass('modal--active');
}

function cartao() {
    $('#cartao').on('keyup', function () {
        const cartao = $(this).val();
        $('.modal__cartao-numero-cartao').text(cartao);
        detectarBandeira(cartao);
        let bandeira = detectarBandeira(cartao);

        if(bandeira !== 'Desconhecida') {
            $('.modal__cartao-bandeira').html(`<img src="${bandeira.src}" alt="${bandeira.nome}">`);
        }
    });

    $('#validade').on('keyup', function () {	
        const validade = $(this).val();
        $('.modal__cartao-validade-cartao').text(validade);
    });

    $('#nome').on('keyup', function () {
        const nome = $(this).val();
        $('.modal__cartao-nome-titular').text(nome);
    });

    $('#cvv').on('keyup', function () {
        const cvv = $(this).val();
        $('.modal__cartao-cvv').text(cvv);
    });

    $('#cvv').on('focus', function () {
        $('.modal__cartao').css('transform', 'rotateY(180deg)');
        $('.modal__cartao-frente').removeClass('modal__cartao-frente--active');
        $('.modal__cartao-verso').addClass('modal__cartao-verso--active');
    });

    $('#cartao, #validade, #nome').on('focus', function () {
        $('.modal__cartao').css('transform', 'rotateY(0deg)');
        $('.modal__cartao-frente').addClass('modal__cartao-frente--active');
        $('.modal__cartao-verso').removeClass('modal__cartao-verso--active');
    });
}

function salvarCartao() {
    const numCartao = $('.modal__step[data-step="2"][data-pagamento="cartao"] input[name="cartao"]').val().replace(/\D/g, '');
    const validade = $('.modal__step[data-step="2"][data-pagamento="cartao"] input[name="validade_cartao"]').val();
    const cvv = $('.modal__step[data-step="2"][data-pagamento="cartao"] input[name="cvv"]').val();
    const nome = $('.modal__step[data-step="2"][data-pagamento="cartao"] input[name="nome"]').val();
    const cpf = $('.modal__step[data-step="2"][data-pagamento="cartao"] input[name="cpf"]').val();
    const formaPagamento = $('.modal__step[data-step="2"][data-pagamento="cartao"] input[name="forma-pagamento"]').val();

    let valido = validarCartaoLuhn(numCartao)

    if(!valido) {
        alert('Digite um número de cartão válido.');
        $('.modal__step--active input[name="cartao"]').focus();
        return
    }

    if(numCartao === '') {
        alert('Digite um número de cartão.');
        $('.modal__step--active input[name="cartao"]').focus();
        return
    }

    if(nome === '') {
        alert('Digite um nome.');
        $('.modal__step--active input[name="nome"]').focus();
        return
    }

    if(cpf === '') {
        alert('Digite um CPF.');
        $('.modal__step--active input[name="cpf"]').focus();
        return
    }

    if(validade === '') {
        alert('Digite uma data de validade.');
        $('.modal__step--active input[name="validade_cartao"]').focus();
        return
    }

    if(cvv === '') {
        alert('Digite um CVV.');
        $('.modal__step--active input[name="cvv"]').focus();
        return
    }

    if(validarCpf(cpf) === false) {
        alert('Digite um CPF valido.');
        $('.modal__step--active input[name="cpf"]').focus();
        return
    }

    if(formaPagamento === '') {
        alert('Selecione uma forma de pagamento válida')
        $('.modal__step[data-step="2"][data-pagamento="cartao"] input[name="forma-pagamento"]').focus();
        return
    }

    let cartao = {numCartao: numCartao, validade: validade, cvv: cvv, nome: nome};
    
    cadastroCliente(cartao, cpf);
}

async function excluirCartao() {
    try {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const idFilial = localStorage.getItem('idFilial');
        const codCli = localStorage.getItem('codCli');
        const codigoMaxiPago = localStorage.getItem('codigoMaxiPago');

        if(!codigoMaxiPago) {
            alert('É necessário o código MaxiPago para excluir o cartão.');
            return
        }

        const apiURL = `https://cmexxfab.com.br/api-homol/api/pagamento/cliente/${codigoMaxiPago}/cartao`;

        const response = await fetch(apiURL, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'codcli': codCli,
                'idfilial': idFilial,
            })
        });

        // Se a resposta não for OK, capturar o erro detalhado
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();
        console.log(data);

        $('.forma-pagamento__row').addClass('forma-pagamento__row--sem-cartao');
        $('.forma-pagamento__row > span > span').text('Sem cartão de crédito adicionado');

    } catch (error) {
        console.error("Erro ao remover cartão:", error);
        alert("Erro ao remover cartão: " + error.message);
    }
}

function cadastroCliente(cartao, cpf) {
    $('.modal__step--active').removeClass('modal__step--active');
    $('.modal__step[data-step="3"][data-pagamento="cartao"]').addClass('modal__step--active');

    $('input[name="zip"]').on('keyup', async function () {
        const zip = $(this).val();
    
        if (zip.length !== 9) {
            return;
        }
    
        const retornoCep = await cep(zip);

        if (!retornoCep) {
            alert('CEP inválido');
            return;
        }
    
        $('input[name="address1"]').val(retornoCep.street);
        $('input[name="address2"]').val(retornoCep.neighborhood);
        $('input[name="state"]').val(retornoCep.state);
    });
    
    $('.btn[data-action="enviar"]').on('click', function () {
        const email = $('.modal__step--active input[name="email"]').val()
        const phone = $('.modal__step--active input[name="phone"]').val()
        const firstName = $('.modal__step--active input[name="firstName"]').val()
        const lastName = $('.modal__step--active input[name="lastName"]').val()
        const zip = $('.modal__step--active input[name="zip"]').val()
        const address1 = $('.modal__step--active input[name="address1"]').val()
        const address2 = $('.modal__step--active input[name="address2"]').val()
        const state = $('.modal__step--active input[name="state"]').val()

        if(email === '') {
            alert('Preencha o campo de email')
            $('input[name="email"]').focus();
            return
        }

        if(phone === '') {
            alert('Preencha o campo de telefone')
            $('input[name="phone"]').focus();
            return
        }

        if(firstName === '') {
            alert('Preencha o campo de nome')
            $('input[name="firstName"]').focus();
            return
        }

        if(lastName === '') {
            alert('Preencha o campo de sobrenome')
            $('input[name="lastName"]').focus();
            return
        }

        if(zip === '') {
            alert('Preencha o campo de cep')
            $('input[name="zip"]').focus();
            return
        }

        if(address1 === '') {
            alert('Preencha o campo de rua')
            $('input[name="address1"]').focus();
            return
        }

        if(address2 === '') {
            alert('Preencha o campo de bairro')
            $('input[name="address2"]').focus();
            return
        }

        if(state === '') {
            alert('Preencha o campo de estado')
            $('input[name="state"]').focus();
            return
        }

        const dadosCliente = {
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            zip: zip,
            address1: address1,
            address2: address2,
            state: state,
            cartao: cartao,
            cpf: cpf
        }

        cadastroClienteMaxipago(dadosCliente)
    })
}

async function cadastroClienteMaxipago(dadosCliente) {
    try {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const idFilial = localStorage.getItem('idFilial');
        const codCli = localStorage.getItem('codCli');

        const apiURL = `https://cmexxfab.com.br/api-homol/api/pagamento/cliente`;

        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'email': dadosCliente.email,
                'phone': dadosCliente.phone,
                'firstName': dadosCliente.firstName,
                'lastName': dadosCliente.lastName,
                'codcli': codCli,
                'idfilial': idFilial,
                'address1': dadosCliente.address1,
                'address2': dadosCliente.address2,
                'state': dadosCliente.state,
                'zip': dadosCliente.zip,
                'country': 'BR'
            })
        });

        // Se a resposta não for OK, capturar o erro detalhado
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();

        cadastroCartao(data.customerId, dadosCliente.cartao, dadosCliente.cpf);

    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        alert("Erro ao adicionar produto: " + error.message);
    }
}

async function cadastroCartao(customerId, cartao, cpf) {
    try {
        const accessToken = localStorage.getItem('access_token');
        const coligadaId = localStorage.getItem('coligadaId');
        const idFilial = localStorage.getItem('idFilial');
        const codCli = localStorage.getItem('codCli');
        const expMonth = cartao.validade.split('/')[0];
        const expYear = '20' + cartao.validade.split('/')[1];

        localStorage.setItem('codigoMaxiPago', customerId);

        const apiURL = `https://cmexxfab.com.br/api-homol/api/pagamento/cartao/autoriza-salva/${customerId}`;

        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligadaId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'number': cartao.numCartao,
                'expMonth': expMonth,
                'expYear': expYear,
                'cvvNumber': cartao.cvv,
                'codcli': codCli,
                'idfilial': idFilial,
            })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();

        if(data.processorMessage == 'VERIFIED' || data.processorMessage == 'APPROVED') {
            localStorage.setItem('cartaoFinal', cartao.numCartao.slice(-4));
            checkCartao()
            modalSuccess('Cartão cadastrado com sucesso!');
        }
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        alert("Erro ao adicionar produto: " + error.message);
    }
}

function checkCartao() {
    const cartao = localStorage.getItem('cartaoFinal')
    if(cartao !== null) {
        $('.forma-pagamento__row').removeClass('forma-pagamento__row--sem-cartao');
        $('.forma-pagamento__row > span > span').text('XXXX XXXX XXXX ' + cartao);
    }
}

async function gerarBoleto(idlan) {
    const accessToken = localStorage.getItem('access_token');
    const coligada = localStorage.getItem('coligadaId');
    const baseUrl = 'https://cmexxfab.com.br/api-homol';
    const endpoint = `/api/cliente/financeiro/fatura/boleto`;
    const queryParams = `?idlan=${idlan}&codcoligada=${coligada}`;
    const url = baseUrl + endpoint + queryParams;

    if (!accessToken) {
        alert('Usuário não autenticado. Por favor, faça login.');
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Coligada: coligada,
                contentType: 'application/pdf'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        modalSuccess('Boleto gerado com sucesso')

        const blob = await response.blob();
        const boletoUrl = URL.createObjectURL(blob);
        
        setTimeout(() => {
            window.open(boletoUrl, '_blank');
        }, 1000)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function detectarBandeira(numero) {
    const clean = numero.replace(/\D/g, '');
    const bandeiras = {
      Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      MasterCard: /^5[1-5][0-9]{14}$/,
      Amex: /^3[47][0-9]{13}$/,
      Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      Diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      JCB: /^(?:2131|1800|35\d{3})\d{11}$/
    };

    for (let bandeira in bandeiras) {
      if (bandeiras[bandeira].test(clean)) {
        if(bandeira == 'Amex') {
            bandeira = {nome: 'Amex', src: 'https://img.icons8.com/color/73/000000/amex.png'}
        }
        if(bandeira == 'Diners') {
            bandeira = {nome: 'Diners', src: 'https://img.icons8.com/color/73/000000/diners-club.png'}
        }
        if(bandeira == 'JCB') {
            bandeira = {nome: 'JCB', src: 'https://img.icons8.com/color/73/000000/jcb.png'}
        }
        if(bandeira == 'Discover') {
            bandeira = {nome: 'Discover', src: 'https://img.icons8.com/color/73/000000/discover.png'}
        }
        if(bandeira == 'MasterCard') {
            bandeira = {nome: 'MasterCard', src: 'https://img.icons8.com/color/73/000000/mastercard.png'}
        }
        if(bandeira == 'Visa') {
            bandeira = {nome: 'Visa', src: 'https://img.icons8.com/color/73/000000/visa.png'}
        }

        return bandeira;
      }
    }
    return 'Desconhecida';
}

function validarCartaoLuhn(numero) {
    const clean = numero.replace(/\D/g, '');
    let soma = 0;
    let alternar = false;

    for (let i = clean.length - 1; i >= 0; i--) {
        let n = parseInt(clean.charAt(i));
        if (alternar) {
        n *= 2;
        if (n > 9) n -= 9;
        }
        soma += n;
        alternar = !alternar;
    }

    return (soma % 10 === 0);
}

function validarCpf(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
}

async function cep(cep) {
    cep = cep.replace(/\D/g, '');

    try {
        const response = await $.ajax({
            url: `https://brasilapi.com.br/api/cep/v1/${cep}`,
            type: "GET",
            dataType: "json"
        });
        return response;
    } catch (error) {
        return false;
    }
}