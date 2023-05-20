const express = require("express");
const router = express.Router();
const routeRoot = "/";
const { InvalidInputError } = require("../models/InvalidInputError");
const { DatabaseError } = require("../models/DatabaseError");
const model = require("../models/artworkModelMongoDB");

//gets all artworks
router.get("/artworks", handleGetAllArtwork);

/**
 * Handles getting all existing artworks in the database
 * @param {object} req Expects no parameters
 * @param {object} res To send all existing artworks
 *  
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleGetAllArtwork(req, res) {
  try {
    let result = await model.getAllArtworks(); //this should throw an error when invalid
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
      userMessage = "Unexpected Error: failed to get all artwork";
    }
    res.send({ errorMessage: userMessage });
  }
}

//creates a new artwork
router.post("/artworks", handleCreateArtwork);

/**
 * Handles the creation of a new artwork in the database
 * @param {object} req Expects body parameters of artworkName, artworkUrl and artworkDate
 * @param {object} res Returns created artwork
 * 
 * throws {InvalidInputError} if any of the body parameters are in an incorrect format. 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleCreateArtwork(req, res) {
try {
    let userMessage;
    let artworkName = req.body.artworkName;
    let artworkUrl = req.body.artworkUrl;
    let artworkDate = req.body.artworkDate;
    let result = await model.addArtwork(artworkName, artworkUrl,artworkDate); //this should throw an error when invalid
    res.status(200);
    res.send(result);
  } catch (err) {
    //--------------- Error handling ---------------
    console.log("Failed to create artwork: " + err.message);
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
      userMessage = "Unexpected Error: failed to create new artwork";
    }
    res.send({ errorMessage: userMessage });
  }
}

//deletes an existing artwork
router.delete("/artworks/delete/:artworkName", handleDeleteArtwork);

/**
 * Handles deleting an existing artwork in the database.
 * @param {object} req Expects artworkName body parameter
 * @param {object} res To return deleted artwork
 * 
 * throws {InvalidInputError} if the artwork name was invalid or not found in the database. 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleDeleteArtwork(req, res) {
try {
    let userMessage;
    let artworkName = req.params.artworkName;


    let result = await model.deleteArtwork(artworkName);
    res.status(200);
    res.send(result);
  } catch (err) {
    //--------------- Error handling ---------------
    console.log("Failed to delete artwork: " + err.message);
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
      userMessage = "Unexpected Error: failed to delete artwork";
    }
    res.send({ errorMessage: userMessage });
  }
}

//updates existing artwork 
router.put("/artworks/update/:artworkName", handleUpdateArtwork);

/**
 * Handles updating an existing artwork in the database. 
 * Expects a artworkName parameter.
 * @param {object} req Expects body parameters of:
 *                 -NewArtworkName
 *                 -NewArtowrkUrl
 *                 -NewArtworkDate
 * @param {object} res To return updated artwork
 * 
 * throws {InvalidInputError} if any of the parameters or invalid or artwork wasn't found in the database. 400
 * throws {DatabaseError} if the problem is related to the database connectivity and its interactions. 500
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types. 500
 */
async function handleUpdateArtwork(req, res) {
  try {
      let userMessage;
      let artworkName = req.params.artworkName;
      let NewArtworkName = req.body.NewArtworkName;
      let NewArtworkUrl = req.body.NewArtworkUrl;
      let NewArtworkDate = req.body.NewArtworkDate;
  
      let result = await model.updateArtwork(artworkName, NewArtworkName, NewArtworkUrl, NewArtworkDate);
      res.status(200);
      res.send(result);
    } catch (err) {
      //--------------- Error handling ---------------
      console.log("Failed to delete artwork: " + err.message);
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
        userMessage = "Unexpected Error: failed to delete artwork";
      }
      res.send({ errorMessage: userMessage });
    }
  }
  
module.exports = {
    router,
    routeRoot,
  };