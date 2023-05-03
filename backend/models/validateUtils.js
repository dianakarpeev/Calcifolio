const validator = require("validator");
const { InvalidInputError } = require("./InvalidInputError");
const validator = require('validator');
const { InvalidTitleError } = require('./InvalidTitleError');
const {InvalidLengthError } = require('./InvalidLengthError');

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
function dateIsValid(date) {
  const result = Date.parse(date);
  if (isNaN(result)) {
    console.log(
      "Error! Date: '" +
        date +
        "' is invalid. Please input a valid string following this format: April 24, 2019"
    );
    return false;
  }
  return true;
}

/**
 * Validates URL string using the JavaScript URL object. If invalid, URL object constructor
 * throws a TypeError that is caught.
 * @param {string} url
 * @returns true/false
 */
function urlIsValid(url) {
  try {
    const newURL = new URL(url);
    return true;
  } catch (err) {
    console.log(
      "Error! URL: '" +
        url +
        "' is invalid. Please input a valid HTTP/HTTPS URL."
    );
    return false;
  }
}

/**
 * Validates name string using validator NPM package. Makes sure it's a string and that all characters are
 * alphanumerical.
 * @param {string} name
 * @returns true/false
 */
function nameIsValid(name) {
  if (typeof name != "string") {
    console.log(
      "Error! Name: '" + name + "' is invalid. Please input a valid string."
    );
    return false;
  }
  return true;
}



//VIDEO VALIDATORS


/**Check to see if title is defined and if length is a timestamp

 * @param {string} title
 * @param {string} length
 * @returns true if length and title are valid. Throws InvalidLengthError or InvalidTitleError otherwise
 */
function isValid2(title,length) {
    if (!title) {
        throw  new InvalidTitleError("Title must be a valid string");
}
if (validator.isTime(length,{hourFormat:'hour24', mode:'withSeconds'})) {
    return true;
}

throw new InvalidLengthError("Length must be a valid time.")
}
function validTitle(title) {
    if (!title) {
        throw  new InvalidTitleError("Title must be a valid string");
}
return true;
}











module.exports = { isValid, isValidName, isValidDate, nameIsValid, urlIsValid, dateIsValid, validTitle, isValid2 };
