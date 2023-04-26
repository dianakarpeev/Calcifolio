const express = require("express");
const router = express.Router();
const routeRoot = "/";
/** Controller function that says hello to user with given name
 *
 * @param {object} request Expect query parameters of firstName and lastName but if undefined return simple response
 * @param {object} response Hello message (200 success).
 */
router.get("/", home)

async function home(req, res){
    let output;
    let firstName= req.query.firstName
    let lastName=req.query.lastName
    if(firstName==undefined||lastName==undefined){
        output = "Hello, fellow user with unknown name. Welcome!";
    }
    else{
    output= "Hello "+firstName+" "+lastName+". Welcome!";
    }
    res.send(output);
  }

module.exports = {
  router,
  routeRoot,
};
