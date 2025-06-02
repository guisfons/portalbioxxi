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
 * @package itmidia
 * @since 1.0.0
 */

if (in_array(session_status(), [PHP_SESSION_NONE, 1])) {
	session_start();
}

/**
 * Composer autoload
 */
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once (__DIR__ . '/vendor/autoload.php');
}

/**
 * @todo improve to use namespaces and Helpers be a class
 */
require_once (__DIR__ . '/src/Helpers.php');
require_once(__DIR__ . '/inc/post-types.php');
#require_once(__DIR__ . '/inc/shortcodes/galleries.php');
#require_once(__DIR__ . '/inc/shortcodes/special-posts-videos.php');

/**
 * @info Security Tip
 * Remove version info from head and feeds
 */
add_filter('the_generator', 'wp_version_removal');

function wp_version_removal() {
    return false;
}

/**
 * @info Security Tip
 * Disable oEmbed Discovery Links and wp-embed.min.js
 */
remove_action( 'wp_head', 'wp_oembed_add_discovery_links', 10 );
remove_action( 'wp_head', 'wp_oembed_add_host_js' );
remove_action('rest_api_init', 'wp_oembed_register_route');
remove_filter('oembed_dataparse', 'wp_filter_oembed_result', 10);

/**
 * @bugfix Yoast fix wrong canonical url in production
 *
 * Set canonical URLs on non-production sites to the production URL
 */
#add_filter( 'wpseo_canonical', function( $canonical ) {
#	$canonical = preg_replace('#//[^/]*/#U', '//itmorum365.com.br/', trailingslashit( $canonical ) );
#	return $canonical;
#});

/**
 * Filter except length to 35 words.
 *
 * @param integer $length
 * @return integer
 */
function custom_excerpt_length( $length ) {
    return 40;
}
add_filter( 'excerpt_length', 'custom_excerpt_length', 999 );

/**
 * Add excerpt support for pages
 */
add_post_type_support( 'page', 'excerpt' );

/**
 * Remove Admin Bar from front-end
 */
add_filter('show_admin_bar', '__return_false');

/**
 * Disables block editor "Gutenberg"
 */
add_filter("use_block_editor_for_post_type", "use_gutenberg_editor");
function use_gutenberg_editor() {
    return false;
}

/**
 * Add support to thumbnails
 */
add_theme_support('post-thumbnails');

/**
 * @info this theme doesn't have custom thumbnails dimensions
 *
 * define the size of thumbnails
 * To enable featured images, the current theme must include
 * add_theme_support( 'post-thumbnails' ) and they will show the metabox 'featured image'
 */
add_image_size('company-size', 162, 81, false );
add_image_size('event-gallery', 490, 568, false );
/*add_image_size('slide-large', 1366, 400, true );
add_image_size('slide-extra-large', 2560, 749, true );*/


/**
 * Páginas Especiais
 */

if( function_exists('acf_add_options_page') ) {

   /* @info disabled by unused*/
    acf_add_options_page(array(
        'page_title' => 'Opções Gerais',
        'menu_title' => 'Opções Gerais',
        'menu_slug'  => 'theme-general-settings',
        'capability' => 'edit_posts',
        'redirect'   => false,
        'icon_url'   => 'dashicons-admin-settings',
        'position'   => 2

    ));

    acf_add_options_page(array(
        'page_title' => 'Destaques',
        'menu_title' => 'Destaques',
        'menu_slug'  => 'uau-slides',
        'capability' => 'edit_posts',
        'redirect'   => false,
        'icon_url'   => 'dashicons-excerpt-view',
        'position'   => 3
	));

}


/**
 * Registering Locations of Navigation Menus
 */

function navigation_menus(){
    /* this function register a array of locations */
    register_nav_menus(
        array(
			'header-menu' => 'Menu Header',
        )
    );
}

add_action('init', 'navigation_menus');

/**
 * ACF Improvements
 * Order results by descendent date in relational fields
 *
 * @param array $args
 * @param array $field
 * @param integer $post_id
 * @return array
 */
function relational_fields_order( $args, $field, $post_id ) {
    $args['orderby'] = 'date';
	$args['order'] = 'DESC';
	return $args;
}
add_filter('acf/fields/relationship/query', 'relational_fields_order', 10, 3);

/**
 * ACF Improvements
 * Order results by descendent date in post object fields
 *
 * @param array $args
 * @param array $field
 * @param integer $post_id
 * @return array
 */
function post_objects_fields_order( $args, $field, $post_id ) {
    $args['orderby'] = 'date';
	$args['order'] = 'DESC';
	return $args;
}
add_filter('acf/fields/post_object/query', 'post_objects_fields_order', 10, 3);

/**
 * Declaring the JS files for the site
 */

function scripts() {
    wp_deregister_script("jquery");
}
add_action('wp_enqueue_scripts','scripts', 10); // priority 10

/**
 * Applying custom logo at WP login form
 */
