require("dotenv").config();
const app = require('./app.js');
const port = 1339;
const model = require("./models/projectDeadlineModelMongoDb");
const videoModel = require("./models/videoModel");
const url = process.env.URL_PRE + process.env.MONGODB_PWD + process.env.URL_POST;
const dbName = "eventDeadline_db";

/**
 * Initialize the database connection
 * @constructor
 */
//videoModel.initialize(dbName, false, url)
model.initialize(dbName, false, url)
    .then(
        
        app.listen(port) // Run the server
    );


