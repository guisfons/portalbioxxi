<?php
/**
 * Declare all used post types
 */
function ks_register_post_types(){

    $def_posttype_args = array(
        'labels'             => array(),
        'description'        => '',
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => '',
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 4,
        'supports'           => array('title', 'thumbnail', 'editor', 'author', 'excerpt', 'page-attributes'),
        'show_in_rest'		 => true
    );

    $def_taxonomy_args = array(
        'hierarchical'      => true,
        'labels'            => array(),
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => '',
        'show_in_rest'		 => true,
        'show_in_quick_edit' => true,
    );

    $posttypes = array(
        'tutoriais_manuais' => array(
            'labels' => array(
                'name'               => __('Tutoriais e Manuais'),
                'singular_name'      => __('Tutorial ou Manual'),
                'menu_name'          => __('Tutoriais e Manuais'),
                'name_admin_bar'     => __('Tutoriais e Manuais'),
                'add_new'            => __('Novo'),
                'add_new_item'       => __('Adicionar Novo'),
                'new_item'           => __('Novo Tutorial ou Manual'),
                'edit_item'          => __('Editar'),
                'view_item'          => __('Ver'),
                'all_items'          => __('Todos'),
                'search_items'       => __('Procurar'),
                'parent_item_colon'  => __('Pai:'),
                'not_found'          => __('Nenhum encontrado.'),
                'not_found_in_trash' => __('Nenhum na lixeira.')
            ),
            'menu_icon'    => 'dashicons-media-document',
            'description'  => __('Tutoriais e Manuais com categorias.'),
            'rest_base'    => 'custom/tutoriais',
            'has_archive'  => 'biblioteca/tutoriais',
            'rewrite'      => array('slug' => 'tutoriais'),
            'supports'     => array('title', 'thumbnail'),
            'show_in_rest' => true,
            'taxonomy'     => array( // <- Aqui entra a definição completa
                'categoria_tutoriais' => array(
                    'labels' => array(
                        'name'              => __('Categorias de Tutoriais'),
                        'singular_name'     => __('Categoria de Tutorial'),
                        'search_items'      => __('Buscar Categorias'),
                        'all_items'         => __('Todas as Categorias'),
                        'parent_item'       => __('Categoria Pai'),
                        'parent_item_colon' => __('Categoria Pai:'),
                        'edit_item'         => __('Editar Categoria'),
                        'update_item'       => __('Atualizar Categoria'),
                        'add_new_item'      => __('Adicionar Nova Categoria'),
                        'new_item_name'     => __('Nome da Nova Categoria'),
                        'menu_name'         => __('Categorias'),
                    ),
                    'rewrite' => array('slug' => 'categoria-tutoriais')
                )
            )
        )
    );

    foreach ($posttypes as $posttype => $options) {

        $args = array_merge($def_posttype_args, $options);

        if(isset($args['taxonomy'])){

            $taxonomies = $args['taxonomy'];

            foreach($taxonomies as $taxonomy => $taxonomy_args){

                $taxonomy_args = array_merge($def_taxonomy_args, $taxonomy_args);

                register_taxonomy($taxonomy, array($posttype), $taxonomy_args);

            }

            unset($args['taxonomy']);

        }

        register_post_type($posttype, $args);

    }
}

add_action('init', 'ks_register_post_types', 10 );

/**
 * Change Native Posts labels
 */
function ks_change_post_label() {

    global $menu;
	global $submenu;

    $menu[5][0] = 'Notícias';
    $submenu['edit.php'][5][0] = 'Notícias';
    $submenu['edit.php'][10][0] = 'Adicionar Notícia';

}

add_action( 'admin_menu', 'ks_change_post_label' );

function ks_change_post_object() {

	global $wp_post_types;

    $labels = &$wp_post_types['post']->labels;
    $labels->name = 'Notícias';
    $labels->singular_name = 'Notícias';
	$labels->menu_name = 'Notícias';
	$labels->name_admin_bar = 'Notícias';
    $labels->add_new = 'Nova Notícia';
    $labels->add_new_item = 'Nova Notícia';
    $labels->new_item = 'Nova Notícia';
    $labels->edit_item = 'Editar Notícia';
    $labels->view_item = 'Ver Notícia';
    $labels->all_items = 'Notícias';
	$labels->search_items = 'Procurar Notícias';
	$labels->parent_item_colon = 'Notícias pai:';
    $labels->not_found = 'Nenhuma Notícia encontrada';
	$labels->not_found_in_trash = 'Nenhuma Notícia encontrada na lixeira';

}

add_action( 'init', 'ks_change_post_object' );
