var conf = require('../conf');
var mongoose = require('mongoose');

mongoose.connect(conf.mongoose.uri);
console.log(mongoose);
module.exports = mongoose;
