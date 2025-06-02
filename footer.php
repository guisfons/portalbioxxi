<section class="selecione-filial">
    <div class="wrapper">
        <h2>Selecione sua filial</h2>
        <div class="selecione-filial__container">
            <select name="filiais" id="filiais"></select>
            <button type="button" class="btn btn--green">Entrar</button>
        </div>
    </div>
</section>
</main>
<?php
if (!is_page('login')) {
    $email = !empty(get_field('email', 'option')) ? get_field('email', 'option') : '#';
    $instagram = !empty(get_field('instagram', 'option')) ? get_field('instagram', 'option') : '#';
    $youtube = !empty(get_field('youtube', 'option')) ? get_field('youtube', 'option') : '#';
    $facebook = !empty(get_field('facebook', 'option')) ? get_field('facebook', 'option') : '#';
    $linkedin = !empty(get_field('linkedin', 'option')) ? get_field('linkedin', 'option') : '#';
    $whatsapp = !empty(get_field('whatsapp', 'option')) ? get_field('whatsapp', 'option') : '#';
?>
<footer class="wrapper footer">
    <div class="footer__contato">
        <span>Entre em contato</span>
        <a href="mailto:<?= $email; ?>" target="_blank" rel="noopener noreferrer"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/email.svg'); ?>" alt="E-mail"><?= $email; ?></a>
    </div>
    <div class="footer__redes">
        <span>Siga a Bioxxi nas redes sociais</span>
        <a href="<?= $instagram; ?>" target="_blank" rel="noopener noreferrer" title="Instagram"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/instagram.svg'); ?>" alt="Instagram"></a>
        <a href="<?= $youtube; ?>" target="_blank" rel="noopener noreferrer" title="Youtube"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/youtube.svg'); ?>" alt="Youtube"></a>
        <a href="<?= $facebook; ?>" target="_blank" rel="noopener noreferrer" title="Facebook"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/facebook.svg'); ?>" alt="Facebook"></a>
        <a href="<?= $linkedin; ?>" target="_blank" rel="noopener noreferrer" title="LinkedIn"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/linkedin.svg'); ?>" alt="LinkedIn"></a>
    </div>

    <a href="<?= $whatsapp; ?>" target="_blank" rel="noopener noreferrer" title="Whatsapp" class="footer__whatsapp"><span>Em caso de dúvidas ou para mais informações, fale conosco no whastapp</span><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/whatsapp.svg'); ?>" alt="Whatsapp"></a>
</footer>
<?php } ?>
<?php wp_footer(); ?>
</body>
</html>