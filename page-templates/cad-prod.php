<?php
    /**
     * Template Name: Ficha de Cadastro de Produto
     * Template Post Type: page
     *
     * @package UAU
     * @since 1.0.0
     */

    get_header();
?>
    <section class="wrapper content heading">
        <h1><?php echo get_the_title(); ?></h1>

        <!-- <div class="heading__filtro">
            <label>
                <span>Período</span>
                <input type="date" name="periodo-inicio" id="periodo-inicio" placeholder="Período de...">
                <span>até</span>
                <input type="date" name="periodo-fim" id="periodo-fim" placeholder="Período de...">
                <button class="help" data-text="Período máximo de consulta é de 30 dias"><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/question.svg'); ?>" alt="Período máximo de consulta é de 30 dias"></button>
            </label>
            <label>
                <span>Cliente</span>
                <select name="clientes" id="clientes">
                    <option value="" selected disabled>Selecione o cliente</option>
                </select>
            </label>
            <label>
                <span>Nome</span>
                <input type="text" name="nome" id="nome" placeholder="Procure pelo nome">
            </label>
            <label>
                <span>Etiqueta</span>
                <input type="text" name="etiqueta" id="etiqueta" placeholder="Insira a etiqueta">
            </label>
            <label>
                <span>Situacao</span>
                <select name="situacao" id="situacao">
                    <option value="" selected disabled>Selecione a situação</option>
                    <option value="">Vazio</option>
                    <option value="1">Pendente</option>
                    <option value="2">Aprovado pelo Cliente</option>
                    <option value="3">Reprovado</option>
                    <option value="4">Aprovado pela BIOXXI</option>
                    <option value="5">Contém item Reprovado</option>
                </select>
            </label>
            
            <button type="button" class="btn btn--green" data-acao="buscar">Buscar</button>
        </div> -->
    </section>
    <section class="wrapper content cadastro-produto">
        <h2>Cadastrar novo produto</h2>
        <button class="btn btn--blue">Novo produto</button>
    </section>
    <hr/>
    <section class="wrapper table table--lista">
        <table>
            <thead>
                <tr>
                    <td>Produto</td>
                    <td>N° Anvisa</td>
                    <td>Criticidade</td>
                    <td>Data Validade</td>
                    <td>Status</td>
                    <td>Informação adicional</td>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </section>
    <hr>
    <section class="wrapper baixar-arquivos" style="display: none;">
        <h2>Disponível para download</h2>
        <button class="download download--excel"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/download-excel.svg'); ?>" alt="Download"></button>
        <button class="download download--pdf"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/download-excel.svg'); ?>" alt="Download"></button>
    </section>
    <section class="modals">
        <div class="modal" data-model="cadastro-produto" data-ficha>
            <div class="modal__heading">
                <h3>Novo produto: <span></span></h3>
                <button type="button" class="modal__close"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/close.svg'); ?>"></button>
            </div>
            <div class="modal__fields">
                <label>
                    <span>Nome produto <span></span></span>
                    <input type="text" name="nome-produto" id="nome-produto" placeholder="Insira o nome do produto">
                    <button type="button" class="btn btn--green btn--anvisa">Buscar na base da ANVISA</button>
                </label>
                <label>
                    <span>N° Anvisa/MS</span>
                    <input type="tel" name="anvisa" id="anvisa" placeholder="0000000000">
                </label>
                <label>
                    <span>Criticidade</span>
                    <select name="criticidade" id="criticidade">
                        <option value="" selected disabled>Selecione o nível</option>
                        <option value="3">Crítico</option>
                        <option value="2">Semicrítico</option>
                        <option value="1">Não Crítico</option>
                    </select>
                    <button class="help" data-text=""><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/question.svg'); ?>" alt="Criticidade"><span><ul><li>Críticos: São produtos para a saúde utilizados em procedimentos invasivos com penetração de pele e mucosas adjacentes, tecidos subepteliais, e sistema vascular, incluindo também todos os produtos para saúde que estejam diretamente conectados com esses sistemas.</li><li>Semicríticos: São produtos que entram em contato com a pele não íntegra ou mucosas íntegras colonizadas.</li><li>Não Críticos: São produtos que entram em contato com a pele íntegra ou não entram em contato com paciente.</li></ul></span></button>
                </label>
                <label>
                    <span>Validade</span>
                    <input type="date" name="validade" id="validade">
                </label>
                <label>
                    <span><input type="checkbox" name="validade_indeterminada" id="validade_indeterminada" value="validade_indeterminada">Indeterminada</span>
                </label>
                <button type="button" class="btn btn--green btn--adicionar">Adicionar</button>
            </div>
            <section class="wrapper table">
                <table>
                    <thead>
                        <tr>
                            <td>Produto</td>
                            <td>N° Anvisa</td>
                            <td>Criticidade</td>
                            <td>Data Validade</td>
                            <td>Status</td>
                            <td>Ação</td>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </section>

            <div class="modal__actions">
                <button type="button" class="btn btn--green" data-acao="aprovar">Aprovar</button>
            </div>
        </div>
        <div class="modal" data-model="produtos">
            <div class="modal__heading">
                <h3>Selecione o produto desejado: </h3>
                <button type="button" class="modal__close"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/close.svg'); ?>"></button>
            </div>
            <div class="modal__content">
                
            </div>
        </div>
        <div class="modal" data-model="item-conjunto">
            <div class="modal__heading">
                <h3>ÍTENS DO CONJUNTO</h3>
                <button type="button" class="modal__close"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/close.svg'); ?>"></button>
            </div>

            <div class="modal__fields">
                <label>
                    <span>Sub ítem</span>
                    <input type="text" name="sub_item" id="sub_item" placeholder="Insira o nome do sub ítem">
                    <button type="button" class="btn btn--green btn--anvisa">Buscar na base da anvisa</button>
                </label>
                <label>
                    <span>N° Anvisa/MS</span>
                    <input type="tel" name="n_anvisa" id="n_anvisa" placeholder="0000000000">
                </label>
                <button type="button" class="btn btn--green btn--confirmar" data-acao="add-sub-item">Confirmar</button>
            </div>

            <div class="table">
                <table>
                    <thead>
                        <tr>
                            <td>Produto</td>
                            <td>N° Anvisa</td>
                            <td>Ação</td>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        <div class="modal" data-model="termos-condicoes">
            <div class="modal__heading">
                <h3>Termos e Condições</h3>
                <button type="button" class="modal__close"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/close.svg'); ?>"></button>
            </div>

            <article class="modal__content">
                <p><strong>Por favor, leia e concorde com os termos:</strong></p>
                <p>O Contratante atesta para os devidos fins que as informações inseridas neste documento são verídicas e que os produtos listados são devidamente regularizados junto à ANVISA, encontram-se dentro do seu prazo de validade, não constam na lista da Resolução RE nº 2.605/2006 da ANVISA, nem tampouco possuem em seu rótulo os dizeres "Proibido Reprocessar" definido por parte de seus respectivos fabricantes.</p>

                <label>
                    <input type="checkbox" name="termos" id="termos">
                    <span>Li e concordo com os termos</span>
                </label>
            </article>

            <div class="modal__actions">
                <button type="button" class="btn btn--gray" data-acao="confirmar" disabled>Confirmar</button>
            </div>
        </div>
        <div class="modal" data-model="assinatura">
            <div class="modal__heading">
                <h3>Assinatura</h3>
                <button type="button" class="modal__close"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/close.svg'); ?>"></button>
            </div>

            <article class="modal__content">
                <label>
                    <span>Nome completo</span>
                    <input type="text" name="nome" id="nome" placeholder="Insira o seu nome completo" required>
                </label>
                <label>
                    <span>CPF</span>
                    <input type="tel" name="cpf" id="cpf" placeholder="000.000.000-00" required>
                </label>
            </article>

            <div class="modal__actions">
                <button type="button" class="btn btn--gray" data-acao="voltar">Voltar</button>
                <button type="button" class="btn btn--green" data-acao="salvar">Salvar</button>
            </div>
        </div>
    </section>
<?php
    get_footer();