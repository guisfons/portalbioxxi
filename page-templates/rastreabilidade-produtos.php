<?php
    /**
     * Template Name: Rastreabilidade dos Produtos
     * Template Post Type: page
     *
     * @package UAU
     * @since 1.0.0
     */

    get_header();
?>
    <section class="wrapper content heading heading--rastreabilidade">
        <h1><?php echo get_the_title(); ?></h1>

        <div class="heading__tabs">
            <span class="heading__tab heading__tab--active" data-tab="cliente">Cliente</span>
            <span class="heading__tab" data-tab="pedido">Pedido</span>
            <span class="heading__tab" data-tab="memorando">Memorando de Retorno</span>
            <span class="heading__tab" data-tab="memorando-coleta">Memorando de Coleta</span>
        </div>

        <div class="heading__filtro heading__filtro--active" data-tab="cliente">
            <label>
                <span>Setor</span>
                <select name="setor" id="setor">
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

        <div class="heading__filtro" data-tab="pedido">
            <label>
                <span>Pedido</span>
                <input type="tel" name="pedido" id="pedido" placeholder="Insira o número do pedido">
            </label>
            <label>
                <span>Ano pedido</span>
                <input type="text" name="ano-pedido" id="ano-pedido" disabled>
            </label>

            <button type="button" class="btn btn--green">Buscar</button>
        </div>

        <div class="heading__filtro" data-tab="memorando">
            <label>
                <span>Número do Memorando de Retorno</span>
                <input type="tel" name="memorando" id="memorando" placeholder="Insira o número do memorando">
            </label>
            
            <button type="button" class="btn btn--green">Buscar</button>
        </div>

        <div class="heading__filtro" data-tab="memorando-coleta">
            <label>
                <span>Número do Memorando de Coleta</span>
                <input type="tel" name="memorando-coleta" id="memorando-coleta" placeholder="Insira o número do memorando">
            </label>
            
            <button type="button" class="btn btn--green">Buscar</button>
        </div>
    </section>
    <hr/>
    <section class="wrapper table">
        <table>
            <thead>
                <tr>
                    <td>Pedido</td>
                    <td>Memo. entrada</td>
                    <td>Unidade</td>
                    <td>Situação</td>
                    <td>Setor</td>
                    <td>Data <br/> Envio</td>
                    <td>Data <br/> Coleta</td>
                    <td>Data <br/> Pedido</td>
                    <td>Data <br/> Chegada</td>
                    <td>Cortesia</td>
                    <td>KIT</td>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </section>
<?php
    get_footer();