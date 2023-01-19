const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')

const colors = [
    '#66bfff', '#006dba', '#01497d'
]

const CarouselSchema = new mongoose.Schema({
    background_color_1: {
        type: String,
        default: colors[0]
    },
    background_color_2: {
        type: String,
        default: colors[1]
    },
    background_color_3: {
        type: String,
        default: colors[2]
    },
    title: {
        type: String,
        required: true
    },
    title_angle: {
        type: Number,
        default: 0,
    },
    title_color: {
        type: String,
        default: 'white',
    },
    body: {
        type: String,
        required: true
    },
    body_angle: {
        type: Number,
        default: 0,
    },
    body_color: {
        type: String,
        default: 'white',
    },
    img: {
        type: String,
        required: true
    },
    img_height: {
        type: Number,
        default: 100,
    },
    img_width: {
        type: Number,
        default: 100,
    },
    type: {
        type: Number,
        default: 2,
    },
});

module.exports = mongoose.model('AdaptiveCarousel', CarouselSchema)