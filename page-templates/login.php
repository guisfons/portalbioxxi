<?php
    /**
     * Template Name: Login
     * Template Post Type: page
     *
     * @package UAU
     * @since 1.0.0
     */

    get_header();
?>
	<section class="wrapper login">
		<h2>Faça seu login</h2>
		<p>Utilize o código alpha que você recebeu por e-mail para fazer seu login e definir sua senha.</p>

		<form class="login__form">
			<label for="usuario">
				<span>Usuário</span>
				<input type="text" name="usuario" id="usuario" placeholder="Insira aqui seu usuário" required>
			</label>
			<label for="senha">
				<span>Senha</span>
				<input type="password" name="senha" id="senha" placeholder="Insira aqui sua senha" required>
			</label>

			<button class="login__senha" type="button">Esqueci minha senha</button>
			<input type="submit" value="Entrar" class="btn btn--green">
		</form>
	</section>

	<section class="wrapper esqueci-senha" style="display: none;">
		<h2>Esqueci minha senha</h2>

		<p>Entre em contato com a Bioxxi para redefinir sua senha. <br> Atendemos das 8:00hs às 17:48hs, de segunda à sexta.</p>

		<a href="<?= get_field('whatsapp', 'option'); ?>" target="_blank" title="WhatsApp" class="esqueci-senha__whatsapp">
			<img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/whatsapp.svg'); ?>" alt="WhatsApp">
			Fale conosco no WhatsApp
		</a>
	</section>
<?php
    get_footer();