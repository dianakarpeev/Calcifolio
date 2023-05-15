const express = require("express");
const router = express.Router();
const routeRoot = "/";
const { InvalidInputError } = require("../models/InvalidInputError");
const { DatabaseError } = require("../models/DatabaseError");
const model = require("../models/projectDeadlineModelMongoDb");
const validator = require("validator");

//============================== Create Deadline (POST) ==============================

//creates a new event deadline with json data ( needs projectName and projectDueDay)
router.post("/deadlines", handleCreateProjectDeadline);
/**
 * Handles the new creation of a new event Deadline in the database.
 * @param {object} req  Expect body parameters of projectName, projectDueDay and description.
 * @param {object} res project deadline was created message (200 success).
 *
 * throws {InvalidInputError} if the project name is empty or the deadline date is not written in the correct format "YYYY-MM-DD". 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleCreateProjectDeadline(req, res) {
  let userMessage;
  try {
    let projectName = req.body.projectName;
    let projectDueDay = req.body.projectDueDay;
    let description = req.body.description;

    let result = await model.createProjectDeadline(projectName, projectDueDay,description); //this should throw an error when invalid
    res.status(200);
    res.send(result);
  } catch (err) {
    //--------------- Error handling ---------------
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
      userMessage = "Unexpected Error: failed to create new event deadline";
    }
    res.send({ errorMessage: userMessage });
  }
}
//============================== Find Deadline (GET)==============================
//get the event deadline without parameters after /deadline
router.get("/deadlines", handleGetAllEvents);

/**
 * Handles the request of getting  all the events in the database.
 * @param {object} req Expect no parameters.
 * @param {object} res sends the number of items and its total in the database. (200 success)
 *
 * throws {InvalidInputError} if the project name is empty or the deadline date is not written in the correct format "YYYY-MM-DD". 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleGetAllEvents(req, res) {
  try {
    let result = await model.getAllEvents(); //this should throw an error when invalid
    console.table(result);
    res.status(200);
    res.send(result);
  } catch (err) {
    //--------------- Error handling ---------------
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
      userMessage = "Unexpected Error: failed to get all events";
    }
    res.send({ errorMessage: userMessage });
  }
}

//Gets a single event from the database using the parameters URL /:projectName after the /deadlines
router.get("/deadlines/:projectName", handleGetSingleEvent);

/**
 * Handles the request for a single event deadline corresponding to the project name within the database.
 * @param {object} req Expect parameter for projectName.
 * @param {object} res userMessage that declares that an event was found. (200 success)
 *
 * throws {InvalidInputError} if the project name is empty or the deadline date is not written in the correct format "YYYY-MM-DD". 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleGetSingleEvent(req, res) {
  let userMessage;
  try {
    let projectName = req.params.projectName;

    let result = await model.getSingleEvent(projectName); //this should throw an error when invalid
    res.status(200);
    res.send(result);
  } catch (err) {
    //--------------- Error handling ---------------
    console.log(err.message)
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
      userMessage = "Unexpected Error: failed to find single event";
    }
    res.send({ errorMessage: userMessage });
  }
}

//============================== (PUT) Update Deadline ==============================
//updateDeadlines with three parameters after /deadlines
// /:old--> the name of the projectName that will be updated
// /:new--> the name of the new projectName that will be updated if planning to update by NAME
//                                      OR
// /:new--> the date of the new projectDueDay that will be updated if planning to update by DUE DATE
// /:optional?--> the optional parameter that will be the the date of the new projectDueDay that will
//   be updated in combination with the new projectName if planning to update by REPLACING THE WHOLE OBJECT
//                                      OR
// /:optional?--> the optional parameter that is a flag indicating whether the update is by name ot by date

router.put("/deadlines/:old/:new/:optional?", handleUpdateSingleEvent);

/**
 * Handles the request to update the deadline for three different types
 * 1. if all 3 parameters are used, it will replace the current deadline with the new parameters if its a date
 *    1.a. or if the 3rd parameter is a string : "by-date" it will up update the deadline by date only.
 * 2. update the deadline by name only.
 * @param {object} req Expect parameters of projectName, newProjectName/newProjectDueDay, and optional parameter: newProjectDueDay.
 * @param {object} res of th update request object. (200 success)
 *
 * throws {InvalidInputError} if the project name is empty or the deadline date is not written in the correct format "YYYY-MM-DD". 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */

