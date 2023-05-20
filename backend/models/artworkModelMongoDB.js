const dbName = "artwork_db";
const validate = require("./validateUtils");
const { MongoClient } = require("mongodb");
const { DatabaseError } = require("./DatabaseError");
const { InvalidInputError } = require("./InvalidInputError");

let client;
let artworksCollection;

/**
 * Connects to database using passed in URL and gets collection (makes sure it exists first).
 * Resets collection if
 * @param {string} dbName
 * @param {boolean} reset
 * @param {string} url
 * @returns
 */
async function initialize(dbName, reset, url) {
  try {
    client = new MongoClient(url); // store connected client for use while the app is running
    await client.connect();
    console.log("Connected to MongoDb");
    db = client.db(dbName);

    // check to see if the artworks collection exists
    collectionCursor = await db.listCollections({ name: "artworks" });
    collectionArray = await collectionCursor.toArray();

    if (collectionArray.length == 0) {
      // collation specifying case-insensitive collection
      const collation = { locale: "en", strength: 1 };
      // no match was found, so create new collection
      await db.createCollection("artworks", { collation: collation });
    }

    artworksCollection = db.collection("artworks"); // convenient access to collection

    if (reset)
      if (!artworksCollection.drop())
        throw new DatabaseError(
          "Unable to reset database - Collection unavailable."
        );
  } catch (err) {
    if (err instanceof DatabaseError)
      return (
        "Unexpected error occured while trying to connect to the database : " +
        err.message
      );
    console.log(err.message);
  }
}

/**
 * Closes database connection
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
 * Creates an artwork object and inserts into the DB. Validates parameters using validation functions
 * in validateUtils.
 * @param {string} name of the artwork. Needs to be unique!
 * @param {string} url of the image file
 * @param {string} date of the artwork i.e. "April 24, 2019"
 * @throws InvalidInputError if any validation tests fail
 * @returns true if successfully inserted
 */
async function addArtwork(name, url, date) {
  if (
    !validate.isValidName(name) ||
    !validate.isValidUrl(url) ||
    !validate.isValidDate2(date)
  ) {
    throw new InvalidInputError(
      "Name, URL or date of artwork to add is invalid."
    );
  }
  const artwork = { name: name, url: url, date: date };
  await artworksCollection.insertOne(artwork);
  return artwork;
}

/**
 * Fetches artwork of given name in the DB and returns it.
 * @param {string} name of artwork to find
 * @throws InvalidInputError if name parameter is empty or not a string
 * @returns artwork object
 */
async function getSingleArtwork(name) {
  if (!validate.isValidName(name))
    throw new InvalidInputError("Name of artwork to find is invalid.");

  const results = await artworksCollection.findOne({ name: name });
  if (results != null) return results;
  throw new InvalidInputError(
    "Artwork " + name + " wasn't found in the database."
  );
}

/**
 * Fetches all artworks in the DB collection and returns an array of them
 * @throws DatabaseError if operation was unsuccessful
 * @returns array containing artwork objects
 */
async function getAllArtworks() {
  const cursor = await artworksCollection.find();
  const collection = await cursor.toArray();

  if (collection != null) return collection;

  throw new DatabaseError(
    "Error encountered with the database when trying to get the entire Pokemons collection."
  );
}

/**
 * Updates a single artwork in the DB. Validates all parameter using validateUtils methods.
 * @param {string} oldName name of artwork to update
 * @param {string} newName
 * @param {string} newURL
 * @param {string} newDate
 * @throws InvalidInputError if any of the parameters are invalid or artwork with the name of oldName isn't found
 * @returns true if operation is successful
 */
async function updateArtwork(oldName, newName, newURL, newDate) {
  if (!validate.isValidName(oldName))
    throw new InvalidInputError(
      "Name of artwork to update is invalid. Please input a valid string."
    );

  const artworkToUpdate = await getSingleArtwork(oldName);
  if (artworkToUpdate == null)
    throw new InvalidInputError(
      "Artwork to update with the name " + oldName + " wasn't found."
    );

  if (
    validate.isValidName(newName) &&
    validate.isValidUrl(newURL) &&
    validate.isValidDate2(newDate)
  ) {
    await artworksCollection.updateOne(
      { name: oldName },
      { $set: { name: newName, url: newURL, date: newDate } }
    );
    return { name: newName, url: newURL, date: newDate };
  }
  throw new InvalidInputError(
    "Name, URL or date to update artwork " + oldName + " to is invalid."
  );
}

/**
 * Deletes an artwork from database. Validates string parameters, makes sure artwork is actually in the database
 * and then deletes.
 * @throws InvalidInputError if string isn't valid or name wasn't found in the database
 * @throws DatabaseError if delete operation isn't successful
 * @param {string} name of artwork to delete
 * @returns true if successful
 */
async function deleteArtwork(name) {
  if (!validate.isValidName(name))
    throw new InvalidInputError(
      "Name of artwork to delete isn't valid. Please input a valid string."
    );

  const artworkToDelete = await getSingleArtwork(name);
  if (artworkToDelete == null)
    throw new InvalidInputError(
      "Artwork " + name + " wasn't found in the database."
    );

  const result = await artworksCollection.deleteOne({ name: name });
  if (result.deletedCount == 1) return true;

  throw new DatabaseError(
    "Error when trying to delete artwork " +
      name +
      " from database. Operation unsuccessful"
  );
}

function getCollection() {
  return artworksCollection;
}

module.exports = {
  initialize,
  close,
  addArtwork,
  getSingleArtwork,
  getAllArtworks,
  updateArtwork,
  deleteArtwork,
  getCollection,
};
