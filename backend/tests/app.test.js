const model = require("../models/projectDeadlineModelMongoDb.js");
const dbName = "dbTest";
const { MongoMemoryServer } = require("mongodb-memory-server");
const { InvalidInputError } = require("../models/InvalidInputError");
require("dotenv").config();
jest.setTimeout(5000);
var mongod;
const app = require("../app");
const supertest = require("supertest");
const { query } = require("express");
const testRequest = supertest(app);

const eventDatabase = [
  { projectName: "Project A", projectDueDay: "2023-05-02" },
  { projectName: "Project B", projectDueDay: "2023-05-12" },
  { projectName: "Project C", projectDueDay: "2023-11-07" },
  { projectName: "Project D", projectDueDay: "2023-05-22" },
  { projectName: "Project E", projectDueDay: "2023-09-18" },
  { projectName: "Project F", projectDueDay: "2023-12-30" },
];

const generateEventDeadlineData = () =>
  eventDatabase.splice(Math.floor(Math.random() * eventDatabase.length), 1)[0];

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

//============================== GET homepage Test ==============================

//get home page
test("GET / success case", async () => {
  const { projectName, projectDueDay } = generateEventDeadlineData();
  await model.createProjectDeadline(projectName, projectDueDay);
  const testResponse = await testRequest.get("/");
  expect(testResponse.status).toBe(200);
});

test("GET /?params success case", async () => {
  const { projectName, projectDueDay } = generateEventDeadlineData();
  await model.createProjectDeadline(projectName, projectDueDay);
  const testResponse = await testRequest.get(
    "/?firstName=Anjeli&lastName=Taruc"
  );
  expect(testResponse.status).toBe(200);
});

//------------------------------Error handling -------------------------------
// Gets invalid endpoint TEST
test("GET /cookies Invalid endpoint", async () => {
  const { projectName, projectDueDay } = generateEventDeadlineData();
  await model.createProjectDeadline(projectName, projectDueDay);
  //invalid endpoint
  const testResponse = await testRequest.get("/cookies");
  expect(testResponse.status).toBe(404);
});

//============================== GET Create Deadline Test ==============================
test("POST /deadlines success case", async () => {
  const testResponse = await testRequest.post("/deadlines").send({
    projectName: "Project 6",
    projectDueDay: "2023-12-02",
  });
  expect(testResponse.status).toBe(200);
});

//------------------------------Error handling -------------------------------
// createProjectDeadline FAIL TEST
test("POST /deadlines fail empty name case", async () => {
  const testResponse = await testRequest.post("/deadlines").send({
    projectName: " ",
    projectDueDay: "2023-12-02",
  });
  expect(testResponse.status).toBe(400);
});
test("POST /deadlines fail empty date case", async () => {
  const testResponse = await testRequest.post("/deadlines").send({
    projectName: "Project 6",
    projectDueDay: " ",
  });
  expect(testResponse.status).toBe(400);
});
test("POST /deadlines fail invalid date format case", async () => {
  const testResponse = await testRequest.post("/deadlines").send({
    projectName: "Project 6",
    projectDueDay: "2023.12.02",
  });
  expect(testResponse.status).toBe(400);
});


//============================== GET Read Deadline ==============================
//Get by Name:
test("GET /deadlines/:projectName success case for single event", async () => {
  const { projectName, projectDueDay } = generateEventDeadlineData();
  await model.createProjectDeadline(projectName, projectDueDay);
  const testResponse = await testRequest.get("/deadlines/" + projectName);
  expect(testResponse.status).toBe(200);
});
//Get all:
test("GET /deadlines success case for ALL", async () => {
  const { projectName, projectDueDay } = generateEventDeadlineData();
  await model.createProjectDeadline(projectName, projectDueDay);

  const testResponse = await testRequest.get("/deadlines");
  expect(testResponse.status).toBe(200);
});
//if name is empty it gets all ^^^^^
test("GET /deadlines/:projectName fail case for single event", async () => {
  let projectName = "Project A";
  let projectDate = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDate);
  let projectDeadline = " ";
  const testResponse = await testRequest.get("/deadlines/" + projectDeadline);
  expect(testResponse.status).toBe(200);
});

