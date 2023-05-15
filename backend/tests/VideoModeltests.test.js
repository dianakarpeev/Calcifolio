const { MongoMemoryServer } = require("mongodb-memory-server");
const { InvalidTitleError } = require("../models/InvalidTitleError");
const { InvalidLengthError } = require("../models/InvalidLengthError");
const { DatabaseError } = require("../models/DatabaseError");
const model = require("../models/videoModel");
const app = require("../app");
const supertest = require("supertest");
const res = require("express/lib/response");
const testRequest = supertest(app);
require("dotenv").config();
jest.setTimeout(5000);

const videoData = [
  { title: "My first video!", length: "00:01:20" },
  { title: "I love pancakes!", length: "10:42:19" },
  { title: "Why do we exist?", length: "00:00:02" },
  { title: "Top 10 Reasons why JavaScript is confusing", length: "00:31:01" },
  { title: "Hello World!", length: "00:10:01" },
  { title: "5 reasons to try!", length: "00:07:36" },
  { title: "Coding", length: "00:07:36" },
  { title: "Nah", length: "00:07:36" },
  { title: "Paradoxes are weird.", length: "20:01:53" },
  { title: "Philosophy in a nutshell", length: "00:02:00" },
  { title: "Good food!", length: "00:17:36" },
  { title: "Bad Food!", length: "15:00:00"},
  { title: "AMAZING Food!", length: "15:00:00"},

];
const generateVideoData = () =>
  videoData.splice(Math.floor(Math.random() * videoData.length), 1)[0];
let mongod;

beforeAll(async () => {
  //This will create a new instance of "MemoryMongoServer" and automatically start it
  mongod = await MongoMemoryServer.create();
  console.log("Mock Database created");
});
afterAll(async () => {
  await mongod.stop(); // stopped
  console.log("Mock Database stopped");
});

beforeEach(async () => {
  const url = await mongod.getUri();
  try {
    await model.initialize(url, "test", true);
  } catch (err) {
    console.log(err.message);
  }
});
afterEach(async () => {
  await model.close();
});
test("Homepage works", async () => {
  const testResponse = await testRequest.get("/");
  expect(testResponse.status).toBe(200);
});
test("Invalid page changes status code", async () => {
  let testResponse = await testRequest.get("/ERRORGENERATOR");
  expect(testResponse.status).toBe(404);
});


//ADD VIDEO TESTS
test("Add Video success", async () => {
  const { title, length } = generateVideoData();
  let testResponse = await testRequest
    .post("/addVideo")
    .send({title: title, length: length});
  expect(testResponse.status).toBe(200);
  const cursor = await model.getCollection().find();
  const results = await cursor.toArray();
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(1);
  expect(results[0].title.toLowerCase() == title.toLowerCase()).toBe(true);
  expect(results[0].length == length).toBe(true);
});

test("Add Video failure due to invalid length", async () => {
  const { title, length } = generateVideoData();
  let testResponse = await testRequest
    .post("/addVideo")
    .send({ title: title, length: -1 });
  expect(testResponse.status).toBe(400);
  console.log(testResponse);
});

test("Add Video failure due to invalid string", async () => {
  const { title, length } = generateVideoData();
  let testResponse = await testRequest.post("/addVideo").send({ length: length });
  expect(testResponse.status).toBe(400);
});

test("Add Video failure due to closing database", async () => {
    const { title, length } = generateVideoData();
    await model.close();
    let testResponse = await testRequest.post("/addVideo").send({ title:title, length:length});
    expect(testResponse.status).toBe(500);
  });

