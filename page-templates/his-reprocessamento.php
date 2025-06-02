<?php
    /**
     * Template Name: Histórico de Reprocessamento
     * Template Post Type: page
     *
     * @package UAU
     * @since 1.0.0
     */

    get_header();
?>
    <section class="wrapper content heading">
        <h1><?php echo get_the_title(); ?></h1>

        <div class="heading__filtro">
            <label>
                <span>Setores</span>
                <select name="setores" id="setores">
                    <option value="" selected disabled>Selecione o setor</option>
                </select>
            </label>
            <label>
                <span>Período</span>
                <input type="date" name="periodo-inicio" id="periodo-inicio" placeholder="Período de...">
                <span>até</span>
                <input type="date" name="periodo-fim" id="periodo-fim" placeholder="Período de...">
                <button class="help" data-text="Período máximo de consulta é de 30 dias"><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/question.svg'); ?>" alt="Período máximo de consulta é de 30 dias"></button>
            </label>
            <label>
                <span>Artigo</span>
                <input type="text" name="artigo" id="artigo" placeholder="Insira o nome do artigo">
            </label>
            <label>
                <span>Código Marcação</span>
                <input type="text" name="marcacao" id="marcacao" placeholder="Digite o código">
            </label>
            <label>
                <span>Qtde de Reprocessamento</span>
                <input type="number" name="qtdreprocessamento" id="qtdreprocessamento" placeholder="Digite a quantidade">
            </label>
            
            <button type="button" class="btn btn--green">Buscar</button>
        </div>
    </section>
    <hr/>
    <section class="wrapper table table--reprocessamento">
        <table>
            <thead>
                <tr>
                    <td>Cliente</td>
                    <td>Código Marcação</td>
                    <td>Artigo</td>
                    <td>Reprocessamentos</td>
                    <td>Limite de reprocessamento</td>
                    <td>Descarte</td>
                    <td>Ação</td>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </section>
    <hr>
    <div class="modal" data-model="artigos-reprocessados">
        <div class="modal__heading">
            <h3>Artigos Reprocessados</h3>
            <button type="button" class="modal__close"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/close.svg'); ?>"></button>
        </div>

        <section class="wrapper table table--reprocessamento-detalhes">
            <table>
                <thead>
                    <tr>
                        <td>Ano</td>
                        <td>Pedido</td>
                        <td>IT. Pedido</td>
                        <td>Quantidade <br> Reproc.</td>
                        <td>Paciente</td>
                        <td>Número Prontuário</td>
                        <td>Complemento</td>
                        <td>Data <br> Processamento</td>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </section>
    </div>

    <section class="wrapper baixar-arquivos">
        <h2>Disponível para download</h2>
        <button class="download download--excel"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/download-excel.svg'); ?>" alt="Download"></button>
        <button class="download download--pdf"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/download-excel.svg'); ?>" alt="Download"></button>
    </section>
<?php
    get_footer();