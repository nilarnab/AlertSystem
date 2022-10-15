const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.post("/createProducts", async (req, res, next) => {
  try {
    console.log(req.query);
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

router.get("/infiniteScroll/:page", async (req, res, next) => {
  const page = req.params.page * 1 || 1;
  const limit = 4;
  const skip_val = (page - 1) * limit * 1;

  query = await Product.find().skip(skip_val).limit(limit);

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

  try {
  } catch (err) {
    return res.status(400).json({
      message: err,
    });
  }
});

module.exports = router;