//------------------------------Error handling -------------------------------
test("GET /deadlines/:projectName fail case for single event", async () => {
  const { projectName, projectDueDay } = generateEventDeadlineData();
  await model.createProjectDeadline(projectName, projectDueDay);
  let projectDeadline = "projectTest"
  const testResponse = await testRequest.get("/deadlines/" + projectDeadline);
  expect(testResponse.status).toBe(400);
});

//============================== PUT Update Deadline ==============================
test("PUT /deadlines/:old/:new/:optional? success case update event by name", async () => {
  let projectName = "Project A";
  let projectDueDay = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDueDay);
  let newName = "project c";

  const testResponse = await testRequest.put(
    "/deadlines/" + projectName + "/" + newName
  );
  expect(testResponse.status).toBe(200);
  let nameVerification = await model.getSingleEvent(newName);
  expect(nameVerification.projectName).toEqual(newName.toLocaleLowerCase());
  expect(nameVerification.projectDueDay).toEqual(projectDueDay);
});

test("PUT /deadlines/:old/:new/:optional? success case update event by date", async () => {
  let projectName = "Project A";
  let projectDueDay = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDueDay);
  let newDueDay = "2027-04-27";

  const testResponse = await testRequest.put(
    "/deadlines/" + projectName + "/" + newDueDay + "/by-date"
  );
  expect(testResponse.status).toBe(200);
  let nameVerification = await model.getSingleEvent(projectName);
  expect(nameVerification.projectName).toEqual(projectName.toLocaleLowerCase());
  expect(nameVerification.projectDueDay).toEqual(newDueDay);
});

test("PUT /deadlines/:old/:new/:optional? success case replaces event", async () => {
  let projectName = "Project A";
  let projectDate = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDate);
  let newDueDay = "2027-04-27";
  let newName = "project c";

  const testResponse = await testRequest.put(
    "/deadlines/" + projectName + "/" + newName+"/" + newDueDay
  );
  expect(testResponse.status).toBe(200);
  let nameVerification = await model.getSingleEvent(newName);
  expect(nameVerification.projectName).toEqual(newName.toLocaleLowerCase());
  expect(nameVerification.projectDueDay).toEqual(newDueDay);
});
//------------------------------Error handling -------------------------------

test("PUT /deadlines/:old/:new/:optional? fail case update event by empty name", async () => {
  let projectName = "Project A";
  let projectDate = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDate);
  let newName = " ";

  const testResponse = await testRequest.put(
    "/deadlines/" + projectName + "/" + newName
  );
  expect(testResponse.status).toBe(404);//bad endpoint
});

test("PUT /deadlines/:old/:new/:optional? fail case update event by invalid date format", async () => {
  let projectName = "Project A";
  let projectDate = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDate);
  let newDate = "2024.11.08";

  const testResponse = await testRequest.put(
    "/deadlines/" + projectName + "/" + newDate+"/by-date"
  );
  expect(testResponse.status).toBe(400);
});

test("PUT /deadlines/:old/:new/:optional? fail case update event by empty date", async () => {
  let projectName = "Project A";
  let projectDate = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDate);
  let newDate = " ";

  const testResponse = await testRequest.put(
    "/deadlines/" + projectName + "/" + newDate
  );
  expect(testResponse.status).toBe(404); //bad endpoint
});

test("PUT /deadlines/:old/:new/:optional? fail case replaces event: invalid date", async () => {
  let projectName = "Project A";
  let projectDate = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDate);
  let newDueDay = "2027.04.27";
  let newName = "project c";

  const testResponse = await testRequest.put(
    "/deadlines/" + projectName + "/" + newName+"/" + newDueDay
  );
  expect(testResponse.status).toBe(400);

});

