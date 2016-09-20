module.exports = function(app) {

    // Sort order hash

    var sort_cells = {
            pfolder: 1,
            pfilename: 1,
            plock: 1,
            ptitle: 1
        },
        sort_cell_default = 'pfolder',
        sort_cell_default_mode = 1;

    // Set items per page for this module

    var items_per_page = 30;

    var router = app.get('express').Router(),
        path = require('path'),
        ObjectId = require('mongodb').ObjectID,
        i18nm = new(require('i18n-2'))({
            locales: app.get('config').locales.avail,
            directory: path.join(__dirname, 'lang'),
            extension: '.js',
            devMode: app.get('config').locales.dev_mode
        }),
        parser = app.get('parser'),
        async = require('async');

    router.get_module_name = function(req) {
        i18nm.setLocale(req.session.current_locale);
        return i18nm.__("module_name");
    };

    router.get('/', function(req, res) {
        i18nm.setLocale(req.session.current_locale);

        if (!req.session.auth || req.session.auth.status < 2) {
            req.session.auth_redirect_host = req.get('host');
            req.session.auth_redirect = '/cp/pages';
            res.redirect(303, "/auth/cp?rnd=" + Math.random().toString().replace('.', ''));
            return;
        }

        app.get('mongodb').collection('pages_folders').find({
            oname: 'folders_json'
        }, {
            limit: 1
        }).toArray(function(err, items) {

            var folders;
            if (!items || !items.length || !items[0].ovalue) {
                // Set default value for folders
                folders = '[{"id":"j1_1","text":"/","data":null,"parent":"#","type":"root"}]';
            } else {
                folders = items[0].ovalue;
            }
            var body = app.get('renderer').render_file(path.join(__dirname, 'views'), 'pages_control', {
                lang: i18nm,
                folders: folders,
                auth: req.session.auth,
                locales: JSON.stringify(app.get('config').locales.avail),
                layouts: JSON.stringify(app.get('config').layouts),
                current_locale: req.session.current_locale
            }, req);

            app.get('cp').render(req, res, {
                body: body,
                css: '<link rel="stylesheet" href="/modules/pages/css/main.css">' + '<link rel="stylesheet" href="/js/jstree/theme/style.min.css">'
            }, i18nm, 'pages', req.session.auth);

        });
    });

    /*

    Pages

    */

    router.post('/data/list', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        var rep = {
            ipp: items_per_page
        };
        var skip = req.body.skip;
        var query = req.body.query;
        var sort_mode = req.body.sort_mode;
        var sort_cell = req.body.sort_cell;
        if (typeof skip != 'undefined')
            if (!skip.match(/^[0-9]{1,10}$/)) {
                rep.status = 0;
                rep.error = i18nm.__("invalid_query");
                return res.send(JSON.stringify(rep));
            }
        if (typeof query != 'undefined')
            if (!query.match(/^[\w\sА-Яа-я0-9_\-\.]{3,40}$/)) {
                rep.status = 0;
                rep.error = i18nm.__("invalid_query");
                return res.send(JSON.stringify(rep));
            }
        if (!req.session.auth || req.session.auth.status < 2) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            return res.send(JSON.stringify(rep));
        }
        var sort = {};
        sort[sort_cell_default] = sort_cell_default_mode;
        if (sort_cells && sort_cells[sort_cell]) {
            sort = {};
            sort[sort_cell] = 1;
            if (typeof sort_mode != 'undefined' && sort_mode == -1) {
                sort[sort_cell] = -1;
            }
        }
        rep.items = [];
        var find_query = {};
        if (query) {
            find_query = {
                $or: [{
                    pfilename: new RegExp(query, 'i')
                }, {
                    pfolder: new RegExp(query, 'i')
                }]
            };
            var tsq = {};
            tsq["pdata." + req.session.current_locale + '.ptitle'] = new RegExp(query, 'i');
            find_query.$or.push(tsq);
        }
        app.get('mongodb').collection('pages').find(find_query).count(function(err, items_count) {
            if (!err && items_count > 0) {
                rep.total = items_count;
                app.get('mongodb').collection('pages').find(find_query, {
                    skip: skip,
                    limit: items_per_page
                }).sort(sort).toArray(function(err, items) {
                    if (!err && items && items.length) {
                        for (var i = 0; i < items.length; i++) {
                            var arr = [];
                            arr.push(items[i]._id);
                            if (items[i].pfolder != '/') {
                                items[i].pfilename = '/' + items[i].pfilename;
                                items[i].pfilename = items[i].pfilename.replace(/\/$/, '');
                            }
                            arr.push(items[i].pfolder + items[i].pfilename);
                            if (items[i].pdata && items[i].pdata[req.session.current_locale])
                                arr.push(items[i].pdata[req.session.current_locale].ptitle);
                            arr.push(items[i].plock);
                            rep.items.push(arr);
                        }
                    }
                    // Return results
                    rep.status = 1;
                    res.send(JSON.stringify(rep));
                }); // data
            } else { // Error or count = 0
                rep.status = 1;
                rep.total = '0';
                res.send(JSON.stringify(rep));
            }
        }); // count
    });

    router.post('/data/list/all', function(req, res) {
        var lng = req.session.current_locale;
        i18nm.setLocale(lng);
        // Check authorization
        if (!req.session.auth || req.session.auth.status < 2) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            res.send(JSON.stringify(rep));
            return;
        }
        var rep = {
                items: []
            },
            get_what = {
                pfilename: 1,
                pfolder: 1
            },
            get_sort = {};
        get_what['pdata.' + lng + '.ptitle'] = 1;
        get_sort['pdata.' + lng + '.ptitle'] = 1;
        // Get pages from MongoDB
        app.get('mongodb').collection('pages').find({}, get_what, {
            limit: 1000
        }).sort(get_sort).toArray(function(err, items) {
            if (typeof items != 'undefined' && !err) {
                // Generate array
                for (var i = 0; i < items.length; i++) {
                    var arr = [];
                    if (items[i].pfolder != '/') {
                        items[i].pfilename = '/' + items[i].pfilename;
                        items[i].pfilename = items[i].pfilename.replace(/\/$/, '');
                    }
                    arr.push(items[i].pfolder + items[i].pfilename);
                    if (!items[i].pdata[lng]) items[i].pdata[lng] = {};
                    arr.push(items[i].pdata[lng].ptitle);
                    rep.items.push(arr);
                }
            }
            // Return results
            rep.status = 1;
            res.send(JSON.stringify(rep));
        }); // data

    });

    router.post('/data/rootpages', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        var rep = {};
        // Check authorization
        if (!req.session.auth || req.session.auth.status < 2) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            res.send(JSON.stringify(rep));
            return;
        }
        // Get pages from MongoDB
        app.get('mongodb').collection('pages').find({
            pfilename: ''
        }, {
            pfolder: 1
        }, {
            limit: 1000
        }).toArray(function(err, items) {
            rep.root_pages = [];
            if (!err && typeof items != 'undefined') {
                for (var i = 0; i < items.length; i++) rep.root_pages.push(items[i].pfolder);
            }
            rep.status = 1;
            res.send(JSON.stringify(rep));
        });
    });

    router.post('/data/load', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        var rep = {};
        var id = req.body.pid,
            unlock = req.body.unlock;
        if (!id || !id.match(/^[a-f0-9]{24}$/)) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_query");
            return res.send(JSON.stringify(rep));
        }
        // Check authorization
        if (!req.session.auth || req.session.auth.status < 2) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            return res.send(JSON.stringify(rep));
        }
        var root_pages = [];
        async.series([
                function(callback) {
                    // Get root pages
                    app.get('mongodb').collection('pages').find({
                        pfilename: ''
                    }, {
                        pfolder: 1
                    }, {
                        limit: 1000
                    }).toArray(function(err, items) {
                        if (!err && typeof items != 'undefined') {
                            for (var i = 0; i < items.length; i++) root_pages.push(items[i].pfolder);
                        }
                        callback();
                    });
                },
                function(callback) {
                    // Unlock
                    if (unlock) {
                        app.get('mongodb').collection('pages').update({
                            _id: new ObjectId(id)
                        }, {
                            $set: {
                                plock: ''
                            }
                        }, function(err) {
                            return callback();
                        });
                    } else {
                        callback();
                    }
                },
                function(callback) {
                    // Get page from MongoDB
                    app.get('mongodb').collection('pages').find({
                        _id: new ObjectId(id)
                    }).toArray(function(err, page_data) {
                        if (err || !page_data || !page_data.length) {
                            rep.status = 0;
                            rep.error = i18nm.__("no_results_in_table");
                            return callback(true);
                        }
                        rep.status = 1;
                        rep.pages_data = page_data[0];
                        rep.root_pages = root_pages;
                        return callback();
                    });
                },
                function(callback) {
                    // Set locking
                    if (rep.pages_data && !rep.pages_data.plock) {
                        app.get('mongodb').collection('pages').update({
                            _id: new ObjectId(id)
                        }, {
                            $set: {
                                plock: req.session.auth.username
                            }
                        }, function(err) {
                            return callback();
                        });
                    } else {
                        callback();
                    }
                }
            ],
            function(err) {
                return res.send(JSON.stringify(rep));
            }
        );
    });

    router.post('/data/unlock', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        var rep = {};
        var id = req.body.pid;
        if (!id || !id.match(/^[a-f0-9]{24}$/)) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_query");
            return res.send(JSON.stringify(rep));
        }
        // Check authorization
        if (!req.session.auth || req.session.auth.status < 2) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            return res.send(JSON.stringify(rep));
        }
        async.series([
                function(callback) {
                    // Unlock
                    app.get('mongodb').collection('pages').update({
                        _id: new ObjectId(id)
                    }, {
                        $set: {
                            plock: undefined
                        }
                    }, function(err) {
                        return callback();
                    });
                }
            ],
            function(err) {
                return res.send(JSON.stringify(rep));
            }
        );
    });

    router.post('/data/save', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        var rep = {
            err_fields: [],
            status: 1
        };
        // Check authorization
        if (!req.session.auth || req.session.auth.status < 2) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            res.send(JSON.stringify(rep));
            return;
        }
        // Fields validation
        var pages_data = req.body.save_data;
        if (!pages_data) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_query");
            return res.send(JSON.stringify(rep));
        }
        if (pages_data._id)
            if (!pages_data._id.match(/^[a-f0-9]{24}$/)) {
                rep.status = 0;
                rep.error = i18nm.__("invalid_query");
                return res.send(JSON.stringify(rep));
            }
        if (!pages_data.pfolder_id || !pages_data.pfolder_id.match(/^[A-Za-z0-9_\-\.]{1,20}$/)) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_folder");
            return res.send(JSON.stringify(rep));
        }
        if (pages_data.pfilename && (!pages_data.pfilename || !pages_data.pfilename.match(/^[A-Za-z0-9_\-\.]{0,80}$/))) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_pfilename");
            return res.send(JSON.stringify(rep));
        }
        if (!pages_data.pfilename) pages_data.pfilename = '';
        if (!pages_data.pdata || typeof pages_data.pdata != 'object') {
            rep.status = 0;
            rep.error = i18nm.__("invalid_query");
            return res.send(JSON.stringify(rep));
        }
        for (var pd in pages_data.pdata) {
            if (!pages_data.pdata[pd].ptitle || pages_data.pdata[pd].ptitle.length > 100) {
                rep.status = 0;
                rep.error = i18nm.__("invalid_query");
                return res.send(JSON.stringify(rep));
            }
            var _plang = app.get('config').locales.avail[0];
            for (var i = 0; i < app.get('config').locales.avail.length; i++)
                if (pages_data.pdata[pd].plang == app.get('config').locales.avail[i])
                    _plang = app.get('config').locales.avail[i];
            pages_data.pdata[pd].plang = _plang;
            var _playout = app.get('config').layouts.default;
            for (var j = 0; j < app.get('config').layouts.avail.length; j++)
                if (pages_data.pdata[pd].playout == app.get('config').layouts.avail[j]) _playout = app.get('config').layouts.avail[j];
            pages_data.pdata[pd].playout = _playout;
        }
        var update = {
            pfilename: pages_data.pfilename,
            pfolder: pages_data.pfolder,
            pfolder_id: pages_data.pfolder_id,
            pdata: {}
        };
        for (var l in app.get('config').locales.avail)
            if (pages_data.pdata[app.get('config').locales.avail[l]]) {
                var lang = app.get('config').locales.avail[l];
                update.pdata[lang] = {};
                try {
                    update.pdata[lang].ptitle = pages_data.pdata[lang].ptitle;
                    update.pdata[lang].pkeywords = pages_data.pdata[lang].pkeywords;
                    update.pdata[lang].pdesc = pages_data.pdata[lang].pdesc;
                    update.pdata[lang].pcontent = pages_data.pdata[lang].pcontent;
                    update.pdata[lang].playout = pages_data.pdata[lang].playout;
                } catch (ex) {
                    rep.status = 0;
                    rep.error = i18nm.__("invalid_query") + ' (' + ex + ')';
                    return res.send(JSON.stringify(rep));
                }
            }
        async.series([
            function(callback) {
                if (pages_data._id) {
                    app.get('mongodb').collection('pages').find({
                        _id: new ObjectId(pages_data._id)
                    }, {
                        plock: 1
                    }).toArray(function(err, items) {
                        if (items && items.length)
                            if (items[0].plock && items[0].plock != req.session.auth.username) {
                                rep.status = 0;
                                rep.error = i18nm.__("locked_by") + ': ' + items[0].plock;
                                return callback(true);
                            }
                        callback();
                    });
                } else {
                    callback();
                }
            },
            function(callback) {
                var query = {
                    pfilename: pages_data.pfilename,
                    pfolder: pages_data.pfolder
                };
                if (pages_data._id)
                    query._id = {
                        $ne: new ObjectId(pages_data._id)
                    };
                app.get('mongodb').collection('pages').find(query, {
                    pfilename: 1
                }, {
                    limit: 1
                }).toArray(function(err, items) {
                    if (err || (items && items.length)) {
                        rep.status = 0;
                        rep.error = i18nm.__("page_exists");
                        return callback(true);
                    }
                    callback();
                });
            },
            function(callback) {
                var update_query = {
                    pfilename: pages_data.pfilename,
                    pfolder: pages_data.pfolder,
                };
                if (pages_data._id)
                    update_query = {
                        _id: new ObjectId(pages_data._id)
                    };
                app.get('mongodb').collection('pages').update(update_query, update, {
                    safe: false,
                    upsert: true
                }, function(err, result) {
                    if (err) return callback(true);
                    if (result && result._id) pages_data._id = result._id;
                    return callback();
                });
            },
            function(callback) {
                var search_data = [];
                for (var pd in pages_data.pdata)
                    search_data.push({
                        pr: parser.words(parser.html2text(pages_data.pdata[pd].pcontent), pages_data.pdata[pd].ptitle),
                        title: pages_data.pdata[pd].ptitle,
                        lang: pd,
                        desc: pages_data.pdata[pd].pdesc
                    });
                async.eachSeries(search_data, function(pd, _callback) {
                    var data = {
                        swords: pd.pr.words,
                        sdesc: pd.pr.desc,
                        stitle: pd.title,
                        slang: pd.lang,
                        item_id: pages_data._id,
                        surl: (pages_data.pfolder + '/' + pages_data.pfilename).replace(/(\/+)/, '/'),
                        space: 'pages'
                    };
                    app.get('mongodb').collection('search_index').update({
                        item_id: pages_data._id,
                        slang: pd.lang
                    }, data, {
                        upsert: true,
                        safe: false
                    }, function() {
                        _callback();
                    });
                }, function(err) {
                    callback();
                });
            }
        ], function(err) {
            return res.send(JSON.stringify(rep));
        });
    });

    router.post('/data/delete', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        var rep = {
            status: 1
        };
        // Check authorization
        if (!req.session.auth || req.session.auth.status < 2) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            res.send(JSON.stringify(rep));
            return;
        }
        var ids = req.body.ids;
        if (typeof ids != 'object' || ids.length < 1) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_query");
            res.send(JSON.stringify(rep));
            return;
        }
        for (var i = 0; i < ids.length; i++) {
            if (ids[i].match(/^[a-f0-9]{24}$/)) {
                app.get('mongodb').collection('pages').remove({
                    _id: new ObjectId(ids[i])
                }, dummy);
                app.get('mongodb').collection('search_index').remove({
                    item_id: ids[i]
                }, dummy);
            }
        }
        res.send(JSON.stringify(rep));
    });

    var dummy = function() {};

    /*

    Folders

    */

    router.post('/data/folders/load', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        var rep = {
            status: 1
        };
        // Check authorization
        if (!req.session.auth || req.session.auth.status < 2) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            res.send(JSON.stringify(rep));
            return;
        }
        app.get('mongodb').collection('pages_folders').find({
            oname: 'folders_json'
        }, {
            limit: 1
        }).toArray(function(err, items) {
            if (err) {
                rep.status = 0;
                rep.error = i18nm.__("cannot_load_db_data");
                res.send(JSON.stringify(rep));
                return;
            }
            if (!items || !items.length || !items[0].ovalue) {
                rep.folders = '[{"id":"j1_1","text":"/","data":null,"parent":"#","type":"root"}]';
                res.send(JSON.stringify(rep));
                return;
            }
            rep.folders = items[0].ovalue;
            res.send(JSON.stringify(rep));
        });
    });

    router.post('/data/folders/save', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        var rep = {
            status: 1
        };
        // Check authorization
        if (!req.session.auth || req.session.auth.status < 2) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            res.send(JSON.stringify(rep));
            return;
        }
        var json = req.body.json;
        try {
            JSON.parse(json);
        } catch (e) {
            rep.status = 0;
            rep.error = i18nm.__("cannot_parse_json");
            res.send(JSON.stringify(rep));
            return;
        }
        app.get('mongodb').collection('pages_folders').remove(function(err) {
            if (!err) {
                app.get('mongodb').collection('pages_folders').insert({
                    oname: 'folders_json',
                    ovalue: json
                }, function(err) {
                    if (err) {
                        rep.status = 0;
                        rep.error = i18nm.__("cannot_save_db_data");
                        res.send(JSON.stringify(rep));
                        return;
                    }
                    res.send(JSON.stringify(rep));
                });
            }
        });
    });
    return router;
};
