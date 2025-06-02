<?php
    /**
     * Custom taxonomy archive
     * Display the theme for "categoria-colunas" items
     */
    get_header();

    $term = get_queried_object();

    $taxonomy_image = get_field('imagem', $term);
	$taxonomy_image = is_array($taxonomy_image) ? $taxonomy_image['sizes']['medium_large'] : get_template_directory_uri() . '/assets/img/bg-fake.png';

    include(TEMPLATEPATH . '/template-parts/taxonomy/content-' . $term->taxonomy . '.php');

    get_footer();