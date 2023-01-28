const express = require("express");
const res = require("express/lib/response");
// middleware = require("../middlewares/auth.js")
const { json } = require("express/lib/response");
const bcrypt = require("bcryptjs");
const router = express.Router();
var path = require("path");
require("dotenv").config();
const fs = require('fs');
const jwt = require("jsonwebtoken");
const AlertJob = require("../models/jobs.js");

const SERVER_CHECKER_CODE = "SERVER_DOWN";
const ACTIONS_FILE = "actions.json";


let actions_raw = fs.readFileSync(ACTIONS_FILE);
let actions = JSON.parse(actions_raw);

// rules for alerting
// -----------------------------

async function checkServer() {
    // check if server is up
    // if not, send alert
    // if yes, do nothing

    var action = actions[SERVER_CHECKER_CODE];

    var current_time = new Date();
    var snooze_time = new Date(current_time.getTime() + action.snooze_time_min * 60 * 1000);

    // fetch get request to target url
    // if response is not 200, send alert
    // else, do nothing

    var send_alert = false;

    try {
        var resp = await fetch(action.target_url, { method: 'GET' })
        if (resp.status != 200) {
            send_alert = true;
        }
    }
    catch (err) {
        send_alert = true;
    }

    if (send_alert) {
        // check if a similar alert has been sent snooze time not exceeding current time  
        var blocking_alerts = await AlertJob.find(
            {
                alert_code: action.alert_code,
                snooze_time: { $gte: current_time },

            })

        if (blocking_alerts.length > 0) {
            // alert has been sent
            // do nothing
            send_alert = false;
        }
    }

    if (send_alert) {
        // send alert
        console.log('sending alert')
        var resp = await AlertJob.insertMany(
            {
                alert_code: action.alert_code,
                job_type: action.job_type,
                alert_level: action.alert_level,
                alert_subject: action.alert_subject,
                alert_body: action.alert_body,
                alert_to: action.concerned,
                alert_time: current_time,
                snooze_time: snooze_time,

            }
        )
    }

    console.log(SERVER_CHECKER_CODE, 'alert send condition', send_alert)

    return 'done'

}

// -----------------------------

router.post("/initate", async (req, res, next) => {
    var resp = await checkServer();

    return res.json(
        {
            verdict: resp
        }
    )
});

module.exports = router;
