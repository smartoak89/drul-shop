var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    article: {type: String},
    name: {type: String},
    category: {type: String},
    count: { type: String },
    link: { type: String },
    color: { type: Array },
    size: { type: Array }
});

module.exports = mongoose.model('Category', schema);