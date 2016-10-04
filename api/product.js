var db = require('../libs/datastore')('product');

module.exports = {
    create: function (data, callback) {
        db.create(data, callback)
    },
    list: function (callback) {
        db.list(callback);
    },
    update: function (id, updateCat, callback) {
        db.update(id, updateCat, callback)
    },
    add: function (id, subCat, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            result.subcat.push(subCat);
            db.update(result.uuid, result, callback);
        })
    },
    remove: function (id, index, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if(index) {
                result.subcat.splice(index, 1);
                db.update(id, result, callback);
            } else {
                db.remove(id, callback);
            }
        });
    }
};