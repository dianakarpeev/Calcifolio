/* -------------------------------------------------------------------------- */
/*                                   Globals                                  */
/* -------------------------------------------------------------------------- */

const { MongoClient, ListCollectionsCursor } = require("mongodb");
const validateUtils = require("./validateUtils");
const { InvalidInputError } = require("./InvalidInputError");
const { DatabaseError } = require("./DatabaseError");
const logger = require('../logger');

const express = require("express");
const router = express.Router();
const routeRoot = "/users";
const validator = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let client;
let userCollection;

/* -------------------------------------------------------------------------- */
/*                                  Database                                  */
/* -------------------------------------------------------------------------- */

/**
 * Connects to a MongoDB server and creates a new collection if it doesn't exist or if the flag is true.
 * @param {string} db_name the name of the database the user wants to connect to.
 * @param {boolean} flag if true, creates a new collection, else it keeps the existing collection.
 * @param {string} url the url to connect to the MongoDB server.
 *
 * throws {DatabaseError} if the url is not valid and cannot be created.
 */
async function initialize(db_name, flag, url) {
    try {
      client = new MongoClient(url); //store connected client for use while the app is running
      await client.connect();
      logger.info("Users connected to MongoDB");
      db = client.db(db_name);
  
      // Check to see if the event deadlines collection exists
      collectionCursor = await db.listCollections({ name: "users" });
      collectionArray = await collectionCursor.toArray();
  
      if (collectionArray.length == 0) {
        // collation specifying case-insensitive collection
        const collation = { locale: "en", strength: 1 };
        // no match was found, so create new collection
        await db.createCollection("users", { collation: collation });
      }
      userCollection = db.collection("users"); // convenient access to collection
  
      if (flag) {
        await dateCollection.drop();
  
        collectionCursor = await db.listCollections({ name: "user" });
        collectionArray = await collectionCursor.toArray();
  
        if (collectionArray.length == 0) {
          // collation specifying case-insensitive collection
          const collation = { locale: "en", strength: 1 };
          // no match was found, so create new collection
          await db.createCollection("events", { collation: collation });
        }
        dateCollection = db.collection("user"); // convenient access to collection
      }
    } catch (err) {
      logger.error(err);
      throw new DatabaseError(err.message);
    }
  }

/**
 * Closes database connection.
 */
