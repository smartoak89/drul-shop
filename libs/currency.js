var Promise = require("bluebird");
var request = require('request');
var _ = require('lodash');

exports.converter = function (data, currency, callback) {
    getCurrentCourse().then(function(course) {
        var input;
        var price = _.find(course, {ccy: currency.toUpperCase()}).sale;

        if (typeof data == 'string') {
            input = [{price: data}];
        }

        if (typeof data == 'object') {
            input = [data];
        }

        _.each(input, function (i) {
            i.price = i.price / price;
        });

        callback(null, input);
    }, function(err) {
        self.callback(err);
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