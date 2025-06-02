$(document).ready(() => {
    meusDados()
    meusContatos()
    actions()

    let tiposContatoGlobal = []; // Variável global para armazenar os tipos de contato
})

function meusDados() {
    const accessToken = localStorage.getItem('access_token');
    const apiURL = `https://cmexxfab.com.br/api-homol/api/usuario/profile`;

    const empresa = $('#empresa');
    const cnpj = $('#CNPJ');
    const email = $('#emailprincipal');
    const telefone = $('#telefoneprincipal');

    fetch(apiURL, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados`);
            }
            return response.json();
        })
        .then(data => {
            empresa.val(data.nome || '');
            cnpj.val(data.coligadas?.[0]?.cnpj || '');
            email.val(data.email || '');
            telefone.val(data.celular || '');
        })
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
            alert('Erro ao carregar os dados. Verifique o console para mais detalhes.');
        });
}

async function meusContatos() {
    const accessToken = localStorage.getItem('access_token');
    const filiais = JSON.parse(localStorage.getItem('filiais'));

    filiais.forEach(filial => {
        idFilial = filial.idfilial;
        codCli = filial.codcli;

        contatos(accessToken, idFilial, codCli);
    });

    masks()
}

async function contatos(accessToken, idFilial, codCli) {
    const apiContatos = `https://cmexxfab.com.br/api-homol/api/cliente/contato?codcli=${codCli}&idfilial=${idFilial}`;
    const apiTiposContato = `https://cmexxfab.com.br/api-homol/api/cliente/contato/tipos-contato`;

    try {
        // Buscar os contatos
        const responseContatos = await fetch(apiContatos, {
            method: 'GET',
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!responseContatos.ok) {
            window.location.href = '/login';
            return
        }
        const contatos = await responseContatos.json();

        // Buscar os tipos de contato
        const responseTipos = await fetch(apiTiposContato, {
            method: 'GET',
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!responseTipos.ok) throw new Error('Erro ao buscar tipos de contato');
        const tiposContato = await responseTipos.json();
        tiposContatoGlobal = tiposContato; // Armazena globalmente

        // Criar um mapa de tipos de contato
        const mapaTipos = {};
        tiposContato.forEach(tipo => {
            mapaTipos[tipo.id] = tipo.descricao;
        });

        // Selecionar o container onde os contatos serão inseridos
        const contatosContainer = $('.contatos__container');
        contatosContainer.append('<div class="contatos__filial" data-id="' + idFilial + '" data-codcli="' + codCli + '"></div>');
        contatosContainer.find('.contatos__filial[data-id="' + idFilial + '"]').append ('<h3 class="contatos__title">' + idFilial + '</h3>')

        // Criar os elementos dinamicamente
        contatos.forEach((contato, index) => {
            const tipoDescricao = mapaTipos[contato.tipo_contato] || 'Não especificado';
            const contatoHTML = `
                <div class="contatos__row" data-index="${index}" data-id="${contato.id}">
                    <label for="nome${index}">
                        <span>Nome</span>
                        <input type="text" id="nome${index}" placeholder="Nome" value="${contato.nome || ''}" disabled>
                    </label>
                    <label for="telefone${index}">
                        <span>Telefone</span>
                        <input type="tel" id="telefone${index}" placeholder="(00) 00000-0000" value="${contato.celular || ''}" disabled>
                    </label>
                    <label for="email${index}">
                        <span>E-mail</span>
                        <input type="email" id="email${index}" placeholder="email@email.com" value="${contato.email || ''}" disabled>
                    </label>
                    <label for="tipocontato${index}">
                        <span>Tipo de contato</span>
                        <select id="tipocontato${index}" disabled>
                            <option selected disabled>Escolha uma opção</option>
                            ${tiposContato.map(tipo => `<option value="${tipo.id}">${tipo.descricao}</option>`).join('')}
                        </select>
                    </label>
                    <div class="contatos__row--actions">
                        <button data-action="remover" class="btn btn--red">Remover</button>
                        <button data-action="editar" class="btn btn--blue">Editar</button>
                        <button data-action="salvar" class="btn btn--green" style="display: none;">Salvar</button>
                    </div>
                </div>
            `;

            contatosContainer.find('.contatos__filial[data-id="' + idFilial + '"]').append(contatoHTML);

            if(contato.tipo_contato !== null) {
                contatosContainer.find('.contatos__row[data-index="' + index + '"] select option[value="' + contato.tipo_contato.id + '"]').attr('selected', 'selected');
            }
        });

        // Adiciona o botão de adicionar contato
        contatosContainer.find('.contatos__filial[data-id="' + idFilial + '"]')
        .append(`<button data-action="add-contato" class="btn btn--green">Adicionar contato</button>`);

    } catch (error) {
        console.error(error);
        alert('Erro ao carregar contatos.');
    }
}

function actions() {
    $(document).on('click', '.btn', function () {
        const action = $(this).data('action');

        if (action === 'salvar') {
            salvarContato($(this));
            return;
        }

        if (action === 'editar') {
            editarContato($(this));
            masks()
            return;
        }

        if (action == 'add-contato') {
            addContato($(this));
            return
        }

        if(action == 'remover') {
            removerContato($(this));
            return
        }
    });
}

function addContato(btn) {    
    const filial = btn.closest('.contatos__filial')
    const lastContato = filial.find('.contatos__row:last-of-type')
    const index = lastContato.length ? lastContato.data('index') + 1 : 0; // Corrige caso não haja contatos ainda

    const contatoHTML = `
        <div class="contatos__row contatos__row--not-saved" data-index="${index}">
            <label for="nome${index}">
                <span>Nome</span>
                <input type="text" id="nome${index}" placeholder="Nome">
            </label>
            <label for="telefone${index}">
                <span>Telefone</span>
                <input type="tel" id="telefone${index}" placeholder="(00) 00000-0000">
            </label>
            <label for="email${index}">
                <span>E-mail</span>
                <input type="email" id="email${index}" placeholder="email@email.com">
            </label>
            <label for="tipocontato${index}">
                <span>Tipo de contato</span>
                <select id="tipocontato${index}">
                    <option selected disabled>Escolha uma opção</option>
                    ${tiposContatoGlobal.map(tipo => `<option value="${tipo.id}">${tipo.descricao}</option>`).join('')}
                </select>
            </label>
            <div class="contatos__row--actions">
                <button data-action="remover" class="btn btn--red">Remover</button>
                <button data-action="editar" class="btn btn--blue" style="display: none;">Editar</button>
                <button data-action="salvar" class="btn btn--green">Salvar</button>
            </div>
        </div>
    `;

    lastContato.after(contatoHTML);
    masks()
}

function editarContato(btn) {
    btn.hide()
    btn.siblings('.btn[data-action="salvar"]').show();
    const contato = btn.closest('.contatos__row');
    contato.find('input, select').prop('disabled', false);
}

function salvarContato(btn) {
    const row = $(btn).closest('.contatos__row');
    const id = row.data('id');
    const index = row.data('index');

    const nome = row.find('#nome' + index).val();
    const email = row.find('#email' + index).val();
    const celular = row.find('#telefone' + index).val();
    const id_tipo_contato = row.find('#tipocontato' + index).val();

    if (!nome || !email || !celular || !id_tipo_contato) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    let contato = {
        ...(id !== undefined && { id }),
        nome: nome,
        email: email,
        celular: celular,
        carimbo: "N",
        tipo: "P",
        id_tipo_contato: Number(id_tipo_contato)
    };

    const accessToken = localStorage.getItem('access_token');
    const coligadaId = localStorage.getItem('coligadaId');
    const codCli = btn.closest('.contatos__filial').data('codcli');
    const idFilial = btn.closest('.contatos__filial').data('id');

    const payload = {
        contatos: [contato]
    };

    fetch(`https://cmexxfab.com.br/api-homol/api/cliente/contato/?codcli=${codCli}&idfilial=${idFilial}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Coligada': coligadaId
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) throw new Error(`Erro ao salvar contato: ${response.status}`);
        return response.json();
    })
    .then(function() {
        alert('Dados salvos com sucesso!')
        console.log(response.json());
    })
    .catch(error => {
        console.error('Erro ao salvar contato:', error);
        alert('Erro ao salvar contato.');
    });
}

function removerContato(btn) {
    const contato = btn.closest('.contatos__row');
    
    if(btn.closest('.contatos__row').hasClass('contatos__row--not-saved')) {
        contato.remove();
        return;
    }

        
}