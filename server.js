const env = require("dotenv").config();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const flash = require("express-flash");
const request = require("request");
const app = express();
const { json } = require("stream/consumers");
const { response } = require("express");

const Key = require("./secure/key");
const PublicKey = require("./secure/publicKey");
const { monitorEventLoopDelay } = require("perf_hooks");
const { time } = require("console");
const { userInfo } = require("os");
const BART_KEY = process.env.BART_KEY;
const cmd = "etd";
const Tempkey = BART_KEY || PublicKey.tempKey;
var destination = "19th";

// APP STUFF

app.use(express.static("static"));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);


// ROUTING

app.get("/", (req, res) => {
  Bi_directionalApiCall(res);
});

app.get("/:station", (req, res) => {
  (destination = req.params.station), Bi_directionalApiCall(res);
});

// REMOVED: Courier /submit route
// Schedule Alerts feature now uses client-side localStorage only
// Future enhancement: integrate with SendGrid free tier or another simple email service

Bi_directionalApiCall = (res) => {
  request(
    "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" +
      destination +
      "&dir=n&key=" +
      Tempkey +
      "&json=y",
    (error, response, north) => {
      request(
        "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" +
          destination +
          "&dir=s&key=" +
          Tempkey +
          "&json=y",
        (error, response, south) => {
          res.render("index.ejs", {
            South: JSON.parse(south),
            North: JSON.parse(north),
            destination: destination,
          });
        }
      ).on("error", (err) => {
        res.render("runtime.ejs");
      });
    }
  );
};

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
