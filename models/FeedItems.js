const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')
var crypto = require('crypto');

const feedItemsSchema = new mongo.Schema({
    title: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    description1: {
        type: String,
    },
    description2: {
        type: String,
    },
    holdimage: {
        type: String,
    },
    posterimage: {
        type: String,
        required: true
    },
    products: {
        type: Array,
    }

})


module.exports = mongoose.model('FeedItems', feedItemsSchema)

