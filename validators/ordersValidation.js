const { check } = require("express-validator");

const ordersValidation = [
    check("price"),
    check("date").isDate({format: 'YYYY-MM-DD'}),
]

module.exports = {
    ordersValidation
};