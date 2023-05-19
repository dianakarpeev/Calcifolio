const model = require("../models/userAccountModelMongoDB.js");
const dbName = "dbTest";
const { MongoMemoryServer } = require("mongodb-memory-server");
const { InvalidInputError } = require("../models/InvalidInputError.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

test("Can add user to DB", async() => {
    const testUser = { username: "test", password: "Password!1234"};
    await model.createUser(testUser.username, testUser.password);
    
    const cursor = (await model.getCollection()).find({username: testUser.username});
    const results = await cursor.toArray();
    
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].username.toLowerCase() == testUser.username.toLowerCase()).toBe(true);
    expect(await bcrypt.compare(testUser.password, results[0].password)).toBe(true);
});
