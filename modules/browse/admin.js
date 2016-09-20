module.exports = function(app) {

    var path = require('path'),
        i18nm = new(require('i18n-2'))({
            locales: app.get('config').locales.avail,
            directory: path.join(__dirname, 'lang'),
            extension: '.js',
            devMode: app.get('config').locales.dev_mode
        }),
        fs = require("fs-extra"),
        router = app.get('express').Router(),
        mime = require('mime'),
        archiver = require('archiver'),
        unzip = require('unzip2'),
        crypto = require('crypto'),
        async = require('async'),
        gm = false;

    if (app.get('config').graphicsmagick) {
        gm = require('gm');
    }

    router.get_module_name = function(req) {
        i18nm.setLocale(req.session.current_locale);
        return i18nm.__("module_name");
    };
    router.get('/', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        if (!req.session.auth || req.session.auth.status < 2) {
            req.session.auth_redirect_host = req.get('host');
            req.session.auth_redirect = '/cp/browse';
            res.redirect(303, "/auth/cp?rnd=" + Math.random().toString().replace('.', ''));
            return;
        }
        var io = false,
            CKEditorFuncNum = "";
        if (req.query.io) io = true;
        if (req.query.CKEditorFuncNum) CKEditorFuncNum = req.query.CKEditorFuncNum;
        var body = app.get('renderer').render_file(path.join(__dirname, 'views'), 'browse', {
            lang: i18nm,
            io: io,
            CKEditorFuncNum: CKEditorFuncNum,
            locales: JSON.stringify(app.get('config').locales.avail)
        }, req);
        res.send(body);
    });
    router.post('/data/load', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        var rep = {};
        var io = req.body.io || false;
        if (io && io != 'false') io = true;
        // Check authorization
        if (!req.session.auth || req.session.auth.status < 2) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            return res.send(JSON.stringify(rep));
        }
        var req_dir = req.body.dir;
        if (req_dir && !check_directory(req_dir)) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_dir");
            return res.send(JSON.stringify(rep));
        }
        if (req_dir) {
            req_dir = '/' + req_dir;
        } else {
            req_dir = '';
        }
        var dir = app.get('config').dir.storage + req_dir;
        fs.exists(dir, function(dx) {
            if (!dx) {
                rep.status = 0;
                rep.error = i18nm.__("dir_not_exists");
                return res.send(JSON.stringify(rep));
            } else {
                var fa = [],
                    da = [];
                fs.readdir(dir, function(err, browse) {
                    if (!browse) browse = [];
                    async.eachSeries(browse, function(file, callback) {
                        var item = {
                            name: file
                        };
                        fs.stat(dir + '/' + file, function(err, stat) {
                            if (err || !stat) return callback();
                            if (stat.isFile() && !file.match(/^\./) && !file.match(/^___thumb_/)) {
                                var file_mime = mime.lookup(dir + '/' + file),
                                    fn = crypto.createHash('md5').update(file).digest('hex');
                                fs.exists(dir + '/___thumb_' + fn + '.jpg', function(ex) {
                                    if (ex) item.thumb = fn;
                                    item.type = 'f';
                                    item.size = stat.size;
                                    item.mime = file_mime;
                                    if (io) {
                                        if (file_mime.match(/image\//)) fa.push(item);
                                    } else {
                                        fa.push(item);
                                    }
                                    return callback();
                                });
                            } else {
                                if (stat.isDirectory() && !file.match(/^\./)) {
                                    item.type = 'd';
                                    item.size = '0';
                                    item.mime = '';
                                    da.push(item);
                                }
                                return callback();
                            }
                        });
                    }, function(err) {
                        da.sort(function(a, b) {
                            if (!a.name || !b.name) return a.name.localeCompare(b.name);
                            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                        });
                        fa.sort(function(a, b) {
                            if (!a.name || !b.name) return a.name.localeCompare(b.name);
                            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                        });
                        rep.files = da.concat(fa);
                        rep.status = 1;
                        res.send(JSON.stringify(rep));
                    });
                });
            }
        });
    });
    // Helper functions (regexp)
    var check_filename = function(_fn) {
        if (!_fn) return false; // don't allow null
        var fn = _fn.replace(/^\s+|\s+$/g, '');
        if (!fn || fn.length > 80) return false; // null or too long
        if (fn.match(/^\./)) return false; // starting with a dot
        if (fn.match(/^[\^<>\:\"\/\\\|\?\*\x00-\x1f]+$/)) return false; // invalid characters
        return true;
    };
    var check_directory = function(_fn) {
        if (!_fn) return true; // allow null
        var fn = _fn.replace(/^\s+|\s+$/g, '');
        if (fn.length > 40) return false; // too long
        if (fn.match(/^\./)) return false; // starting with a dot
        if (fn.match(/^\\/)) return false; // starting with a slash
        if (fn.match(/^[\^<>\:\"\\\|\?\*\x00-\x1f]+$/)) return false; // invalid characters
        return true;
    };
    return router;
};
