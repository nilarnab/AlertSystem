const express = require("express");
const res = require("express/lib/response");
const session = require("express-session");
const path = require('path');
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// creating db connectiion with project database
const mongo_proj = require("mongoose");
const db_proj = mongo_proj.createConnection(process.env.DATABASE_PROJECT_URL, { usenewUrlParser: true });

db_proj.on("error", (error) => {
  console.error(error);
});
db_proj.once("open", () => {
  console.log("connection project complete");
});

exports.db_proj = db_proj;

// creawting db connection with alerter database
const mongo_alerter = require("mongoose");
const db_alerter = mongo_alerter.createConnection(process.env.DATABASE_ALERTER_URL, { usenewUrlParser: true });

db_alerter.on("error", (error) => {
  console.error(error);
});
db_alerter.once("open", () => {
  console.log("connection alerter complete");
});

exports.db_alerter = db_alerter;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  express.urlencoded({
    extended: true,
  })
);


app.set("view engine", "ejs");




const authRouter = require('./routes/auth.js');
const rulesRouter = require('./routes/rules.js');


app.use("/auth", authRouter)
app.use("/rules", rulesRouter)


const port = process.env.PORT || 3000;
app.listen(port);
console.log(`app is listening at ${port}`)


