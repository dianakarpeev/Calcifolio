const validator = require('validator');
const { InvalidTitleError } = require('./InvalidTitleError');
const {InvalidLengthError } = require('./InvalidLengthError');

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

module.exports = {isValid2, validTitle};