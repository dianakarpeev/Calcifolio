const express = require("express");
const router = express.Router();
const routeRoot = "/";
const { InvalidInputError } = require("../models/InvalidInputError");
const { DatabaseError } = require("../models/DatabaseError");
const model = require("../models/userAccountModelMongoDb.js");
const validator = require("validator");

/* --------------------------- Create User (POST) --------------------------- */
router.post("/signin", handleCreateUser);

/**
 * Handles creation of new user in the database.
 * @param {object} req Expects body parameters username and password
 * @param {object} res User was created message (200 success)
 * 
 * throws {InvalidInputError} if username or password are in an incorrect format 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
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

/* ----------------------------- Find User (GET) ---------------------------- */
router.get("/user", handleGetUser);

/**
 * Handles the request of getting an existing user in the database.
 * @param {object} req Expects username body paramater
 * @param {object} res Sends user information
 * 
 * throws {InvalidInputError} if the username is empty or incorrect. 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleGetUser(req, res){
    let userMessage;

    try {
        let username = req.body.username;
        let result = await model.getSingleUser(username);
        console.log(result);
        res.status(200);
        res.send(result);
    } catch (err) {
        console.log(err.message);

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
            userMessage = "Unexpected Error: failed to get user " + username;
        }

        res.send({ errorMessage: userMessage });
    }
}