function login_logo() {
?>
    <style type="text/css">
        #login h1 a, .login h1 a {
            background-image: url("<?php echo get_stylesheet_directory_uri(); ?>/assets/img/logo.svg");
            width:260px;
            height:55px;
            background-size: contain;
            background-repeat: no-repeat;
        }
    </style>
<?php
}
add_action( 'login_enqueue_scripts', 'login_logo' );

function login_logo_url() {
    return home_url();
}

add_filter( 'login_headerurl', 'login_logo_url' );

function login_logo_url_title() {
    return 'Portal Bioxxi';
}

add_filter( 'login_headertext', 'login_logo_url_title' );

function enqueue_api_auth_script() {
    if(!is_admin() && !is_page('login')) {
        wp_enqueue_script('api-auth-script', get_template_directory_uri() . '/assets/js/oauth.js', array('jquery'), null, true);
    }
}
add_action('wp_enqueue_scripts', 'enqueue_api_auth_script');
/**
 * Declaring the JS files for the site
 */
add_action('wp_enqueue_scripts','scripts', 10); // priority 10

REQUIRE_ONCE('inc/style-scripts.php');

add_action('admin_menu', 'portal_bioxxi_settings_page');
add_action('admin_init', 'portal_bioxxi_settings_init');

function portal_bioxxi_settings_page() {
    add_options_page(
        'API Credentials',
        'API Credentials',
        'manage_options',
        'portal-bioxxi-settings',
        'portal_bioxxi_settings_page_html'
    );
}

function portal_bioxxi_settings_init() {
    register_setting('portal_bioxxi_settings_group', 'my_client_id');
    register_setting('portal_bioxxi_settings_group', 'my_client_secret');

    add_settings_section(
        'portal_bioxxi_section',
        'Client Credentials',
        null,
        'portal-bioxxi-settings'
    );

    add_settings_field(
        'my_client_id',
        'Client ID',
        'my_client_id_field_cb',
        'portal-bioxxi-settings',
        'portal_bioxxi_section'
    );

    add_settings_field(
        'my_client_secret',
        'Client Secret',
        'my_client_secret_field_cb',
        'portal-bioxxi-settings',
        'portal_bioxxi_section'
    );
}

function my_client_id_field_cb() {
    $value = esc_attr(get_option('my_client_id'));
    echo "<input type='text' name='my_client_id' value='$value' class='regular-text' />";
}

function my_client_secret_field_cb() {
    $value = esc_attr(get_option('my_client_secret'));
    echo "<input type='text' name='my_client_secret' value='$value' class='regular-text' />";
}

function portal_bioxxi_settings_page_html() {
    ?>
    <div class="wrap">
        <h1>API Credentials</h1>
        <form method="post" action="options.php">
            <?php
                settings_fields('portal_bioxxi_settings_group');
                do_settings_sections('portal-bioxxi-settings');
                submit_button();
            ?>
        </form>
    </div>
    <?php
}

add_action('wp_ajax_nopriv_do_oauth', 'portal_bioxxi_handle_oauth_request');
add_action('wp_ajax_do_oauth', 'portal_bioxxi_handle_oauth_request');

function portal_bioxxi_handle_oauth_request() {
    // Sanitize input
    $username = sanitize_text_field($_POST['username'] ?? '');
    $password = sanitize_text_field($_POST['password'] ?? '');

    // Make sure both fields are present
    if (empty($username) || empty($password)) {
        wp_send_json_error(['message' => 'Usuário e senha são obrigatórios.']);
    }

    // Retrieve credentials from WP options
    $client_id = get_option('my_client_id');
    $client_secret = get_option('my_client_secret');

    if (empty($client_id) || empty($client_secret)) {
        wp_send_json_error(['message' => 'Credenciais do cliente não configuradas.']);
    }

    // Prepare OAuth request
    $response = wp_remote_post('https://cmexxfab.com.br/api-homol/oauth/token', [
        'headers' => ['Content-Type' => 'application/x-www-form-urlencoded'],
        'body' => [
            'grant_type'    => 'password',
            'client_id'     => $client_id,
            'client_secret' => $client_secret,
            'username'      => $username,
            'password'      => $password,
        ],
    ]);

    if (is_wp_error($response)) {
        wp_send_json_error(['message' => 'Erro ao conectar com o servidor de autenticação.']);
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);

    if (!empty($body['access_token'])) {
        wp_send_json_success([
            'access_token'  => $body['access_token'],
            'refresh_token' => $body['refresh_token'] ?? null,
            'expires_in'    => $body['expires_in'] ?? null,
        ]);
    } else {
        // Log the raw API response for debugging (check your server error log)
        error_log('OAuth API error response: ' . wp_remote_retrieve_body($response));
        file_put_contents( WP_CONTENT_DIR . '/debug-oauth.log', wp_remote_retrieve_body($response) . "\n", FILE_APPEND );

        $error = $body['error_description'] ?? $body['error'] ?? 'Erro de autenticação.';
        wp_send_json_error(['message' => $error]);
    }

    wp_die();
}