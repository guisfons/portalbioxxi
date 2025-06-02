/**
 * Helpers function works like a class. You can reate new instance of it with some params to do something: new Helpers({method : 'POST'}}
 * Each global param can be override passing it globally or for the specific internal function.
 * @version 2.1.1 - solved bug for custom dataType in ajax
 * @author Marcos Freitas
 * @url https://github.com/marcosfreitas
 * @param params for all internal functions.
 * @constructor
 */

let Helpers;

Helpers = function (params) {

    'use strict';

    let __default = {
        protocol: '',
        host: "",
        headers : {},
        recursive_cron: 0, // a counter passed to recursive function
        recursive_call_intervals: 3000,
        recursive_max_wait_for: 15, // a limit passed to recursive function
        method: 'GET',
    },
    helper = $.extend(true, {}, __default, params),
    self = this;

    // declared functions into Helpers' scope

    // Returns a function, that, as long as it continues to be invoked, will not be triggered.
    // The function will be called after it stops being called for N milliseconds.
    // If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
    // https://davidwalsh.name/javascript-debounce-function
    this.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    this.call_recursive = function (callback) {
        try {

            if (helper.recursive_call_intervals / 1000 <= helper.recursive_max_wait_for) {

                console.warn('waiting ' + helper.recursive_call_intervals + ' seconds...');

                helper.recursive_cron =
                    setInterval(function () {

                        helper.recursive_call_intervals += 3000;
                        clearInterval(helper.recursive_cron);

                        callback();

                    }, helper.recursive_call_intervals)
                ;
            } else {
                helper.recursive_call_intervals = 3000;
                clearInterval(helper.recursive_cron);
                return false;
            }


            return true;
        } catch(e) {
            console.error('recursive call failed... ' + e);
        }
    };

    /**
     * @version 1.1.2
     * Fixed the params (o) order declaration and merge with $.extend
     * Added X-CSRF-TOKEN to headers if tag meta exists
     *
     * @param options
     * @returns {*|{interval_requests, max_time_waiting, method}|{readyState, getResponseHeader, getAllResponseHeaders, setRequestHeader, overrideMimeType, statusCode, abort}}
     */
    this.ajax = function (options) {

        try {

            let o = {};

            // request's parameters
            o.cache = false;
            o.timeout = 10000;
            o.headers = {};
            o.dataType = 'json';

            if ($('meta[name="csrf-token"]').length > 0){
                o.headers = {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                };
            };

            o = $.extend(true, o, helper, options);

            if (typeof o.jsonp_callback !== 'undefined') {
                o.crossDomain = true;
                o.jsonpCallback = o.jsonp_callback;
                o.dataType = 'jsonp';
            }

            return $.ajax(o);

        } catch (e) {
            console.error('I couldn\'t do this... ' + e);
        }

    };

    this.content_is_loading = function(params) {

        let __default, config, html;
        __default = {
			scope: $('html'),
            tag_left: '',
            tag_right: ''
        };
        config = $.extend({}, __default, params);
        html = '<div class="loading"><div class="loading__animation loading__animation--blue is-animating"><span></span></div></div>';


		if (config.scope.find('.loader').length === 0) {
			config.scope.prepend('<div class="loader centralize" style="height:100px;"></div>');
		}

		config.loader = config.scope.find('.loader');

        // like toggle
        if (config.scope.hasClass('is-loading')) {
			config.loader.remove();
            config.scope.removeClass('is-loading');

            return this;
        };

        config.scope.addClass('is-loading');
        config.loader.html(config.tag_left + html + config.tag_right).show();

        return this;
    };

    /**
     * Function to load css and js resources
     */
    this.load = (function() {
        /*
         * Function which returns a function
         */
        function _load(tag) {

          return function(url) {
            // This promise will be used by Promise.all to determine success or failure
            return new Promise(function(resolve, reject) {
              var element = document.createElement(tag);
              var parent = 'body';
              var attr = 'src';

              // Important success and error for the promise
              element.onload = function() {
                resolve(url);
              };
              element.onerror = function() {
                reject(url);
              };

              // Need to set different attributes depending on tag type
              switch(tag) {
                case 'script':
                  element.async = true;
                  break;
                case 'link':
                  element.type = 'text/css';
                  element.rel = 'stylesheet';
                  attr = 'href';
                  parent = 'head';
              }

              // Inject into document to kick off loading
              element[attr] = url;
              document[parent].appendChild(element);
            });
          };
        }

        return {
            css: _load('link'),
            js: _load('script'),
        };
    })(),

    /**
     * @version 1.1.0 redefined items quantity behavior
     */
    this.pagination = {
        events : function(callback, apply_params) {
            /*$(window).on('hashchange', function() {
                if (window.location.hash) {
                    var page = window.location.hash.replace('#', '');
                    if (page == Number.NaN || page <= 0) {
                        return false;
                    }
                    getPosts(page);
                }
            });*/

            $('ul.pagination a').on('click', function(e) {
               e.preventDefault();

               apply_params.url = $(this).attr('href');
               callback(apply_params);

            });
        },
        build : function(params) {

            let __default = {
                    current_page : '',
                    first_page_url : '',
                    from : '',
                    last_page : '',
                    last_page_url : '',
                    next_page_url : '',
                    path : '',
                    per_page : '',
                    prev_page_url : '',
                    to : '',
                    total : '',
                },
                config = $.extend({}, __default, params);

            config.total_pages = Math.ceil(config.total/config.per_page);

            let html = '<ul class="pagination" role="navigation">';

            // previous page
            if (!config.prev_page_url) {

                html += '<li class="page-item disabled">';
                html += '<span class="page-link">‹</span>';
                html += '</li>';

            } else {

                if (config.current_page > 4) {
                    html += '<li class="page-item"><a title="primeira página" class="page-link" href="'+ config.first_page_url +'">‹‹</a></li>';
                }

                if(config.prev_page_url) {
                    html += '<li class="page-item"><a title="página anterior" class="page-link" href="'+ config.prev_page_url +'">‹</a></li>';
                }

            }


            // pages
            for (let i = 1; i <= config.total_pages; i++) {
                if(
                    i <= 2 || // first items
                    (i > 2 && i >= config.current_page - 3 && i <= config.current_page + 3) || // middle itens
                    i >= config.total_pages - 1 // last items
                ) {
                    html += '<li class="page-item '+  ((i === config.current_page) ? 'active' : '') +'">';
                        if (i === config.current_page) {
                            html += '<span class="page-link">'+ i +'</span>';
                        } else {
                            html += '<a class="page-link" href="' + config.path + '?page=' + i + '">' + i + '</a>';
                        }
                    html += '</li>';
                }

                if (
                    config.total_pages > 10 &&
                    (
                        i === 2 && config.current_page > 2 ||
                        i === (config.total_pages - 2)-1
                    )
                ) {
                    html += '<li class="page-item disabled">';
                    html += '<span class="page-link">...</span>';
                    html += '</li>';
                }
            }

            // next page
            if (!config.next_page_url) {

                html += '<li class="page-item disabled">';
                html += '<span class="page-link">›</span>';
                html += '</li>';

            } else {

                if(config.next_page_url) {
                   html += '<li class="page-item"><a title="próxima página" class="page-link" href="'+ config.next_page_url +'">›</a></li>';
                }

                if (config.current_page < config.total_pages) {
                    html += '<li class="page-item"><a title="última página" class="page-link" href="'+ config.last_page_url +'">››</a></li>';
                }

            }

            html += '</ul>';

            return html;
        }
    };

    // first run, make some auto-adjusts

    (function (params, self) {

        helper.protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
        helper.host = window.location.host;

        if (typeof params !== 'undefined') {
            if (typeof params.host !== 'undefined') {
                // defining the correct path of localhost projects
                if (helper.host.indexOf('localhost') >= 0) {
                    helper.host = params.host;
                }
            }
        }

        // return self;
    })(params, self);

};
