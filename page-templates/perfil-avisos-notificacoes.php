<?php
    /**
     * Template Name: Perfil | Avisos e Notificações
     * Template Post Type: page
     *
     * @package UAU
     * @since 1.0.0
     */

    get_header();
?>
	<section class="wrapper quadro-avisos">
		<h2>Meus Avisos</h2>
		<div class="quadro-avisos__slider splide">
			<div class="splide__track">
				<div class="splide__list">
					<!-- <div class="quadro-avisos__card splide__slide">
						<figure><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/clip.svg'); ?>"></figure>
						<p>O portal esta em desenvolvimento e pode apresentar erros.</p>
					</div>
					<div class="quadro-avisos__card splide__slide">
						<figure><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/clip.svg'); ?>"></figure>
						<p>Seu boleto está próximo de vencer. Acesse no menu a opção Pagamentos no seu perfil e pague agora mesmo.</p>
					</div>
					<div class="quadro-avisos__card splide__slide">
						<figure><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/clip.svg'); ?>"></figure>
						<p>Atualizamos nosso Catálogo de Serviços. Fique por dentro das soluções em esterilização da Bioxxi.</p>
					</div>
					<div class="quadro-avisos__card splide__slide">
						<figure><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/clip.svg'); ?>"></figure>
						<p>Estamos com uma nova funcionalidade aqui no portal. Acesse no menu principal a opção Solicitar Coletas e veja como funciona.</p>
					</div>
					<div class="quadro-avisos__card splide__slide">
						<figure><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/clip.svg'); ?>"></figure>
						<p>Seu boleto venceu. Acesse no menu a opção Pagamentos no seu perfil e pague agora mesmo.</p>
					</div> -->
				</div>
			</div>
		</div>
	</section>
	<section class="wrapper notificacoes">
		<h2>Notificações</h2>
		<p>Receba as notificações no portal e no seu número de Whastapp</p>
		
		<div class="notificacoes__item">
			<span>Avisar sobre vencimento de boletos</span>
			
			<label for="boletos">
				<input type="checkbox" id="boletos" checked>
				<span></span>
			</label>
		</div>

		<div class="notificacoes__item">
			<span>Avisar sobre vencimento de boletos</span>
			
			<label for="boletos">
				<input type="checkbox" id="boletos" checked>
				<span></span>
			</label>
		</div>

		<div class="notificacoes__item">
			<span>Avisar sobre próximas faturas</span>
			
			<label for="faturas">
				<input type="checkbox" id="faturas" checked>
				<span></span>
			</label>
		</div>

		<div class="notificacoes__item">
			<span>Avisar sobre atualização de cadastro</span>
			
			<label for="cadastro">
				<input type="checkbox" id="cadastro" checked>
				<span></span>
			</label>
		</div>

		<div class="notificacoes__item">
			<span>Avisar sobre novidades no portal</span>
			
			<label for="novidades">
				<input type="checkbox" id="novidades" checked>
				<span></span>
			</label>
		</div>

		<div class="notificacoes__item">
			<span>Avisar sobre meus chamados</span>
			
			<label for="chamados">
				<input type="checkbox" id="chamados" checked>
				<span></span>
			</label>
		</div>

		<div class="notificacoes__item">
			<span>Avisar sobre atualização de senha</span>
			
			<label for="senha">
				<input type="checkbox" id="senha" checked>
				<span></span>
			</label>
		</div>
	</section>
<?php
	get_footer();