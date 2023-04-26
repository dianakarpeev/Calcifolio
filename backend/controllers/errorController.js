const express = require("express");
const router = express.Router();
const routeRoot = "/";

/** Controller function that says invalid URL to user with entering the wrong/non-existent endpoint
 *
 * @param {object} request No parameters
 * @param {object} response Invalid URL entered. Please try again message (404 error).
 */
router.get("*", showError);

async function showError(req, res) {
  res.status(404);
  res.send("Invalid URL entered. Please try again.");
}

module.exports = {
  router,
  routeRoot,
};
