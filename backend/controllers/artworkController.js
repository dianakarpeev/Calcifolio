const express = require("express");
const router = express.Router();
const routeRoot = "/";
const { InvalidInputError } = require("../models/InvalidInputError");
const { DatabaseError } = require("../models/DatabaseError");
const model = require("../models/artworkModelMongoDB");


//GET ALL ARTWORKS
router.get("/artworks", handleGetAllArtwork);

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






router.post("/artworks", handleCreateArtwork);

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
module.exports = {
    router,
    routeRoot,
  };