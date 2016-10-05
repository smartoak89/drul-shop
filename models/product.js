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
    description: {type: String},
    category: {type: String},
    count: { type: String },
    color: { type: Array },
    size: { type: Array },
    price: {type: Number},
    old_price: {type: Number}
});

module.exports = mongoose.model('Product', schema);
