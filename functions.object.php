<?php

    /**
     * Theme functions and definitions.
     *
     * Sets up the theme and provides some helper functions, which are used in the
     * theme as custom template tags. Others are attached to action and filter
     * hooks in WordPress to change core functionality.
     *
     * For more information on hooks, actions, and filters,
     * see http://codex.wordpress.org/Plugin_API
     *
     * @since 1.0.0
     */
    if (in_array(session_status(), [PHP_SESSION_NONE, 1])) {
        session_start();
    }

// Composer autoload
    if (file_exists(__DIR__.'/vendor/autoload.php')) {
        require_once __DIR__.'/vendor/autoload.php';
    }

    /**
     * @todo improve to use namespaces and Helpers be a class
     */
    require_once __DIR__.'/src/Helpers.php';
    use OKN\Theme\Theme;

    require_once __DIR__.'/src/Theme.php';

    require_once __DIR__.'/inc/post-types.php';

    $theme = new Theme();

    /*
     * @bugfix Yoast fix wrong canonical url in production
     *
     * Set canonical URLs on non-production sites to the production URL
     *
     * @param mixed $length
     */
    //add_filter( 'wpseo_canonical', function( $canonical ) {
    //	$canonical = preg_replace('#//[^/]*/#U', '//itmorum365.com.br/', trailingslashit( $canonical ) );
    //	return $canonical;
    //});

    /*
     * Filter except length to 35 words.
     *
     * @param int $length
     *
     * @return int
     */
    $theme->addFilter('excerpt_length', function ($length) {
        return 40;
    }, 999);

    // Add excerpt support for pages
    $theme->addPostSupport('page', 'excerpt');

    // Disables block editor "Gutenberg"
    $theme->addFilter('use_block_editor_for_post_type', function () {
        return false;
    });

    /*
     * @info this theme doesn't have custom thumbnails dimensions
     *
     * define the size of thumbnails
     * To enable featured images, the current theme must include
     * add_theme_support( 'post-thumbnails' ) and they will show the metabox 'featured image'
     */
    $theme->addImageSize('company-size', 162, 81, false);
    $theme->addImageSize('event-gallery', 490, 568, false);

    // Páginas Especiais
    $theme->createOptionsPage([
        'page_title' => 'Opções Gerais',
        'menu_title' => 'Opções Gerais',
        'menu_slug' => 'theme-general-settings',
        'capability' => 'edit_posts',
        'redirect' => false,
        'icon_url' => 'dashicons-admin-settings',
        'position' => 2,
    ]);
    $theme->createOptionsPage([
        'page_title' => 'Destaques',
        'menu_title' => 'Destaques',
        'menu_slug' => 'uau-slides',
        'capability' => 'edit_posts',
        'redirect' => false,
        'icon_url' => 'dashicons-excerpt-view',
        'position' => 3,
    ]);
    $theme->addNavMenus([
        'header-menu' => 'Menu Header',
    ]);
    //$theme->populateRequiredStructure(function () use ($theme){
        $theme->createPage('Pagina Template', '', 'page-template');
        $theme->createPage('Pagina nova', '', 'pagina-nova');
        $theme->createMenu('Menu Header', 'header-menu', [['title' => 'Página de Template', 'url' => home_url('/page-template'), 'classes' => ['classe1', 'classe2']]]);
    //});

    /**
     * ACF Improvements
     * Order results by descendent date in relational fields.
     *
     * @param array $args
     * @param array $field
     * @param int   $post_id
     *
     * @return array
     */
    function relational_fields_order($args, $field, $post_id)
    {
        $args['orderby'] = 'date';
        $args['order'] = 'DESC';

        return $args;
    }

    add_filter('acf/fields/relationship/query', 'relational_fields_order', 10, 3);

    /**
     * ACF Improvements
     * Order results by descendent date in post object fields.
     *
     * @param array $args
     * @param array $field
     * @param int   $post_id
     *
     * @return array
     */
    function post_objects_fields_order($args, $field, $post_id)
    {
        $args['orderby'] = 'date';
        $args['order'] = 'DESC';

        return $args;
    }

    add_filter('acf/fields/post_object/query', 'post_objects_fields_order', 10, 3);

    // Declaring the JS files for the site.
    $theme->removeScript('jquery');
    /**
     * Applying custom logo at WP login form.
     */
    function login_logo()
    {
        get_template_part('template-parts/login/logo');
    }

    add_action('login_enqueue_scripts', 'login_logo');

    function login_logo_url()
    {
        return home_url();
    }

    add_filter('login_headerurl', 'login_logo_url');

    function login_logo_url_title()
    {
        return 'WP Kickstart';
    }

    add_filter('login_headertext', 'login_logo_url_title');

    function get_post_by_slug($slug)
    {
        global $theme;

        return $theme->get_post_by_slug($slug);
    }
