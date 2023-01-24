const express = require('express');
const { json } = require('express/lib/response');
const bcrypt = require("bcryptjs");
const router = express.Router();
const Wishlists = require('../models/Wishlists');
const Products = require('../models/Product')
const Activity = require("../models/Activity")
require('dotenv').config();



router.post("/insert-item", async (req, res) => {
  if (req.query.user_id && req.query.prod_id ) {
    var user_id = req.query.user_id
      var prod_id = req.query.prod_id
    var wish_id = await Wishlists.find({ user_id: user_id, prod_id: prod_id, valid: 1 })

    if (wish_id.length > 0) {

        var response = await Wishlists.findOneAndUpdate({
            user_id: user_id,
            prod_id: prod_id
        })


        return res.json({
            verdict: 1,
            message: "Success in changing",
            response,
        })


    }



     

      
     
        try{
        var new_wishlist = new Wishlists()
        new_wishlist.user_id = user_id
        new_wishlist.prod_id = prod_id


        var response = await new_wishlist.save()
        try{
            await (new Activity({action:"addedToWishlist",productID:prod_id,timestamp:Date.now(),userID:user_id})).save();
        }
        catch(err){
            console.log(err);
            res.sendStatus(500);
        }
        console.log("added successfully");
        return res.status(200).json(response)
       
    }
    catch (error) {
        return res.status(500).json(error);
      }
    }
    else {
        return res.status(404).json({ msg: "Error occured" });
        
    }

})


router.post("/remove/:user_id/:prod_id",async (req, res) => {
    var user_id = req.params.user_id
    var prod_id = req.params.prod_id
    try {
        await Wishlists.findOneAndDelete({user_id:user_id,prod_id:prod_id});
        res.status(200).json({ 'message': 'Deletion completed successfully!' });
        console.log("REmove successfully")
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Delete failed!' });
    }
})
router.post('/getwish/:user_id',async(req,res)=>{
    let puid=req.params.user_id;
    
    Wishlists.find({user_id:puid},
        (err,data)=>{
        if(err){
           res.send("ERROR"); 
        }
         else{   if(data==null){
                res.send("Nothing found")
            }
            else{
              console.log("mila data")
                res.send(data)
            }
        }
    })
    })
  



router.get('/getstatus/:user_id',async(req,res)=>{
    
    let puid=req.params.user_id;
    try {
        
        var product = await Wishlists.findOne({user_id:puid});
        if (!product) {
          return res.status(404).json({ msg: "Error occured" });
        }
    
        return res.status(200).json(product);
      } catch (error) {
        return res.status(500).json(error);
      }
    
   
    })
    router.get('/get_ind/:user_id/:prod_id',async(req,res)=>{
      let uid=req.params.user_id;
      let puid=req.params.prod_id;
      console.log("get wish list item")
      console.log(uid);
      console.log(puid)
    

      try {
      
          var product = await Wishlists.findOne({user_id:uid,prod_id:puid});
          console.log(product)
          if (product==null) {
            console.log("error")         
            return res.status(404).json({msg:"product doesnt found"});
          // return res.send();
          }
          else{
          
            console.log("pro found")
            return res.status(200).json(product);
         
          }
        } catch (error) {
          return res.status(500).json(error);
        }
      
     
      })
   
module.exports = router