//FIX UPDATES
async function handleUpdateSingleEvent(req, res) {
  let userMessage;
  var default_date_options = {
    format: "YYYY-MM-DD",
    delimiters: ["-"],
    strictMode: true,
  };

  try {
    let result;
    let projectName = req.params.old;
    let newItem = req.params.new;
    let newDate = req.params.optional;
    //checks if the third parameter is empty or not
    if (newDate != undefined) {
      let flag = req.params.optional.toLocaleLowerCase();
      //checks if the third parameter is a valid date
      if (validator.isDate(newDate, default_date_options)) {
        result = await model.replaceSingleEvent(projectName, newItem, newDate); //return Json object containing the modified count
        if (result.modifiedCount < 1) {
          throw new InvalidInputError(
            'Error: "' + projectName + '" does not exist in database \n'
          );
        }
        let replaced = await model.getSingleEvent(newItem); //this should throw an error when invalid
        res.send(replaced);
        //checks if the flag is a string "by-date" flag
      } else if (flag == "by-date") {
        //update the first event that matches the same date as the param
        let oldDate = await model.getSingleEvent(projectName); //this should throw an error when invalid
        result = await model.updateSingleEventDate(projectName, newItem);
        //return Json object containing the modified count
        if (result.modifiedCount < 1) {
          throw new InvalidInputError(
            'Error: "' + projectName + '" does not exist in database \n'
          );
        }
        let newDate = await model.getSingleEvent(projectName); //this should throw an error when invalid
        res.status(200);
        userMessage = res.send(newDate);
      } else {
        throw new InvalidInputError(
          'third parameter must be a valid date format "YYYY-MM-DD" if planning to replace the project deadline ' +
            'OR its value is "by-date" to update the project deadline by date'
        );
      }
    } else {
      //update the first event that matches the same name as the param
      result = await model.updateSingleEventName(projectName, newItem); //return Json object containing the modified count
      if (result.modifiedCount < 1) {
        throw new InvalidInputError(
          'Error: "' + projectName + '" does not exist in database \n'
        );
      }
      let eventName = await model.getSingleEvent(newItem); //this should throw an error when invalid
      res.status(200);
      res.send(eventName);
    }
  } catch (err) {
    //--------------- Error handling ---------------
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
      userMessage = "Unexpected Error: failed to update event deadline";
    }
    res.send({ errorMessage: userMessage });
  }
}

//============================== (DELETE) Delete Deadline ==============================
//Deletes a single event from the database using the parameters URL /:projectName after the /deadlines
router.delete("/deadlines/:projectName", handleDeleteSingleEvent);
/**
 * Handles the delete event from the database using the parameters URL /:projectName
 * @param {object} req Expects parameters projectName.
 * @param {object} res deleted item. (200 success)
 *
 * throws {InvalidInputError} if the project name is empty or the deadline date is not written in the correct format "YYYY-MM-DD". 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleDeleteSingleEvent(req, res) {
  let userMessage;

  try {
    let projectName = req.params.projectName;

    let result = await model.deleteSingleEvent(projectName); //return Json object containing the deleted count

    if (result.deletedCount < 1) {
      throw new InvalidInputError(
        'Error: "' +
          projectName +
          '" does not exist in database, therefore nothing was deleted \n'
      );
    }
    res.send(result);
  } catch (err) {
    //--------------- Error handling ---------------
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

//BEYOND THIS POINT, ITS NOT USED IN THE FRONT END================================================================================================================
//Deletes all events matching names or date  from the database using the parameters URL /:nameDate after the /deadlines/delete-many
router.delete("/deadlines/delete-many/:nameDate", handleDeleteManyEvents);
/**
 * Handles the deleting of many events corresponding to matching names or date from the database.
 * @param {object} req expects parameters nameDate.
 * @param {object} res Deleted item object. (200 success)
 *
 * throws {InvalidInputError} if the project name is empty or the deadline date is not written in the correct format "YYYY-MM-DD". 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleDeleteManyEvents(req, res) {
  let userMessage;
  var default_date_options = {
    format: "YYYY-MM-DD",
    delimiters: ["-"],
    strictMode: true,
  };
  try {
    let nameDate = req.params.nameDate;

    if (!validator.isDate(nameDate, default_date_options)) {
      //deletes all events that are matching by the given name
      result = await model.deleteManyEventsByName(nameDate); //return Json object containing the deleted count
      if (result.deletedCount < 1) {
        throw new InvalidInputError(
          nameDate +
            " does not exist in database, therefore nothing was deleted \n"
        );
      }
      res.status(200);
      userMessage =
        'All matching project names: "' +
        nameDate +
        '" got deleted! \n Count: ' +
        result.deletedCount;
    } else {
      //deletes all events matching project by date
      result = await model.deleteManyEventsByDate(nameDate); //return Json object containing the deleted count
      if (result.deletedCount < 1) {
        throw new InvalidInputError(
          nameDate +
            " does not exist in database, therefore nothing was deleted \n"
        );
      }
      res.status(200);
      userMessage =
        'All matching project dates: "' +
        nameDate +
        '" got deleted! \n Count: ' +
        result.deletedCount;
    }
  } catch (err) {
    //--------------- Error handling ---------------
    if (err instanceof InvalidInputError) {
      userMessage =
        "The request cannot be fulfilled due to invalid input:" +
        "\n" +
        err.message;
      res.status(400);
      console.log(err.message);
    } else if (err instanceof DatabaseError) {
      userMessage = "Internal error: " + err.message;
      res.status(500);
      console.log(err.message);
    } else {
      console.log(err.message);
      res.status(500);
      userMessage =
        "Unexpected Error: failed to delete many events by name or date";
    }
  }
  res.send(userMessage);
}

module.exports = {
  router,
  routeRoot,
};
