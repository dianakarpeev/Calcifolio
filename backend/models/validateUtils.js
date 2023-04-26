const validator = require("validator");
const { InvalidInputError } = require("./InvalidInputError");

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

module.exports = { isValid, isValidName, isValidDate };
