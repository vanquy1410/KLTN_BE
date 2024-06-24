// server.js
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
//config env
require("dotenv").config();
const cors = require("cors");
const app = express();
const http = require("http");
const cookieParser = require('cookie-parser');
const server = http.createServer(app);
const ip = process.env.IP;
const port = process.env.PORT;
const mongodb = process.env.MONGODB_URI;
const passport = require('passport');

app.use(express.json());
// Import the router
const accountRoute = require("./src/routers/Account.routers");
const eventRoute = require("./src/routers/Event.routers");
const deckRoute = require("./src/routers/Deck.routers");

// Use the router as middleware
app.use("/api/account", accountRoute);
app.use("/api/event", eventRoute);
app.use("/api/deck", deckRoute);
app.use(passport.initialize());

// Database connection
mongoose
  .connect(mongodb)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Connection failed:", error);
  });

// Start the server and listen for connections
server.listen(port, ip, () => {
    console.log("Server is running on IP: " + ip);
    console.log("Server is running on PORT: " + port);
    console.log("Server is running on DB: " + mongodb);
});
