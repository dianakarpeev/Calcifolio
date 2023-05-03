const { InvalidInputError } = require("../models/InvalidInputError");
const model = require("../models/artworkModelMongoDB");
const utils = require("../models/validateUtils");
const server = require("../node_modules/mongodb-memory-server");
const dotenv = require("dotenv").config();

let mongodb;
jest.setTimeout(5000);

/**
 * Creates a new instance of MongoMemoryServer and automatically starts it.
 * Runs before all tests.
 */
beforeAll(async () => {
  mongodb = await server.MongoMemoryServer.create();
  console.log("Mock Database started");
});

/**
 * Gets URL from Memory Server and initializes a test database.
 * Runs before each test.
 */
beforeEach(async () => {
  try {
    const url = mongodb.getUri();
    await model.initialize("artwork_db_test", true, url);
  } catch (err) {
    console.log(err.message);
  }
});

/**
 * Closes test database
 */
afterEach(async () => {
  await model.close();
});

/**
 * Closes mock database
 */
afterAll(async () => {
  await mongodb.stop(); //stops the MongoMemoryServer
  console.log("Mock Database stopped");
});

/**
 * Adds two artworks using addArtwork. Verifies if content of collection has
 * 1) Right amount of artworks
 * 2) Correct information
 */
test("Can add artworks to DB", async () => {
  //artwork objects to create
  const papillon = {
    name: "Papillon Punch",
    url: "https://www.monsterenergy.com/media/uploads_image/2021/08/12/auto/800/12f658780b93bc4807a090858c6db3f1.png?mod=v1_e803c4bafcac766b9c5d5378f5805924",
    date: "28 March, 2016",
  };

  const khaotic = {
    name: "Khaotic Punch",
    url: "https://www.monsterenergy.com/media/uploads_image/2021/08/12/auto/800/753b9eb635f29a196e41f8686942b55e.png?mod=v1_d52f5e3b3c592a75501541c1e4298393",
    date: "26 April, 2012",
  };

  //attempts to create
  await model.addArtwork(papillon.name, papillon.url, papillon.date);
  await model.addArtwork(khaotic.name, khaotic.url, khaotic.date);

  //recuperates collection after adding artworks
  const cursor = await model.getCollection().find();
  const results = await cursor.toArray();

  //expects two artworks in collection
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(2);

  //checks if information is correct
  expect(results[0].name.toLowerCase() == papillon.name.toLowerCase()).toBe(
    true
  );
  expect(results[0].url.toLowerCase() == papillon.url.toLowerCase()).toBe(true);
  expect(results[0].date.toLowerCase() == papillon.date.toLowerCase()).toBe(
    true
  );

  expect(results[1].name.toLowerCase() == khaotic.name.toLowerCase()).toBe(
    true
  );
  expect(results[1].url.toLowerCase() == khaotic.url.toLowerCase()).toBe(true);
  expect(results[1].date.toLowerCase() == khaotic.date.toLowerCase()).toBe(
    true
  );
});

test("Cannot add artwork with invalid name to DB", async () => {
  const assault = {
    name: 123,
    url: "https://www.monsterenergy.com/media/uploads_image/2017/03/30/auto/800/f84840d3ca0860e9b6ba466645de9b2f.png?mod=v1_654cd951f2a4d67c8525ab58f4fd507c",
    date: "November 14, 2003",
  };

  await expect(
    async () => await model.addArtwork(assault.name, assault.url, assault.date)
  ).rejects.toThrow(InvalidInputError);
});

test("Cannot add artwork with invalid url to DB", async () => {
  const assault = {
    name: "Assault",
    url: "www.monsterenergy.com/media/uploads_image800/f84840d3ca0860e9b6ba466645de9b2f.png?mod=v1_654cd951f2a4d67c8525ab58f4fd507c",
    date: "November 14, 2003",
  };

  await expect(
    async () => await model.addArtwork(assault.name, assault.url, assault.date)
  ).rejects.toThrow(InvalidInputError);
});

