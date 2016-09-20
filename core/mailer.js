var config = require('../config'),
    nodemailer = require('nodemailer'),
    sendmailTransport = require('nodemailer-sendmail-transport');

module.exports = function(app) {
    var transporter,
        renderer = require('../core/renderer')(app),
        Entities = require('html-entities').AllHtmlEntities,
        entities = new Entities();
    if (config.mailer.transport == 'smtp') transporter = nodemailer.createTransport(config.mailer.smtp);
    if (config.mailer.transport == 'sendmail') transporter = nodemailer.createTransport(sendmailTransport(config.mailer.sendmail));

    var mailer = {
        send: function(to, subject, dir, html, txt, data, req, callback) {
            var site_title = '';
            if (app.get('settings') && app.get('settings').site_title) site_title = app.get('settings').site_title;
            var data_html = renderer.render_file(dir, html, data),
                data_txt = renderer.render_file(dir, txt, data),
                mail_template = renderer.render_file('../views', 'mail', {
                    title: subject,
                    message: data_html,
                    site_title: site_title,
                    site_url: config.protocol + '://' + req.get('host')
                });
            if (data_txt) data_txt = data_txt.replace(/<br>/gmi, '\n');
            var mailOptions = {
                from: config.mailer.sender,
                to: to,
                subject: subject,
                text: data_txt,
                html: entities.encodeNonASCII(mail_template)
            };
            if (transporter) {
                transporter.sendMail(mailOptions, function(error, info) {
                    if (callback) {
                        if (error) {
                            callback(error);
                        } else {
                            callback();
                        }
                    }
                });
            } else {
                if (callback) callback('No transporter defined');
            }
        }
    };

    return mailer;

};
