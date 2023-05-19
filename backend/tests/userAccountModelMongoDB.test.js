const model = require("../models/userAccountModelMongoDB.js");
const dbName = "dbTest";
const { MongoMemoryServer } = require("mongodb-memory-server");
const { InvalidInputError } = require("../models/InvalidInputError.js");
require("dotenv").config();
jest.setTimeout(5000);
var mongod;

beforeAll(async () => {
  // This will create a new instance of "MongoMemoryServer" and automatically start it
  mongod = await MongoMemoryServer.create();
  console.log("Mock Database started");
});

afterAll(async () => {
  await mongod.stop(); // Stop the MongoMemoryServer
  console.log("Mock Database stopped");
});

beforeEach(async () => {
  try {
    const url = mongod.getUri();
    await model.initialize(dbName, true, url);
  } catch (err) {
    console.log(err.message);
  }
});

afterEach(async () => {
  await model.close();
});


