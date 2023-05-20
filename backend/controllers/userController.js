const express = require("express");
const router = express.Router();
const routeRoot = "/";
const { InvalidInputError } = require("../models/InvalidInputError");
const { DatabaseError } = require("../models/DatabaseError");
const model = require("../models/userAccountModelMongoDb.js");
const validator = require("validator");
const P = require("pino");



module.exports = { router, routeRoot };
/* --------------------------- Create User (POST) --------------------------- */
router.post("/signup", handleCreateUser);

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
    console.log("Failed to create a user account: " + err.message);

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
      userMessage = "Unexpected Error: failed to create new user ";
    }

    res.send({ errorMessage: userMessage });
  }
}

/* ----------------------------- Find User (GET) ---------------------------- */
router.get("/user/:username", handleGetUser);

/**
 * Handles the request of getting an existing user in the database.
 * @param {object} req Expects username body parameter
 * @param {object} res Sends user information
 *
 * throws {InvalidInputError} if the username is empty or incorrect. 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleGetUser(req, res) {
  let userMessage;

  try {
    let username = req.params.username;
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

router.post("/login", handleGetUserLogins);

/**
 * Handles authentication user when they attempt to login.
 * @param {object} req Expects body parameters username and password
 * @param {object} res To return true or false on whether the user is authenticated.
 * 
 * throws {InvalidInputError} if any property is invalid or user wasn't found in the database. 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleGetUserLogins(req, res) {
  let userMessage;

  try {
    let username = req.body.username;
    let password = req.body.password;
    let result = await model.checkCredentials(username, password);
    console.log(result);
    res.  status(200);
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

/* -------------------------- Update User (PUT) ------------------------- */
router.put("/users/:username", handleUpdateUser);

/**
 * Handles when a user tries to update their account. Can update either username or password.
 * @param {*} req Expects newUsername parameter if updating username. newPassword parameter if updating password.
 * @param {*} res Returns updated user
 * 
 * throws {InvalidInputError} if any of the properties are at an incorrect format. 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleUpdateUser(req, res) {
  try {
    if (req.body.newUsername != null && req.body.newUsername != undefined)
      handleUpdateUsername(req, res);

    if (req.body.newPassword != null && req.body.newPassword != undefined)
      handleUpdatePassword(req, res);

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

/**
 * Handles when a user attempts to update their username to a new one.
 * @param {object} req Expects username, newUsername and password body paramaters
 * @param {object} res To return updated user
 * 
 * throws {InvalidInputError} if any parameters are invalid or user isn't found in the database. 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleUpdateUsername(req, res) {
  try {
    let username = req.params.username;
    let newUsername = req.body.newUsername;
    let password = req.body.password;

    let result = await model.updateUsername(username, newUsername, password);
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

/**
 * Handles when a user attempts to update their password to a new one.
 * @param {object} req Expects username, password and newPassword body paramaters
 * @param {object} res To return updated user
 * 
 * throws {InvalidInputError} if any parameters are invalid or user isn't found in the database. 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleUpdatePassword(req, res) {
  try {
    let username = req.params.username;
    let password = req.body.password;
    let newPassword = red.body.newPassword;

    let result = await models.updatePassword(username, password, newPassword);
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

/* -------------------------- Delete User (DELETE) -------------------------- */
router.delete("/users/:username", handleDeleteUser);

/**
 * Handles deleting existing user from the database.
 * @param {object} req Expects username and password body properties.
 * @param {object} res Returns deleted user
 *
 * throws {InvalidInputError} if any parameters are invalid or user isn't found in the database. 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleDeleteUser(req, res) {
  let userMessage;

  try {
    let username = req.params.username;
    let password = req.body.password;
    let result = await model.handleDeleteUser(username, password);

    res.status(200);
    res.send(result);
  } catch (err) {
    console.log(err.message);

    if (err instanceof InvalidInputError) {
      userMessage =
        "The request cannot be fulfilled due to invalid input:" +
        "\n" +
        err.message;
      res.status(400);
    } else if (err instanceof DatabaseError) {
      userMessage = "Internal error: " + err.message;
      res.status(500);
    } else {
      res.status(500);
      userMessage = "Unexpected Error: failed to delete single event";
    }

    res.send({ errorMessage: userMessage });
  }
}

module.exports = {
  router,
  routeRoot,
};