const { MongoClient, ListCollectionsCursor } = require("mongodb");
const validateUtils = require("./validateUtils");
const { InvalidInputError } = require("./InvalidInputError");
const { DatabaseError } = require("./DatabaseError");
const logger = require('../logger');

//global variables
let client;
let dateCollection;
let db;

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
    collectionCursor = await db.listCollections({ name: "events" });
    collectionArray = await collectionCursor.toArray();

    if (collectionArray.length == 0) {
      // collation specifying case-insensitive collection
      const collation = { locale: "en", strength: 1 };
      // No match was found, so create new collection
      await db.createCollection("events", { collation: collation });
    }
    dateCollection = db.collection("events"); // convenient access to collection

    if (flag) {
      await dateCollection.drop();

      collectionCursor = await db.listCollections({ name: "events" });
      collectionArray = await collectionCursor.toArray();

      if (collectionArray.length == 0) {
        // collation specifying case-insensitive collection
        const collation = { locale: "en", strength: 1 };
        // No match was found, so create new collection
        await db.createCollection("events", { collation: collation });
      }
      dateCollection = db.collection("events"); // convenient access to collection
    }
  } catch (err) {
    //--------------- Error handling ---------------
    logger.error(err);
    throw new DatabaseError(err.message);
  }
}
//============================== Create Deadline ==============================
/**
 * Creates a new event Deadline in the database.
 * @param {String} projectName is the name of the project/ identification besides the the _id.
 * @param {String} projectDueDay is the date of the deadline.
 *
 * throws {InvalidInputError} if the project name is empty or the deadline date is not written in the correct format "YYYY-MM-DD".
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function createProjectDeadline(projectName, projectDueDay,description) {
  try {
    let name = projectName.toLocaleLowerCase();
    if(description==null){
      description="no info provided";
    }
    if (validateUtils.isValid(name, projectDueDay)) {
      dateCollection.insertOne({
        projectName: name,
        projectDueDay: projectDueDay,
        description: description,
      });
      return {projectName:name, projectDueDay:projectDueDay, description: description};
    }
  } catch (err) {
    //--------------- Error handling ---------------
    logger.error(err);
    if (err instanceof InvalidInputError) {
      throw err;
    } else if (err instanceof DatabaseError) {
      throw err;
    } else {
      throw err;
    }
  }
}
//============================== Find Deadline ==============================

/**
 * Finds the first deadline corresponding to the project Name in the database.
 * @param {string} projectName is the name of the project/ identification besides the the _id.
 * @returns the corresponding object representing the searched project.
 *
 * throws {InvalidInputError} if the project name is empty or the deadline date is not written in the correct format "YYYY-MM-DD".
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function getSingleEvent(projectName) {
  try {
    let name = projectName.toLocaleLowerCase();
    if (validateUtils.isValidName(name)) {
      let result = await dateCollection.findOne({ projectName: name });
      if (result == null || result == undefined) {
        throw new InvalidInputError("Name does not exist in database");
      }
      return result;
    }
  } catch (err) {
    //--------------- Error handling ---------------
    logger.error(err);
    if (err instanceof InvalidInputError) {
      throw err;
    } else if (err instanceof DatabaseError) {
      throw err;
    } else {
      throw err;
    }
  }
}
/**
 * Creates an array format of the dateCollection objects.
 * @returns an array format of the dateCollection objects.
 *
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function getAllEvents() {
  try {
    collectionCursor = await dateCollection.find({});
    collectionArray = await collectionCursor.toArray();
    return collectionArray;
  } catch (err) {
    //--------------- Error handling ---------------
    logger.error(err);
    if (err instanceof DatabaseError) {
      throw err;
    } else {
      throw err;
    }
  }
}
//============================== Update Deadline ==============================
/**
 * Updates a singular event deadline by name only.
 * @param {String} projectName is the name of the project/ identification besides the the _id.
 * @param {String} newProjectName is the new name of the project that will replace the projectName.
 * @returns the updated event where the name got changed.
 *
 * throws {InvalidInputError} if the project name is empty or the deadline date is not written in the correct format "YYYY-MM-DD".
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function updateSingleEventName(projectName, newProjectName) {
  try {
    let name = projectName.toLocaleLowerCase();
    let newName = newProjectName.toLocaleLowerCase();
    if (validateUtils.isValidName(name)) {
      if (validateUtils.isValidName(newName)) {
        let result = await dateCollection.updateOne(
          { projectName: name },
          { $set: { projectName: newName } }
        );
        if (result == null || result.modifiedCount==0) {
          throw new InvalidInputError("Name does not exist in database");
        }
        logger.info(result);
        return result;
      }
    }
  } catch (err) {
    //--------------- Error handling ---------------
    logger.error(err);
    if (err instanceof InvalidInputError) {
      throw err;
    } else if (err instanceof DatabaseError) {
      throw err;
    } else {
      throw err;
    }
  }
}

/**
 * Updates a singular event deadline by date only.
 * @param {String} projectName is the name of the project/ identification besides the the _id.
 * @param {String} newProjectDueDay is the new date of the project that will replace the corresponding projectName collection's oldDate.
 * @returns the updated event where the date got changed.
 *
 * throws {InvalidInputError} if the project name is empty or the deadline date is not written in the correct format "YYYY-MM-DD".
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function updateSingleEventDate(projectName, newProjectDueDay) {
  try {
    let name = projectName.toLocaleLowerCase();
    if (validateUtils.isValid(name, newProjectDueDay)) {
      let result = await dateCollection.updateOne(
        { projectName: name },
        { $set: { projectDueDay: newProjectDueDay } }
      );
      logger.info(result);
      return result;
    }
  } catch (err) {
    //--------------- Error handling ---------------
    logger.error(err);
    if (err instanceof InvalidInputError) {
      throw err;
    } else if (err instanceof DatabaseError) {
      throw err;
    } else {
      throw err;
    }
  }
}
/**
 * Forces a complete update of a single eventDeadline by changing everything like the projectName and projectDueDay except the _idObject property.
 * @param {string} projectName is the name of the project/ identification besides the the _id.
 * @param {string} newProjectName is the new name of the project that will replace the projectName.
 * @param {string} newProjectDueDay is the new date of the project that will replace the projectDueDay corresponding to the projectName.
 * @returns the updated event where the name and date are changed.
 *
 * throws {InvalidInputError} if the project name is empty or the deadline date is not written in the correct format "YYYY-MM-DD".
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function replaceSingleEvent(
  projectName,
  newProjectName,
  newProjectDueDay
) {
  try {
    let name = projectName.toLocaleLowerCase();
    let newName = newProjectName.toLocaleLowerCase();
    if (validateUtils.isValidName(name)) {
      if (validateUtils.isValid(newName, newProjectDueDay)) {
        let result = await dateCollection.replaceOne(
          { projectName: name },
          { projectName: newName, projectDueDay: newProjectDueDay }
        );
        logger.info(result);
        return result;
      }
    }
  } catch (err) {
    //--------------- Error handling ---------------
    logger.error(err);
    if (err instanceof InvalidInputError) {
      throw err;
    } else if (err instanceof DatabaseError) {
      throw err;
    } else {
      throw err;
    }
  }
}

/**
 * updates more than one project containing the same category or theme
 * TO DO: eventually with more pieces of information per document
 *
 * @param {String} projectName is the name of the project/ identification besides the the _id
 * @param {String} newProjectName
 * @param {String} newProjectDueDay
 * @returns
 */
