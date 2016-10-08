var Promise = require("bluebird");
var request = require('request');
var _ = require('lodash');

exports.converter = function (data, currency, callback) {
    getCurrentCourse().then(function(course) {
        var curr = currency.toUpperCase();
        if (curr == 'UAH') return callback(null, data);

        var currentPrice;
        var c = _.find(course, {ccy: curr});
        c ? currentPrice = c.sale : callback(null, data);

        _.each(data, function (i) {
            i.price = i.price / currentPrice;
        });

        callback(null, data);
    }, function(err) {
        callback(err);
    });
};

function getCurrentCourse () {
    return new Promise(function (res, rej) {
        request.get({
            url: 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'
        }, function (err, response, body) {
            if (err) return rej(err);
            try {
                var Jbody = JSON.parse(body)
            } catch (ex) {
                rej(new Error('response from api.privatbanc is empty'))
            }
            res(Jbody);
        });
    })
}