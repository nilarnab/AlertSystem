const express = require('express');
const { json } = require('express/lib/response');
const bcrypt = require("bcryptjs");
const router = express.Router();
const Wishlists = require('../models/Wishlists');
const Products = require('../models/Product')
const Activity = require("../models/Activity")
require('dotenv').config();


router.post("/showitems", async (req, res, next) => {

//         var response = {}
//         console.log("entered route")

//         if (req.query.user_id) {
//             console.log("user id present")
//             var wishlist_items = await Wishlists.find({ user_id: req.query.user_id, valid: 1 })

//             if (wishlist_items.length == 0) {
//                 return res.json({
//                     verdict: 1,
//                     message: "No items in wishlist",
//                     response: null
//                 })
//             }

//             console.log("found some items")
//             response["wishlist_items"] = []
//             for (i = 0; i < wishlist_items.length; i++) {
//                 var product = await Products.findById(wishlist_items[i]["prod_id"])

//                 console.log(wishlist_items[i])

//                 var prod_obj = {}
//                 prod_obj["product"] = product
//                 prod_obj["wishlist_id"] = wishlist_items[i]._id
//                 response["wishlist_items"].push(prod_obj)

//                 if (i == wishlist_items.length - 1) {

//                     console.log("sending response")
//                     return res.json({
//                         verdict: 1,
//                         response
//                     })


//                 }
//             }

//             wishlist_items.forEach(async (data, i) => {
//                 wishlist_items[i]["product"] = await Products.findById(req.query.user_id)
//             })




//         }
//         else {
//             return res.json({
//                 verdict: 0,
//                 message: "Invalid fields",
//                 data: null
//             })
//         }



//     })

//     router.post("/showitem", async (req, res, next) => {
//         /*
//         Accepts parameters

//         1. user_id: (str)
//         2. prod_id: (str) 

//         show all the cart items of a user id

//         */

//         var user_id = req.query.user_id
//         var prod_id = req.query.prod_id

//         if (user_id && prod_id) {
//             var wishlist_ids = await Wishlists.find({ user_id: user_id, prod_id: prod_id, valid: 1 })

//             if (wishlist_ids.length == 0) {
//                 return res.json({
//                     verdict: 0,
//                     message: "No such cart item exists",
//                     wishlist_item: null
//                 })
//             }
//             var wishlist_item = wishlist_ids[0]

//             // finding product
//             var prod_id = wishlist_item.prod_id
//             var prod = await Products.findById(prod_id)
//             wishlist_item.product = prod

//             return res.json({
//                 verdict: 1,
//                 message: "Success in fetching",
//                 wishlist_item,
//             })
//         }


//         else {
//             return res.json({
//                 verdict: 0,
//                 message: "Invalid fields",
//                 data: null
//             })
//         }



//     })

//     router.post("/insert_item", async (req, res, next) => {

//         /*
//         Accepts parameters

//         1. user_id: (str)
//         2. prod_id: (str)


//         inserts a new entry in the Wishlists for a user

//         */
//      console.log("insert item me");
//         if (req.query.user_id && req.query.prod_id ) {

//             var user_id = req.query.user_id
//             var prod_id = req.query.prod_id


//             var wishlist_ids = await Wishlists.find({ user_id: user_id, prod_id: prod_id, valid: 1 })

//              if (wishlist_ids.length > 0) {

//                 var response = await Wishlists.findOneAndUpdate({
//                     user_id: user_id,
//                     prod_id: prod_id
//                 })


//                 return res.json({
//                     verdict: 1,
//                     message: "Success in changing",
//                     response,
//                 })


//             }

//             var new_wishlist = new Wishlists()
//             new_wishlist.user_id = user_id
//             new_wishlist.prod_id = prod_id


//             var response = await new_wishlist.save()
//             try{
//                 await (new Activity({action:"addedToWishlist",productID:prod_id,timestamp:Date.now(),userID:user_id})).save();
//             }
//             catch(err){
//                 console.log(err);
//                 res.sendStatus(500);
//             }
//             return res.json({
//                 verdict: 1,
//                 message: "Success in insertion",
//                 response: response
//             })
//         }
//         else {
//             return res.json({
//                 verdict: 0,
//                 message: "Invalid fields",
//                 data: null
//             })
//         }

//     })




// //     router.delete("/remove/:wishlist_id",async (req, res) => {
// //         const wishlist_id = req.params.wishlist_id;
// //         try {
// //             const Wishlist = await Wishlists.findById(wishlist_id);
// //             if (!Wishlist) {
// //                 return res.status(404).json({ message: 'Wishlists not found!' });
// //             }


// //             await Wishlists.findByIdAndRemove(wishlist_id);
// //             res.status(200).json({ 'message': 'Deletion completed successfully!' });

// //         } catch (error) {
// //             console.log('error', error);
// //             res.status(500).json({ message: 'Delete failed!' });
// //         }
})


module.exports = router