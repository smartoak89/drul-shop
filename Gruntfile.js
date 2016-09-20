module.exports = function(grunt) {
    grunt.initConfig({
        // Beautifier
        jsbeautifier: {
            files: [
                "modules/**/*.js",
                "modules/**/*.html",
                "modules/**/*.css",
                "core/**/*.js",
                "app.js",
                "config.js",
                "views/*.html"
            ],
            options: {
                html: {
                    braceStyle: "collapse",
                    indentChar: "\t",
                    indentScripts: "keep",
                    indentSize: 1,
                    maxPreserveNewlines: 10,
                    preserveNewlines: false,
                    unformatted: ["a", "sub", "sup", "b", "i", "u"],
                    wrapLineLength: 0
                },
                css: {
                    indentChar: "\t",
                    indentSize: 1
                },
                js: {
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 1,
                    indentWithTabs: true,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
            }
        },
        // Compress
        uglify: {
            module_auth_cp: {
                files: {
                    'modules/auth/public/modules/auth/js/auth_cp.min.js': ['public/js/jquery.medved.loading.js', 'public/js/uikit/addons/tooltip.min.js', 'public/js/jquery.placeholder.js', 'modules/auth/public/modules/auth/js/auth_cp.js']
                }
            },
            module_auth_user: {
                files: {
                    'modules/auth/public/modules/auth/js/auth_user.min.js': ['modules/auth/public/modules/auth/js/auth_user.js', 'public/js/helper.js', 'public/js/uikit/addons/tooltip.min.js']
                }
            },
            module_auth_password: {
                files: {
                    'modules/auth/public/modules/auth/js/auth_password.min.js': ['public/js/helper.js', 'modules/auth/public/modules/auth/js/pwd.js', 'modules/auth/public/modules/auth/js/password.js']
                }
            },
            module_auth_register: {
                files: {
                    'modules/auth/public/modules/auth/js/auth_register.min.js': ['public/js/helper.js', 'modules/auth/public/modules/auth/js/pwd.js', 'public/js/uikit/addons/tooltip.min.js', 'modules/auth/public/modules/auth/js/register.js']
                }
            },
            module_auth_reset: {
                files: {
                    'modules/auth/public/modules/auth/js/auth_reset.min.js': ['public/js/helper.js', 'public/js/uikit/addons/tooltip.min.js', 'modules/auth/public/modules/auth/js/reset.js']
                }
            },
            module_auth_profile: {
                files: {
                    'modules/auth/public/modules/auth/js/auth_profile.min.js': ['public/js/helper.js', 'public/js/jquery.medved.loading.js', 'modules/auth/public/modules/auth/js/pwd.js', 'public/js/uikit/addons/notify.min.js', 'modules/auth/public/modules/auth/js/profile.js']
                }
            },
            admin: {
                files: {
                    'public/js/admin.min.js': ['public/js/json2.js', 'public/js/jquery.min.js', 'public/js/jquery.history.min.js', 'public/js/jquery.medved.table.js', 'public/js/uikit/uikit.min.js', 'public/js/uikit/addons/notify.min.js', 'public/js/uikit/addons/tooltip.min.js', 'public/js/helper.js']
                }
            },
            module_files: {
                files: {
                    'modules/files/public/modules/files/js/files.min.js': ['modules/files/public/modules/files/js/dragdrop.helper.js', 'modules/files/public/modules/files/js/jquery.shifty.js', 'modules/files/public/modules/files/js/dragdrop.js', 'modules/files/public/modules/files/js/main.js']
                }
            },
            module_menu: {
                files: {
                    'modules/menu/public/modules/menu/js/menu.min.js': 'modules/menu/public/modules/menu/js/main.js'
                }
            },
            module_cp: {
                files: {
                    'modules/cp/public/modules/cp/js/cp.min.js': 'modules/cp/public/modules/cp/js/main.js'
                }
            },
            module_templates: {
                files: {
                    'modules/templates/public/modules/templates/js/templates.min.js': 'modules/templates/public/modules/templates/js/templates.js'
                }
            },
            module_pages: {
                files: {
                    'modules/pages/public/modules/pages/js/pages.min.js': ['public/js/jquery.medved.loading.js', 'public/js/jstorage.js', 'public/js/moment.min.js', 'modules/pages/public/modules/pages/js/main.js', 'modules/pages/public/modules/pages/js/tree.js']
                }
            },
            module_parts: {
                files: {
                    'modules/parts/public/modules/parts/js/parts.min.js': 'modules/parts/public/modules/parts/js/main.js'
                }
            },
            module_browse: {
                files: {
                    'modules/browse/public/modules/browse/js/browse.min.js': ['public/js/uikit/addons/tooltip.min.js', 'modules/browse/public/modules/browse/js/main.js']
                }
            },
            module_settings: {
                files: {
                    'modules/settings/public/modules/settings/js/settings.min.js': 'modules/settings/public/modules/settings/js/main.js'
                }
            },
            module_invites: {
                files: {
                    'modules/invites/public/modules/invites/js/invites.min.js': ['public/js/jquery.medved.loading.js', 'public/js/moment.min.js', 'modules/invites/public/modules/invites/js/invites.js']
                }
            },
            module_user: {
                files: {
                    'modules/user/public/modules/user/js/user.min.js': 'modules/user/public/modules/user/js/main.js'
                }
            },
            module_search: {
                files: {
                    'modules/search/public/modules/search/js/search.min.js': ['public/js/helper.js', 'modules/search/public/modules/search/js/main.js']
                }
            },
            module_textedit_codemirror: {
                files: {
                    'modules/textedit/public/modules/textedit/js/codemirror/codemirror.min.js': ['modules/textedit/public/modules/textedit/js/codemirror/codemirror.js', 'modules/textedit/public/modules/textedit/js/codemirror/brace-fold.js', 'modules/textedit/public/modules/textedit/js/codemirror/closebrackets.js', 'modules/textedit/public/modules/textedit/js/codemirror/comment.js', 'modules/textedit/public/modules/textedit/js/codemirror/dialog.js', 'modules/textedit/public/modules/textedit/js/codemirror/foldcode.js', 'modules/textedit/public/modules/textedit/js/codemirror/hardwrap.js', 'modules/textedit/public/modules/textedit/js/codemirror/match-highlighter.js', 'modules/textedit/public/modules/textedit/js/codemirror/matchbrackets.js', 'modules/textedit/public/modules/textedit/js/codemirror/search.js', 'modules/textedit/public/modules/textedit/js/codemirror/searchcursor.js', 'modules/textedit/public/modules/textedit/js/codemirror/sublime.js', 'modules/textedit/public/modules/textedit/js/codemirror/mode/css.js', 'modules/textedit/public/modules/textedit/js/codemirror/mode/htmlmixed.js', 'modules/textedit/public/modules/textedit/js/codemirror/mode/javascript.js', 'modules/textedit/public/modules/textedit/js/codemirror/mode/xml.js']
                }
            },
            module_textedit: {
                files: {
                    'modules/textedit/public/modules/textedit/js/textedit.min.js': 'modules/textedit/public/modules/textedit/js/main.js'
                }
            },
            module_blog_post: {
                files: {
                    'modules/blog/public/modules/blog/js/blog_post.min.js': ['public/js/jquery.medved.loading.js', 'modules/blog/public/modules/blog/js/wysibb/jquery.wysibb.min.js', 'public/js/helper.js', 'public/js/uikit/addons/tooltip.min.js', 'modules/blog/public/modules/blog/js/blog_post.js']
                }
            },
            module_blog_cp: {
                files: {
                    'modules/blog/public/modules/blog/js/blog_cp.min.js': ['public/js/jquery.medved.loading.js', 'modules/blog/public/modules/blog/js/blog_cp.js']
                }
            },
            module_blog_view: {
                files: {
                    'modules/blog/public/modules/blog/js/blog_view.min.js': ['public/js/jquery.medved.loading.js', 'public/js/uikit/addons/tooltip.min.js', 'modules/blog/public/modules/blog/js/blog_comment.js']
                }
            },
            module_social: {
                files: {
                    'modules/social/public/modules/social/js/social.min.js': ['public/js/jquery.medved.loading.js', 'public/js/uikit/addons/tooltip.min.js', 'public/js/helper.js', 'public/js/socket.io.min.js', 'public/js/jquery.history.min.js', 'public/js/moment.min.js', 'public/js/uikit/addons/notify.min.js', 'modules/social/public/modules/social/js/jquery.typing.min.js', 'modules/social/public/modules/social/js/social.js']
                }
            },
            module_catalog_frontend: {
                files: {
                    'modules/catalog/public/modules/catalog/js/frontend.min.js': ['public/js/helper.js', 'public/js/uikit/addons/tooltip.min.js', 'modules/catalog/public/modules/catalog/js/frontend.js']
                }
            },
            module_catalog_frontend_cart: {
                files: {
                    'modules/catalog/public/modules/catalog/js/frontend_cart.min.js': ['public/js/uikit/addons/tooltip.min.js', 'modules/catalog/public/modules/catalog/js/frontend_cart.js']
                }
            },
            module_catalog_frontend_checkout: {
                files: {
                    'modules/catalog/public/modules/catalog/js/frontend_checkout.min.js': ['public/js/uikit/addons/tooltip.min.js', 'modules/catalog/public/modules/catalog/js/frontend_checkout.js']
                }
            },
            module_catalog_frontend_item: {
                files: {
                    'modules/catalog/public/modules/catalog/js/frontend_item.min.js': ['public/js/uikit/addons/tooltip.min.js', 'public/js/magnific/magnific.min.js', 'modules/catalog/public/modules/catalog/js/frontend_item.js']
                }
            },
            module_catalog_frontend_orders: {
                files: {
                    'modules/catalog/public/modules/catalog/js/frontend_orders.min.js': ['public/js/uikit/addons/tooltip.min.js', 'public/js/helper.js', 'public/js/jquery.history.min.js', 'modules/catalog/public/modules/catalog/js/frontend_orders.js']
                }
            },
            module_catalog_orders: {
                files: {
                    'modules/catalog_orders/public/modules/catalog_orders/js/catalog_orders.min.js': ['public/js/uikit/addons/tooltip.min.js', 'modules/catalog_orders/public/modules/catalog_orders/js/main.js']
                }
            },
            module_warehouse: {
                files: {
                    'modules/warehouse/public/modules/warehouse/js/warehouse.min.js': ['public/js/jquery.medved.loading.js', 'public/js/uikit/addons/sortable.min.js', 'public/js/jstorage.js', 'public/js/moment.min.js', 'modules/warehouse/public/modules/warehouse/js/dragdrop.js', 'modules/warehouse/public/modules/warehouse/js/dragdrop.helper.js', 'modules/warehouse/public/modules/warehouse/js/jquery.shifty.js', 'modules/warehouse/public/modules/warehouse/js/main.js', 'modules/warehouse/public/modules/warehouse/js/tree.js']
                }
            },
            module_warehouse_conf: {
                files: {
                    'modules/warehouse_conf/public/modules/warehouse_conf/js/warehouse_conf.min.js': ['public/js/jquery.medved.loading.js', 'public/js/uikit/addons/sortable.min.js', 'modules/warehouse_conf/public/modules/warehouse_conf/js/warehouse_conf_cp.js']
                }
            },
            module_siteconf: {
                files: {
                    'modules/siteconf/public/modules/siteconf/js/siteconf_cp.min.js': ['public/js/jquery.medved.loading.js', 'modules/siteconf/public/modules/siteconf/js/siteconf_cp.js']
                }
            },
            log: {
                files: {
                    'modules/log/public/modules/log/js/log.min.js': ['modules/log/public/modules/log/js/log.js']
                }
            },
            feedback: {
                files: {
                    'modules/feedback/public/modules/feedback/js/feedback.min.js': ['public/js/helper.js', 'public/js/uikit/addons/tooltip.min.js', 'modules/feedback/public/modules/feedback/js/main.js']
                }
            },
            billing_accounts: {
                files: {
                    'modules/billing_accounts/public/modules/billing_accounts/js/billing_accounts.min.js': ['public/js/moment.min.js', 'public/js/jquery.medved.loading.js', 'public/js/uikit/addons/datepicker.min.js', 'modules/billing_accounts/public/modules/billing_accounts/js/billing_accounts_cp.js']
                }
            },
            billing_conf: {
                files: {
                    'modules/billing_conf/public/modules/billing_conf/js/billing_conf.min.js': ['public/js/jquery.medved.loading.js', 'public/js/uikit/addons/sortable.min.js', 'modules/billing_conf/public/modules/billing_conf/js/billing_conf_cp.js']
                }
            },
            billing_profiles: {
                files: {
                    'modules/billing_profiles/public/modules/billing_profiles/js/billing_profiles.min.js': ['public/js/moment.min.js', 'public/js/jquery.medved.loading.js', 'public/js/uikit/addons/autocomplete.min.js', 'public/js/uikit/addons/datepicker.min.js', 'public/js/uikit/addons/timepicker.min.js', 'modules/billing_profiles/public/modules/billing_profiles/js/billing_profiles_cp.js']
                }
            },
            billing_frontend: {
                files: {
                    'modules/billing_frontend/public/modules/billing_frontend/js/billing_frontend.min.js': ['public/js/moment.min.js', 'public/js/helper.js', 'public/js/uikit/addons/notify.min.js', 'public/js/uikit/addons/tooltip.min.js', 'public/js/uikit/addons/accordion.min.js', 'modules/billing_frontend/public/modules/billing_frontend/js/billing_frontend.js']
                }
            },
            support_dashboard: {
                files: {
                    'modules/support/public/modules/support/js/dashboard.min.js': ['public/js/jquery.medved.loading.js', 'public/js/jquery.medved.table.js', 'public/js/uikit/addons/notify.min.js', 'public/js/moment.min.js', 'public/js/helper.js', 'public/js/jquery.history.min.js', 'public/js/socket.io.min.js', 'modules/support/public/modules/support/js/support_dashboard.js']
                }
            },
            support_frontend: {
                files: {
                    'modules/support/public/modules/support/js/frontend.min.js': ['public/js/jquery.medved.loading.js', 'public/js/jquery.medved.table.js', 'public/js/uikit/addons/notify.min.js', 'public/js/moment.min.js', 'public/js/helper.js', 'public/js/jquery.history.min.js', 'modules/support/public/modules/support/js/support_frontend.js']
                }
            },
            chat: {
                files: {
                    'modules/chat/public/modules/chat/js/chat.min.js': ['public/js/helper.js', 'public/js/socket.io.min.js', 'public/js/moment.min.js', 'public/js/string.min.js', 'public/js/uikit/addons/notify.min.js', 'public/js/uikit/addons/tooltip.min.js', 'modules/chat/public/modules/chat/js/chat.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('beautifier', ['jsbeautifier']);

};
