const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const ProdResource = require("../models/ProdResource");
const { query } = require("express");

router.post("/createProducts", async (req, res, next) => {
  try {
    // console.log(req.query);
    const createProduct = await Product.create(req.query);
    return res.status(201).json({
      status: "Success",
      createProduct,
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error",
      message: "Something went wrong !",
      error: err,
    });
  }
});

router.get("/getAllProducts", async (req, res, next) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json({
      status: "Success",
      allProducts,
    });
  } catch (err) {
    return res.status(400).json({
      status: "Error",
      message: "Something went wrong !",
    });
  }
});


router.get("/get_product", async (req, res, next) => {

  try {

    if (req.query.prod_id) {

      var prod_id = req.query.prod_id
      // console.log(prod_id)

      var prod = await Product.findById(prod_id)

      var image = await ProdResource.find({
        prod_id: prod_id,
        primary: 1,
        type: 'IMG'
      })

      // console.log(image[0]['url'])

      if (image.length) {
        prod['image'] = image[0]['url']
      }
      // prod['image'] = 'image'

      return res.json({
        verdict: 1,
        data: prod,
        message: 'Found prod'
      })

    }
    else {

      return res.json({
        verdict: 0,
        message: 'Product id empty'
      })
    }

  } catch (err) {
    return res.status(400).json({
      status: "Error",
      message: "Something went wrong !",
    });
  }

})

router.get("/infiniteScroll/:page", async (req, res, next) => {
  // console.log("got")
  // console.log(req.params)
  const page = req.params.page * 1 || 1;
  const limit = 4;
  const skip_val = (page - 1) * limit * 1;

  var query = await Product.find().skip(skip_val).limit(limit);

  query.forEach(async (item, index) => {

    // console.log(item._id.toString())

    var image = await ProdResource.find({
      prod_id: item._id.toString(),
      primary: 1,
      type: 'IMG'
    })



    var image_val = 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_large.png?format=webp&v=1530129113'

    if (image.length) {
      image_val = image[0]['url']
    }

    query[index].image_val = image_val



    if (index == query.length - 1) {

      if (query.length == 0) {
        return res.status(200).json({
          message: "Success",
          query,
          extra_message: "LIMIT EXCEEDED",
        });
      } else {
        return res.status(200).json({
          message: "Success",
          query,
          extra_message: "LIMIT NOT EXCEEDED",
        });
      }

    }
  });



  try {
  } catch (err) {
    return res.status(400).json({
      message: err,
    });
  }
});
router.post('/get_individual/:prod_id',async(req,res)=>{
  let puid=req.params.prod_id;
  
  Product.findById({_id:puid},
      (err,data)=>{
      if(err){
         res.send("ERROR"); 
      }
       else{   if(data==null){
              res.send("Nothing found")
          }
          else{
              res.send(data)
          }
      }
  })
  
  })


router.get("/get_one_product", async (req, res, next) => {

  console.log('reached')
  console.log(req.query)

  // initialization 
  var prodId = req.query.prodId

  if (prodId != null) {
    // getting product
    var products = await Product.findById(prodId)

    if (products) {
      return res.json(
        {
          verdict: 1,
          response: {
            cart_items: [
              {
                product: products,
                qnt: 1
              }
            ]
          }
        }
      )
    }
    else {
      return res.json(
        {
          verdict: 0,
          message: 'Product not found'
        }
      )
    }
  }
  else {
    return res.json(
      {
        verdict: 0,
        message: 'Invalid fields'
      }
    )
  }


})

module.exports = router;
