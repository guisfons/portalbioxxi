<?php
	/**
	 * @version 1.0.0
	 *
	 * A serie of common post attributes to be used into loops.
	 * Any difference, you must override this variables.
	 * By example, you can override $post_image variable to get a smallest thumbnail
	 */

	/**
	 * @bug @info known bug, global $post has been overridden by loop-in-loop schemes. So preserves the original $post
	 */

	/**
	 * Defining default post authors atributes
	*/
	$aux_post = $post;

	$author = [];
	$author['display_name'] = get_the_author_meta('display_name', $aux_post->post_author);

	$author['url'] = '';

	if (!empty($author['display_name'])):
		$author['url'] = getAuthorPermalink($author['display_name']);
	endif;

	$post_image = get_the_post_thumbnail_url($aux_post, 'large');
	$excerpt = get_the_excerpt($aux_post);
	$post_link = get_the_permalink($aux_post);
	$post_title = $aux_post->post_title;
	/**
	 * Special Posts marker
	 */
	$html_special_post_marker = '';

	/**
	 * @info New fields added. Old Field 'Modelo' removed and attached an fallback here
	 */
	$post_has_video = get_field('codigo_video', $aux_post->ID);

	/**
	 * Redefining to default author
	 */
	$author['display_name'] = !empty($author['display_name']) ? $author['display_name'] : 'Redação';

	# @todo improvements Add picture for authors in another post-types
	if ($aux_post->post_type === 'colunas') {
		$author['picture'] = getAuthorPicture($author['display_name']);
	}

	/**
	* Prioritizing custom author
	*/
	$enables_custom_author_name = get_field('autor_personalizado_habilitado', $aux_post->ID);

	if ($enables_custom_author_name) {
		$author = [
			'url' => '#',
			'picture' => '',
			'display_name' => get_field('autor_personalizado', $aux_post->ID)
		];
	}

	# default author's picture
	if (empty($author['picture'])) {
		$author['picture'] = get_template_directory_uri() . '/assets/img/avatar.png';
	}

	if (in_array($aux_post->post_type, ['post', 'video'])):

		$taxonomy_slug = 'category';

		$tags_term = get_the_terms($aux_post->ID, 'post_tag');

		if (!empty($tags_term)):
			$tags = '';
			foreach ($tags_term as $key => $tag) {
				$tag_link = get_term_link($tag, 'post_tag');
				$tag_link = '<a href="'.$tag_link. '">'. $tag->name. '</a>';
				$tags .= '<span>'. $tag_link . '</span>';
			}
		endif;

	else:

		# @todo showing column category name, actually that means the column name.
		# Show be reviewed at re-categorization
		$taxonomy_slug = 'categoria-colunas';

	endif;

	if (!empty($taxonomy_slug)):
		$taxonomy = get_the_terms($aux_post->ID, $taxonomy_slug);

		if (!empty($taxonomy)):
			$taxonomy_link = get_term_link($taxonomy[0], $taxonomy_slug);
		endif;
	endif;

	/**
	 * @info resetting $post to its past value
	 */
	$post = $aux_post;