test("Cannot add artwork with invalid date to DB", async () => {
  const assault = {
    name: "Assault",
    url: "https://www.monsterenergy.com/media/uploads_image/2017/03/30/auto/800/f84840d3ca0860e9b6ba466645de9b2f.png?mod=v1_654cd951f2a4d67c8525ab58f4fd507c",
    date: false,
  };

  await expect(
    async () => await model.addArtwork(assault.name, assault.url, assault.date)
  ).rejects.toThrow(InvalidInputError);
});

/**
 * Add artwork to collection and finds it using getSingleArtwork.
 * Checks if artwork object returned has the correct information.
 */
test("Can find artwork in DB", async () => {
  const white = {
    name: "Ultra White",
    url: "https://www.monsterenergy.com/media/uploads_image/2021/08/12/auto/800/dcc0a65302f90da9922cea5fab184c6d.png?mod=v1_0cb1a3600fed62fe8d324dc350777fdb",
    date: "July 17, 2009",
  };

  //adds artwork to collection and attempts to find it
  await model.addArtwork(white.name, white.url, white.date);
  const result = await model.getSingleArtwork(white.name);

  //checks if returned artwork object has correct information
  expect(result != null).toBe(true);
  expect(result.name.toLowerCase == white.name.toLowerCase).toBe(true);
  expect(result.url.toLowerCase == white.url.toLowerCase).toBe(true);
  expect(result.date.toLowerCase == white.date.toLowerCase).toBe(true);
});

/**
 * Attempts to find an artwork in an empty collection.
 * Expects an InvalidInputError.
 */
test("Cannot find artwork that doesn't exist in DB", async () => {
  await expect(
    async () => await model.getSingleArtwork("Sunrise")
  ).rejects.toThrow(InvalidInputError);
});

/**
 * Adds two artworks to collection, updates one with new info using updateArtwork().
 * Checks if collection afterwards:
 * 1) Contains right amount of artworks
 * 2) Contains the right information about the artworks
 */
test("Can update an artwork in the DB", async () => {
  const sunrise = {
    name: "Ultra Sunrise",
    url: "https://www.monsterenergy.com/media/uploads_image/2021/01/07/auto/800/7f29897a8542bfa8ef6fa2a272b3431d.png?mod=v1_78814b4c4b580f6ef1983cb7cc949997",
    date: "December 20, 2001",
  };

  const gold = {
    name: "Ultra Gold",
    url: "https://www.monsterenergy.com/media/uploads_image/2022/01/11/auto/800/1f503b5d20cc8fa06bb2a238d7f53ba9.png?mod=v1_cd4dbdbaed80ad9caeb290ba3bf3eb3b",
    date: "May 23, 2010",
  };

  const blue = {
    name: "Ultra Blue",
    url: "https://www.monsterenergy.com/media/uploads_image/2021/08/12/auto/800/2c2b6e166f1e7a13164a868908e98dbc.png?mod=v1_9919316baad6ad938da951700b623c73",
    date: "July 18, 2009",
  };

  //adds two artworks to collection, attempts to update one of them
  await model.addArtwork(sunrise.name, sunrise.url, sunrise.date);
  await model.addArtwork(gold.name, gold.url, gold.date);
  await model.updateArtwork(sunrise.name, blue.name, blue.url, blue.date);

  //recuperates collection after operations
  const cursor = await model.getCollection().find();
  const results = await cursor.toArray();

  //checks if collection has right amount of artworks
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(2);

  //checks if collection objects has the right information
  expect(results[0].name.toLowerCase() == blue.name.toLowerCase()).toBe(true);
  expect(results[0].url.toLowerCase() == blue.url.toLowerCase()).toBe(true);
  expect(results[0].date.toLowerCase() == blue.date.toLowerCase()).toBe(true);

  expect(results[1].name.toLowerCase() == gold.name.toLowerCase()).toBe(true);
  expect(results[1].url.toLowerCase() == gold.url.toLowerCase()).toBe(true);
  expect(results[1].date.toLowerCase() == gold.date.toLowerCase()).toBe(true);
});

