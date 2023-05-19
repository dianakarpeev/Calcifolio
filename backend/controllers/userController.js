const express = require("express");
const router = express.Router();
const routeRoot = "/";
const { InvalidInputError } = require("../models/InvalidInputError");
const { DatabaseError } = require("../models/DatabaseError");
const model = require("../models/userAccountModelMongoDb.js");
const validator = require("validator");

/* --------------------------- Create User (POST) --------------------------- */
async function handleCreateUser(req, res) {
  let userMessage;

  try {
    let username = req.body.username;
    let password = req.body.password;

    let result = await model.createUser(username, password);
    res.status(200);
    res.send(result);
  } catch (err) {
    console.log("Failed to create project deadline: " + err.message);

    if (err instanceof InvalidInputError) {
      userMessage =
        "The request cannot be fulfilled due to invalid input: \n" +
        err.message;
      res.status(400);
    } else if (err instanceof DatabaseError) {
      userMessage = "Internal error: " + err.message;
      res.status(500);
    } else {
      res.status(500);
      userMessage = "Unexpected Error: failed to create new user " + username;
    }

    res.send({ errorMessage: userMessage });
  }
}
