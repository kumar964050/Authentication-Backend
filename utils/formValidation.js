var validator = require("validator");
var passwordValidator = require("password-validator");

// name validation min 3 max 24
exports.isNameValid = (name) => {
  return !(name.length >= 3 && name.length <= 24);
};

// age validation min 18
exports.isAgeValid = (age) => {
  return !(age >= 18);
};

// email validation
exports.isEmailValid = (email) => {
  return !validator.isEmail(email);
};

// password validation min 6  it contains one Upper and Lower not spaces one number
exports.isPasswordValid = (password) => {
  var schema = new passwordValidator();
  schema
    .is()
    .min(6) // Minimum length 8
    .is()
    .max(200) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(1) // Must have at least 2 digits
    .has()
    .not()
    .spaces(); // Should not have spaces
  // Validate against a password string
  return !schema.validate(password);
};
