const validator = require("validator");
const { InvalidInputError } = require("./InvalidInputError");
const { InvalidTitleError } = require("./InvalidTitleError");
const { InvalidLengthError } = require("./InvalidLengthError");

//default attributes that are expected from the validation
var default_date_options = {
  format: "YYYY-MM-DD",
  delimiters: ["-"],
  strictMode: true,
};
var default_empty_options = {
  ignore_whitespace: true,
};

/**
 * Checks whether the given date and project name is valid.
 * @param {String} projectName is the name of the project/ identification besides the the _id.
 * @param {String} projectDueDay is the date of the deadline.
 * @returns true if the the input is valid, otherwise:
 * throws InvalidInputError is the required field are empty.
 * throws InvalidInputError is the date does not follow the format expected or is out of date range.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
function isValid(projectName, projectDueDay) {
  try {
    if (
      validator.isEmpty(projectName, default_empty_options) ||
      validator.isEmpty(projectDueDay, default_empty_options)
    ) {
      throw new { InvalidInputError }.InvalidInputError(
        "All fields are required"
      );
    }
    if (!validator.isDate(projectDueDay, default_date_options)) {
      throw new { InvalidInputError }.InvalidInputError(
        "Invalid Date format (YYYY-MM-DD)"
      );
    }
    return true;
  } catch (err) {
    throw err;
  }
}

/**
 * Checks whether the given user information is valid by verifying if there are empty strings
 * and calls isValidUsername and isValidPassword.
 * @param {string} username to validate.
 * @param {string} password to validate.
 * @returns true if valid, throws an exception otherwise
 */
function isValidUser(username, password) {
  try {
    if (
      validator.isEmpty(username, default_empty_options) ||
      validator.isEmpty(password, default_empty_options)
    )
      throw new { InvalidInputError }.InvalidInputError(
        "All fields are required"
      );

    if (!isValidUsername(username))
      throw new { InvalidInputError }.InvalidInputError(
        "Invalid username. Please make sure the username doesn't contain special characters and has a correct amount of characters."
      );

    if (!isValidPassword(password))
      throw new [InvalidInputError].InvalidInputError("Weak password.");

    return true;
  } catch (err) {
    throw err;
  }
}

/**
 * Checks whether project name and only the project name is valid.
 * @param {String} projectName is the name of the project/ identification besides the the _id.
 * @returns true if the the input is valid, otherwise:
 * throws InvalidInputError is the required field are empty.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
function isValidName(projectName) {
  try {
    if (validator.isEmpty(projectName, default_empty_options)) {
      throw new { InvalidInputError }.InvalidInputError("Name cannot be empty");
    }
    return true;
  } catch (err) {
    throw err;
  }
}

/**
 * Checks whether project deadline date and only the project deadline date is valid.
 * @param {String} projectDueDay is the date of the deadline.
 * @returns true if the the input is valid, otherwise:
 * throws InvalidInputError is the date does not follow the format expected or is out of date range.
 * throws Exception if the project comes to contact with unknown errors that are unexpected instead of 'swallowing' other types.
 */
function isValidDate(projectDueDay) {
  try {
    if (!validator.isDate(projectDueDay, default_date_options)) {
      throw new { InvalidInputError }.InvalidInputError(
        "Invalid Date format (YYYY-MM-DD)"
      );
    }
    return true;
  } catch (err) {
    throw err;
  }
}

/**
 * Validates string date using Date.parse
 * @param {string} date expected format: April 24, 2019
 * @returns true/false
 */
function isValidDate2(date) {
  try {
    const result = Date.parse(date);
    if (isNaN(result)) {
      throw new { InvalidInputError }.InvalidInputError(
        "Error! Date: '" +
          date +
          "' is invalid. Please input a valid string following this format: April 24, 2019"
      );
    }
    return true;
  } catch (err) {
    throw err;
  }
}
  /**
   * Validates URL string using the JavaScript URL object. If invalid, URL object constructor
   * throws a TypeError that is caught.
   * @param {string} url
   * @returns true/false
   */
  function isValidUrl(url) {
    try {
      const newURL = new URL(url);
      if (newURL == null) {
        throw new InvalidInputError(
          "Invalid URL: '" +
            url +
            "' is invalid. Please input a valid HTTP/HTTPS URL."
        );
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Validates name string using validator NPM package. Makes sure it's a string and that all characters are
   * alphanumerical.
   * @param {string} name
   * @returns true/false
   */
  function isValidArtworkName(name) {
    if (typeof name != "string") {
      console.log(
        "Error! Name: '" + name + "' is invalid. Please input a valid string."
      );
      return false;
    }
    return true;
  }

  /**
   * Checks if password contains:
   * - 8 characters
   * - 1 uppercase letter
   * - 1 lowercase letter
   * - 1 number
   * - 1 symbol
   * @param {string} password to validate
   * @returns true if valid, false other
   */
  function isValidPassword(password) {
    try {
      if (!validator.isStrongPassword(password)) {
        throw new InvalidInputError(
          "Error! Password '" +
            password +
            "' is invalid. Please input a valid password that contains: \n - 8 characters \n - 1 uppercase \n- 1 lowercase \n - 1 number \n - 1 symbol"
        );
      }
      return true;
    } catch (err) {
      throw err;
    }
  }


/**
 * Checks if username is:
 * - A string
 * - Is empty
 * - Contains at least 3 characters
 * - Contains less than 10 characters
 * - Contains special characters
 * @param {string} username to validate
 * @returns true if valid, false otherwise
 */
function isValidUsername(username) {

  try{
    const specialChars = /[`!@#$%^&*()_\+=\[\]{};':"\\|,.<>\/?~ ]/;
    const minAmountChars = 3;
    const maxAmountChars = 11;
  
    validator.id;
    //if username is not a string
    if (!typeof username === "string") {
      throw new InvalidInputError(
        "Error! Username '" + username + "' needs to be a string."
      );
    }
  
    //if username is under 3 characters
    if (username.length < minAmountChars) {
      throw new InvalidInputError(
        "Error! Username '" + username + "' cannot be under 3 characters long."
      );
    }
  
    //if username is above 10 characters
    if (username.length > maxAmountChars) {
      throw new InvalidInputError(
        "Error! Username '" +
          username +
          "' is invalid due to having more characters than the maximum limit of 10."
      );
    }
  
    //if username contains special characters
    if (specialChars.test(username)) {
    throw new InvalidInputError(
        "Error! Username '" + username + "' cannot contain special characters."
      );
    }
  
    //username is valid
    return true;
  }
  catch(err){
    throw err;
  }

}



//VIDEO VALIDATORS

/**Check to see if title is defined

 * @param {string} title to validate

 * @returns true if title is valid. Throws InvalidTitleError otherwise
 */

function validTitle(title) {
  try{
    if (!title) {
      throw new InvalidTitleError("Title must be a valid string");
    }
    return true;
  }
  catch(err){
    throw err;
  }
}

module.exports = {
  isValid,
  isValidName,
  isValidDate,
  isValidArtworkName,
  isValidUrl,
  isValidDate2,
  isValidPassword,
  isValidUsername,
  validTitle,
};
