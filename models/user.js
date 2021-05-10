var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    "_id": String,
    "name": String,
    "password":String,
    "account":String,
    "pid":[String]
})

module.exports = mongoose.model('Users' , schema)