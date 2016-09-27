var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String
    },
    name: {
        type: String
    },
    link: {
        type: String
    },
    subcat: {
        type: Array
    }
});

module.exports = mongoose.model('Category', schema);
