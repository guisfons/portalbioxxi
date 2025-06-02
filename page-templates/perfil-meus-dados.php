<?php
    /**
     * Template Name: Perfil | Meus Dados
     * Template Post Type: page
     *
     * @package UAU
     * @since 1.0.0
     */

    get_header();
?>
	<section class="content heading">
		<h1><?php echo get_the_title(); ?></h1>
	</section>
	<section class="dados-empresa">
		<h2>Dados da Empresa</h2>
		
		<label for="empresa" class="inactive">
			<span>Empresa</span>
			<input type="text" id="empresa" placeholder="Empresa" value="Empresa" disabled>
		</label>

		<label for="CNPJ" class="inactive">
			<span>CNPJ</span>
			<input type="text" id="CNPJ" placeholder="00.000.000.0000-00" value="00.000.000.0000-00" disabled>
		</label>

		<label for="emailprincipal" class="inactive">
			<span>E-mail principal</span>
			<input type="email" id="emailprincipal" placeholder="email@email.com" value="email@email.com" disabled>
		</label>

		<label for="telefoneprincipal" class="inactive">
			<span>Telefone principal</span>
			<input type="text" id="telefoneprincipal" placeholder="(00) 00000-0000" value="(00) 00000-0000" disabled>
		</label>

		<!-- <button type="button" class="btn btn--green">Editar</button> -->
	</section>

	<section class="contatos">
		<h2>Contatos</h2>

		<div class="contatos__container">
		</div>

	</section>
<?php
	get_footer();