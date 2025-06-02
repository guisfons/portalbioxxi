<?php
    /**
     * Template Name: Histórico de Cadastro 
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
                <span>Cliente</span>
                <input type="tel" name="cliente" id="cliente" placeholder="ID do cliente">
            </label>
            <label>
                <span>Marcacao</span>
                <input type="text" name="marcacao" id="marcacao" placeholder="Código de Marcação">
            </label>
            <label>
                <span>Descarte</span>
                <select name="descartados" id="descartados">
                    <option value="S">Sim</option>
                    <option value="N">Não</option>
                </select>
            </label>
            <button type="button" class="btn btn--green">Buscar</button>
        </div>
    </section>
    <hr/>
    <section class="wrapper table">
        <table>
            <thead>
                <tr>
                <td>Produto</td>
                <td>Marcação</td>
                <td>ID Produto</td>
                <td>Registro Anvisa</td>
                <td>Data de Fabricação</td>
                <td>Data de Descarte</td>
                <td>Ação</td>
                </tr>
                <tbody>
                    
                </tbody>
            </thead>
        </table>
    </section>
    <hr>
    <section class="wrapper baixar-arquivos">
        <h2>Disponível para download</h2>
        <button class="download download--excel"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/download-excel.svg'); ?>" alt="Download"></button>
        <button class="download download--pdf"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/download-pdf.svg'); ?>" alt="Download"></button>
    </section>
<?php
    get_footer();