//DELETE VIDEO TESTS


  test("Delete Video success", async () => {
    const { title, length } = generateVideoData();
    //first add the video
    await testRequest
    .post("/addVideo")
    .send({title: title, length: length});

    let testResponse = await testRequest
    .delete("/deleteVideo/" + title)
    expect(testResponse.status).toBe(200);
    const cursor = await model.getCollection().find();
    const results = await cursor.toArray();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
    
  });

  test("Delete Video failure caused by video not found", async () => {
    const { title, length } = generateVideoData();
    //first add the video
    await testRequest
    .post("/addVideo")
    .send({title: title, length: length});

    let testResponse = await testRequest
    .delete("/deleteVideo/" + "aaaaa");
    expect(testResponse.status).toBe(500);

  });


  //FIND VIDEO TESTS
  test("Find Video success", async () => {
    let { title, length } = generateVideoData();
    //first add the video
    await testRequest
    .post("/addVideo")
    .send({title: title, length: length});

    let testResponse = await testRequest
    .get("/videos/" + title)
    expect(testResponse.status).toBe(200);
    const cursor = await model.getCollection().find();
    const results = await cursor.toArray();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].title.toLowerCase() == title.toLowerCase()).toBe(true);
    expect(results[0].length == length).toBe(true);
    
  });
  test("Find Video failure due to video not found", async () => {
    const { title, length } = generateVideoData();
    //first add the video
    await testRequest
    .post("/addVideo")
    .send({title: title, length: length});

    let testResponse = await testRequest
    .get("/videos/" + "aaaaaaa");
    expect(testResponse.status).toBe(500);

  });

  test("List all videos success", async () => {
    const { title, length } = generateVideoData();
    //first add the videos
    await testRequest
    .post("/addVideo")
    .send({title: title, length: length});

    let testResponse = await testRequest
    .get("/videos");
    expect(testResponse.status).toBe(200);
    const cursor = await model.getCollection().find();
    const results = await cursor.toArray();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].title.toLowerCase() == title.toLowerCase()).toBe(true);
    expect(results[0].length == length).toBe(true);
  });

  test("List all videos failure due to no videos", async () => {
    let testResponse = await testRequest
    .get("/videos");
    expect(testResponse.status).toBe(500);
  
  });
  test("update Video success", async () => {
    let { title, length } = generateVideoData();
    //first add the video
    await testRequest
    .post("/addVideo")
    .send({title: title, length: length});
    let newTitle = "TestTitle"
    let newLength = "00:10:00"
    let testResponse = await testRequest
    .put("/updateVideo/" + title + `/?newTitle=${newTitle}&newLength=${newLength}`);
    expect(testResponse.status).toBe(200);
    const cursor = await model.getCollection().find();
    const results = await cursor.toArray();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].title.toLowerCase() == newTitle.toLowerCase()).toBe(true);
    expect(results[0].length == newLength).toBe(true);
    
  });


  test("update Video failure due to unfound video", async () => {
    let { title, length } = generateVideoData();
    //first add the video
    await testRequest
    .post("/addVideo")
    .send({title: title, length: length});
    let newTitle = "TestTitle"
    let newLength = "00:10:00"
    let testResponse = await testRequest
    .put("/updateVideo/" + "AAAAAAAAAAAA" + `/?newTitle=${newTitle}&newLength=${newLength}`);
    expect(testResponse.status).toBe(500);
   
  });


  test("update Video success due to invalid length", async () => {
    let { title, length } = generateVideoData();
    //first add the video
    await testRequest
    .post("/addVideo")
    .send({title: title, length: length});
    let newTitle = "testTitle"
    let newLength = "00:10:00"
    let testResponse = await testRequest
    .put("/updateVideo/" + title + `/?newTitle=${newTitle}&newLength=hi`);
    expect(testResponse.status).toBe(400);
  });
  test("update Video success due to invalid title", async () => {
    let { title, length } = generateVideoData();
    //first add the video
    await testRequest
    .post("/addVideo")
    .send({title: title, length: length});
    let newTitle = ""
    let newLength = "00:10:00"
    let testResponse = await testRequest
    .put("/updateVideo/" + title + `/?newTitle=${newTitle}&newLength=${newLength}`);
    expect(testResponse.status).toBe(400);    
  });
  
