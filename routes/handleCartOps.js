const express = require('express');
const res = require('express/lib/response');
// middleware = require("../middlewares/auth.js")
const { json } = require('express/lib/response');
const bcrypt = require("bcryptjs");
const router = express.Router();
const Users = require('../models/Users')
const Otps = require('../models/Otps')
const Carts = require('../models/Carts')
const Products = require('../models/Product')
const Activity = require("../models/Activity")
var path = require('path');
const { randomFillSync } = require('crypto');
require('dotenv').config();


router.post("/show_items", async (req, res, next) => {
    /*
    Accepts parameters
    1. user_id: (str)
    show all the cart items of a user id
    
    */

    var response = {}

    if (req.query.user_id) {

        var cart_items = await Carts.find({ user_id: req.query.user_id, valid: 1 })

        if (cart_items.length == 0) {
            return res.json({
                verdict: 1,
                message: "No items in cart",
                response: null
            })
        }

        response["cart_items"] = []
        for (i = 0; i < cart_items.length; i++) {
            var product = await Products.findById(cart_items[i]["prod_id"])

            var prod_obj = {}
            prod_obj["product"] = product
            prod_obj["qnt"] = cart_items[i].qnt
            prod_obj["cart_id"] = cart_items[i]._id
            response["cart_items"].push(prod_obj)

            if (i == cart_items.length - 1) {

                return res.json({
                    verdict: 1,
                    response
                })


            }
        }

        // cart_items.forEach(async (data, i) => {
        //     cart_items[i]["product"] = await Product.findById(req.query.user_id)
        // })




    }
    else {
        return res.json({
            verdict: 0,
            message: "Invalid fields",
            data: null
        })
    }



})

router.post("/show_item", async (req, res, next) => {
    /*
    Accepts parameters

    1. user_id: (str)
    2. prod_id: (str) 

    show all the cart items of a user id
    
    */

    var user_id = req.query.user_id
    var prod_id = req.query.prod_id

    if (user_id && prod_id) {
        var cart_ids = await Carts.find({ user_id: user_id, prod_id: prod_id, valid: 1 })

        if (cart_ids.length == 0) {
            return res.json({
                verdict: 0,
                message: "No such cart item exists",
                cart_item: null
            })
        }
        var cart_item = cart_ids[0]

        // finding product
        var prod_id = cart_item.prod_id
        var prod = await Products.findById(prod_id)
        cart_item.product = prod

        return res.json({
            verdict: 1,
            message: "Success in fetching",
            cart_item,
        })
    }


    else {
        return res.json({
            verdict: 0,
            message: "Invalid fields",
            data: null
        })
    }



})

router.post("/insert", async (req, res, next) => {

    /*
    Accepts parameters

    1. user_id: (str)
    2. prod_id: (str)
    3. qnt: (int)

    inserts a new entry in the Carts for a user
    
    */

    if (req.query.user_id && req.query.prod_id && req.query.qnt) {

        var user_id = req.query.user_id
        var prod_id = req.query.prod_id
        var qnt = req.query.qnt

        var cart_ids = await Carts.find({ user_id: user_id, prod_id: prod_id, valid: 1 })

        if (cart_ids.length > 0) {

            var response = await Carts.findOneAndUpdate({
                user_id: user_id,
                prod_id: prod_id
            }, { qnt: qnt })


            return res.json({
                verdict: 1,
                message: "Success in changing",
                response,
            })


        }

        var new_cart = new Carts()
        new_cart.user_id = user_id
        new_cart.prod_id = prod_id
        new_cart.qnt = req.query.qnt

        var response = await new_cart.save()
        var response = await new_cart.save()
        try {
            await (new Activity({ action: "addedToCart", productID: prod_id, timestamp: Date.now(), userID: user_id })).save();
        }
        catch (err) {
            console.log(err);
            // res.sendStatus(500);
        }

        return res.json({
            verdict: 1,
            message: "Success in insertion",
            response: response
        })
    }
    else {
        return res.json({
            verdict: 0,
            message: "Invalid fields",
            data: null
        })
    }

})

router.post("/alter", async (req, res, next) => {
    /*
    Accepts parameters

    1. cart_id: (str)
    3. qnt_new: (int)

    changes the qnt value of a cart item
    
    */

    if (req.query.cart_id && req.query.qnt_new!==undefined && req.query.prod_id) {


        var cart_ids = await Carts.findOne({ _id: req.query.cart_id, valid: 1 })
        try {
            if (cart_ids.length == 0) {
                return res.send({
                    verdict: 0,
                    message: "No such Cart item exists",
                    data: null
                })
            }
        }
        catch (err) {
            console.log(err);
        }

        try{
            //check if new quantity becomes 0
            if(req.query.qnt_new==0){

                var response = await Carts.findByIdAndUpdate(req.query.cart_id,{$set:{qnt:0,valid:0}});
            
            //adding activity 
            try {
                await (new Activity({ action: "removedFromCart", productID: req.query.prod_id, timestamp: Date.now(), userID: cart_ids.user_id })).save();
            }
            catch (err) {
                console.log(err);
                // res.sendStatus(500);
            }
        }
            else{
            response = await Carts.findByIdAndUpdate(req.query.cart_id, { qnt: req.query.qnt_new });
            }
            return res.json({
                verdict: 1,
                message: "Success in changing quantity",
                data: response
            })
        }
        catch(err){
            console.log(err);
            return res.json({
                verdict: 0,
                message: "error in changing quantity",
                data: null
            })
            
        }
    }
    else {
        return res.json({
            verdict: 0,
            message: "Invalid fields",
            data: null
        })
    }



})

router.post("/purge", async (req, res, next) => {

    if (req.query.cart_id) {
        var cart_ids = await Carts.findById(req.query.cart_id)

        if (cart_ids.length == 0) {
            return res.json({
                verdict: 0,
                message: "No such Cart item exists",
                data: null
            })
        }

        var response = await Carts.findByIdAndUpdate(req.query.cart_id, { valid: 1 })

        return res.json({
            verdict: 1,
            message: "Success in purge",
            data: response
        })

    }
    else {
        return res.json({
            verdict: 0,
            message: "Invalid fields",
            data: null
        })
    }

})


module.exports = router