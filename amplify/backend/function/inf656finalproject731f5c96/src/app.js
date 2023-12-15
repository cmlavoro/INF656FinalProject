/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// declare a new express app
const app = express();
const path = require("path");
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(methodOverride("_method"));

const connectDB = require("./config/dbConfig");
const mongoose = require("mongoose");

connectDB();

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const Contact = require("./model/Contact");
/**********************
 * Example get method *
 **********************/

app.get("/comedy", async (req, res) => {
  const contacts = await Contact.find().sort({ LastName: 1 });
  if (!contacts || contacts.length == 0) {
    return res.status(400).json({ message: "No Contacts found." });
  }

  res.json(contacts);
});

app.get("/comedy/*", function (req, res) {
  // Add your code here
  res.json({
    success: "get call succeed even with additional characters!",
    url: req.url,
  });
});

/****************************
 * Example post method *
 ****************************/

app.post("/comedy", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

app.post("/comedy/*", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example put method *
 ****************************/

app.put("/comedy", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/comedy/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/comedy", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/comedy/*", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});


mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(5000, () => console.log(`Server is running on ${5000}`));
});


// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
