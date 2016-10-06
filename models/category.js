var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    link: {
        type: String
    },
    subcat: {
        type: Array
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Category', schema);
