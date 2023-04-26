const pino = require("pino");
const streams = [
  {
    level: "trace",
    stream: process.stdout, // logs to the standard output
  },
  {
    level: "trace",
    stream: pino.destination("logs/server-log"), // log to this file
  },
];
const logger = pino(
    {
        level: "info", //minimum level to log messages
    },
    pino.multistream(streams)
);

module.exports = logger;
