const express = require('express');
const res = require('express/lib/response');
// middleware = require("../middlewares/auth.js")
const { json } = require('express/lib/response');
const bcrypt = require("bcryptjs");
const router = express.Router();
const Users = require('../models/Users')
const Searchables = require('../models/Searchables')

var path = require('path');
require('dotenv').config();
const axios = require('axios');
const Products = require('../models/Product');
const { send } = require('process');

const { MeiliSearch } = require('meilisearch');
const Product = require('../models/Product');
var client;
try {
    client = new MeiliSearch({ host: 'http://localhost:7700', apiKey: 'aajmereyaarkishaadihai' })
    client.index('products').addDocuments({})
        .then((res) => console.log(res));
}
catch (err) {
    console.log(err);
}

router.get("/query", async (req, res) => {
    const q = req.query.query;
    try {
        client.index('products').search(q).then((result) => res.send({ 'verdict': 1, 'data': result.hits, }));
    }

    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

router.post('/add', async (req, res, next) => {

    /*
        requried fields
        body: product object that is to be added 
    */
    console.log(req.body)

    var prod_id = req.body._id.$oid
    var timestamp = Date.now()

    req.body._id = prod_id

    delete req.body._id

    console.log(req.body)

    try {
        client.index('products').addDocuments(req.body)
            .then((res) => console.log(res));
        console.log("success in insertion in open search")
        console.log(prod_id);

        Searchables.insertMany(
            [{
                prod_id: prod_id,
                search_id: timestamp
            }], (err, res) => {
                console.log(err)
                console.log(res)
            }
        )
        console.log("inserted in local database")

        return res.json(
            {
                verdict: 1
            }
        )
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
})


module.exports = router