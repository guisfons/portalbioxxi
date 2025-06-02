<?php

namespace OKN\Theme;

    class Theme
    {
        public function __construct()
        {
            $this->addThemeSupport('title-tag')
//				->addThemeSupport('custom-logo')
                ->addThemeSupport('post-thumbnails')
                ->addStyle('theme-styles', get_stylesheet_uri())
                ->addCommentScript()
            ;
            $this->secureWordPress();
            // Remove Admin Bar from front-end
            $this->addFilter('show_admin_bar', '__return_false');
        }



        public function populateRequiredStructure($function)
        {
            $this->actionActivation($function);
        }

        public function addThemeSupport($feature, $options = null)
        {
            $this->actionAfterSetup(function () use ($feature, $options) {
                if ($options) {
                    add_theme_support($feature, $options);
                } else {
                    add_theme_support($feature);
                }
            });

            return $this;
        }

        public function addPostSupport($post_type, $feature)
        {
            $this->actionAfterSetup(function () use ($post_type, $feature) {
                add_post_type_support($post_type, $feature);
            });

            return $this;
        }

        public function removeThemeSupport($feature)
        {
            $this->actionAfterSetup(function () use ($feature) {
                remove_theme_support($feature);
            });

            return $this;
        }

        public function loadTextDomain($domain, $path = false)
        {
            $this->actionAfterSetup(function () use ($domain, $path) {
                load_theme_textdomain($domain, $path);
            });

            return $this;
        }

        public function addImageSize($name, $width = 0, $height = 0, $crop = false)
        {
            $this->actionAfterSetup(function () use ($name, $width, $height, $crop) {
                add_image_size($name, $width, $height, $crop);
            });

            return $this;
        }

        public function removeImageSize($name)
        {
            $this->actionAfterSetup(function () use ($name) {
                remove_image_size($name);
            });

            return $this;
        }

        public function addStyle($handle, $src = '', $deps = [], $ver = false, $media = 'all')
        {
            $this->actionEnqueueScripts(function () use ($handle, $src, $deps, $ver, $media) {
                wp_enqueue_style($handle, $src, $deps, $ver, $media);
            });

            return $this;
        }

        public function addScript($handle, $src = '', $deps = [], $ver = false, $in_footer = false)
        {
            $this->actionEnqueueScripts(function () use ($handle, $src, $deps, $ver, $in_footer) {
                wp_enqueue_script($handle, $src, $deps, $ver, $in_footer);
            });

            return $this;
        }

        public function addCommentScript()
        {
            $this->actionEnqueueScripts(function () {
                if (is_singular() && comments_open() && get_option('thread_comments')) {
                    wp_enqueue_script('comment-reply');
                }
            });

            return $this;
        }

        public function removeStyle($handle)
        {
            $this->actionEnqueueScripts(function () use ($handle) {
                wp_dequeue_style($handle);
                wp_deregister_style($handle);
            });

            return $this;
        }

        public function removeScript($handle)
        {
            $this->actionEnqueueScripts(function () use ($handle) {
                wp_dequeue_script($handle);
                wp_deregister_script($handle);
            });

            return $this;
        }

        public function addNavMenus($locations = [])
        {
            $this->actionAfterSetup(function () use ($locations) {
                register_nav_menus($locations);
            });

            return $this;
        }

        public function addNavMenu($location, $description)
        {
            $this->actionAfterSetup(function () use ($location, $description) {
                register_nav_menu($location, $description);
            });

            return $this;
        }

        public function removeNavMenu($location)
        {
            $this->actionAfterSetup(function () use ($location) {
                unregister_nav_menu($location);
            });

            return $this;
        }

        public function removeAction($tag, $function, $priority = 10)
        {
            $this->actionAfterSetup(function () use ($tag, $function, $priority) {
                remove_action($tag, $function, $priority);
            });

            return $this;
        }

        public function removeFilter($tag, $function, $priority = 10)
        {
            $this->actionAfterSetup(function () use ($tag, $function, $priority) {
                remove_filter($tag, $function, $priority);
            });

            return $this;
        }

        public function addFilter($tag, $function, $priority = 10)
        {
            $this->actionAfterSetup(function () use ($tag, $function, $priority) {
                add_filter($tag, $function, $priority);
            });

            return $this;
        }

        public function createOptionsPage($options)
        {
            $this->actionAfterSetup(function () use ($options) {
                if (function_exists('acf_add_options_page')) {
                    acf_add_options_page($options);
                }
            });

            return $this;
        }

        public function createPage($page_title, $page_content, $page_slug = null, $page_template = null)
        {
            if (empty($page_slug)) {
                $page_slug = str_replace($page_title, ' ', '-');
                $page_slug = strtolower($page_slug);
            }
            $this->createPostType($page_title, $page_slug, 'page', $page_content, $page_template);

            return $this;
        }

        public function createPost($post_title, $post_content, $post_slug = null)
        {
            if (empty($post_slug)) {
                $post_slug = str_replace($post_title, ' ', '-');
                $post_slug = strtolower($post_slug);
            }
            $this->createPostType($post_title, $post_slug, 'post', $post_content);

            return $this;
        }

        public function createPostType($post_title, $post_slug, $post_type, $post_content = '', $page_template = null)
        {
            $this->actionActivation(function () use ($post_title, $post_slug, $post_type, $post_content, $page_template) {
                $post_check = $this->get_post_by_slug($post_slug, $post_type);
                $post = [
                    'post_type' => $post_type,
                    'post_title' => $post_title,
                    'post_name' => $post_slug,
                    'post_content' => $post_content,
                    'post_status' => 'publish',
                    'post_author' => 1,
                ];
                if (!isset($post_check->ID)) {
                    $post_id = wp_insert_post($post);
                    if (!empty($page_template)) {
                        update_post_meta($post_id, '_wp_page_template', $page_template);
                    }
                }
            });

            return $this;
        }

        public function createMenu($menuname, $location = null, $nav_items = [])
        {
            if (empty($location)) {
                $location = $menuname;
            }
            $this->actionActivation(function () use ($menuname, $location) {
                $menu_exists = wp_get_nav_menu_object($menuname);
                if (!$menu_exists) {
                    $menu_id = wp_create_nav_menu($menuname);
                } else {
                    $menu_id = $menu_exists->term_id;
                }
                $locations = get_theme_mod('nav_menu_locations');
                $locations[$location] = $menu_id;
                set_theme_mod('nav_menu_locations', $locations);
            });
            foreach ($nav_items as $nav_item) {
                $this->createMenuItem($menuname, $nav_item['title'], $nav_item['url'], $nav_item['classes'] ?? []);
            }

            return $this;
        }

        public function createMenuItem($menuname, $title, $url, $classes = [])
        {
            $this->actionActivation(function () use ($menuname, $title, $url, $classes) {
                $menu_exists = wp_get_nav_menu_object($menuname);
                $menu_id = $menu_exists->term_id;
                $array_menu = wp_get_nav_menu_items($menu_id);
                if (!in_array(__($title), array_column($array_menu, 'post_title'), true)) {
                    wp_update_nav_menu_item($menu_id, 0, [
                        'menu-item-title' => __($title),
                        'menu-item-classes' => implode(' ', $classes),
                        'menu-item-url' => $url,
                        'menu-item-status' => 'publish', ]);
                }
            });

            return $this;
        }

        public function get_post_by_slug($slug, $post_type = 'post')
        {
            $args = [
                'name' => $slug,
                'post_type' => $post_type,
            ];
            $found_post = get_posts($args);
            if (!empty($found_post)) {
                return $found_post[0];
            }

            return [];
        }

        private function actionAfterSetup($function)
        {
            add_action('after_setup_theme', function () use ($function) {
                $function();
            });
        }

        private function actionActivation($function)
        {
            add_action('after_switch_theme', function () use ($function) {
                $function();
            });
        }

        private function actionEnqueueScripts($function, $priority = 10)
        {
            add_action('wp_enqueue_scripts', function () use ($function) {
                $function();
            }, $priority);
        }

        private function secureWordPress()
        {
            /*
             * @info Security Tip
             * Remove version info from head and feeds
             */
            $this->addFilter('the_generator', function () {
                return false;
            });
            /*
             * @info Security Tip
             * Disable oEmbed Discovery Links and wp-embed.min.js
             */
            $this->removeAction('wp_head', 'wp_oembed_add_discovery_links', 10);
            $this->removeAction('wp_head', 'wp_oembed_add_host_js');
            $this->removeAction('rest_api_init', 'wp_oembed_register_route');
            $this->removeFilter('oembed_dataparse', 'wp_filter_oembed_result', 10);
        }
    }
