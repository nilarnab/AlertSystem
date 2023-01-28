const express = require("express");
const res = require("express/lib/response");
// middleware = require("../middlewares/auth.js")
const { json } = require("express/lib/response");
const bcrypt = require("bcryptjs");
const router = express.Router();
var path = require("path");
require("dotenv").config();
const jwt = require("jsonwebtoken");


router.post("/login", async (req, res, next) => {

});

module.exports = router;
