const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const { db_alerter } = require('../server');

const dbAlertSchema = new mongoose.Schema({
    alert_code: {
        type: String,
        required: true
    },
    alert_level: {
        type: String,
        required: true
    },
    job_type: {
        type: String,
        default: 'MAIL'
    },
    alert_subject: {
        type: String,
        required: true
    },
    alert_body: {
        type: String,
        required: true
    },
    alert_time: {
        type: Date,
        required: true
    },
    alert_to: [
        {
            type: String,
            required: true
        },
    ],
    snooze_time: {
        type: Date,
        required: true
    },
    is_done: {
        type: Boolean,
        default: false
    }

});

module.exports = db_alerter.model('AlertJob', dbAlertSchema);