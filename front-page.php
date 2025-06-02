<?php
get_header();
?>
<section class="wrapper greetings">
    <p>Olá <span class="greetings__name">[NOME DO CLIENTE],</span><strong>Que bom que você voltou!</strong></p>
</section>
<hr/>

<section class="wrapper quadro-avisos">
    <h2><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/bioxxi.svg'); ?>">Quadro de avisos</h2>
    <p>Esteja sempre atualizado em tudo que acontece aqui no portal</p>
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
                </div> -->
            </div>
        </div>
    </div>
</section>

<section class="wrapper destaque">
    <h2><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/bioxxi.svg'); ?>">Destaque</h2>
    <figure class="destaque__embed">
        <?php 
            $video_url = get_field('destaque_video');
            if (!empty($video_url)) {
                $embed_url = str_replace('watch?v=', 'embed/', $video_url);
                echo '<iframe src="' . esc_url($embed_url) . '"  title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
            } else {
                echo '<p>Vídeo em destaque não disponível.</p>';
            }
        ?>
    </figure>

    <div class="destaque__cards">
        <?php
            // Destaque 1
            $destaque_1_url = get_field('destaque_1_url');
            $destaque_1_img = get_field('destaque_1');
            if ($destaque_1_img) {
                $url = is_array($destaque_1_url) ? esc_url($destaque_1_url['url']) : '#';
                $target = is_array($destaque_1_url) && $destaque_1_url['target'] == '_blank' ? '_blank' : '_self';

                echo '<figure class="destaque__card">';
                echo '<a href="' . $url . '" target="' . $target . '">';
                echo '<img src="' . esc_url($destaque_1_img) . '" alt="' . esc_attr('Destaque 1') . '">';
                echo '</a>';
                echo '</figure>';
            }

            // Destaque 2
            $destaque_2_url = get_field('destaque_2_url');
            $destaque_2_img = get_field('destaque_2');
            if ($destaque_2_img) {
                $url = is_array($destaque_2_url) ? esc_url($destaque_2_url['url']) : '#';
                $target = is_array($destaque_2_url) && $destaque_2_url['target'] == '_blank' ? '_blank' : '_self';

                echo '<figure class="destaque__card">';
                echo '<a href="' . $url . '" target="' . $target . '">';
                echo '<img src="' . esc_url($destaque_2_img) . '" alt="' . esc_attr('Destaque 2') . '">';
                echo '</a>';
                echo '</figure>';
            }
        ?>
    </div>
</section>

<section class="wrapper blog">
    <?php $instagram = !empty(get_field('instagram', 'option')) ? get_field('instagram', 'option') : '#'; ?>
    <div class="blog__heading">
        <h2><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/bioxxi.svg'); ?>">Posts recentes</h2>
        <a href="https://bioxxi.com.br/blog/" target="_blank" rel="noopener noreferrer">Ver todos</a>
    </div>

    <div class="blog__container">
    </div>
</section>

<section class="wrapper certificacoes">
    <h2><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/icons/bioxxi.svg'); ?>">Certificações da Bioxxi</h2>
    <p>Atendemos aos mais rigorosos padrões de qualidade e segurança</p>

    <div class="certificacoes__container">
        <div class="certificacoes__card">
            <figure><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/ONA.png'); ?>"></figure>
            <article>
                <span>Acreditação ONA</span>
                <p>Certificado de Qualidade ONA avaliado pelo conceituado IQG.</p>
            </article>
        </div>
        <div class="certificacoes__card">
            <figure><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/ISO.png'); ?>"></figure>
            <article>
                <span>ISO 10993-7:2008</span>
                <p>Atendimento à norma de Avaliação e Gestão de Riscos biológicos em produtos médicos.</p>
            </article>
        </div>
        <div class="certificacoes__card">
            <figure><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/ISO.png'); ?>"></figure>
            <article>
                <span>ISO 11135-1:2014</span>
                <p>Atendimento à norma de Esterilização de Produto de Atenção à Saúde por Óxido de Etileno.</p>
            </article>
        </div>
        <div class="certificacoes__card">
            <figure><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/ISO.png'); ?>"></figure>
            <article>
                <span>ISO 9001:2015</span>
                <p>Certificação em atendimento às práticas de Gestão da Qualidade.</p>
            </article>
        </div>
        <div class="certificacoes__card">
            <figure><img src="<?= esc_url(get_template_directory_uri() . '/assets/img/ISO.png'); ?>"></figure>
            <article>
                <span>ISO 13485:2016</span>
                <p>Certificação em atendimento à norma de Gestão da Qualidade para dispositivos médicos.</p>
            </article>
        </div>
    </div>
</section>
<section class="wrapper banner" style="background-image: url('<?= esc_url(get_template_directory_uri() . '/assets/img/bg-banner.png'); ?>');">
    <article>
        <p>Oferecendo soluções completas que unem tecnologia, eficiência e segurança no cuidado com a saúde.</p>
        <a href="https://bioxxi.com.br" target="_blank">Visite nosso site</a>
    </article>
</section>
<?php
get_footer();
?>