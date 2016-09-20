module.exports = function(app) {
    var router = app.get('express').Router(),
        path = require('path'),
        ObjectId = require('mongodb').ObjectID,
        i18nm = new(require('i18n-2'))({
            locales: app.get('config').locales.avail,
            directory: path.join(__dirname, 'lang'),
            extension: '.js',
            devMode: app.get('config').locales.dev_mode
        });
    router.get_module_name = function(req) {
        i18nm.setLocale(req.session.current_locale);
        return i18nm.__("module_name_cp");
    };
    router.get('/', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        if (!req.session.auth || req.session.auth.status < 2) {
            req.session.auth_redirect_host = req.get('host');
            req.session.auth_redirect = '/cp/blog';
            res.redirect(303, "/auth/cp?rnd=" + Math.random().toString().replace('.', ''));
            return;
        }
        app.get('mongodb').collection('settings').find({
            $or: [{
                oname: 'blog_mode'
            }, {
                oname: 'blog_areas'
            }]
        }).toArray(function(err, items) {
            var mode = '',
                areas = '[]';
            if (items && items.length == 2) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].oname == 'blog_mode') mode = items[i].ovalue;
                    if (items[i].oname == 'blog_areas') areas = items[i].ovalue;
                }
            }
            var body = app.get('renderer').render_file(path.join(__dirname, 'views'), 'blog_cp', {
                lang: i18nm,
                auth: req.session.auth,
                init_mode: mode,
                init_areas: areas,
                locales: JSON.stringify(app.get('config').locales.avail)
            }, req);
            app.get('cp').render(req, res, {
                body: body,
                css: '<link rel="stylesheet" href="/modules/blog/css/main.css">'
            }, i18nm, 'blog_cp', req.session.auth);
        });
    });
    router.post('/config/save', function(req, res) {
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
        var mode = req.body.mode,
            areas = req.body.areas;
        if (mode != 'private' && mode != 'moderation' && mode != 'public') {
            rep.status = 0;
            return res.send(JSON.stringify(rep));
        }
        if (areas) areas = JSON.stringify(areas);
        if (!areas) {
            rep.status = 0;
            return res.send(JSON.stringify(rep));
        }
        app.get('mongodb').collection('settings').find({
            $or: [{
                oname: 'blog_mode'
            }, {
                oname: 'blog_areas'
            }]
        }).toArray(function(err, items) {
            if (err) {
                rep.status = 0;
                return res.send(JSON.stringify(rep));
            }
            if (items && items.length) { // update
                app.get('mongodb').collection('settings').update({
                    oname: 'blog_mode'
                }, {
                    $set: {
                        ovalue: mode,
                        olang: ''
                    }
                }, function(err) {
                    if (err) {
                        rep.status = 0;
                        return res.send(JSON.stringify(rep));
                    }
                    app.get('mongodb').collection('settings').update({
                        oname: 'blog_areas'
                    }, {
                        $set: {
                            ovalue: areas,
                            olang: ''
                        }
                    }, function(err) {
                        if (err) {
                            rep.status = 0;
                            return res.send(JSON.stringify(rep));
                        }
                        return res.send(JSON.stringify(rep));
                    });
                });
            } else { //insert
                app.get('mongodb').collection('settings').insert({
                    oname: 'blog_mode',
                    ovalue: mode,
                    olang: ''
                }, function(err) {
                    if (err) {
                        rep.status = 0;
                        return res.send(JSON.stringify(rep));
                    }
                    app.get('mongodb').collection('settings').insert({
                        oname: 'blog_areas',
                        ovalue: areas,
                        olang: ''
                    }, function(err) {
                        if (err) {
                            rep.status = 0;
                            return res.send(JSON.stringify(rep));
                        }
                        return res.send(JSON.stringify(rep));
                    });
                });
            }
        });
        return res.send(JSON.stringify(rep));
    });
    return router;
};
