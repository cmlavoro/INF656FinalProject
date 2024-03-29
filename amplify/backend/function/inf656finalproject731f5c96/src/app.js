/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// declare a new express app
const app = express();
const path = require("path");
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Built in middleware functions in express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connectDB = require("./config/dbConfig");
const mongoose = require("mongoose");

connectDB();

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const HasAllData = (data) =>
  data.FirstName != "" &&
  data.LastName != "" &&
  data.Phone != "" &&
  data.Email != "";

const NameFormat = (name) => name.match(/^[a-zA-Z .]*$/);

const PhoneFormat = (phone) => phone.match(/^\d+$/);

const EmailFormat = (email) =>
  email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

const FormValid = (req, res) => {
  if (!HasAllData(req)) return "First Name, Last Name, Phone, and Email are required!";
  if (!NameFormat(req.FirstName)) return "First Name is invalid";
  if (!NameFormat(req.LastName)) return "Last Name is invalid";
  if (!PhoneFormat(req.Phone)) return "Phone is invalid. Use ########## only!";
  if (!EmailFormat(req.Email)) return "Email is invalid.";

  return true;
};

const Contact = require("./model/Contact");

app
  .route("/comedy")
  .get(async (req, res) => {
    const contacts = await Contact.find().sort({ LastName: 1 });
    if (!contacts || contacts.length == 0) {
      return res.status(400).json({ message: "No Contacts found." });
    }
    res.json(contacts);
  })
  .post(async function (req, res) {
    const validationResult = FormValid(req.body);
    if (validationResult != true) {
      return res.status(400).json({ message: validationResult });
    } else {
      await Contact.create({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Phone: req.body.Phone,
        Email: req.body.Email,
        Address: req.body.Address,
      });
      const contacts = await Contact.find().sort({ LastName: 1 });
      res.json(contacts);
    }
  });

app.put("/comedy", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.delete("/comedy", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(5000, () => console.log(`Server is running on 5000`));
});

module.exports = app;
