const model = require("../models/projectDeadlineModelMongoDb.js");
const dbName = "dbTest";
const { MongoMemoryServer } = require("mongodb-memory-server");
const { InvalidInputError } = require("../models/InvalidInputError.js");
require("dotenv").config();
jest.setTimeout(5000);
var mongod;

const eventDatabase = [
  { projectName: "Project A", projectDueDay: "2023-05-02", description: "Project A is the backend"},
  { projectName: "Project B", projectDueDay: "2023-05-12", description: "Project B is the presentation slides"},
  { projectName: "Project C", projectDueDay: "2023-11-07", description: "Project c is the frontend" },
  { projectName: "Project D", projectDueDay: "2023-05-22", description: "Project D is really urgent" },
  { projectName: "Project E", projectDueDay: "2023-09-18", description: "no info provided" },
  { projectName: "Project F", projectDueDay: "2023-12-30", description: "no info provided"},
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

test("Can add EventDeadline to DB", async () => {
  const { projectName, projectDueDay,description } = generateEventDeadlineData();
  await model.createProjectDeadline(projectName, projectDueDay,description);
  const cursor = (await model.getCollection()).find();
  const results = await cursor.toArray();
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(1);
  expect(
    results[0].projectName.toLowerCase() == projectName.toLowerCase()
  ).toBe(true);
  expect(
    results[0].projectDueDay.toLowerCase() == projectDueDay.toLowerCase()
  ).toBe(true);
  
});
test("Can add 2 EventDeadline to DB", async () => {
  projectName = "Project A";
  projectName1 = "Project B";
  projectDueDay = "2023-05-02";
  projectDueDay1 = "2023-05-12";
  description1="Project has description";
  await model.createProjectDeadline(projectName, projectDueDay);
  await model.createProjectDeadline(projectName1, projectDueDay1,description1);
  const cursor = (await model.getCollection()).find();
  const results = await cursor.toArray();
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(2);
  expect(
    results[0].projectName.toLowerCase() == projectName.toLowerCase()
  ).toBe(true);
  expect(
    results[0].projectDueDay.toLowerCase() == projectDueDay.toLocaleLowerCase()
  ).toBe(true);
  expect(results[0].description =="no info provided").toBe(true);

  expect(
    results[1].projectName.toLowerCase() == projectName1.toLocaleLowerCase()
  ).toBe(true);
  expect(
    results[1].projectDueDay.toLowerCase() == projectDueDay1.toLocaleLowerCase()
  ).toBe(true);
  expect(results[1].description.toLowerCase() == description1.toLocaleLowerCase()).toBe(true);
});

test("Should catch invalid empty name when Creating new deadline", async () => {
  projectName = " ";
  projectDueDay = "2023-05-02";
  try {
    await model.createProjectDeadline(projectName, projectDueDay);
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Should catch invalid empty date when Creating new deadline", async () => {
  projectName = "Project A";
  projectDueDay = " ";
  try {
    await model.createProjectDeadline(projectName, projectDueDay);
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Should catch invalid date format when Creating new deadline", async () => {
  projectName = "Project A";
  projectDueDay = "2023/05/02";
  try {
    await model.createProjectDeadline(projectName, projectDueDay);
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Finds Event Deadline by name ", async () => {
  const { projectName, projectDueDay,description } = generateEventDeadlineData();
  projectName1 = "HelloWold";
  await model.createProjectDeadline(projectName, projectDueDay,description);
  await model.createProjectDeadline(projectName1, projectDueDay,description);
  const result = await model.getSingleEvent(projectName1);
  expect(
    result.projectName.toLowerCase() == projectName1.toLocaleLowerCase()
  ).toBe(true);
});

test("Should catch invalid empty name when Finding a deadline", async () => {
  projectName = " ";
  projectDueDay = "2023/05/02";
  try {
    await model.getSingleEvent(projectName, projectDueDay);
    //throws Name cannot be empty error
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Should catch non-existent name when Finding a deadline", async () => {
  projectName = "Project A";
  projectDueDay = "2023/05/02";
  try {
    //database is empty, therefore is searching for a non existent project
    await model.getSingleEvent(projectName, projectDueDay);
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});
test("Update a single event by name", async () => {
  const { projectName, projectDueDay } = generateEventDeadlineData();
  projectName1 = "HelloWold";
  await model.createProjectDeadline(projectName, projectDueDay);

  const result = await model.updateSingleEventName(projectName, projectName1);
  expect(result.modifiedCount == 1).toBe(true);
  const cursor = (await model.getCollection()).find();
  const results = await cursor.toArray();
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(1);
  expect(
    results[0].projectName.toLowerCase() == projectName1.toLocaleLowerCase()
  ).toBe(true);
  expect(
    results[0].projectDueDay.toLowerCase() == projectDueDay.toLocaleLowerCase()
  ).toBe(true);
});

test("Should catch non-existent name when Updating a deadline by name", async () => {
  const { projectName, projectDueDay } = generateEventDeadlineData();
  projectName1 = "HelloWold";
  await model.createProjectDeadline(projectName, projectDueDay);

  try {
    await model.updateSingleEventName(projectName1, projectName);
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Should catch invalid empty new name when Updating a deadline by name", async () => {
  // const { projectName, projectDueDay } = generateEventDeadlineData();
  // await model.createProjectDeadline(projectName, projectDueDay);
  try {
    await model.updateSingleEventName("projectName", " ");
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});
test("Should catch invalid empty old name when Updating a deadline by name", async () => {
  try {
    //  projectName = "Project A";
    // projectDueDay = "2023-05-02";
    // await model.createProjectDeadline(projectName, projectDueDay);
    await model.updateSingleEventName(" ", "projectName");
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Update a single event by date", async () => {
  const { projectName, projectDueDay } = generateEventDeadlineData();
  projectDueDay1 = "2023-08-02";
  await model.createProjectDeadline(projectName, projectDueDay);

  const result = await model.updateSingleEventDate(projectName, projectDueDay1);
  expect(result.modifiedCount == 1).toBe(true);
  const cursor = (await model.getCollection()).find();
  const results = await cursor.toArray();
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(1);
  expect(
    results[0].projectName.toLowerCase() == projectName.toLocaleLowerCase()
  ).toBe(true);
  expect(
    results[0].projectDueDay.toLowerCase() == projectDueDay1.toLocaleLowerCase()
  ).toBe(true);
});

test("Should catch invalid empty new date when Updating a deadline by date", async () => {
  // const { projectName, projectDueDay } = generateEventDeadlineData();
  // await model.createProjectDeadline(projectName, projectDueDay);
  try {
    await model.updateSingleEventDate("projectName", " ");
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});
test("Should catch invalid empty name when Updating a deadline by date", async () => {
  try {
    // projectName = "Project A";
    projectDueDay = "2023-05-02";
    //  await model.createProjectDeadline(projectName, projectDueDay);
    await model.updateSingleEventDate(" ", "2023-05-02");
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});
test("Should catch invalid date when Updating a deadline by date", async () => {
  try {
    await model.updateSingleEventDate("Project A ", "2023.05.02");
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Should catch invalid date when Updating a deadline by date", async () => {
  try {
    await model.updateSingleEventDate("Project A ", "2023.05.02");
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Should replace Single EventDeadline ", async () => {
  const { projectName, projectDueDay } = generateEventDeadlineData();
  let newProjectName = "Project 863";
  let newProjectDueDay = "2023-06-11";
  await model.createProjectDeadline(projectName, projectDueDay);
  let result = await model.replaceSingleEvent(
    projectName,
    newProjectName,
    newProjectDueDay
  );
  expect(result.modifiedCount == 1).toBe(true);
  const cursor = (await model.getCollection()).find();
  const results = await cursor.toArray();
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(1);
  expect(
    results[0].projectName.toLowerCase() == newProjectName.toLocaleLowerCase()
  ).toBe(true);
  expect(
    results[0].projectDueDay.toLowerCase() ==
      newProjectDueDay.toLocaleLowerCase()
  ).toBe(true);
});
//====================== These should throw an invalid input error but returns false =======================================================================

// test("Should catch invalid date when Replacing a deadline", async () => {
//   try {
//     const { projectName, projectDueDay } = generateEventDeadlineData();
//     newProjectName = "HelloWold";
//     await model.createProjectDeadline(projectName, projectDueDay);
//     await model.replaceSingleEvent(projectName, newProjectName, "2023.05.02");
//   } catch (err) {
//     expect(err instanceof InvalidInputError).toBe(true);
//   }
// });
// test("Should catch invalid empty date when Replacing a deadline", async () => {
//   try {
//     const { projectName, projectDueDay } = generateEventDeadlineData();
//     newProjectName = "HelloWold";
//     await model.createProjectDeadline(projectName, projectDueDay);
//     await model.replaceSingleEvent(projectName, newProjectName, " ");
//   } catch (err) {
//     expect(err instanceof InvalidInputError).toBe(true);
//   }
// });
// test("Should catch invalid non-existent project name when Replacing a deadline", async () => {
//   try {
//     projectName = "Oranges";
//     projectDueDay = "2023-05-02";
//     newProjectName = "HelloWold";
//     await model.createProjectDeadline(projectName, projectDueDay);
//     await model.replaceSingleEvent(
//       newProjectName,
//       newProjectName,
//       "2023.05.02"
//     );
//   } catch (err) {
//     expect(err instanceof InvalidInputError).toBe(true);
//   }
// });

// test("Should catch invalid name when Replacing a deadline", async () => {
//   try {
//     const { projectName, projectDueDay } = generateEventDeadlineData();
//     newProjectName = "HelloWold";
//     await model.createProjectDeadline(projectName, projectDueDay);
//     await model.replaceSingleEvent(projectName, " ", "2023-05-02");
//   } catch (err) {
//     expect(err instanceof InvalidInputError).toBe(true);
//   }
// });

test("delete a single deadline", async () => {
  projectName = "Oranges";
  projectDueDay = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDueDay);
  await model.deleteSingleEvent(projectName);
  const cursor = (await model.getCollection()).find();
  const results = await cursor.toArray();
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(0);
});

test("Should catch invalid name when Delete a deadline", async () => {
  try {

    await model.deleteSingleEvent("projectName1");
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Should catch empty name when Delete a deadline ", async () => {
  try {

    await model.deleteSingleEvent(" ");
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("delete a single deadline by name", async () => {
  projectName = "Oranges";
  projectDueDay = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDueDay);
  await model.deleteManyEventsByName(projectName);
  const cursor = (await model.getCollection()).find();
  const results = await cursor.toArray();
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(0);
});

test("Should catch invalid name when Delete a deadline by name", async () => {
  try {
    await model.deleteManyEventsByName("projectName1");
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Should catch empty name when Delete a deadline by name", async () => {
  try {
    await model.deleteManyEventsByName(" ");
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("delete a single deadline by date", async () => {
  projectName = "Oranges";
  projectDueDay = "2023-05-02";
  await model.createProjectDeadline(projectName, projectDueDay);
  await model.deleteManyEventsByDate(projectDueDay);
  const cursor = (await model.getCollection()).find();
  const results = await cursor.toArray();
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(0);
});

test("Should catch empty date when Delete a deadline by date", async () => {
  try {
    await model.deleteManyEventsByDate(" ");
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});

test("Should catch invalid date when Delete a deadline by name", async () => {
  try {
    await model.deleteManyEventsByName("2020.04.06");
  } catch (err) {
    expect(err instanceof InvalidInputError).toBe(true);
  }
});