<?php

/**
 * Get the picture of a custom co-author by a given name
 * @author Marcos Freitas <marcos@okn.com.br>
 * @param string $author_name
 * @return string
 */
function getAuthorPicture($author_name = '') {

    if (empty($author_name)) {
        return false;
    }

    $author = new WP_Query([
        'post_type' => 'autores',
        'post_status' => 'publish',
        'title' => $author_name,
    ]);

    if (!$author->have_posts()) {
        return false;
    }

    $authors_picture = false;

    while($author->have_posts()) {
        $author->the_post();

        if (has_post_thumbnail()) {
            $authors_picture = get_the_post_thumbnail_url($author->ID, 'thumbnail');
        }
    }

    $author->reset_postdata();

    return $authors_picture;
}

/**
 * Get the permalink of a co-author by a given name
 *
 * @author Marcos Freitas <marcos@okn.com.br>
 *
 * @param string $author_name
 * @return string
 */
function getAuthorPermalink($author_name = '') {

    if (empty($author_name)) {
        return false;
    }

    $author = new WP_Query([
        'post_type' => 'autores',
        'post_status' => 'publish',
        'title' => $author_name,
    ]);

    if (!$author->have_posts()) {
        return false;
    }

    $author_permalink = false;

    while($author->have_posts()) {
        $author->the_post();

        $author_permalink = get_the_permalink($author->ID);
    }

    $author->reset_postdata();

    return $author_permalink;

}

function getAllColumnsAuthors($filter = []) {
    global $post;

    $authors = [];

    /**
     * prevent bad use
     */
    if (isset($filter['post_type'])) {
        unset($filter['post_type']);
    }

    $params = [
        'post_type' => 'autores',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => 'title',
        'order' => 'ASC',
    ];

    $params = array_merge($params, $filter);

    $authors_query = new WP_Query($params);

    while($authors_query->have_posts()):

        $authors_query->the_post();

        $authors[] = [
            'picture' => get_the_post_thumbnail_url($post->ID, 'thumbnail'),
            'display_name' => $post->post_title,
            'permalink' => get_the_permalink($post->ID)
        ];

    endwhile;
    $authors_query->reset_postdata();

    return $authors;

}

/**
 * Get author's published columns name
 * @bug  triggering some errors on class-wp-query.php
 *
 * @param string $author_name
 * @return array
 */
function getAuthorsColumnsByName($author_name = '') {


    if (empty($author_name)) {
        return '';
    }

    # get all posts published by this author
    $columns = new WP_Query([
        'post_type' => 'colunas',
        'status' => 'publish',
        'author_name' => $author_name
    ]);

    $authors_columns_terms = [];

    while($columns->have_posts()):
        $columns->the_post();

        $column_post_id = array_shift($columns->posts)->ID;
        $terms = get_the_terms($column_post_id , 'categoria-colunas' );

        if (empty($terms) || is_wp_error($terms[0])) {
            continue;
        }

        $column_link = get_term_link($terms[0], 'categoria-colunas');

        if (is_wp_error($column_link)) {
            continue;
        }

        if (isset($authors_columns_terms[$terms[0]->slug])) {
            continue;
        }

        $authors_columns_terms[$terms[0]->slug] = [
            'id' => $terms[0]->term_id,
            'permalink' => $column_link,
            'name' => $terms[0]->name,
            'slug' => $terms[0]->slug,
        ];

    endwhile;

    $columns->wp_reset_postdata();

    return $authors_columns_terms;
}

/**
 * Get columns authors list
 * @parm $term_id integer taxonomy ID
 */
function getColumnsAuthorsByTaxonomyID($term_id = null){

    global $post;

    if (empty($term_id)) {
        return false;
    }

    $column_posts = new WP_Query([
        'post_type' => 'colunas',
        'status' => 'publish',
        'tax_query' => [
            [
                'taxonomy' => 'categoria-colunas',
                'field'    => 'term_id',
                'terms'    => $term_id,
            ]
        ],
        'order' => 'DESC',
    ]);

    if ($column_posts->have_posts()):

        $authors = [];
        $authors_name = [];

        while($column_posts->have_posts()):

            $column_posts->the_post();

            $authors['list'][] = [
                'display_name' => get_the_author_meta('display_name', $post->post_author),
                'url' => get_author_posts_url($post->post_author)
            ];
            $authors_name[] = get_the_author_meta('display_name', $post->post_author);
        endwhile;

        $most_frequent_author_names = array_count_values($authors_name);

        /**
         * sorting and preserving index:value correct association
         */
        arsort($most_frequent_author_names);

        $authors['most_frequent'] = key($most_frequent_author_names);

        $column_posts->wp_reset_postdata();

        /** remove duplicates from this resulted array */

        $authors['list'] = array_unique($authors['list'],SORT_REGULAR);

        # rebuild indexes
        sort($authors['list']);

        return $authors;

    endif;

    return [];
}

function getBusinessBrandByPostObject($wp_post = null, $size = 'medium') {
    return [
        'brandpost_flag' => get_field('logo_empresa', $wp_post->ID),
        'featured' => get_the_post_thumbnail_url($wp_post, $size),
    ];
}

/**
 * Retrieve a business brandspace details
 *
 * @param \WP_POST $wp_post a 'empresa' wp_post object
 * @return array
 */
function getBrandSpaces($wp_post = null) {
    global $post;

    $brandspace = [];

    $params = [
        'post_type' => 'brandspaces',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => 'title',
		'order' => 'ASC'
    ];

    $query = new WP_Query($params);

    while($query->have_posts()):

		$query->the_post();

		$business = get_field('selecione_a_empresa', $post->ID)[0];

		if (!empty($wp_post) && ($business->ID !== $wp_post->ID) ) {
			continue;
		}

        $brandspace_details = [
            'featured' => get_the_post_thumbnail_url($post->ID, 'medium_large'),
			'title' => $post->post_title,
			'subtitle' => get_field('olho', $post->ID),
			'permalink' => get_the_permalink($post->ID),
			'business' => $business
		];

		if (empty($wp_post)) {
			$brandspace[] = $brandspace_details;
		} else {
			$brandspace = $brandspace_details;
		}

    endwhile;
    $query->reset_postdata();

    return $brandspace;

}