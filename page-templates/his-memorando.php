<?php
    /**
     * Template Name: Histórico de Memorando de Coleta
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
                <span>Número do Memorando</span>
                <input type="text" name="num-memorando" id="num-memorando" placeholder="ID memorando de Entrega">
            </label>
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
            
            <button type="button" class="btn btn--green">Buscar</button>
        </div>
    </section>
    <hr/>
    <section class="wrapper table">
        <table>
            <thead>
                <tr>
                    <td>Memorando</td>
                    <td>Setor</td>
                    <td>Pedido</td>
                    <td>Emissão</td>
                    <td>Expedido</td>
                    <td>Ação</td>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </section>
    <div class="modal" data-model="memorando">
        <div class="modal__heading">
            <h3>Número do memorando: <span id="num-memorando"></span></h3>
            <button type="button" class="modal__close"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/close.svg'); ?>"></button>
        </div>

        <section class="wrapper table table--memorando">
            <table>
                <thead>
                    <tr>
                        <td>Produtos</td>
                        <td>Quantidade</td>
                        <td>Número do Pedido</td>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </section>
    </div>
    <hr>
    <section class="wrapper baixar-arquivos">
        <h2>Disponível para download</h2>
        <button class="download download--excel"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/download-excel.svg'); ?>" alt="Download"></button>
        <button class="download download--pdf"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/download-excel.svg'); ?>" alt="Download"></button>
    </section>
<?php
    get_footer();