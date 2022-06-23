const { check } = require("express-validator");

const usersValidation = [
    check("first_name").notEmpty().isLength({ min: 2 }).withMessage("The first name must be 2+ characters long"),
    check("last_name").notEmpty().isLength({ min: 2 }).withMessage("The last name must be 2+ characters long"),
    check("age").isInt().withMessage("Should be a number")
]

module.exports = {
    usersValidation
};