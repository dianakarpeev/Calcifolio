/* -------------------------------------------------------------------------- */
/*                                   Globals                                  */
/* -------------------------------------------------------------------------- */

const { MongoClient, ListCollectionsCursor } = require("mongodb");
const validateUtils = require("./validateUtils");
const { InvalidInputError } = require("./InvalidInputError");
const { DatabaseError } = require("./DatabaseError");
const logger = require('../logger');

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
      logger.info("Connected to MongoDB");
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

/* -------------------------------------------------------------------------- */
/*                            User CRUD Operations                            */
/* -------------------------------------------------------------------------- */

/* ------------------------------- Create User ------------------------------ */
//TODO: Make password storage encrypted
async function createUser(username, password){
    try {
        let username = username.toLocaleLowecase();
        if (validateUtils.isValidUsername(username)){
            if (validateUtils.isValidPassword(password)){
                const user = {username: username, password: password};
                await userCollection.insertOne(user);
                return true;
            }
        }
    } catch (error) {
        logger.error(error);
        throw error;
    }
}


/* -------------------------------- Read User ------------------------------- */



/* ------------------------------- Update User ------------------------------ */



/* ------------------------------- Delete User ------------------------------ */


