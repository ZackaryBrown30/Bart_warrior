require('dotenv').config();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const flash = require("express-flash");
const request = require("request");
const app = express();
const fetch = require("node-fetch"); 
const { json } = require("stream/consumers");
const { response } = require("express");


const Key = require("./secure/key");
const PublicKey = require("./secure/publicKey");
const { monitorEventLoopDelay } = require('perf_hooks');
const { time } = require('console');
var Mykey = Key.key;
var cmd = "etd";
var Tempkey = PublicKey.tempKey;
var destination = "19th";


const automations = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: "Bearer "+process.env.CourierKey
  },
  body: JSON.stringify({
      "automation": {
          "steps": [
              {
                  "action": "delay",
                  "duration": "2 minutes"
              }
          ],
          "cancelation_token": "abcdefgh12345678"
      },
      "brand": "W50NC77P524K14M5300PGPEK4JMJ",
      "template": "S6CME56DCCM6DVQA7CVZR1MTPFPA",
      "recipient": "8ec8c99a-c5f7-455b-9f60-8222b8a27056",
      "data": {
          "name": "Jane Doe",
          "age": 27
      },
      "profile": "example"
  })
};


fetch('https://api.courier.com/automations/invoke', automations)
.then(response => response.json())
.then(response => console.log(response))
.catch(err => {
  console.log('84')
  console.error(err)
});


app.use(express.static("static"));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.get("/", (req, res) => {
  Bi_directionalApiCall(res)});

app.get("/:station", (req, res) => {
  (destination = req.params.station),
  Bi_directionalApiCall(res) // ,
  // fareCalculator(res),
  // console.log(fare)
});

// fareCalculator = (res) => {
//   request( 
//     "http://api.bart.gov/api/sched.aspx?cmd=fare&orig='+destination+'&" +endPoint+ "=embr&date=today&key="+ Tempkey+"=y", 
//     (error, response, fare) => {
//     console.error("Fare Calculator Error", fare);
      
//     })
//   };



Bi_directionalApiCall = (res)  => { 
  request(
  "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" + destination + "&dir=n&key=" + Tempkey + "&json=y",
    (error, response, north) => {   
    request(
      "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" +destination+ "&dir=s&key=" +Tempkey+ "&json=y",
      (error, response, south) => {
        
        res
        .render("index.ejs", {
          South: JSON.parse(south),
          North: JSON.parse(north),
          destination : destination,
        }
        );
        // console.log(nort.antc); trying to log the data
      })
        .on('error', (err) => {
          res.render("runtime.ejs")})
  })};

const server = app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
