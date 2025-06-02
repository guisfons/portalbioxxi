<?php
    /**
     * Template Name: FAQ
     * Template Post Type: page
     *
     * @package UAU
     * @since 1.0.0
     */

    get_header();
?>
    <section class="wrapper content heading">
        <h1><?php echo get_the_title(); ?></h1>
        <span>Escolha um assunto e tire suas dúvidas. </span>
    </section>
    
    <section class="wrapper faq">
        <?php if ( have_rows( 'duvidas' ) ) : ?>
            <?php while ( have_rows( 'duvidas' ) ) :
                the_row();
                $titulo = get_sub_field( 'titulo' );
                $icone = get_sub_field( 'icone' );
                ?>
                <button class="faq__button" type="button" data-subject="<?php echo esc_html( $titulo ); ?>">
                    <span>Dúvidas sobre</span>
                    <strong><?php echo esc_html( $titulo ); ?></strong>
                    <figure><?= wp_get_attachment_image( $icone, 'full' ); ?></figure>
                </button>
            <?php endwhile; ?>
        <?php endif; ?>
    </section>

    <?php if ( have_rows( 'duvidas' ) ) : ?>
        <?php while ( have_rows( 'duvidas' ) ) :
            the_row();
            $titulo = get_sub_field( 'titulo' );
            $icone = get_sub_field( 'icone' );
            ?>
            <section class="wrapper faq__container" data-subject="<?php echo esc_html( $titulo ); ?>">
                <div class="faq__head">
                    <figure><?= wp_get_attachment_image( $icone, 'full' ); ?></figure>
                    <article>
                        <p>Tire suas dúvidas sobre</p>
                        <span><?php echo esc_html( $titulo ); ?></span>
                    </article>
                    <button type="button" class="faq__back">
                        <span>Retornar para a <br> página principal</span>
                        <figure><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/back.svg'); ?>" alt="Retornar para a página principal"></figure>
                    </button>
                </div>
                <div class="wrapper faq__content">
                    <?php if ( have_rows( 'categoria' ) ) : ?>
                        <?php while ( have_rows( 'categoria' ) ) :
                            the_row();
                            $pergunta = get_sub_field( 'pergunta' );
                            $resposta = get_sub_field( 'resposta' );
                            ?>
                            <div class="faq__card">
                                <h3><?php echo esc_html( $pergunta ); ?></h3>
                                <article><?php echo $resposta; ?></article>
                            </div>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </div>
            </section>
        <?php endwhile; ?>
    <?php endif; ?>

    
    <hr/>
<?php
    get_footer();