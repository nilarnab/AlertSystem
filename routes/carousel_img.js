const express = require("express");
const router = express.Router();
const AdaptiveCarousel = require("../models/AdaptiveCarousel");

router.get("/getCarousel", async (req, res, next) => {
  try {
    let carousel = await AdaptiveCarousel.find({});
    return res.json({
      verdict: 1,
      data: carousel

    })
  }
  catch (err) {
    return res.json({
      verdict: 0,
      data: err
    })
  }
})


router.post("/addCarousel", async (req, res, next) => {
  try {
    await AdaptiveCarousel.insertMany(
      {
        title: 'watch the videos',
        body: 'and then buy',
        img: 'https://images.unsplash.com/photo-1616161610000-1b1b1b1b1b1b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      }
    )
    return res.json({
      verdict: 1,
      data: carousel
    })
  }
  catch (err) {
    return res.json({
      verdict: 0,
      data: err
    })
  }
})

module.exports = router