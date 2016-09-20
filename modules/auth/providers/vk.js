module.exports = function(app) {
    var router = app.get('express').Router(),
        request = require('request'),
        crypto = require('crypto'),
        config = app.get('config'),
        fs = require("fs"),
        gm = false;
    if (app.get('config').graphicsmagick) {
        gm = require('gm');
    }
    router.get('/vk', function(req, res) {
        if (app.get('settings') && app.get('settings').site_mode && (app.get('settings').site_mode == 'private' || app.get('settings').site_mode == 'invites')) return res.redirect(303, config.protocol + '://' + (req.session.auth_redirect_host || req.get('host')) + "/auth?rnd=" + Math.random().toString().replace('.', ''));
        var config_auth = app.get('config_auth');
        var code = req.query.code;
        if (!code) return res.redirect(303, config.protocol + '://' + (req.session.auth_redirect_host || req.get('host')) + "/auth?rnd=" + Math.random().toString().replace('.', ''));
        var url = 'https://oauth.vk.com/token';
        request.post(url, {
                form: {
                    code: code,
                    client_id: config_auth.vk.clientID,
                    client_secret: config_auth.vk.clientSecret,
                    redirect_uri: config_auth.vk.callbackURL
                }
            },
            function(error, response, body) {
                if (error || !body) return res.redirect(303, config.protocol + '://' + (req.session.auth_redirect_host || req.get('host')) + "/auth?rnd=" + Math.random().toString().replace('.', ''));
                var res_arr1 = body.split(/&/);
                var data = JSON.parse(body);
                if (!data.access_token || !data.user_id) return res.redirect(303, config.protocol + '://' + (req.session.auth_redirect_host || req.get('host')) + "/auth?rnd=" + Math.random().toString().replace('.', ''));
                var data_url = 'https://api.vk.com/method/users.get?access_token=' + data.access_token + '&uids=' + data.user_id + '&fields=first_name,last_name,photo_medium,uid';
                request.get(data_url, function(error, response, body) {
                    if (error || response.statusCode != 200) return res.redirect(303, config.protocol + '://' + (req.session.auth_redirect_host || req.get('host')) + "/auth?rnd=" + Math.random().toString().replace('.', ''));
                    var user_data = JSON.parse(body);
                    if (!user_data.response || !user_data.response.length) return res.redirect(303, config.protocol + '://' + (req.session.auth_redirect_host || req.get('host')) + "/auth?rnd=" + Math.random().toString().replace('.', ''));
                    user_data = user_data.response[0];
                    app.get('mongodb').collection('users').find({
                        username_vk_uid: user_data.uid
                    }, {
                        limit: 1
                    }).toArray(function(err, items) {
                        if (err) return res.redirect(303, config.protocol + '://' + (req.session.auth_redirect_host || req.get('host')) + "/auth?rnd=" + Math.random().toString().replace('.', ''));
                        if (typeof items == 'undefined' || !items || !items.length) {
                            var _now = Date.now();
                            var user = {
                                username: 'vk_' + _now,
                                realname: user_data.first_name + ' ' + user_data.last_name,
                                email: '',
                                password: crypto.createHash('md5').update(config.salt + '.' + Math.random()).digest('hex'),
                                username_auth: 'vk_' + _now,
                                username_vk_uid: user_data.uid,
                                need_finish: '1',
                                regdate: Date.now(),
                                status: 1
                            };
                            app.get('mongodb').collection('users').insert(user, function(err, items) {
                                if (err) return res.redirect(303, config.protocol + '://' + (req.session.auth_redirect_host || req.get('host')) + "/auth?rnd=" + Math.random().toString().replace('.', ''));
                                var user_id = items[0]._id.toHexString();
                                if (!user_id) return res.redirect(303, config.protocol + '://' + (req.session.auth_redirect_host || req.get('host')) + "/auth?rnd=" + Math.random().toString().replace('.', ''));
                                app.get('mongodb').collection('users').find({
                                    _id: items[0]._id
                                }, {
                                    limit: 1
                                }).toArray(function(err, items) {
                                    if (err || typeof items == 'undefined' || !items || !items.length) return res.redirect(303, config.protocol + '://' + (req.session.auth_redirect_host || req.get('host')) + "/auth?rnd=" + Math.random().toString().replace('.', ''));
                                    req.session.auth = items[0];
                                    req.session.auth.timestamp = Date.now();
                                    delete req.session.auth.password;
                                    if (!gm) return _redirect(req, res);
                                    var afn = crypto.createHash('md5').update(config.salt + '.' + req.session.auth._id).digest('hex');
                                    var file = fs.createWriteStream(app.get('config').dir.avatars + '/' + afn + '.jpg');
                                    if (user_data.photo_medium) {
                                        request.get(user_data.photo_medium).pipe(file).on('close', function() {
                                            return _redirect(req, res);
                                        });
                                    } else {
                                        return _redirect(req, res);
                                    }
                                });
                            });
                        } else {
                            req.session.auth = items[0];
                            req.session.auth.timestamp = Date.now();
                            delete req.session.auth.password;
                            return _redirect(req, res);
                        }
                    });
                });
            });
    });

    var _redirect = function(req, res) {
        // Redirect
        var redirect_host = config.protocol + '://' + (req.session.auth_redirect_host || req.get('host'));
        if (req.session.auth_redirect) {
            return res.redirect(303, redirect_host + req.session.auth_redirect);
        } else {
            return res.redirect(303, redirect_host + "/auth/profile?rnd=" + Math.random().toString().replace('.', ''));
        }
    };

    return router;
};
