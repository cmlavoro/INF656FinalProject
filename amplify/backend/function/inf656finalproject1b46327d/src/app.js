require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConfig");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

// ConnectDB
connectDB();

// Custom Middleware Function
app.use(logger);
app.use(cors(corsOptions));
app.use(methodOverride("_method"));

// Built in middleware functions in express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//serves static assets such as HTML files, images, and so on
app.use(express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

//routes
app.use("/subdir", require("./routes/subdir"));
app.use("/", require("./routes/root"));
//API Route
app.use("/contact", require("./routes/api/contacts"));

//Handle undefined routes
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join)(__dirname, "views", "404.html");
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
});
