var categoryAPI = require('./category');

module.exports = function (next) {
    categoryAPI.list(function (err, result) {
        if (err) return next(err);
        var cat = result.map(function (i) {
            return {
                uuid: i.uuid,
                name: i.name,
                link: i.link,
                subcat: i.subcat
            }
        });

        return cat;
    })
};