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
        'supports'           => array('title', 'thumbnail', 'editor', 'author', 'excerpt', 'page-attributes' ),
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

        // 'empresas' => array(

        //     'labels' => array(
        //         'name'               => __('Empresas'),
        //         'singular_name'      => __('Empresa'),
        //         'menu_name'          => __('Empresas'),
        //         'name_admin_bar'     => __('Empresas'),
        //         'add_new'            => __('Nova Empresa'),
        //         'add_new_item'       => __('Nova Empresa'),
        //         'new_item'           => __('Nova Empresa'),
        //         'edit_item'          => __('Editar Empresa'),
        //         'view_item'          => __('Ver Empresa'),
        //         'all_items'          => __('Empresas'),
        //         'search_items'       => __('Procurar por Empresas'),
        //         'parent_item_colon'  => __('Empresas pai:'),
        //         'not_found'          => __('Nenhum Empresa encontrado.'),
        //         'not_found_in_trash' => __('Nenhum Empresa encontrado na lixeira.')
        //     ),
        //     'menu_icon' => 'dashicons-store',
        //     'description' => __('Empresas'),
        //     'rest_base' =>'custom/empresas',
        //     'has_archive' => 'biblioteca/empresas',
        //     'rewrite'     => [
        //         'slug' => 'empresas',
        //     ],
        //     'supports'    => array('title', 'thumbnail'),
        //     'show_in_rest' => false,  // @info inherited from old version
        // ),

        // 'eventos' => array(

        //     'labels' => array(
        //         'name'               => __('Eventos'),
        //         'singular_name'      => __('Evento'),
        //         'menu_name'          => __('Eventos'),
        //         'name_admin_bar'     => __('Eventos'),
        //         'add_new'            => __('Novo Evento'),
        //         'add_new_item'       => __('Novo Evento'),
        //         'new_item'           => __('Novo Evento'),
        //         'edit_item'          => __('Editar Evento'),
        //         'view_item'          => __('Ver Evento'),
        //         'all_items'          => __('Eventos'),
        //         'search_items'       => __('Procurar por Eventos'),
        //         'parent_item_colon'  => __('Eventos pai:'),
        //         'not_found'          => __('Nenhum Evento encontrado.'),
        //         'not_found_in_trash' => __('Nenhum Evento encontrado na lixeira.')
        //     ),
        //     'menu_icon' => 'dashicons-admin-site-alt',
        //     'description' => __('Eventos'),
        //     'rest_base' =>'custom/eventos',
        //     'has_archive' => 'biblioteca/eventos',
        //     'rewrite'     => [
        //         'slug' => 'eventos',
        //     ],
        //     'supports'    => array('title', 'editor', 'thumbnail', 'excerpt'),
        //     'show_in_rest' => false,  // @info inherited from old version
        // ),

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
