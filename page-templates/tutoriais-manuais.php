<?php
    /**
     * Template Name: Tutoriais e Manuais
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
                <span>Pesquisa</span>
                <input type="text" name="pesquisa" placeholder="Pesquisar por...">
            </label>
            <label>
                <span>Ordenar por</span>
                <select name="ordem" id="ordem">
                    <option value="" selected>Selecione uma ordem</option>
                    <option value="asc">Ordem crescente</option>
                    <option value="desc">Ordem decrescente</option>
                </select>
            </label>
            <label>
                <span>Categoria</span>
                <select name="categoria" id="categoria">
                    <option value="" selected>Selecione uma categoria</option>
                </select>
            </label>
        </div>
    </section>
    <hr/>
    <section class="wrapper tutoriais-manuais"></section>
<?php
    get_footer();