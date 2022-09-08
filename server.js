const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const flash = require("express-flash");
const request = require("request");
const app = express();
const Key = require("./secure/key");
const PublicKey = require("./secure/publicKey")
// const stations = require("./secure/stations")
app.use(express.static("client/static"));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
// var oak = stations.dest.oak;
// var sanfran = stations.dest.sf;
// var nor = stations.dest.north;
// var sou = stations.dest.south;
var Mykey = Key.key;
var cmd = "etd";
var Tempkey = PublicKey.tempKey;
var destination = "19th";

app.get("/", (req, res) => {
  Bi_directionalApiCall(res)});


//   /* Wild Error proofing */ I 86D the previous Favicon & Added a new call on baggate.ejs for this icon
// app.get("/favicon.ico", (req,res) => {
//   res.status(404);
//   res.end();
// })  

app.get("/:station", (req, res) => {
  (destination = req.params.station),
  Bi_directionalApiCall(res)});

  /* Calls the bart api for data with parameters that supply northbound, then southbound trains */
  /* TO-DO Within both of the Api urls' below, replace the Tempkey variable with 'Mykey' once you have your own stable Api key from Bart.com's legacy API, you will also need to add the Key into the code of /secure/key.js */

Bi_directionalApiCall = (res)  => { 
  request(
  "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" + destination + "&dir=n&key=" + Tempkey + "&json=y",
    (error, response, north) => {   
    console.error("North error:", error);
    request(
      "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" +destination+ "&dir=s&key=" +Tempkey+ "&json=y",
      (error, response, south) => {
        
        console.error("South error:", error);
        console.log(north);
        console.log(" *********** ");
        console.log(south);
        
        res
        .render("index.ejs", {
          South: JSON.parse(south),
          North: JSON.parse(north)})
        })
        .on('error', (err) => {
          res.render("runtime.ejs")})
  })};

const server = app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
