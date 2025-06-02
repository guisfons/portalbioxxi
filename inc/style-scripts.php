<?php
define('ASSETS_VERSION','1');

/**
 * Enqueue scripts and styles that are used on every page
 * Dequeue unused scripts and styles
 */
function themeFiles() {

    wp_deregister_script('jquery');
    wp_dequeue_style('wp-block-library');
    
    wp_register_style('style', get_stylesheet_directory_uri() . '/assets/css/main.min.css', array(), ASSETS_VERSION, 'screen');
    wp_enqueue_style('style');

    wp_register_script('jquery', 'https://code.jquery.com/jquery-3.7.1.min.js', array(), ASSETS_VERSION, true);
    wp_enqueue_script('jquery');

    wp_register_script('jquerymask', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.8/jquery.mask.min.js', array('jquery'), ASSETS_VERSION, true);
    wp_enqueue_script('jquerymask');

    wp_register_style('datatable', '//cdn.datatables.net/2.1.8/css/dataTables.dataTables.min.css', array('jquery'), ASSETS_VERSION, 'screen');
    wp_enqueue_style('datatable');

    wp_register_script('datatable', '//cdn.datatables.net/2.1.8/js/dataTables.min.js', array('jquery'), ASSETS_VERSION, true);
    wp_enqueue_script('datatable');

    wp_register_style('splide', '//cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/css/splide.min.css', array(), ASSETS_VERSION, 'screen');
    wp_enqueue_style('splide');

    wp_register_script('splide', '//cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/js/splide.min.js', array('jquery'), ASSETS_VERSION, true);
    wp_enqueue_script('splide');

    wp_register_script('javascript', get_stylesheet_directory_uri() . '/assets/js/main.js', array('api-auth-script', 'datatable'), ASSETS_VERSION, true);
    wp_enqueue_script('javascript');

    enqueueTargetAssets(getTargetType());
}
add_action('wp_enqueue_scripts', 'themeFiles');

/**
 * Define pages that don't have template slug
 */
function getTargetType() {
    if ( is_front_page() ) {
        return "home";
    }

    if( is_page('login') ) {
        return 'login';
    }

    if( is_page('tutoriais-e-manuais') ) {
        return 'tutoriais-manuais';
    }

    if( is_page('boletos-e-faturas') ) {
        return 'boletos-faturas';
    }

    if( is_page('historico-de-memorando-de-coleta') ) {
        return 'his-memorando';
    }

    if( is_page('historico-de-reprocessamento') ) {
        return 'his-reprocessamento';
    }

    if( is_page('historico-de-produtos-cadastrados') ) {
        return 'his-prod-cadastrado';
    }

    if( is_page('rastreabilidade-dos-produtos') ) {
        return 'rastreabilidade-produtos';
    }

    if( is_page('formas-de-pagamento') ) {
        return 'formas-pagamento';
    }

    if( is_page('perguntas-frequentes') ) {
        return 'faq';
    }

    if( is_page('contrato-digital') ) {
        return 'perfil-contrato-digital';
    }

    if( is_page('memorando-de-coleta-de-produtos') ) {
        return 'memorando-col-produtos';
    }

    if( is_page('meus-avisos') ) {
        return 'perfil-avisos-notificacoes';
    }

    if( is_page('meus-dados') ) {
        return 'perfil-meus-dados';
    }

    if( is_page('cadastro-de-produto') ) {
        return 'cad-prod';
    }

    $catalogo_page = get_page_by_path('catalogo-de-servicos');

    if ( is_page('catalogo-de-servicos') || ( $catalogo_page && wp_get_post_parent_id(get_the_ID()) == $catalogo_page->ID ) ) {
        return 'catalogo-servicos';
    }

    return str_replace(".php", "", basename(get_page_template_slug()));
}

/**
 * Set array of files (CSS & JS) that are used on pages
 */
function enqueueTargetAssets($page) {
    $pageAssetsConfig = (object) array(
        "home" => ["javascripts" => ["home.js"], "css" => ["home.min.css"], "type" => "page", "concat" => true],
        "login" => ["javascripts" => ["login.js"], "css" => ["login.min.css"], "type" => "page", "concat" => true],
        "tutoriais-manuais" => ["javascripts" => ["tutoriais-manuais.js"], "css" => ["tutoriais-manuais.min.css"], "type" => "page", "concat" => true],
        "boletos-faturas" => ["javascripts" => ["boletos-faturas.js"], "css" => ["boletos-faturas.min.css"], "type" => "page", "concat" => true],
        "his-memorando" => ["javascripts" => ["his-memorando.js"], "css" => ["his-memorando.min.css"], "type" => "page", "concat" => true],
        "his-reprocessamento" => ["javascripts" => ["his-reprocessamento.js"], "css" => ["his-reprocessamento.min.css"], "type" => "page", "concat" => true],
        "his-prod-cadastrado" => ["javascripts" => ["his-prod-cadastrado.js"], "css" => ["his-prod-cadastrado.min.css"], "type" => "page", "concat" => true],
        "cad-prod" => ["javascripts" => ["cad-prod.js"], "css" => ["cad-prod.min.css"], "type" => "page", "concat" => true],
        "faq" => ["javascripts" => ["faq.js"], "css" => ["faq.min.css"], "type" => "page", "concat" => true],
        "rastreabilidade-produtos" => ["javascripts" => ["rastreabilidade-produtos.js"], "css" => ["rastreabilidade-produtos.min.css"], "type" => "page", "concat" => true],
        "perfil-contrato-digital" => ["javascripts" => ["perfil-contrato-digital.js"], "css" => ["perfil-contrato-digital.min.css"], "type" => "page", "concat" => true],
        "perfil-avisos-notificacoes" => ["javascripts" => ["perfil-avisos-notificacoes.js"], "css" => ["perfil-avisos-notificacoes.min.css"], "type" => "page", "concat" => true],
        "perfil-meus-dados" => ["javascripts" => ["perfil-meus-dados.js"], "css" => ["perfil-meus-dados.min.css"], "type" => "page", "concat" => true],
        "memorando-col-produtos" => ["javascripts" => ["memorando-col-produtos.js"], "css" => ["memorando-col-produtos.min.css"], "type" => "page", "concat" => true],
        "formas-pagamento" => ["javascripts" => ["formas-pagamento.js"], "css" => ["formas-pagamento.min.css"], "type" => "page", "concat" => true],
        "catalogo-servicos" => ["javascripts" => ["catalogo-servicos.js"], "css" => ["catalogo-servicos.min.css"], "type" => "page", "concat" => true],
    );

    if (property_exists($pageAssetsConfig, $page)) {
        $config = (object) $pageAssetsConfig->{$page};

        // If concat is false, add filter once
        if ($config->concat === false) {
            add_filter('js_do_concat', function ($do_concat, $handle) {
                return false;
            }, 10, 2);

            add_filter('css_do_concat', function () {
                return false;
            });
        }

        // Enqueue scripts
        foreach ($config->javascripts as $i => $js_file) {
            $handle = "pl-js-{$page}-$i";
            // Add jquery dependency if needed, adjust as per your scripts
            $deps = ($page === 'login') ? ['jquery'] : [];
            wp_register_script($handle, get_stylesheet_directory_uri() . "/assets/js/pages/{$js_file}", $deps, ASSETS_VERSION, true);
            wp_enqueue_script($handle);

            if ($page === 'login') {
                wp_localize_script($handle, 'ajax_object', [
                    'ajax_url' => admin_url('admin-ajax.php'),
                ]);
            }
        }

        // Enqueue styles
        foreach ($config->css as $i => $css_file) {
            $handle = "pl-css-{$page}-$i";
            wp_register_style($handle, get_stylesheet_directory_uri() . "/assets/css/{$css_file}", array(), ASSETS_VERSION, "screen");
            wp_enqueue_style($handle);
        }
    }
}

function deleteJsAndCssEnqueueTargetAssetFromConcatenatedBundle($handle) {
    return false;
}

/**
 * Functions that call the files that the modules depend on
 */

function loadLibsScriptsForTemplate($file) {
    wp_register_script($file, get_stylesheet_directory_uri() . '/assets/lib/' . $file, array(), ASSETS_VERSION, true);
    wp_enqueue_script($file);
}

function loadModulesScriptsForTemplate($file) {
    wp_register_script($file, get_stylesheet_directory_uri() . '/assets/js/page-modules/' . $file, array(), ASSETS_VERSION, true);
    wp_enqueue_script($file);
}

function loadModulesCssForTemplate($file) {
    wp_register_style($file, get_stylesheet_directory_uri() . "/assets/css/page-modules/" . $file, array(), ASSETS_VERSION, "screen");
    wp_enqueue_style($file);
}