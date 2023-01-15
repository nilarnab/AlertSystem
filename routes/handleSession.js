const express = require("express");
const router = express.Router();
const Sessions = require("../models/Sessions");
const Users = require("../models/Users");

// utility functions

async function get_user(uuid, phone_num) {

    var sessions = await Sessions.find({ uuid: uuid, phonenum: phone_num })

    var user_id = sessions[0].user_id

    var user = await Users.findById(user_id)


    return user

}


router.post('/create', async (req, res, next) => {

    /*
        Creates a new user
        1. creates a new entry if user with given phone number does not exist
        2. creates a new entry in session with user id , uuid, phonenum


        Parameters:
        1. phone_num: string
        2. uuid: string

    */


    if (req.query.phone_num && req.query.uuid) {

        // initialization
        var user_id = null
        var phone_num = req.query.phone_num
        var uuid = req.query.uuid

        // checking for an existing session
        // ----------------------------------------
        var existings = await Sessions.find({ phonenum: phone_num, uuid: uuid, alive: 1 })

        if (existings.length != 0) {

            var user = await get_user(uuid, phone_num)

            return res.json(
                {
                    verdict: 1,
                    user,
                    message: "session already exists"
                }
            )
        }
        else {
            // console.log("session does not exist")
        }

        // ----------------------------------------

        // getting current timestamp
        // -------------------------------------
        var timestamp = Date.now()

        const date = new Date(timestamp)
        var month = date.getMonth() + 1

        const timestamp_human = date.getFullYear() + ':'
            + month + ':'
            + date.getDate() + '::'
            + date.getHours() + ':'
            + date.getMinutes() + ':'
            + date.getSeconds() + ':'
            + date.getMilliseconds()

        // ---------------------------------------------------

        // find if user already exists 
        // -------------------------------------------------
        var existing = await Users.find({ phone: phone_num })

        if (existing.length == 0) {
            // as the user does not already exist, we have to make a new user
            // ------------------------------------
            var users = await Users.insertMany([
                {
                    phone: phone_num
                }
            ])

            user_id = users[0]._id.toString()


            // -------------------------------

        }

        else {
            // if user already exists, just query the user id
            // -----------------------------------------
            var users = await Users.find({ phone: phone_num })

            user_id = users[0]._id.toString()
            // ----------------------------------------

        }

        // now creating a new entry in the session
        // ------------------------------------

        var response = await Sessions.insertMany([
            {
                user_id: user_id,
                uuid: uuid,
                phonenum: phone_num,
                timestamp: timestamp,
                timestamp_human: timestamp_human
            }
        ])

        // -----------------------------------


        var user = await get_user(uuid, phone_num)

        return res.json(
            {
                verdict: 1,
                user,
                message: "created new session"
            }
        )
    }
    else {
        res.json(
            {
                verdict: 0,
                message: "invalid fields"
            }
        )
    }

})


router.post('/is_alive', async (req, res, next) => {

    if (req.query.user_id) {

        var user_id = req.query.user_id

        // checking if exists in sessions
        var alives = await Sessions.find({ user_id: user_id, alive: true })

        if (alives.length == 0) {
            res.json(
                {
                    verdict: 0,
                    message: "No valid session"
                }
            )
        }
        else {
            var response = await Users.findById(user_id)
            res.json(
                {
                    verdict: 1,
                    message: "Session exists",
                    response
                }
            )
        }

    }
    else {
        res.json(
            {
                verdict: 0,
                message: "invalid fields"
            }
        )
    }
})

router.post('/destroy', async (req, res, next) => {

    // console.log("reached endpoint")
    if (req.query.user_id) {

        var user_id = req.query.user_id

        var response = await Sessions.deleteMany({
            user_id: user_id
        })

        res.json({
            verdict: 1,
            message: "Deletion complete",
            response
        })

    }
    else {
        res.json(
            {
                verdict: 0,
                message: "invalid fields"
            }
        )
    }
})



module.exports = router;