//update many projects
// async function updateManyEvents(projectName,newProjectName,newProjectDueDay){
//   try{
//    if(validateUtils.isValid(newProjectName,newProjectDueDay)){
//     let result =await dateCollection.updateMany({projectName:projectName},
//      {$set: {projectName:newProjectName,projectDueDay:newProjectDueDay}});
//     console.log(result);
//     return result;
//    }
//   }
//   catch (err) {
//    throw err;
//   }
//  }

//============================== Delete Deadline ==============================
/**
 * Deletes the first projectDeadline found by the projectName.
 * @param {string} projectName is the name of the project/ identification besides the the _id.
 * @returns a boolean value indicating whether its been acknowledged, and a deleted count.
 *
 * throws {InvalidInputError} if the project name is empty.
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function deleteSingleEvent(projectName) {
  try {
    let name = projectName.toLocaleLowerCase();
    if (validateUtils.isValidName(name)) {
      let result = await dateCollection.deleteOne({
        projectName: name,
      });
      return result;
    }
  } catch (err) {
    //--------------- Error handling ---------------
    logger.error(err);
    if (err instanceof InvalidInputError) {
      throw err;
    } else if (err instanceof DatabaseError) {
      throw err;
    } else {
      throw err;
    }
  }
}

/**
 * Deletes all events deadline corresponding with the projectName.
 * @param {*} projectName is the name of the project/ identification besides the the _id.
 * @returns  a boolean value indicating whether its been acknowledged, and a deleted count.
 *
 * throws {InvalidInputError}  the project name is empty.
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function deleteManyEventsByName(projectName) {
  try {
    let name = projectName.toLocaleLowerCase();
    if (validateUtils.isValidName(name)) {
      let result = await dateCollection.deleteMany({
        projectName: name,
      });
      return result;
    }
  } catch (err) {
    //--------------- Error handling ---------------
    logger.error(err);
    if (err instanceof InvalidInputError) {
      throw err;
    } else if (err instanceof DatabaseError) {
      throw err;
    } else {
      throw err;
    }
  }
}

/**
 * Deletes all events deadline corresponding with the project deadline date.
 * @param {*string} projectDueDay is the date of the deadline to be deleted.
 * @returns  a boolean value indicating whether its been acknowledged, and a deleted count.
 *
 * throws {InvalidInputError} if the deadline date is not written in the correct format "YYYY-MM-DD".
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function deleteManyEventsByDate(projectDueDay) {
  try {
    if (validateUtils.isValidDate(projectDueDay)) {
      let result = await dateCollection.deleteMany({
        projectDueDay: projectDueDay,
      });
      return result;
    }
  } catch (err) {
    //--------------- Error handling ---------------
    logger.error(err);
    if (err instanceof InvalidInputError) {
      throw err;
    } else if (err instanceof DatabaseError) {
      throw err;
    } else {
      throw err;
    }
  }
}

/**
 * Deletes everything in the dateCollection objects on MongoDB.
 * @returns an array format of the dateCollection objects.
 *
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
//NEVER USED
async function deleteTheDatabase() {
  try {
    collectionCursor = await dateCollection.deleteMany({});
    collectionArray = await collectionCursor.toArray();
    return collectionArray;
  } catch (err) {
    //--------------- Error handling ---------------
    logger.error(err);
    if (err instanceof DatabaseError) {
      throw err;
    } else {
      throw err;
    }
  }
}

/**
 * Closes the connection of the MsongoDb
 */
async function close() {
  try {
    await client.close();
    logger.info("MongoDb connection closed");
  } catch (err) {
    logger.error(err.message);
  }
}

/**
 * Gets the dateCollection that is connected to the client.db
 * @returns the dateCollection.
 *
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
async function getCollection() {
  try {
    return dateCollection;
  } catch (err) {
    //--------------- Error handling ---------------
    logger.error(err);
    if (err instanceof DatabaseError) {
      throw err;
    } else {
      throw err;
    }
  }
}

module.exports = {
  initialize,
  createProjectDeadline,
  createProjectDeadline,
  getSingleEvent,
  getAllEvents,
  updateSingleEventName,
  updateSingleEventDate,
  replaceSingleEvent,
  deleteSingleEvent,
  deleteManyEventsByName,
  deleteManyEventsByDate,
  deleteTheDatabase,
  getCollection,
  close,
};