/**
 * Attempts to update an artwork in an empty collection.
 * Expects an InvalidInputError.
 */
test("Cannot update artwork that doesn't exist in the DB", async () => {
  await expect(
    async () =>
      await model.updateArtwork(
        "Ultra Fiesta",
        "Mango Loco Punch",
        "https://www.monsterenergy.com/media/uploads_image/2018/11/09/auto/800/b3675eaa8cfb6bedaf9d843fe91aa496.png?mod=v1_e19609103b56602ddd2ab745d54c15fe",
        "September 28, 2004"
      )
  ).rejects.toThrow(InvalidInputError);
});

/**
 * Attempts to update an artwork while passing an integer instead of a string.
 * Expects an InvalidInputError.
 */
test("Cannot update artwork with invalid parameter", async () => {
  const mangoloco = {
    name: "Mango Loco Punch",
    url: "https://www.monsterenergy.com/media/uploads_image/2018/11/09/auto/800/b3675eaa8cfb6bedaf9d843fe91aa496.png?mod=v1_e19609103b56602ddd2ab745d54c15fe",
    date: "September 28, 2004"
  }

  await model.addArtwork(mangoloco.name, mangoloco.url, mangoloco.date);
  await expect(
    async () =>
      await model.updateArtwork(
        "Mango Loco Punch",
        244533,
        "https://www.monsterenergy.com/media/uploads_image/2018/11/09/auto/800/b3675eaa8cfb6bedaf9d843fe91aa496.png?mod=v1_e19609103b56602ddd2ab745d54c15fe",
        "September 28, 2004"
      )
  ).rejects.toThrow(InvalidInputError);
})

/**
 * Adds two artwork objects to collection, deletes one of them using deleteArtwork.
 * Checks if collection afterwards:
 * 1) Contains right amount of artworks
 * 2) Contains the right information
 */
test("Can delete artwork in the DB", async () => {
  const pacific = {
    name: "Pacific Punch",
    url: "https://www.monsterenergy.com/media/uploads_image/2021/01/07/auto/800/407601590885f82a955127e5e025feef.png?mod=v1_6d89e56ec7c59a00723553bbd21d0635",
    date: "March 25, 2009"
  };

  const violet = {
    name: "Ultra Violet",
    url: "https://www.monsterenergy.com/media/uploads_image/2021/08/12/auto/800/7e0bcb770b9f793ef3b839664d61756b.png?mod=v1_19caef6c001593f0884fe71111933b4c",
    date: "October 7, 2011"
  };

  //adds two artworks to collection, attempts to deletes one of them
  await model.addArtwork(pacific.name, pacific.url, pacific.date);
  await model.addArtwork(violet.name, violet.url, violet.date);
  await model.deleteArtwork(violet.name);

  //recuperates collection after operations
  const cursor = await model.getCollection().find();
  const results = await cursor.toArray();

  //checks if collection has right amount of items
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(1);

  //checks if items in collection contain the right information
  expect(results[0].name.toLowerCase() == pacific.name.toLowerCase()).toBe(
    true
  );
  expect(results[0].url.toLowerCase() == pacific.url.toLowerCase()).toBe(true);
  expect(results[0].date.toLowerCase() == pacific.date.toLowerCase()).toBe(
    true
  );
});

/**
 * Attempts to delete an artwork while passing an integer instead of a string.
 * Expects an InvalidInputError.
 */
test("Cannot delete artwork that doesn't exist in the DB", async () => {
  await expect(
    async () =>
      await model.deleteArtwork("Violet Ultra")
  ).rejects.toThrow(InvalidInputError);
});