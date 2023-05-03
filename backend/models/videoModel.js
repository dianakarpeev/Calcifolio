const dbName = "video_db";
const { MongoClient } = require("mongodb");
const validateUtils = require("./validateUtils");
const { InvalidTitleError } = require("./InvalidTitleError");
const { InvalidLengthError } = require("./InvalidLengthError");
const { DatabaseError } = require("./DatabaseError");
const logger = require('../logger');
let client;
let db;
let videoCollection;

/**
 * Connect up to the online MongoDb database with the name stored in dbName
 * @param databaseName optional name of the database
 * @param reset Resets the collection if set to true
 */
async function initialize(url, databaseName = dbName, reset) {
  try {
    await client.connect();
    logger.info("Connected to MongoDB");
    db = client.db(databaseName);

    if (reset && db.collection("videos")) {
      videoCollection = db.collection("videos");
      await videoCollection.drop();
      logger.info("Videos collection reset");
    }
    //check to see if the videos collection exists
    collectionCursor = await db.listCollections({ name: "videos" });
    collectionArray = await collectionCursor.toArray();
    if (collectionArray.length == 0) {
      //collation specifying case-insensitive collection
      const collation = { locale: "en", strength: 1 };
      //No match was found, so create new collection
      await db.createCollection("videos", { collation: collation });
      logger.info("Videos collection created");
    }
    
    logger.info("Videos collection exists");
    videoCollection = db.collection("videos"); // convenient access to collection
  } catch (error) {
    logger.error(error);
  }
}

/**
 * Adds a video to the database
 * @param title name of the video
 * @param length length of the video
 * @returns video object if successful, throws error otherwise
 * @throws InvalidLengthError if length is not a valid time (i.e -1)
 * @throws InvalidTitleError if title is an empty string
 * @throws DatabaseError if any other error is thrown 
 */
async function addVideo(title, length,image) {
  try {
    if (validateUtils.isValid2(title, length)) {
      await videoCollection.insertOne({ title: title, length: length, image: image});
      return { title: title, length: length, image: image};
    }
  } catch (err) {
    if (err instanceof InvalidLengthError) {
      throw new InvalidLengthError(err.message);
    } else if (err instanceof InvalidTitleError) {
      throw new InvalidTitleError(err.message);
    } else {
      throw new DatabaseError(
        "Could not add video to database: " + err.message
      );
    }
  }
}
/**
 * Finds a video that matches the name parameter
 * @param {*} title Represents what a video is called on the website.
 * @returns the found video as an object
 * @throws InvalidTitleError if title is an empty string
 * @throws DatabaseError if any other error is thrown 
 */
async function getSingleVideo(title) {
  try {
    let foundVideo;
    if (validateUtils.validTitle(title)) {
      foundVideo = await videoCollection.findOne({ title: title });
    }
    if (foundVideo != null) {
      logger.info("Video found" + foundVideo);
      return foundVideo;
    } else {
      throw new DatabaseError("No video with title " + title + " was found");
    }
  } catch (err)
  {
    logger.error(err);
    if (err instanceof InvalidTitleError) {
      throw new InvalidTitleError(err.message);
    } else {
      throw new DatabaseError(
        "Could not delete video from database: " + err.message
      );
    }
  }
}
/**
 * Updates a video so it has a new title and a new length
 * @param {*} title title of the video we want to update
 * @param {*} newTitle new title of the video
 * @param {*} newLength new length of the video
 * @returns the object of the video before it was updated.
 * @throws InvalidLengthError if length is not a valid time (i.e -1)
 * @throws InvalidTitleError if title is an empty string
 * @throws DatabaseError if any other error is thrown 
 */
async function updateVideo(title, newTitle, newLength, newImage) {
  try {
    if (
      validateUtils.validTitle(title) &&
      validateUtils.isValid2(newTitle, newLength)
    ) {
      let foundVideo = await getSingleVideo(title);
    }
    if (foundVideo) {
      await videoCollection.replaceOne(
        { title: title },
        { title: newTitle, length: newLength, image: newImage}
      );
      foundVideo = await getSingleVideo(newTitle);
      logger.info("Video updated to " + foundVideo);
      return foundVideo;
    }
  } catch (err) {
    logger.error(err);
    if (err instanceof InvalidLengthError) {
      throw new InvalidLengthError(err.message);
    } else if (err instanceof InvalidTitleError) {
      throw new InvalidTitleError(err.message);
    } else {
      throw new DatabaseError(
        "Could not update video in database: " + err.message
      );
    }
  }
}
/**
 * Deletes a video with the corresponding title from the collection
 * @param {*} title Title of video to be deleted
 * @returns the video object that was deleted.
 * @throws InvalidTitleError if title is an empty string
 * @throws DatabaseError if any other error is thrown
 */
async function deleteVideo(title) {
  try {
    if (validateUtils.validTitle(title)) {
      let foundVideo = await getSingleVideo(title);
      if (foundVideo) {
        await videoCollection.deleteOne({ title: title });
        logger.info("Video deleted" + foundVideo);
        return foundVideo;
      }
    }
  } catch (err) {
    logger.error(err);
    if (err instanceof InvalidTitleError) {
      throw new InvalidTitleError(err.message);
    } else {
      throw new DatabaseError(
        "Could not delete video from database: " + err.message
      );
    }
  }
}
/**
 * Finds all the videos in the collection
 * @returns An array containing all the video objects
 * @throws DatabaseError if collection is empty
 */
async function getAllVideos() {
  try {
    let foundVideos = videoCollection.find();
    foundVideos = await foundVideos.toArray();

    if (foundVideos.length > 0) {
      logger.info("Video collection returned");
      return foundVideos;
    } else {
      throw new DatabaseError("Collection is empty");
    }
  } catch (err) {
    logger.error(err);
  }
}

/**
 * Closes the client connection
 */
async function close() {
  try {
    await client.close();
    logger.info("MongoDb connection closed");
  } catch (err) {
    logger.error(err);
  }
}

function getCollection() {
  return videoCollection;
}
module.exports = {
  initialize,
  addVideo,
  getSingleVideo,
  getAllVideos,
  close,
  getCollection,
  deleteVideo,
  updateVideo,
};
