const model = require("../models/videoModel");
const express = require("express");
const { DatabaseError } = require("../models/DatabaseError");
const { InvalidLengthError } = require("../models/InvalidLengthError");
const { InvalidTitleError } = require("../models/InvalidTitleError");
const router = express.Router();
const routeRoot = "/";

module.exports = { router, routeRoot };

//=============================================================
router.post(routeRoot + "addVideo", handleAddVideo);

/**
 * Handles the AddVideo function from videoModel by failing gracefully
 * @param {*} req 
 * @param {*} res 
 * @returns status 200 if adding video is successful, 400 if client error and 500 if database error
 */

async function handleAddVideo(req, res) {
  try {
    addedVideo = await model.addVideo(req.body.title, req.body.url);

    if (addedVideo) {
      res.status(200);
      res.send(addedVideo);
    } else {
      logger.error("Truthy check failed.");
      res.status(400);
      res.send({error: "Failed to add Video to collection for unknown reason"});
    }
  } catch (err) {

   
    if (err instanceof DatabaseError) {
      res.status(500);
      res.send({error:"There was a database error: " + err.message});
    } else if (err instanceof InvalidLengthError) {
      res.status(400);
      res.send({error:"There was an Invalid Length Error: " + err.message});
    } else if (err instanceof InvalidTitleError) {
      res.status(400);
      res.send({error: "There was an Invalid Title Error : " + err.message});
    } else {
      res.status(500);
      res.send({error:"There was an error: " + err.message});
    }

  }
}
//=============================================================
router.get(routeRoot + "videos/:videoTitle", handleFindSingleVideo);
/**
 * Handles the getSingleVideo function from videoModel by failing gracefully
 * @param {*} req 
 * @param {*} res 
 * @returns status 200 if video is found, 400 if client error and 500 if database error
 */
async function handleFindSingleVideo(req, res) {
  //get
  try {
    foundVideo = await model.getSingleVideo(req.params.videoTitle);
    if (foundVideo) {
      res.status(200);
      res.send(foundVideo);
    } else {
      logger.error("Truthy check failed.");
      res.status(400);
      res.send({error: "Failed to find video from collection for unknown reason"});
    }
  } catch (err) {

    if (err instanceof DatabaseError) {
      res.status(500);
      res.send({error:"There was a database error: " + err.message});
    } else if (err instanceof InvalidLengthError) {
      res.status(400);
      res.send({error: "There was an Invalid Length Error: " + err.message});
    } else if (err instanceof InvalidTitleError) {
      res.status(400);
      res.send({error:"There was an Invalid Title Error : " + err.message});
    } else {
      res.status(500);
      res.send({error:"There was an error: " + err.message});
    }

  }
}
//=============================================================
router.get(routeRoot + "videos", handleFindAllVideos);
/**
 * Writes all the videos to the webpage
 * @param {*} req 
 * @param {*} res 
 * @returns status 200 if operation is successful, 400 if client error and 500 if database error
 */
async function handleFindAllVideos(req, res) {
  try {
    foundVideos = await model.getAllVideos();
    if (foundVideos) {
      res.status(200);
      res.send(foundVideos);
      
    } else {
      logger.error("Truthy check failed.");
      res.status(400);
      res.send({error:"Videos are not found for unknown reason"});
    }
    res.end();
  } catch (err) {
    if (err instanceof DatabaseError) {
      res.status(500);
      res.send({error:"There was a database error: " + err.message});
    } else {
      res.status(500);
      res.send({error:"There was an error: " + err.message});
    }

  }
}
//=============================================================
router.delete(routeRoot + "deleteVideo/:videoTitle", HandleDeleteVideo);
/**
 * Handles the deleteVideo function from videoModel by informing the user if deleting video was successful
 * @param {*} req 
 * @param {*} res 
 * @returns status 200 if operation is successful, 400 if client error and 500 if database error
 */

async function HandleDeleteVideo(req, res) {
  try {
    deletedVideo = await model.deleteVideo(req.params.videoTitle);
    if (deletedVideo) {
      res.status(200);
      res.send(deletedVideo);
       
      
    } else {
      logger.error("Truthy check failed.");
      res.status(400);
      res.send({error:"Could not delete video for unknown reason"});
    }
  } catch (err) {

    if (err instanceof DatabaseError) {
      res.status(500);
      res.send({error:"There was a database error: " + err.message});
    } else if (err instanceof InvalidLengthError) {
      res.status(400);
      res.send({error:"There was an Invalid Length Error: " + err.message});
    } else if (err instanceof InvalidTitleError) {
      res.status(400);
      res.send({error:"There was an Invalid Title Error : " + err.message});
    } else {
      res.status(500);
      res.send({error:"There was an error: " + err.message});
    }

  }
}
//=============================================================
router.put(routeRoot + "updateVideo/:videoTitle", handleUpdateVideo);

/**
 * Tries to update a video and informs on the webpage if the operation was successful or not
 * @param {*} req 
 * @param {*} res 
 * @returns status 200 if operation is successful, 400 if client error and 500 if database error
 */

async function handleUpdateVideo(req, res) {
  try {
    updatedVideo = await model.updateVideo(
      req.params.videoTitle,
      req.body.newTitle,
      req.body.newLength,
      req.body.newImage,
    );
    if (updatedVideo) {
      res.status(200);
      res.send(model.updateVideo);
      
    } else {
      logger.error("Truthy check failed.");
      res.status(400);
      res.send({error:"Failed to update video"});
    }
  } catch (err) {
    if (err instanceof DatabaseError) {
      res.status(500);
      res.send({error:"There was a database error: " + err.message});
    } else if (err instanceof InvalidLengthError) {
      res.status(400);
      res.send({error: "There was an Invalid Length Error: " + err.message});
    } else if (err instanceof InvalidTitleError) {
      res.status(400);
      res.send({error: "There was an Invalid Title Error : " + err.message});
    } else {
      res.status(500);
      res.send({error:"There was an error: " + err.message});
    }
  }
}
