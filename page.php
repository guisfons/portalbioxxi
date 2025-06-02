<?php
/**
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that other
 * 'pages' on your WordPress site will use a different template.
 *
 * @package ITMIDIA
 * @since 2.0.0
 */

get_header();

    while ( have_posts() ) : the_post();
        $post->post_content = apply_filters( 'the_content', $post->post_content );
        get_template_part('template-parts/page/content', $post->post_name);
    endwhile;
    wp_reset_postdata();

get_footer();