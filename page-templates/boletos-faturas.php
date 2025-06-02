<?php
    /**
     * Template Name: Boletos e Faturas
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
                <span>Período</span>
                <input type="date" name="periodo-inicio" id="periodo-inicio" placeholder="Período de...">
                <span>até</span>
                <input type="date" name="periodo-fim" id="periodo-fim" placeholder="Período de...">
            </label>
            
            <button type="button" class="btn btn--green">Buscar</button>
        </div>
    </section>
    <section class="wrapper table">
        <table>
            <thead>
                <tr>
                    <!-- <td><input type="checkbox" name="selectall" id="selectall"></td> -->
                    <td>Mês</td>
                    <td>Documento</td>
                    <td>Vencimento</td>
                    <td>Status</td>
                    <td>Valor</td>
                    <td>Ações arquivos</td>
                </tr>
                <tbody></tbody>
            </thead>
        </table>
    </section>
    <!-- <section class="wrapper baixar-arquivos">
        <h2>Baixar arquivos selecionados</h2>
        <button class="btn btn--blue">Arquivos selecionados</button>
    </section> -->
    <hr/>
<?php
    get_footer();