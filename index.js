require("dotenv").config({ path: __dirname + "/sample.env" });

const express = require("express");
const cors = require("cors");
const app = express();
let bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const shortUrlschema = new mongoose.Schema({
  url: { type: String, required: true },
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlschema);

app.post("/api/shorturl", (req, res) => {
  const newShortUrl = new ShortUrl({ url: req.body.url });
  newShortUrl.save((err, data) => {
    if (err) return err;
    res.json({ url: req.body.url, id: data._id });
  });
});

app.get("/api/shorturl/:id", (req, res) => {
  ShortUrl.findById(req.params.id, (err, data) => {
    res.redirect(data.url);
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
