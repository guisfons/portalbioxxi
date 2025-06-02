<?php
    /**
     * Template Name: Histórico de Produto Cadastrado
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
                <span>Código Marcação</span>
                <input type="text" name="marcacao" id="marcacao" placeholder="Digite o número">
            </label>
            <label>
                <span>Exibir Descartados</span>
                <span><input type="radio" name="descartados" id="sim" value="S" checked>Sim</span>
                <span><input type="radio" name="descartados" id="nao" value="N">Não</span>
            </label>
            <button type="button" class="btn btn--green">Buscar</button>
        </div>
    </section>
    <hr/>
    <section class="wrapper table">
        <table>
            <thead>
                <tr>
                    <td>ID Do Produto</td>
                    <td>Nome do Produto</td>
                    <td>N° da Marcação</td>
                    <td>N° registro Anvisa</td>
                    <td>Data de Descarte</td>
                    <td>Validade</td>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </section>
<?php
    get_footer();