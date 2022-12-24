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
const Orders = require('../models/Orders')
const OrderSets = require('../models/OrderSets')
var path = require('path');
const { v4: uuidv4 } = require('uuid');
const { randomFillSync } = require('crypto');
require('dotenv').config();

// titles and descriptinos of stages
stage_titles = [
    'Order Placed',
    'Manul Verification',
    'Out for Delivery',
    'Order Delivered'
]

stage_descriptions = [
    'Your order has been placed. We will verify your order and get back to you.',
    'Your order has been verified. We will deliver your order soon.',
    'Your order is out for delivery. We will deliver your order soon.',
    'Your order has been delivered. Thank you for shopping with us.'
]


router.post("/place_by_cart", async (req, res, next) => {
    /*
    Accepts parameters
    user_id: (str)

    place order by cart items, and makes the entries of the cart invalid

    */
    // console.log("placing order by cart")

    // initialization
    var user_id = req.query.user_id

    // get all the valid cart items
    var cart_items = await Carts.find({ user_id: user_id, valid: 1 })

    if (cart_items.length == 0) {
        return res.json({
            verdict: 1,
            message: "No items in cart",
            response: null
        })
    }

    // adding cart items to order
    var order_id = uuidv4()
    // make a new order Set
    var response = await OrderSets.insertMany({ order_id: order_id, user_id: user_id, timestamp: Date.now() })

    // update the cart items with order_id
    var cart_items_sendable = []

    cart_items.forEach(async (data, i) => {

        var temp_item = {}

        temp_item["order_id"] = order_id
        temp_item["user_id"] = data.user_id
        temp_item["prod_id"] = data.prod_id
        temp_item["qnt"] = data.qnt

        cart_items_sendable.push(temp_item)

        if (i == cart_items.length - 1) {
            // console.log("updating cart items", order_id)
            // console.log(cart_items_sendable)
            var response = await Orders.insertMany(cart_items_sendable)

            // invalidating cart items
            var response = await Carts.updateMany({ user_id: user_id, valid: 1 }, { valid: 0 })

            return res.json({
                verdict: 1,
                response
            })
        }
    })




})


//Comparer Function    
function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}


router.post('/get_orders', async (req, res, next) => {

    /*
    Returns all the order sets of a user
    
    Accepts parameters
    user_id: (str)
    */

    // console.log("entered route here")

    //initialization
    var user_id = req.query.user_id
    var response = []

    // get all the order sets
    var order_sets = await OrderSets.find({ user_id: user_id, valid: 1 }).sort({ timestamp: 1 })

    // // console.log(order_sets)

    // get the items of the order sets
    order_sets.forEach(async (data, i) => {
        // console.log("entered loop", i)
        var order = {}
        var order_id = data.order_id

        // get stage data
        order["order_id"] = order_id
        order["stage"] = data.stage
        order["order_date"] = data.timestamp
        order["stage_title"] = stage_titles[data.stage]
        order["stage_description"] = stage_descriptions[data.stage]

        // get order items
        var order_items = await Orders.find({ order_id: order_id, valid: 1 })
        // console.log("order items")
        // console.log(order_items)

        var order_items_sendable = []
        var send_response = false

        order_items.forEach(async (data2, j) => {

            var order_item_temp = {}
            order_item_temp["prod_id"] = data2.prod_id
            order_item_temp["qnt"] = data2.qnt
            order_item_temp["user_id"] = data2.user_id
            order_item_temp["order_id"] = data2.order_id
            order_item_temp["valid"] = data2.valid

            order_item_temp["product"] = await Products.findById(order_items[j]["prod_id"])

            order_items_sendable.push(order_item_temp)

            if (order_items_sendable.length == order_items.length) {
                order["items"] = order_items_sendable
                // console.log("pushing order", i)
                // console.log(order)
                response.push(order)
                if (response.length == order_sets.length) {

                    // sorting array
                    response.sort(GetSortOrder("order_date"))

                    return res.json({
                        verdict: 1,
                        response
                    })
                }
            }
        })


    })
})
module.exports = router