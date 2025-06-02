<?php
    /**
     * Template Name: Perfil | Contrato Digital
     * Template Post Type: page
     *
     * @package UAU
     * @since 1.0.0
     */

    get_header();
?>
	<section class="wrapper content heading">
		<h1><?php echo get_the_title(); ?></h1>
	</section>
	<section class="wrapper contrato">
		<iframe class="contrato__iframe" src="https://wetzel.com.br/wp-content/uploads/2023/05/pdf-de-teste.pdf" frameborder="0"></iframe>
	</section>
<?php
	get_footer();