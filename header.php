<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	
	<?php
		wp_head();

		global $current_user;
		wp_get_current_user();
	?>

	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

	<title><?php echo get_bloginfo('name') . ' | ' . get_the_title(); ?></title>
</head>

<body>
<section class="loader"><figure class="loader__logo"><img src="<?php echo esc_url(get_stylesheet_directory_uri() . '/assets/img/logo.svg'); ?>" alt="<?= get_bloginfo('name'); ?>"></figure></section>
<?php
	if (is_page('login')) {
		echo '<main>';
		get_template_part('template-parts/login-header');
	} else {
	?>
		<header class="header">
			<div class="header__top">
				<div class="header__wrapper">
					<a href="<?= esc_url(home_url()); ?>" title="<?= get_bloginfo('name'); ?>">
						<figure class="header__logo"><img src="<?php echo esc_url(get_stylesheet_directory_uri() . '/assets/img/logo.svg'); ?>" alt="<?= get_bloginfo('name'); ?>"></figure>
					</a>
	
					<div class="header__notifications">
						<button class="header__bell" data-total><img src="<?php echo esc_url(get_stylesheet_directory_uri() . '/assets/img/icons/bell.svg'); ?>" alt="Notificações"></button>
	
						<div class="header__notification">
							<div class="header__notification-heading">
								<span>Avisos</span>
								<span><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/gear.svg'); ?>" alt="Configurações"></span>
							</div>
							<div class="header__notification-body">
								<div class="header__notification-item">
									<span class="header__notification-item-title">FICHA DE CADASTRO</span>
									<span class="header__notification-item-date">29/11 às 15h45</span>
									<p>Curabitur porttitor sapien dui, eu eleifend felis pellentesque ac Vestibulum eleifend lorem ac est luctus pretium.</p>
								</div>
								<div class="header__notification-item">
									<span class="header__notification-item-title">MEMORANDO DE COLETA</span>
									<span class="header__notification-item-date">29/11 às 12h01</span>
									<p>In hac habitasse platea dictumst. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.</p>
								</div>
								<button class="header__notification-btn">Exibir tudo</button>
							</div>
						</div>
					</div>
					<button class="header__sair">
						<span>SAIR</span>
						<img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/logout.svg'); ?>" alt="Sair">
					</button>
				</div>
			</div>

			<div class="header__menu">
				<div class="header__wrapper">
					<?php
						wp_nav_menu(array(
							'theme_location' => 'header-menu',
							'menu'           => 'Menu',
							'container'      => 'nav',
							'container_class'=> 'header__nav',
							'menu_class'     => 'header__nav-menu',
						));
					?>

					<a href=""></a>
				</div>
			</div>
		</header>
		<main>
	<?php } ?>