test("PUT /deadlines/:old/:new/:optional? fail case replaces event: empty name", async () => {
  let projectName = "Project A";
  let projectDate = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDate);
  let newDueDay = "2027-04-30";
  let newName = " ";

  const testResponse = await testRequest.put(
    "/deadlines/" + projectName + "/" + newName+"/" + newDueDay
  );
  expect(testResponse.status).toBe(400);

});
//============================== DELETE Delete Deadline ==============================
//Delete a single even by deadline name:

//Delete many by name
test("DELETE /deadlines/:projectName success case for single event", async () => {
  let projectName1 = "Project A";
  let projectDate1 = "2023-05-02";
  let projectName2 = "Project A";
  let projectDate2 = "2023-05-22";
  let projectName3 = "Project A";
  let projectDate3 = "2023-05-12";
  await model.createProjectDeadline(projectName1, projectDate1);
  await model.createProjectDeadline(projectName2, projectDate2);
  await model.createProjectDeadline(projectName3, projectDate3);
 
  const testResponse = await testRequest.delete("/deadlines/delete-many/" + projectName3);
  expect(testResponse.status).toBe(200);
});

//Delete many by date
test("DELETE /deadlines/:projectName success case for single event", async () => {
  let projectName1 = "Project A";
  let projectDate1 = "2023-05-02";
  let projectName2 = "Project B";
  let projectDate2 = "2023-05-02";
  let projectName3 = "Project C";
  let projectDate3 = "2023-05-02";
  await model.createProjectDeadline(projectName1, projectDate1);
  await model.createProjectDeadline(projectName2, projectDate2);
  await model.createProjectDeadline(projectName3, projectDate3);
 
  const testResponse = await testRequest.delete("/deadlines/delete-many/" + projectDate1);
  expect(testResponse.status).toBe(200);
});

test("DELETE /deadlines/:projectName success case for single event", async () => {
  let projectName = "Project A";
  let projectDate = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDate);
  const testResponse = await testRequest.delete("/deadlines/" + projectName);
  expect(testResponse.status).toBe(200);
});

//------------------------------Error handling -------------------------------

//Delete many by name
test("DELETE /deadlines/:projectName success case for single event", async () => {
  let projectName1 = "Project A";
  let projectDate1 = "2023-05-02";
  let projectName2 = "Project A";
  let projectDate2 = "2023-05-22";
  let projectName3 = "Project A";
  let projectDate3 = "2023-05-12";
  await model.createProjectDeadline(projectName1, projectDate1);
  await model.createProjectDeadline(projectName2, projectDate2);
  await model.createProjectDeadline(projectName3, projectDate3);
 
  const testResponse = await testRequest.delete("/deadlines/delete-many/non-existentName" );
  expect(testResponse.status).toBe(400);
});

//Delete many by date
test("DELETE /deadlines/:projectName success case for many events by date", async () => {
  let projectName1 = "Project A";
  let projectDate1 = "2023-05-02";
  let projectName2 = "Project B";
  let projectDate2 = "2023-05-02";
  let projectName3 = "Project C";
  let projectDate3 = "2023-05-02";
  await model.createProjectDeadline(projectName1, projectDate1);
  await model.createProjectDeadline(projectName2, projectDate2);
  await model.createProjectDeadline(projectName3, projectDate3);
 
  const testResponse = await testRequest.delete("/deadlines/delete-many/2023-05-06");
  expect(testResponse.status).toBe(400);
});

test("DELETE /deadlines/:projectName fail case for single event name does'nt exist", async () => {
  let projectName = "Project A";
  let projectDate = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDate);
  let projectFakeName="projectFake"
  const testResponse = await testRequest.delete("/deadlines/" + projectFakeName);
  expect(testResponse.status).toBe(400);
});

//============================== Database Connectivity ==============================

test("Database Connectivity fail", async () => {
  await model.close();
  const testResponse = await testRequest.get("/deadlines/");
  expect(testResponse.status).toBe(500);
});
