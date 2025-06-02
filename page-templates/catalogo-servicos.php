<?php
    /**
     * Template Name: Catalogo de Serviços
     * Template Post Type: page
     *
     * @package UAU
     * @since 1.0.0
     */

    get_header();
?>
    <section class="wrapper heading">
        <span>Catálogo de serviços</span>
    </section>
    <section class="content">
        <article>
            <?php
                if(get_field('titulo_logo')) {
                    echo '<h1><figure>'.wp_get_attachment_image(get_field('logo'), 'full').'</figure>'.get_field('titulo').'</h1>';
                } else {
                    echo '<h1>'.get_the_title().'</h1>';
                }

                the_content();
            ?>
        </article>
        <figure><?php echo get_the_post_thumbnail($post->ID, 'full'); ?></figure>
    </section>
    <section class="wrapper como-funciona">
        <h2>Como funciona</h2>
        <div class="como-funciona__container">
            <article><?php echo get_field('texto_como_funciona', 'option'); ?></article>
            <div class="como-funciona__etiquetas">
                <figure>
                    <?php echo wp_get_attachment_image(get_field('etiqueta_de_identificacao', 'option'), 'full'); ?>
                    <figcaption>Etiqueta de identificação</figcaption>
                </figure>
                <figure>
                    <?php echo wp_get_attachment_image(get_field('memorando_de_coleta', 'option'), 'full'); ?>
                    <figcaption>Memorando de coleta</figcaption>
                </figure>
            </div>
        </div>
        <div class="como-funciona__etapas">
            <div class="como-funciona__etapas-item"><figure><img src="<?php echo get_template_directory_uri(); ?>/assets/img/coleta/1.svg" alt="Etapa 1"></figure></div>
            <div class="como-funciona__etapas-item"><figure><img src="<?php echo get_template_directory_uri(); ?>/assets/img/coleta/2.svg" alt="Etapa 2"></figure></div>
            <div class="como-funciona__etapas-item"><figure><img src="<?php echo get_template_directory_uri(); ?>/assets/img/coleta/3.svg" alt="Etapa 3"></figure></div>
            <div class="como-funciona__etapas-item"><figure><img src="<?php echo get_template_directory_uri(); ?>/assets/img/coleta/4.svg" alt="Etapa 4"></figure></div>
            <div class="como-funciona__etapas-item"><figure><img src="<?php echo get_template_directory_uri(); ?>/assets/img/coleta/5.svg" alt="Etapa 5"></figure></div>
        </div>
    </section>
    
    <?php if(get_field('etapas')) { ?>
    <section class="content content--no-bg">
        <article><?php echo get_field('etapas'); ?></article>
    </section>
    <?php } ?>

    <section class="wrapper beneficios">
        <article>
            <h2>Benefícios</h2>
            <?php echo get_field('beneficios'); ?>
        </article>
        <?php if (have_rows('itens_beneficios')) : ?>
            <div class="beneficios__tabs">
            <?php while (have_rows('itens_beneficios')) : the_row(); ?>
            <div class="beneficios__tabs-item">
                <figure><?php echo wp_get_attachment_image(get_sub_field('icone'), 'full'); ?></figure>
                <article><?php the_sub_field('descricao'); ?></article>
            </div>
            <?php endwhile; ?>
        </div>
        <?php endif; ?>

    </section>
    
    <section class="wrapper duvida">
        <article><?php echo get_field('conteudo', 'option'); ?></article>
        <a href="<?php echo get_field('link', 'option')['url']; ?>" class="btn btn--blue">
            <?php echo get_field('link', 'option')['title']; ?>
            <figure><svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_325_4140)"><path d="M50.625 30.375V27H40.5V43.875H43.875V37.125H48.9375V33.75H43.875V30.375H50.625Z" fill="white"/><path d="M32.0625 43.875H25.3125V27H32.0625C33.4047 27.0015 34.6915 27.5353 35.6406 28.4844C36.5897 29.4335 37.1235 30.7203 37.125 32.0625V38.8125C37.1235 40.1547 36.5897 41.4415 35.6406 42.3906C34.6915 43.3397 33.4047 43.8735 32.0625 43.875ZM28.6875 40.5H32.0625C32.5099 40.4995 32.9388 40.3216 33.2552 40.0052C33.5716 39.6888 33.7495 39.2599 33.75 38.8125V32.0625C33.7495 31.6151 33.5716 31.1862 33.2552 30.8698C32.9388 30.5534 32.5099 30.3755 32.0625 30.375H28.6875V40.5Z" fill="white"/><path d="M18.5625 27H10.125V43.875H13.5V38.8125H18.5625C19.4572 38.8113 20.315 38.4553 20.9477 37.8227C21.5803 37.19 21.9363 36.3322 21.9375 35.4375V30.375C21.9365 29.4802 21.5806 28.6224 20.9479 27.9896C20.3151 27.3569 19.4573 27.001 18.5625 27ZM13.5 35.4375V30.375H18.5625L18.5642 35.4375H13.5Z" fill="white"/><path d="M37.125 23.6256V16.8756C37.131 16.6538 37.0889 16.4333 37.0015 16.2294C36.9141 16.0255 36.7835 15.8429 36.6188 15.6943L24.8063 3.88183C24.6577 3.71701 24.4752 3.58639 24.2712 3.49899C24.0673 3.41158 23.8468 3.36948 23.625 3.37558H6.75C5.8557 3.37821 4.99878 3.73463 4.36642 4.367C3.73405 4.99936 3.37763 5.85628 3.375 6.75058V47.2506C3.375 48.1457 3.73058 49.0041 4.36351 49.6371C4.99645 50.27 5.85489 50.6256 6.75 50.6256H33.75V47.2506H6.75V6.75058H20.25V16.8756C20.2526 17.7699 20.6091 18.6268 21.2414 19.2592C21.8738 19.8915 22.7307 20.248 23.625 20.2506H33.75V23.6256H37.125ZM23.625 16.8756V7.42558L33.075 16.8756H23.625Z" fill="white"/></g><defs><clipPath id="clip0_325_4140"><rect width="54" height="54" fill="white"/></clipPath></defs></svg></figure>
        </a>
    </section>
<?php
    get_footer();