async function close() {
    try {
      await client.close();
      console.log("MongoDb connection closed");
    } catch (err) {
      console.log(err.message);
    }
  }

  /**
   * Checks if given password matches the one in the database.
   * @param {string} username of the account to check the password of
   * @param {string} passwordToCheck password to validate with database
   * @returns true if passwords match, false otherwise
   * 
  * throws {InvalidInputError} if the username is empty or is not written in the correct username format.
  * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
  * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
  */
  async function checkCredentials(name, passwordToCheck){
    try {
      let username = name.toLocaleLowerCase();
      
      if (validateUtils.isValidUsername(username) && validateUtils.isValidPassword(passwordToCheck)){
        const result = await userCollection.findOne( { username: username } );

        if (result == null || result == undefined) {
          throw new InvalidInputError("Cannot find information for account of " + username + " in the database. Cannot authenticate");
        }

        const isSame = await bcrypt.compare(passwordToCheck, result.password);
        
        if (isSame){
          console.log("Successfully authenticated user.");
          return true;
        } else {
          console.log("Incorrect password. Cannot authenticate user " + username);
          return false;
        }
      } else 
        throw new InvalidInputError("Username " + username + " or password is invalid.");
    } catch (error){
      logger.error(error);
      throw error;
    }
  }

  /**
   * Checks in the database if a user account with that username already exists.
   * @param {string} usernameToCheck username to check duplicates for
   * @returns false if no duplicates were found, true otherwise
   */
  async function hasDuplicates(usernameToCheck){
    try {
      usernameToCheck = usernameToCheck.toLocaleLowerCase();
      let result = await userCollection.findOne({username: usernameToCheck});
    
      if (result == null)
        return false;
      else 
        return true;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

/* -------------------------------------------------------------------------- */
/*                            User CRUD Operations                            */
/* -------------------------------------------------------------------------- */

/* ------------------------------- Create User ------------------------------ */
/**
 * Creates a new user account in the database. Hashes the password before storing it.
 * @param {string} username of the new user to create
 * @param {string} password of the new user to create.
 * @returns true if successful, throws an error otherwise
 * 
 * throws {InvalidInputError} if the username is empty or is not written in the correct username format.
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function createUser(username, password){
    try {
        let lowerUsername = username.toLowerCase();
        if (validateUtils.isValidUsername(lowerUsername)){
            if (validateUtils.isValidPassword(password) && !hasDuplicates(password)){
                const hashPassword = await bcrypt.hash(password, saltRounds);
                await userCollection.insertOne({username: lowerUsername, password: hashPassword});
                logger.info("Successful user registration");
                return true;
            }
        }
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

/* -------------------------------- Read User ------------------------------- */
/**
 * Finds the user corresponding to the username in the database.
 * @param {string} username is the name of user to find.
 * @returns the corresponding object representing the searched user.
 *
 * throws {InvalidInputError} if the username is empty or is not written in the correct username format.
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function getSingleUser(username){
  try {
    const name = username.toLocaleLowerCase();
    if (validateUtils.isValidUsername(name)){
      let result = await userCollection.findOne({username: name});

      if (result == null || result == undefined)
        throw new InvalidInputError("Username does not exist in the database.");

      logger.info("Successfully reading of user account");
      return result;
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

/**
 * Creates an array format of userCollection objects
 * @returns an array format of userCollection objects
 * 
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function getAllUsers(){
  try {
    const collectionCursor = await userCollection.find({});
    const collectionArray = await collectionCursor.toArray();
    logger.info("Successfuly read all user accounts.");
    return collectionArray;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

/* ------------------------------- Update User ------------------------------ */
/**
 * Updates a singular user account's username.
 * @param {string} oldUsername username of user account to update.
 * @param {string} newUsername name to change current username of account to.
 * @param {string} password password of the user acount to update.
 * @returns the updated user account where the username got changed.
 * 
 * throws {InvalidInputError} if the username/password is empty or the username/password is not written in the correct format "YYYY-MM-DD".
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the user comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function updateUsername(oldUsername, newUsername, password){
  try {
    const user = oldUsername.toLocaleLowerCase();
    const newName = newUsername.toLocaleLowerCase();

    if (await checkCredentials(oldUsername, password)){
      if (validateUtils.isValidUsername(user)){
        let result = await userCollection.updateOne(
          {username: user, password: password},
          {$set: {username: newName}}
        );

        if (result == null || result.modifiedCount == 0)
          throw new InvalidInputError("Name " + user + " does not exist in the database or incorrect password was provided.");

        logger.info(result);
        return result;
      }
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

/**
 * Updates an user's account password
 * @param {string} username of account to update the password of
 * @param {string} oldPassword password of account to update
 * @param {string} newPassword to change oldPassword of account to update to
 * @returns user account with updated password
 */
async function updatePassword(username, oldPassword, newPassword){
  try {
    const user = username.toLocaleLowerCase();

    if (validateUtils.isValidPassword(newPassword)){
      if (await checkCredentials(username, password)){
        let result = await userCollection.updateOne(
          {username: user},
          {$set: {password: newPassword}}
        );

        if (result == null || result.modifiedCount == 0)
          throw new InvalidInputError("Name " + user + " does not exist in the database.");
        
        logger.info(result);
        return result;
      }
    } else
      throw new InvalidInputError("New password is invalid due to incorrect format.");
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
/* ------------------------------- Delete User ------------------------------ */
/**
 * Deletes a single user profile.
 * @param {string} username of user account to delete.
 * @param {string} userPassword password of user account to delete. 
 * @returns deleted user.
 * 
 * throws {InvalidInputError}  the username/password is empty or wasn't found in the database.
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the user account comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function deleteUser(username, userPassword){
  try {
    let name = username.toLocaleLowecase();
    let password = userPassword.toLocaleLowecase();

    if (await checkCredentials(username, password)){
      let result = await userCollection.deleteOne({
        username: name,
        password: password
      });

      return result;
    };

    throw new InvalidInputError("Username " + name + " or password was not found in the database.");
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

module.exports = {
  initialize,
  close,
  deleteUser,
  checkCredentials,
  updatePassword,
  updateUsername,
  getAllUsers,
  getSingleUser,
  createUser,
  hasDuplicates
};
