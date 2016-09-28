var db = require('../core/datastore')('category');var uuid = require('uuid');module.exports = {    create: function (cat, callback) {        db.create(cat, callback)    },    list: function (callback) {        db.list(callback);    },    update: function (id, updateCat, callback) {        db.update(id, updateCat, callback)    },    add: function (id, subCat, callback) {        db.find(id, function (err, result) {            if (err) return callback(err);            subCat.uuid = uuid.v4();            result.subcat.push(subCat);            db.update(result.uuid, result, callback);        })    },    remove: function (id, index, callback) {        db.find(id, function (err, result) {            if (err) return callback(err);            if(index) {                result.subcat.splice(index, 1);                db.update(id, result, callback);            } else {                db.remove(id, callback);            }        });    }};