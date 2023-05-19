const model = require("../models/userAccountModelMongoDB.js");
const dbName = "dbTest";
const { MongoMemoryServer } = require("mongodb-memory-server");
const { InvalidInputError } = require("../models/InvalidInputError.js");
<<<<<<< Updated upstream
const bcrypt = require('bcrypt');
=======
const bcrypt = require("bcrypt");
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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

test("Cannot add user with invalid username to DB", async() => {
    const invalidUser = {username: "!@@U$B@!J12345", password: "Password!1234"};
    try {
        await model.createUser(invalidUser.username, invalidUser.password);
    } catch (err) {
        expect(err instanceof InvalidInputError).toBe(true);
    }
});

test("Cannot add user with invalid password to DB", async () => {
    const invalidUser = {username: "testUser", password: "easy"};

    try {
        await model.createUser(invalidUser.username, invalidUser.password);
    } catch (err) {
        expect (err instanceof InvalidInputError).toBe(true);
    }
});

test("Cannot add user with empty username", async () => {
    const invalidUser = {username: "", password: "Test!1234"};

    try {
        await model.createUser(invalidUser.username, invalidUser.password)
    } catch (err) {
        expect (err instanceof InvalidInputError).toBe(true);
    }
});

test("Cannot add user with empty password", async () => {
    const invalidUser = {username: "testUser", password: ""};

    try {
        await model.createUser(invalidUser.username, invalidUser.password)
    } catch (err) {
        expect (err instanceof InvalidInputError).toBe(true);
    }
});

test("Can get a single user from DB", async () => {
    const testUser = { username: "test2", password: "Password!1234"};
    await model.createUser(testUser.username, testUser.password);
    const result = await model.getSingleUser(testUser.username);

    expect(result != null).toBe(true);
    expect(result.username.toLowerCase() == testUser.username.toLowerCase()).toBe(true);
    expect(await bcrypt.compare(testUser.password, result.password)).toBe(true);
=======
test("Can add user to DB", async () => {
  const testUser = { username: "test", password: "Password!1234" };
  await model.createUser(testUser.username, testUser.password);

  const cursor = (await model.getCollection()).find({
    username: testUser.username,
  });
  const results = await cursor.toArray();

  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(1);
  expect(
    results[0].username.toLowerCase() == testUser.username.toLowerCase()
  ).toBe(true);
  expect(await bcrypt.compare(testUser.password, results[0].password)).toBe(
    true
  );
});

test("Can add two users to DB", async () => {
    const testUser = { username: "test123", password: "Password!123456" };
    const testUserTwo = {username: "1235test", password: "PASSSSSword!329875"};

    await model.createUser(testUser.username, testUser.password);
    await model.createUser(testUserTwo.username, testUserTwo.password);

    const cursor = (await model.getCollection()).find({
      username: testUser.username,
    });
    const results = await cursor.toArray();
  
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(
      results[0].username.toLowerCase() == testUser.username.toLowerCase()
    ).toBe(true);
    expect(await bcrypt.compare(testUser.password, results[0].password)).toBe(
      true
    );
  });

test("Cannot add user with invalid username to DB", async () => {
  const invalidUser = { username: "!@@U$B@!J12345", password: "Password!1234" };
  try {
    await model.createUser(invalidUser.username, invalidUser.password);
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Cannot add user with invalid password to DB", async () => {
  const invalidUser = { username: "testUser", password: "easy" };

  try {
    await model.createUser(invalidUser.username, invalidUser.password);
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Cannot add user with empty username", async () => {
  const invalidUser = { username: "", password: "Test!1234" };

  try {
    await model.createUser(invalidUser.username, invalidUser.password);
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Cannot add user with empty password", async () => {
  const invalidUser = { username: "testUser", password: "" };

  try {
    await model.createUser(invalidUser.username, invalidUser.password);
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Can get a single user from DB", async () => {
  const testUser = { username: "test2", password: "Password!1234" };
  await model.createUser(testUser.username, testUser.password);
  const result = await model.getSingleUser(testUser.username);

  expect(result != null).toBe(true);
  expect(result.username.toLowerCase() == testUser.username.toLowerCase()).toBe(
    true
  );
  expect(await bcrypt.compare(testUser.password, result.password)).toBe(true);
>>>>>>> Stashed changes
});