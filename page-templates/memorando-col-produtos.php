<?php
    /**
     * Template Name: Memorando de Coleta de Produtos
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
                <span>Cliente</span>
                <select name="clientes" id="clientes">
                    <option value="" selected disabled>Selecione o cliente</option>
                </select>
            </label>
            
            <button type="button" class="btn btn--green" data-action="buscar">Buscar</button>
        </div> -->
    </section>
    <hr/>
    <section class="wrapper content novo-memorando">
        <h2>Novo Memorando de Coleta</h2>
        <button class="btn btn--blue">Novo memorando de coleta</button>
    </section>
    <section class="modals">
        <div class="modal" data-model="novo-memorando">
            <div class="modal__heading">
                <h3>Novo memorando <span style="display: none;">IDMEMO: <span class="id-memorando"></span></span></h3>
                <button type="button" class="modal__close"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/close.svg'); ?>"></button>
            </div>
            
            <div class="modal__step modal__step--active" data-step="1">
                <label>
                    <span>Tipo de material</span>
                    <select name="material" id="material">
                        <option value="" selected disabled>Selecione o tipo de material</option>
                        <option value="S">Reprocessamento</option>
                        <option value="N">Manofaturado</option>
                    </select>
                </label>

                <div class="modal__step-actions">
                    <button type="button" class="btn btn--green" data-action="continuar">Continuar</button>
                </div>
            </div>
            <div class="modal__step" data-step="2">
                <div class="modal__fields modal__fields--active">
                    <label>
                        <span>Setor</span>
                        <select name="setor" id="setor">
                            <option value="" selected disabled>Selecione o setor</option>
                        </select>
                    </label>
                    <label>
                        <span>Coleta</span>
                        <input type="text" name="coleta" id="coleta" placeholder="00/00/0000 14:00" value="<?= date('d/m/Y H:i'); ?>" disabled>
                    </label>
                    <label>
                        <span>Observação</span>
                        <textarea name="observacao" id="observacao" placeholder="Insira uma observação"></textarea>
                    </label>

                    <div class="modal__step-actions">
                        <button type="button" class="btn btn--gray" data-action="voltar">Voltar</button>
                        <button type="button" class="btn btn--green" data-action="adicionar-memorando">Adicionar</button>
                    </div>
                </div>
                <div class="modal__fields modal__fields--2">
                    <label>
                        <span>Código Marcação</span>
                        <input type="text" name="codigomarcacao" id="codigomarcacao" placeholder="Insira o código de marcação">
                    </label>
                    <label>
                        <span>Produto</span>
                        <select name="produto" id="produto">
                            <option value="" selected disabled>Selecione o produto</option>
                        </select>
                    </label>
                    <label>
                        <span>Quantidade</span>
                        <input type="number" name="quantidade" id="quantidade" placeholder="Insira a quantidade">
                    </label>
                    <label>
                        <span>Paciente</span>
                        <input type="text" name="paciente" id="paciente" placeholder="Insira o nome do paciente">
                    </label>
                    <label>
                        <span>Médico</span>
                        <input type="text" name="medico" id="medico" placeholder="Insira o nome do médico">
                    </label>
                    <label>
                        <span>Observação</span>
                        <textarea name="observacao-item" id="observacao-item" placeholder="Insira uma observação"></textarea>
                    </label>
                    <div class="modal__step-actions">
                        <button type="button" class="btn btn--gray" data-action="voltar">Voltar</button>
                        <button type="button" class="btn btn--green" data-action="adicionar-item">Adicionar</button>
                    </div>
                </div>
                <div class="modal__table">
                    <div class="table">
                        <table>
                            <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>Código Marcação</td>
                                    <td>Produto</td>
                                    <td>Quantidade</td>
                                    <td>Paciente</td>
                                    <td>Médico</td>
                                    <td>Ação</td>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>

                    <div class="modal__step-actions">
                        <button type="button" class="btn btn--gray" data-action="cancelar">Cancelar</button>
                        <button type="button" class="btn btn--green" data-action="finalizar">Finalizar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal" data-model="conferir">
            <div class="modal__heading">
                <h3>Conferir peças do produto de id: <span data-id-produto></span></h3>
                <button type="button" class="modal__close"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/close.svg'); ?>"></button>
            </div>

            <div class="modal__tabs">
                <span class="modal__tab modal__tab--active" data-tab="keydot">Keydot</span>
                <span class="modal__tab" data-tab="manual">Manual</span>
            </div>

            <div class="modal__tab modal__tab--active" data-tab="keydot">
                <label>
                    <input type="text" placeholder="Clique aqui antes de realizar a leitura do keydot">
                </label>
                
                <button type="button" class="btn btn--green" data-action="adicionar-keydot">Adicionar</button>
            </div>

            <div class="modal__tab modal__tab--active" data-tab="manual">
                <label>
                    <span>Produto</span>
                    <input type="text" id="manual-produto" name="manual-produto" placeholder="Insira o nome do produto">
                </label>
                <label>
                    <span>Quantidade</span>
                    <input type="number" id="quantidade-produto" name="quantidade-produto" placeholder="0">
                </label>
                
                <button type="button" class="btn btn--green" data-action="adicionar-manual">Adicionar</button>
            </div>

            <div class="modal__table">

            </div>

            <div class="modal__step-actions">
                <button type="button" class="btn btn--gray" data-action="voltar-conferir">Voltar</button>
                <button type="button" class="btn btn--green" data-action="salvar-conferir">Salvar</button>
            </div>
        </div>

        <div class="modal" data-model="finalizar">
            <div class="modal__heading">
                <h3>Informe os responsáveis</h3>
                <button type="button" class="modal__close"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/close.svg'); ?>"></button>
            </div>
            <article class="modal__content">
                <label>
                    <span>Responsável pelo envio</span>
                    <input type="text" name="nome-responsavel" id="nome-responsavel" placeholder="Insira o nome do responsável" required>
                </label>
                <label>
                    <span>CPF do responsável</span>
                    <input type="tel" name="cpf-responsavel" id="cpf-responsavel" placeholder="Insira o número do CPF do responsável" required>
                </label>
            </article>

            <div class="modal__actions">
                <button type="button" class="btn btn--gray" data-action="cancelar">Cancelar</button>
                <button type="button" class="btn btn--green" data-action="enviar">Enviar</button>
            </div>
        </div>
    </section>
<?php
    get_footer();