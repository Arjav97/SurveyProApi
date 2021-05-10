var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    "_id": String,
    "name": String,
    "desc": String,
    "category":String,
    "image": {
        "data":Buffer,
        "contentType": String
    },
    "cc": String,
    "link": String,
    "review": [{
        "_id":String,
        "c1":Boolean,
        "c2":Boolean,
        "desc":String,
        "rating":String
    }]
})

module.exports = mongoose.model('Products' , schema)