<?php
    /**
     * Default category archive
     * Display the theme for "categoria-colunas" items
     */
    get_header();

	$term = get_queried_object();

	global $wp_query;

	echo $term->name;
?>

<section class="posts" data-max-pages="<?php echo $wp_query->max_num_pages; ?>">

	<?php
		while ( have_posts() ):

			the_post();

			$post->post_content = apply_filters( 'the_content', $post->post_content );

			include(TEMPLATEPATH . '/inc/common-post-properties.php');

			$post_image = get_the_post_thumbnail_url($aux_post, 'medium_large');

			include(TEMPLATEPATH . '/template-parts/components/post-item-loop.php');

		endwhile;

		wp_reset_postdata();
	?>

	<div class="okn-pagination-container">
		<nav class="navigation pagination" role="navigation">
			<div class="nav-links">
				<?php
					$big = 999999999;
					echo paginate_links( array(
						'mid_size' => 1,
						'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
						'format' => '?paged=%#%',
						'current' => max( 1, get_query_var('paged') ),
						'total' => $wp_query->max_num_pages,
						'prev_text' => __('&lt;'),
						'next_text' => __('&gt;'),
					) );
				?>
			</div>
		</nav>
	</div>

</section>

<?php

    get_footer();