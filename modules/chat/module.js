module.exports = function(app) {

    var router = app.get('express').Router(),
        path = require('path'),
        async = require('async'),
        renderer = app.get('renderer'),
        moment = require('moment'),
        config = app.get('config'),
        crypto = require('crypto'),
        S = require('string'),
        socketsender = require('../../core/socketsender')(app),
        redis_client = app.get('redis_client'),
        ObjectId = require('mongodb').ObjectID,
        i18nm = new(require('i18n-2'))({
            locales: config.locales.avail,
            directory: path.join(__dirname, 'lang'),
            extension: '.js',
            devMode: config.locales.dev_mode
        }),
        history_length = 50,
        cmd_avail = ['color', 'mod_set', 'mod_unset', 'readonly_set', 'readonly_unset', 'nick', 'ban_set', 'ban_unset', 'clear'];

    router.get('/', function(req, res) {
        if (!req.session.auth || req.session.auth.status < 1) {
            req.session.auth_redirect_host = req.get('host');
            req.session.auth_redirect = '/chat';
            res.redirect(303, "/auth?rnd=" + Math.random().toString().replace('.', ''));
            return;
        }
        i18nm.setLocale(req.session.current_locale);
        if (req.session.auth.need_finish) {
            var data = {
                    title: i18nm.__('module_name'),
                    page_title: i18nm.__('module_name'),
                    keywords: '',
                    description: '',
                    extra_css: '<link rel="stylesheet" href="/modules/chat/css/main.css" type="text/css">'
                },
                render = renderer.render_file(path.join(__dirname, 'views'), 'need_finish', {
                    lang: i18nm
                }, req);
            data.content = render;
            return app.get('renderer').render(res, undefined, data, req);
        }
        if (req.session.auth.chat_data && req.session.auth.chat_data.ban_flag && req.session.auth.status < 2) {
            var b_data = {
                    title: i18nm.__('module_name'),
                    page_title: i18nm.__('module_name'),
                    keywords: '',
                    description: '',
                    extra_css: '<link rel="stylesheet" href="/modules/chat/css/main.css" type="text/css">'
                },
                b_render = renderer.render_file(path.join(__dirname, 'views'), 'banned', {
                    lang: i18nm
                }, req);
            b_data.content = b_render;
            return app.get('renderer').render(res, undefined, b_data, req);
        }
        var users_online = [],
            users_data = {},
            users_history = [],
            messages_data = {};
        async.series([
            function(callback) {
                redis_client.lrange(config.redis.prefix + 'socketio_users_online', 0, 100, function(err, reply) {
                    if (reply && reply.length) users_online = reply;
                    callback();
                });
            },
            function(callback) {
                var query_channels = [''],
                    channels_hash = {};
                if (req.session.chat_channels && req.session.chat_channels.length)
                    for (var cc in req.session.chat_channels) {
                        var channel_id = crypto.createHash('md5').update([req.session.auth.username, req.session.chat_channels[cc]].sort().join(' ')).digest('hex');
                        channels_hash[channel_id] = req.session.chat_channels[cc];
                        query_channels.push(channel_id);
                    }
                async.eachSeries(query_channels, function(channel, esc) {
                        app.get('mongodb').collection('chat_messages').find({
                            channel_id: channel,
                            msg_deleted: {
                                $exists: false
                            }
                        }).count(function(err, msg_count) {
                            if (err) return esc(true);
                            if (!msg_count) msg_count = 0;
                            var skip = 0;
                            if (msg_count > history_length) skip = msg_count - history_length;
                            app.get('mongodb').collection('chat_messages').find({
                                channel_id: channel,
                                msg_deleted: {
                                    $exists: false
                                }
                            }).skip(skip).sort({
                                timestamp: 1
                            }).toArray(function(err, messages) {
                                if (messages && messages.length) {
                                    for (var mi in messages) {
                                        if (messages[mi].username)
                                            if (users_history.indexOf(messages[mi].username) == -1) users_history.push(messages[mi].username);
                                        messages[mi].channel = channels_hash[channel] || '';
                                        if (messages[mi].cmd) messages[mi].cmd = cmd_avail.indexOf(messages[mi].cmd);
                                        if (!messages_data[messages[mi].channel]) messages_data[messages[mi].channel] = [];
                                        delete messages[mi].channel_id;
                                        delete messages[mi]._id;
                                        messages_data[messages[mi].channel].push(messages[mi]);
                                    }
                                }
                                esc();
                            });
                        });
                    },
                    function() {
                        callback();
                    });
            },
            function(callback) {
                if (users_history.length) {
                    var query = [];
                    for (var ui in users_history)
                        query.push({
                            username: users_history[ui]
                        });
                    for (var oi in users_online)
                        if (users_history.indexOf(users_online[oi]) == -1)
                            query.push({
                                username: users_online[oi]
                            });
                    app.get('mongodb').collection('users').find({
                        $or: query
                    }).toArray(function(err, users) {
                        if (users && users.length)
                            for (var ui in users) {
                                if (users[ui].chat_data) {
                                    users_data[users[ui].username] = users[ui].chat_data;
                                } else {
                                    users_data[users[ui].username] = {};
                                }
                                if (users[ui].status == 2) users_data[users[ui].username].mod_flag = true;
                            }
                        callback();
                    });
                } else {
                    callback();
                }
            },
            function(callback) {
                var data = {
                        title: i18nm.__('module_name'),
                        page_title: i18nm.__('module_name'),
                        keywords: '',
                        description: '',
                        extra_css: '<link rel="stylesheet" href="/modules/chat/css/main.css" type="text/css">'
                    },
                    render = renderer.render_file(path.join(__dirname, 'views'), 'chat', {
                        lang: i18nm,
                        data: data,
                        current_locale: req.session.current_locale,
                        current_username: req.session.auth.username,
                        current_user: JSON.stringify({
                            id: req.session.auth._id,
                            id_hash: crypto.createHash('md5').update(config.salt + '.' + req.session.auth._id).digest('hex')
                        }),
                        cmd_list: JSON.stringify(i18nm.__('cmd_list')),
                        messages_data: JSON.stringify(messages_data),
                        users_online: JSON.stringify(users_online),
                        chat_users_data: JSON.stringify(users_data),
                    }, req);
                data.content = render;
                app.get('renderer').render(res, undefined, data, req);
                return callback();
            }
        ]);
    });

    router.post('/ajax/msg', function(req, res) {
        var rep = {
            status: 1
        };
        if (!req.session.auth || req.session.auth.status < 1 || req.session.auth.need_finish) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            return res.send(JSON.stringify(rep));
        }
        var msg = S(req.body.msg || '').stripTags().decodeHTMLEntities().s.replace(/[\n\r\t]/gm, ''),
            channel = req.body.channel || '',
            timestamp = Date.now();
        if (channel && (!channel.match(/^[A-Za-z0-9_\-]{3,20}$/) || channel == req.session.auth.username)) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_channel");
            return res.send(JSON.stringify(rep));
        }
        var lwl = msg.split(/ /).reduce(function(x, y) {
            return x.length > y.length ? x : y;
        }).length;
        if (msg.length < 2 || msg.length > 1024 || lwl > 30) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_msg");
            return res.send(JSON.stringify(rep));
        }
        var user_data = {},
            channel_data = {},
            user_id;
        async.series([
            function(callback) {
                if (channel && channel.length) {
                    app.get('mongodb').collection('users').find({
                        username: channel
                    }).toArray(function(err, users) {
                        if (!users || !users.length) {
                            rep.status = 0;
                            rep.error = i18nm.__("invalid_channel");
                            res.send(JSON.stringify(rep));
                            return callback(true);
                        }
                        user_id = users[0]._id;
                        channel_data = users[0];
                        callback();
                    });
                } else {
                    callback();
                }
            },
            function(callback) {
                app.get('mongodb').collection('users').find({
                    username: req.session.auth.username
                }).toArray(function(err, users) {
                    if (users && users.length && users[0].chat_data) {
                        user_data = users[0].chat_data;
                    }
                    callback();
                });
            },
            function(callback) {
                if (user_data.ro_flag || user_data.ban_flag) {
                    rep.status = 0;
                    rep.error = i18nm.__("your_account_is_ro");
                    res.send(JSON.stringify(rep));
                    return callback(true);
                } else {
                    callback();
                }
            },
            function(callback) {
                var channel_id = '';
                if (channel && channel.length)
                    channel_id = crypto.createHash('md5').update([req.session.auth.username, channel].sort().join(' ')).digest('hex');
                rep.msg_data = {
                    username: req.session.auth.username,
                    timestamp: timestamp,
                    message: msg,
                    type: 'u',
                    data: {},
                    channel_id: channel_id
                };
                app.get('mongodb').collection('chat_messages').insert(rep.msg_data, function() {
                    if (user_data) rep.msg_data.data = user_data;
                    return callback();
                });
            },
            function(callback) {
                if (channel && channel.length) {
                    if (!req.session.chat_channels) req.session.chat_channels = [];
                    if (req.session.chat_channels.indexOf(channel) == -1)
                        req.session.chat_channels.push(channel);
                }
                callback();
            },
            function(callback) {
                rep.msg_data.channel = channel;
                if (channel) {
                    rep.msg_data.nicknames = {};
                    if (channel_data && channel_data.chat_data && channel_data.chat_data.nickname) rep.msg_data.nicknames[channel] = channel_data.chat_data.nickname;
                    if (user_data && user_data.nickname) rep.msg_data.nicknames[req.session.auth.username] = user_data.nickname;
                    socketsender.emit(user_id, 'taracot_chat_message', rep.msg_data);
                } else {
                    redis_client.publish(config.redis.prefix + 'medved_broadcast', JSON.stringify({
                        msgtype: 'taracot_chat_message',
                        msg: rep.msg_data
                    }));
                }
                res.send(JSON.stringify(rep));
                return callback();
            },
        ]);
    });

    router.post('/ajax/cmd', function(req, res) {
        var rep = {
            status: 1
        };
        if (!req.session.auth || req.session.auth.status < 1 || req.session.auth.need_finish) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            return res.send(JSON.stringify(rep));
        }
        var cmd = S(req.body.cmd || '').stripTags().decodeHTMLEntities().s.replace(/[\n\r\t]/gm, ''),
            timestamp = Date.now();
        if (cmd.length < 2 && cmd.length > 1024) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_cmd");
            return res.send(JSON.stringify(rep));
        }
        var cmd_arr = cmd.split(' '),
            cmd_0 = cmd_arr[0].toLowerCase(),
            cmd_index = cmd_avail.indexOf(cmd_0);
        if (cmd_index === -1) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_cmd");
            return res.send(JSON.stringify(rep));
        }
        rep.cmd_timestamp = Date.now();
        async.series([
            function(callback) {
                if (cmd_0 == 'color') {
                    if (cmd_arr.length != 2 || !cmd_arr[1].match(/^#(?:[0-9a-f]{3}){1,2}$/i)) {
                        rep.status = 0;
                        rep.error = i18nm.__("cmd_color_invalid_value");
                        return callback(true);
                    }
                    var color = cmd_arr[1].toLowerCase();
                    rep.cmd = cmd_0;
                    rep.cmd_index = cmd_index;
                    rep.cmd_data = {
                        "username": req.session.auth.username,
                        "color": color
                    };
                    app.get('mongodb').collection('users').update({
                        _id: new ObjectId(req.session.auth._id)
                    }, {
                        $set: {
                            chat_data: {
                                color: color
                            }
                        }
                    }, function(err) {
                        return callback(true);
                    });
                } else {
                    callback();
                }
            },
            function(callback) {
                if (cmd_0 == 'mod_set') {
                    if (cmd_arr.length != 2 || !cmd_arr[1].match(/^[a-z0-9_\-]{3,20}$/i)) {
                        rep.status = 0;
                        rep.error = i18nm.__("cmd_mod_invalid_username");
                        return callback(true);
                    }
                    var username = cmd_arr[1].toLowerCase(),
                        chat_data = {};
                    async.series([

                        function(asc) {
                            if (req.session.auth.status == 2) return asc();
                            app.get('mongodb').collection('users').find({
                                _id: new ObjectId(req.session.auth._id)
                            }).toArray(function(err, users) {
                                if (!users || !users.length || !users[0].chat_data || !users[0].chat_data.mod_flag) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_mod_insufficent_rights");
                                    return asc(true);
                                }
                                return asc();
                            });
                        },
                        function(asc) {
                            app.get('mongodb').collection('users').find({
                                username: username
                            }).toArray(function(err, users) {
                                if (!users || !users.length) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_mod_invalid_username");
                                    return asc(true);
                                }
                                if (users[0].chat_data) chat_data = users[0].chat_data;
                                return asc();
                            });
                        },
                        function(asc) {
                            chat_data.mod_flag = true;
                            app.get('mongodb').collection('users').update({
                                username: username
                            }, {
                                $set: {
                                    chat_data: chat_data
                                }
                            }, function(err) {
                                if (!err) {
                                    rep.cmd = cmd_0;
                                    rep.cmd_index = cmd_index;
                                    rep.cmd_data = {
                                        "moderator": req.session.auth.username,
                                        "new_moderator": username
                                    };
                                    return asc();
                                } else {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_database_error");
                                    return asc(true);
                                }
                            });
                        }
                    ], function(pf) {
                        if (!pf) return callback('insert');
                        return callback(true);
                    });
                } else {
                    callback();
                }
            },
            function(callback) {
                if (cmd_0 == 'mod_unset') {
                    if (cmd_arr.length != 2 || !cmd_arr[1].match(/^[a-z0-9_\-]{3,20}$/i)) {
                        rep.status = 0;
                        rep.error = i18nm.__("cmd_mod_invalid_username");
                        return callback(true);
                    }
                    var username = cmd_arr[1].toLowerCase(),
                        chat_data = {};
                    async.series([

                        function(asc) {
                            if (req.session.auth.status == 2) return asc();
                            app.get('mongodb').collection('users').find({
                                _id: new ObjectId(req.session.auth._id)
                            }).toArray(function(err, users) {
                                if (!users || !users.length || !users[0].chat_data || !users[0].chat_data.mod_flag) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_mod_insufficent_rights");
                                    return asc(true);
                                }
                                return asc();
                            });
                        },
                        function(asc) {
                            app.get('mongodb').collection('users').find({
                                username: username
                            }).toArray(function(err, users) {
                                if (!users || !users.length || !users[0].chat_data || !users[0].chat_data.mod_flag) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_err_not_moderator");
                                    return asc(true);
                                }
                                if (users[0].chat_data) chat_data = users[0].chat_data;
                                return asc();
                            });
                        },
                        function(asc) {
                            chat_data.mod_flag = false;
                            app.get('mongodb').collection('users').update({
                                username: username
                            }, {
                                $set: {
                                    chat_data: chat_data
                                }
                            }, function(err) {
                                if (!err) {
                                    rep.cmd = cmd_0;
                                    rep.cmd_index = cmd_index;
                                    rep.cmd_data = {
                                        "moderator": req.session.auth.username,
                                        "new_moderator": username
                                    };
                                    return asc();
                                } else {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_database_error");
                                    return asc(true);
                                }
                            });
                        }
                    ], function(pf) {
                        if (!pf) return callback('insert');
                        return callback(true);
                    });
                } else {
                    callback();
                }
            },
            function(callback) {
                if (cmd_0 == 'readonly_set') {
                    if (cmd_arr.length < 2 || !cmd_arr[1].match(/^[a-z0-9_\-]{3,20}$/i)) {
                        rep.status = 0;
                        rep.error = i18nm.__("cmd_mod_invalid_username");
                        return callback(true);
                    }
                    var username = cmd_arr[1].toLowerCase(),
                        chat_data = {},
                        reason_arr = [];
                    if (cmd_arr.length > 2)
                        for (var cai = 2; cai < cmd_arr.length; cai++)
                            reason_arr.push(cmd_arr[cai]);
                    async.series([

                        function(asc) {
                            if (req.session.auth.status == 2) return asc();
                            app.get('mongodb').collection('users').find({
                                _id: new ObjectId(req.session.auth._id)
                            }).toArray(function(err, users) {
                                if (!users || !users.length || !users[0].chat_data || !users[0].chat_data.mod_flag) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_mod_insufficent_rights");
                                    return asc(true);
                                }
                                return asc();
                            });
                        },
                        function(asc) {
                            app.get('mongodb').collection('users').find({
                                username: username
                            }).toArray(function(err, users) {
                                if (!users || !users.length) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_mod_invalid_username");
                                    return asc(true);
                                }
                                if (users[0].chat_data) chat_data = users[0].chat_data;
                                return asc();
                            });
                        },
                        function(asc) {
                            chat_data.ro_flag = true;
                            app.get('mongodb').collection('users').update({
                                username: username
                            }, {
                                $set: {
                                    chat_data: chat_data
                                }
                            }, function(err) {
                                if (!err) {
                                    rep.cmd = cmd_0;
                                    rep.cmd_index = cmd_index;
                                    rep.cmd_data = {
                                        "moderator": req.session.auth.username,
                                        "user_ro": username,
                                        "reason": reason_arr.join(' ') || '?'
                                    };
                                    return asc();
                                } else {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_database_error");
                                    return asc(true);
                                }
                            });
                        }
                    ], function(pf) {
                        if (!pf) return callback('insert');
                        return callback(true);
                    });
                } else {
                    callback();
                }
            },
            function(callback) {
                if (cmd_0 == 'readonly_unset') {
                    if (cmd_arr.length < 2 || !cmd_arr[1].match(/^[a-z0-9_\-]{3,20}$/i)) {
                        rep.status = 0;
                        rep.error = i18nm.__("cmd_mod_invalid_username");
                        return callback(true);
                    }
                    var username = cmd_arr[1].toLowerCase(),
                        chat_data = {},
                        reason_arr = [];
                    if (cmd_arr.length > 2)
                        for (var cai = 2; cai < cmd_arr.length; cai++)
                            reason_arr.push(cmd_arr[cai]);
                    async.series([

                        function(asc) {
                            if (req.session.auth.status == 2) return asc();
                            app.get('mongodb').collection('users').find({
                                _id: new ObjectId(req.session.auth._id)
                            }).toArray(function(err, users) {
                                if (!users || !users.length || !users[0].chat_data || !users[0].chat_data.mod_flag) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_mod_insufficent_rights");
                                    return asc(true);
                                }
                                return asc();
                            });
                        },
                        function(asc) {
                            app.get('mongodb').collection('users').find({
                                username: username
                            }).toArray(function(err, users) {
                                if (!users || !users.length) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_mod_invalid_username");
                                    return asc(true);
                                }
                                if (users[0].chat_data) chat_data = users[0].chat_data;
                                return asc();
                            });
                        },
                        function(asc) {
                            chat_data.ro_flag = false;
                            app.get('mongodb').collection('users').update({
                                username: username
                            }, {
                                $set: {
                                    chat_data: chat_data
                                }
                            }, function(err) {
                                if (!err) {
                                    rep.cmd = cmd_0;
                                    rep.cmd_index = cmd_index;
                                    rep.cmd_data = {
                                        "moderator": req.session.auth.username,
                                        "user_ro": username
                                    };
                                    return asc();
                                } else {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_database_error");
                                    return asc(true);
                                }
                            });
                        }
                    ], function(pf) {
                        if (!pf) return callback('insert');
                        return callback(true);
                    });
                } else {
                    callback();
                }
            },
            function(callback) {
                if (cmd_0 == 'nick') {
                    if (cmd_arr.length != 2) {
                        rep.status = 0;
                        rep.error = i18nm.__("cmd_mod_invalid_nickname");
                        return callback(true);
                    }
                    var nickname = S(cmd_arr[1]).stripTags().decodeHTMLEntities().s.replace(/[\n\r\t'\"]/gm, ''),
                        chat_data = {};
                    if (nickname.length < 2 || nickname.length > 20) {
                        rep.status = 0;
                        rep.error = i18nm.__("cmd_mod_invalid_nickname");
                        return callback(true);
                    }
                    async.series([
                        function(asc) {
                            app.get('mongodb').collection('users').find({
                                _id: new ObjectId(req.session.auth._id)
                            }).toArray(function(err, users) {
                                if (users && users.length && users[0].chat_data) chat_data = users[0].chat_data;
                                return asc();
                            });
                        },
                        function(asc) {
                            chat_data.nickname = nickname;
                            app.get('mongodb').collection('users').update({
                                _id: new ObjectId(req.session.auth._id)
                            }, {
                                $set: {
                                    chat_data: chat_data
                                }
                            }, function(err) {
                                if (!err) {
                                    rep.cmd = cmd_0;
                                    rep.cmd_index = cmd_index;
                                    rep.cmd_data = {
                                        "username": req.session.auth.username,
                                        "nickname": nickname
                                    };
                                    return asc();
                                } else {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_database_error");
                                    return asc(true);
                                }
                            });
                        }
                    ], function(pf) {
                        if (!pf) return callback('insert');
                        return callback(true);
                    });
                } else {
                    callback();
                }
            },
            function(callback) {
                if (cmd_0 == 'ban_set') {
                    if (cmd_arr.length < 2 || !cmd_arr[1].match(/^[a-z0-9_\-]{3,20}$/i)) {
                        rep.status = 0;
                        rep.error = i18nm.__("cmd_mod_invalid_username");
                        return callback(true);
                    }
                    var username = cmd_arr[1].toLowerCase(),
                        chat_data = {},
                        reason_arr = [];
                    if (cmd_arr.length > 2)
                        for (var cai = 2; cai < cmd_arr.length; cai++)
                            reason_arr.push(cmd_arr[cai]);
                    async.series([
                        function(asc) {
                            if (req.session.auth.status == 2) return asc();
                            app.get('mongodb').collection('users').find({
                                _id: new ObjectId(req.session.auth._id)
                            }).toArray(function(err, users) {
                                if (!users || !users.length || !users[0].chat_data || !users[0].chat_data.mod_flag) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_mod_insufficent_rights");
                                    return asc(true);
                                }
                                return asc();
                            });
                        },
                        function(asc) {
                            app.get('mongodb').collection('users').find({
                                username: username
                            }).toArray(function(err, users) {
                                if (!users || !users.length) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_mod_invalid_username");
                                    return asc(true);
                                }
                                if (users[0].chat_data) chat_data = users[0].chat_data;
                                return asc();
                            });
                        },
                        function(asc) {
                            chat_data.ban_flag = true;
                            app.get('mongodb').collection('users').update({
                                username: username
                            }, {
                                $set: {
                                    chat_data: chat_data
                                }
                            }, function(err) {
                                if (!err) {
                                    rep.cmd = cmd_0;
                                    rep.cmd_index = cmd_index;
                                    rep.cmd_data = {
                                        "moderator": req.session.auth.username,
                                        "user_ban": username,
                                        "reason": reason_arr.join(' ') || '?'
                                    };
                                    return asc();
                                } else {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_database_error");
                                    return asc(true);
                                }
                            });
                        }
                    ], function(pf) {
                        if (!pf) return callback('insert');
                        return callback(true);
                    });
                } else {
                    callback();
                }
            },
            function(callback) {
                if (cmd_0 == 'ban_unset') {
                    if (cmd_arr.length < 2 || !cmd_arr[1].match(/^[a-z0-9_\-]{3,20}$/i)) {
                        rep.status = 0;
                        rep.error = i18nm.__("cmd_mod_invalid_username");
                        return callback(true);
                    }
                    var username = cmd_arr[1].toLowerCase(),
                        chat_data = {},
                        reason_arr = [];
                    if (cmd_arr.length > 2)
                        for (var cai = 2; cai < cmd_arr.length; cai++)
                            reason_arr.push(cmd_arr[cai]);
                    async.series([

                        function(asc) {
                            if (req.session.auth.status == 2) return asc();
                            app.get('mongodb').collection('users').find({
                                _id: new ObjectId(req.session.auth._id)
                            }).toArray(function(err, users) {
                                if (!users || !users.length || !users[0].chat_data || !users[0].chat_data.mod_flag) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_mod_insufficent_rights");
                                    return asc(true);
                                }
                                return asc();
                            });
                        },
                        function(asc) {
                            app.get('mongodb').collection('users').find({
                                username: username
                            }).toArray(function(err, users) {
                                if (!users || !users.length) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_mod_invalid_username");
                                    return asc(true);
                                }
                                if (users[0].chat_data) chat_data = users[0].chat_data;
                                return asc();
                            });
                        },
                        function(asc) {
                            chat_data.ban_flag = false;
                            app.get('mongodb').collection('users').update({
                                username: username
                            }, {
                                $set: {
                                    chat_data: chat_data
                                }
                            }, function(err) {
                                if (!err) {
                                    rep.cmd = cmd_0;
                                    rep.cmd_index = cmd_index;
                                    rep.cmd_data = {
                                        "moderator": req.session.auth.username,
                                        "user_ban": username
                                    };
                                    return asc();
                                } else {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_database_error");
                                    return asc(true);
                                }
                            });
                        }
                    ], function(pf) {
                        if (!pf) return callback('insert');
                        return callback(true);
                    });
                } else {
                    callback();
                }
            },
            function(callback) {
                if (cmd_0 == 'clear') {
                    async.series([
                        function(asc) {
                            if (req.session.auth.status == 2) return asc();
                            app.get('mongodb').collection('users').find({
                                _id: new ObjectId(req.session.auth._id)
                            }).toArray(function(err, users) {
                                if (!users || !users.length || !users[0].chat_data || !users[0].chat_data.mod_flag) {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_mod_insufficent_rights");
                                    return asc(true);
                                }
                                return asc();
                            });
                        },
                        function(asc) {
                            app.get('mongodb').collection('chat_messages').update({
                                channel_id: '',
                                timestamp: {
                                    $lt: Date.now()
                                }
                            }, {
                                $set: {
                                    msg_deleted: true
                                }
                            }, {
                                multi: true
                            }, function(err) {
                                if (!err) {
                                    rep.cmd = cmd_0;
                                    rep.cmd_index = cmd_index;
                                    rep.cmd_data = {
                                        "moderator": req.session.auth.username
                                    };
                                    return asc();
                                } else {
                                    rep.status = 0;
                                    rep.error = i18nm.__("cmd_database_error");
                                    return asc(true);
                                }
                            });
                        }
                    ], function(pf) {
                        if (!pf) return callback('insert');
                        return callback(true);
                    });
                } else {
                    callback();
                }
            }
        ], function(pf) {
            if (pf) {
                if (pf == 'insert') {
                    var data = {
                        username: req.session.auth.username,
                        channel_id: '',
                        timestamp: rep.cmd_timestamp,
                        type: 'c',
                        cmd: rep.cmd,
                        cmd_data: rep.cmd_data
                    };
                    app.get('mongodb').collection('chat_messages').insert(data, function() {
                        data.cmd_index = cmd_index;
                        redis_client.publish(config.redis.prefix + 'medved_broadcast', JSON.stringify({
                            msgtype: 'taracot_chat_message',
                            msg: data
                        }));
                        return res.send(JSON.stringify(rep));
                    });
                } else {
                    return res.send(JSON.stringify(rep));
                }
            } else {
                rep.status = 0;
                rep.error = i18nm.__("invalid_cmd");
                return res.send(JSON.stringify(rep));
            }
        });
    });

    router.post('/ajax/channel/close', function(req, res) {
        var rep = {
            status: 1
        };
        if (!req.session.auth || req.session.auth.status < 1 || req.session.auth.need_finish) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            return res.send(JSON.stringify(rep));
        }
        var channel = req.body.channel;
        if (!channel || !channel.match(/^[A-Za-z0-9_\-]{3,20}$/)) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_channel");
            return res.send(JSON.stringify(rep));
        }
        if (req.session.chat_channels && req.session.chat_channels.length && req.session.chat_channels.indexOf(channel) != -1)
            req.session.chat_channels.splice(req.session.chat_channels.indexOf(channel), 1);
        res.send(JSON.stringify(rep));
    });

    router.post('/ajax/channel/history', function(req, res) {
        var rep = {
            status: 1
        };
        if (!req.session.auth || req.session.auth.status < 1 || req.session.auth.need_finish) {
            rep.status = 0;
            rep.error = i18nm.__("unauth");
            return res.send(JSON.stringify(rep));
        }
        var channel = req.body.channel;
        if (!channel || !channel.match(/^[A-Za-z0-9_\-]{3,20}$/)) {
            rep.status = 0;
            rep.error = i18nm.__("invalid_channel");
            return res.send(JSON.stringify(rep));
        }
        if (!req.session.chat_channels) req.session.chat_channels = [];
        if (req.session.chat_channels.indexOf(channel) == -1)
            req.session.chat_channels.push(channel);
        var channel_id = crypto.createHash('md5').update([req.session.auth.username, channel].sort().join(' ')).digest('hex'),
            messages_data = {};
        app.get('mongodb').collection('chat_messages').find({
            channel_id: channel_id,
            msg_deleted: {
                $exists: false
            }
        }).count(function(err, msg_count) {
            if (!msg_count) msg_count = 0;
            var skip = 0;
            if (msg_count > history_length) skip = msg_count - history_length;
            var users_history = [],
                users_data = {};
            app.get('mongodb').collection('chat_messages').find({
                channel_id: channel_id,
                msg_deleted: {
                    $exists: false
                }
            }).skip(skip).sort({
                timestamp: 1
            }).toArray(function(err, messages) {
                if (messages && messages.length) {
                    for (var mi in messages) {
                        if (messages[mi].username)
                            if (users_history.indexOf(messages[mi].username) == -1) users_history.push(messages[mi].username);
                        messages[mi].channel = channel;
                        if (!messages_data[channel]) messages_data[channel] = [];
                        delete messages[mi].channel_id;
                        delete messages[mi]._id;
                        messages_data[channel].push(messages[mi]);
                    }
                }
                async.series([
                    function(callback) {
                        if (users_history.length) {
                            var query = [];
                            for (var ui in users_history)
                                query.push({
                                    username: users_history[ui]
                                });
                            app.get('mongodb').collection('users').find({
                                $or: query,
                                chat_data: {
                                    $exists: true
                                }
                            }).toArray(function(err, users) {
                                if (users && users.length)
                                    for (var ui in users)
                                        users_data[users[ui].username] = users[ui].chat_data;
                                callback();
                            });
                        } else {
                            callback();
                        }
                    },
                    function(callback) {
                        rep.users_data = users_data;
                        rep.messages = messages_data;
                        res.send(JSON.stringify(rep));
                        return callback();
                    }
                ]);
            });
        });
    });

    return router;
};
