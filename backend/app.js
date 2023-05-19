const express = require("express");
const app = express();
const logger = require("./logger");
const pinohttp = require("pino-http");
const httpLogger = pinohttp({
  logger: logger,
});
app.use(httpLogger);

// Make sure errorController is last!
const controllers = ["homeController","userController","deadlineController", "videoController", "artworkController" , "errorController"];
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Register routes from all controllers
//  (Assumes a flat directory structure and common
// 'routeRoot' / 'router' export)
controllers.forEach((controllerName) => {
  try {
    const controllerRoutes = require("./controllers/" + controllerName);
    app.use(controllerRoutes.routeRoot, controllerRoutes.router);
  } catch (error) {
    console.log(error);
    throw error; // We could fail gracefully, but this
    //  would hide bugs later on.
  }
});

//These are two ways you can list out the routes
// to try to make sure everything was created properly.

const listEndpoints = require("express-list-endpoints");
console.log(listEndpoints(app)); //gives a bit more detail

const expressListRoutes = require("express-list-routes");
expressListRoutes(app, { prefix: "/" }); //gives simpler output but may be easier to read sometimes

module.exports = app;
