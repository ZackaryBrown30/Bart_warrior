const env = require("dotenv").config();
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
const { monitorEventLoopDelay } = require("perf_hooks");
const { time } = require("console");
const { userInfo } = require("os");
var Mykey = Key.key;
var cmd = "etd";
var Tempkey = PublicKey.tempKey;
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

// CRON FUNCTION sanitizes raw date data into CRON format

const dateToCron = (date) => {
  const seconds = "*";
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const days = "*";
  const months = "*";
  const dayOfWeek = "*";

  return `${seconds} ${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
  // Should return date = (* 0 0 * * *)
};

// ROUTING

app.get("/", (req, res) => {
  Bi_directionalApiCall(res);
});

app.get("/:station", (req, res) => {
  (destination = req.params.station), Bi_directionalApiCall(res);
});

app.post("/submit", (req, res) => {
  console.log("*******  SERVER POST HITS *****");
  const formData = req.body;
  date = new Date(req.body.time);
  cron = dateToCron(date);
  console.log("cron = min hour day/mon mon day/week ", cron);

  const automations = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.CourierKey,
    },
    body: JSON.stringify({
      profile: {
        email: formData.email,
        phone_number: formData.phone_number,
        //Dis aint it \/ but were going somewhere... i think
        data: {
          day: formData.day,
          time: formData.time,
          phone_number: formData.phone_number,
          email: formData.email,
          station: formData.station,
        },
      },
    }),
  };

  // Calls the courier api via their AUTOMATIONS/ INVOKE path
  fetch("https://api.courier.com/automations/invoke", automations)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => {
      console.log("84");
      console.error(err);
    });
  res.send({});
});

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

const server = app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
