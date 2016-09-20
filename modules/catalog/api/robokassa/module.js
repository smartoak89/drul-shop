/*

 Robokassa API

*/

module.exports = function(app) {
    var path = require('path'),
        i18nm = new(require('i18n-2'))({
            locales: app.get('config').locales.avail,
            directory: path.join(__dirname, 'lang'),
            extension: '.js',
            devMode: app.get('config').locales.dev_mode
        }),
        router = app.get('express').Router(),
        config = app.get('config'),
        fs = require('fs'),
        crypto = require('crypto'),
        mailer = app.get('mailer'),
        ObjectId = require('mongodb').ObjectID;

    var gaikan = require('gaikan'),
        payment_html = (fs.existsSync(path.join(__dirname, 'views') + '/custom_payment.html')) ? gaikan.compileFromFile(path.join(__dirname, 'views') + '/custom_payment.html') : gaikan.compileFromFile(path.join(__dirname, 'views') + '/payment.html'),
        pt_payment_btn = (fs.existsSync(path.join(__dirname, 'views') + '/custom_parts_payment_btn.html')) ? gaikan.compileFromFile(path.join(__dirname, 'views') + '/custom_parts_payment_btn.html') : gaikan.compileFromFile(path.join(__dirname, 'views') + '/parts_payment_btn.html');

    /*

    Redirect user to the Robokassa website to make a payment

    */

    router.get('/invoice/:invid', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        var invid = parseInt(req.params.invid);
        var render_data = {
            title: i18nm.__('process_payment'),
            current_lang: req.session.current_locale,
            page_title: i18nm.__('process_payment')
        };
        if (!invid || invid.isNaN || invid < 1) {
            render_data.content = payment_html(gaikan, {
                title: i18nm.__('payment_error'),
                msg: i18nm.__('invalid_order_id')
            }, undefined);
            return app.get('renderer').render(res, undefined, render_data, req);
        }
        app.get('mongodb').collection('warehouse_orders').find({
            order_id: invid,
            user_id: req.session.auth._id
        }, {
            limit: 1
        }).toArray(function(err, items) {
            if (err || !items || !items.length || items[0].order_status !== 0) {
                render_data.content = payment_html(gaikan, {
                    title: i18nm.__('payment_error'),
                    msg: i18nm.__('invalid_order_id')
                }, undefined);
                return app.get('renderer').render(res, undefined, render_data, req);
            }
            var order = items[0],
                signature = crypto.createHash('md5').update(config.catalog_payment.robokassa.sMerchantLogin + ':' + order.sum_total + ':' + invid + ':' + config.catalog_payment.robokassa.sMerchantPass1).digest('hex').toUpperCase();
            req.session.catalog_redirect_host = req.get('host');
            return res.redirect(303, config.catalog_payment.robokassa.url + "?MrchLogin=" + config.catalog_payment.robokassa.sMerchantLogin + "&OutSum=" + order.sum_total + "&InvId=" + invid + "&Desc=" + i18nm.__('invoice_no') + ' ' + invid + "&SignatureValue=" + signature + "&IncCurrLabel=" + config.catalog_payment.robokassa.sIncCurrLabel + "&Culture=" + req.session.current_locale + "&rnd=" + Math.random().toString().replace('.', ''));
        });
    });

    /*

    Process a result request from Robokassa

    */

    router.all('/process', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        var OutSum = req.body.OutSum || req.query.OutSum,
            InvId = parseInt(req.body.InvId || req.query.InvId),
            SignatureValue = String(req.body.SignatureValue || req.query.SignatureValue);
        if (!OutSum || parseFloat(OutSum).isNAN || parseFloat(OutSum) < 0 || !InvId || InvId.isNAN || InvId < 0 || !SignatureValue) return res.send("Invalid parameters");
        app.get('mongodb').collection('warehouse_orders').find({
            order_id: InvId,
            order_status: 0
        }, {
            limit: 1
        }).toArray(function(err, items) {
            if (err || !items || !items.length) return res.send('Invalid order');
            var order = items[0],
                signature = crypto.createHash('md5').update(OutSum + ':' + order.order_id + ':' + config.catalog_payment.robokassa.sMerchantPass2).digest('hex').toUpperCase();
            if (signature != SignatureValue) return res.send("Invalid signature");
            app.get('mongodb').collection('warehouse_orders').update({
                    order_id: InvId
                }, {
                    $set: {
                        order_status: 1
                    }
                },
                function(err) {
                    if (err) return res.send("Cannot update database");
                    // Send "Payment success" email
                    app.get('mongodb').collection('users').find({
                        _id: new ObjectId(order.user_id)
                    }).toArray(function(us_err, users) {
                        var mail_data = {
                            lang: i18nm,
                            site_title: app.get('settings').site_title,
                            order_id: order.order_id,
                            view_url: config.protocol + '://' + req.get('host') + '/catalog/orders?mode=view&order_id=' + order._id,
                            subj: i18nm.__('your_order_id') + ' ' + order.order_id
                        };
                        if (!us_err && users && users.length && users[0].email) {
                            mailer.send(users[0].email, i18nm.__('your_order_id') + ' ' + order.order_id + ' (' + app.get('settings').site_title + ')', path.join(__dirname, 'views'), 'mail_success_html', 'mail_success_txt', mail_data, req, function() {
                                mail_data.subj = i18nm.__('order_id') + ' ' + order.order_id;
                                mail_data.view_url = config.protocol + '://' + req.get('host') + '/cp/catalog_orders';
                                mailer.send(app.get('config').mailer.feedback, i18nm.__('order_id') + ' ' + order.order_id + ' (' + app.get('settings').site_title + ')', path.join(__dirname, 'views'), 'mail_success_html', 'mail_success_txt', mail_data, req, function() {
                                    return res.send("OK" + InvId);
                                });
                            });
                        } else {
                            mail_data.subj = i18nm.__('order_id') + ' ' + order.order_id;
                            mail_data.view_url = config.protocol + '://' + req.get('host') + '/cp/catalog_orders';
                            mailer.send(app.get('config').mailer.feedback, i18nm.__('order_id') + ' ' + order.order_id + ' (' + app.get('settings').site_title + ')', path.join(__dirname, 'views'), 'mail_success_html', 'mail_success_txt', mail_data, req, function() {
                                return res.send("OK" + InvId);
                            });
                        }

                    });
                });
        });
    });

    /*

    Success URL

    */

    router.all('/success', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        var OutSum = req.body.OutSum || req.query.OutSum,
            InvId = parseInt(req.body.InvId || req.query.InvId),
            SignatureValue = String(req.body.SignatureValue || req.query.SignatureValue);
        // Redirect if wrong language loaded
        if (req.session.catalog_redirect_host && req.session.catalog_redirect_host != req.get('host')) return res.redirect(303, app.get('config').protocol + '://' + req.session.catalog_redirect_host + '/catalog/api/payment/success?OutSum=' + OutSum + '&InvId=' + InvId + '&SignatureValue=' + SignatureValue);
        var render_data = {
            title: i18nm.__('payment'),
            current_lang: req.session.current_locale,
            page_title: i18nm.__('payment')
        };
        if (!InvId || InvId.isNaN || InvId < 1 || !OutSum || parseFloat(OutSum).isNaN || parseFloat(OutSum) < 0 || !SignatureValue) {
            render_data.content = payment_html(gaikan, {
                title: i18nm.__('payment_error'),
                msg: i18nm.__('invalid_order_id')
            }, undefined);
            return app.get('renderer').render(res, undefined, render_data, req);
        }
        app.get('mongodb').collection('warehouse_orders').find({
            order_id: InvId,
            user_id: req.session.auth._id
        }, {
            limit: 1
        }).toArray(function(err, items) {
            if (err || !items || !items.length) {
                render_data.content = payment_html(gaikan, {
                    title: i18nm.__('payment_error'),
                    msg: i18nm.__('invalid_order_id')
                }, undefined);
                return app.get('renderer').render(res, undefined, render_data, req);
            }
            var order = items[0],
                signature = crypto.createHash('md5').update(OutSum + ':' + order.order_id + ':' + config.catalog_payment.robokassa.sMerchantPass1).digest('hex').toUpperCase();
            if (signature != SignatureValue.toUpperCase()) {
                render_data.content = payment_html(gaikan, {
                    title: i18nm.__('payment_error'),
                    msg: i18nm.__('invalid_signature')
                }, undefined);
                return app.get('renderer').render(res, undefined, render_data, req);
            }
            render_data.content = payment_html(gaikan, {
                title: i18nm.__('payment_success'),
                msg: i18nm.__('payment_success_msg'),
                html: pt_payment_btn(gaikan, {
                    lang: i18nm,
                    order_id: order._id
                }, undefined)
            }, undefined);
            return app.get('renderer').render(res, undefined, render_data, req);
        });
    });

    /*

    Fail URL

    */

    router.all('/fail', function(req, res) {
        i18nm.setLocale(req.session.current_locale);
        if (req.session.catalog_redirect_host && req.session.catalog_redirect_host != req.get('host')) return res.redirect(303, app.get('config').protocol + '://' + req.session.catalog_redirect_host + '/catalog/api/payment/fail');
        var render_data = {
            title: i18nm.__('payment'),
            current_lang: req.session.current_locale,
            page_title: i18nm.__('payment')
        };
        render_data.content = payment_html(gaikan, {
            title: i18nm.__('payment_error'),
            msg: i18nm.__('payment_failed')
        }, undefined);
        return app.get('renderer').render(res, undefined, render_data, req);
    });

    return router;
};
