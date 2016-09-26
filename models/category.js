var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    parent: {
        type: String,
        required: true
    },
    subcat: {
        type: Array,
    }
});

module.exports = mongoose.model('Category', schema);
