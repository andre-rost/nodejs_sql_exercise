require("dotenv").config();
const express = require('express');
const db = require("./db/client");
const app = express()
const  { validationResult }  = require("express-validator");
const { usersValidation } = require("./validators/usersValidation");
const { ordersValidation } = require("./validators/ordersValidation");
app.use(express.json());

const PORT = process.env.PORT || 3000

// USERS //

// GET ALL USERS

app.get("/api/users", (req, res) => {
  db
    .query("SELECT * FROM users;")
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// GET ONE USER

app.get("/api/users/:id", (req, res) => {

  const { id } = req.params;

    db
      .query("SELECT * FROM users WHERE id = $1", [id])
      .then((data) => res.json(data.rows))
      .catch((error) => res.sendStatus(500));

  const getOneUser = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  };

  db
    .query(getOneUser)
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// CREATE ONE USER

app.post("/api/users", usersValidation, (req, res) => {

  const { id, first_name, last_name, age, active } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  const createOneUser = {
    text: `
    INSERT INTO 
        users
            (id, first_name, last_name, age, active)
        VALUES
            ($1, $2, $3, $4, $5) 
        RETURNING *
        `,
    values: [id, first_name, last_name, age, active],
  };

  db
    .query(createOneUser)
    .then((data) => res.status(201).json(data.rows[0]))
    .catch((error) => res.sendStatus(500));
});

// UPDATE ONE USER

app.put("/api/users/:id", usersValidation, (req, res) => {

  const { id } = req.params;
 
  const { first_name, last_name, age, active } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  const updateOneUser = {
    text: `
    UPDATE users
        SET
            first_name = $1, 
            last_name = $2, 
            age = $3, 
            active = $4
        WHERE
            id = $5
        RETURNING *
        `,
    values: [first_name, last_name, age, active, id],
  };

  db
    .query(updateOneUser)
    .then((data) => res.json(data.rows))
    .catch((e) => res.status(500).send(e.message));
});

// DELETE ONE USER

app.delete("/api/users/:id", (req, res) => {

  const { id } = req.params;

  const deleteOneUser = {
    text: "DELETE FROM users WHERE id = $1 RETURNING *",
    values: [id],
  };

  db
    .query(deleteOneUser)
    .then((data) => res.json(data.rows))
    .catch((e) => res.status(500).send(e.message));
});

// ORDERS // 

// GET ALL ORDERS

app.get("/api/orders", (req, res) => {
  db
    .query("SELECT * FROM orders;")
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// GET ONE ORDER

app.get("/api/orders/:id", (req, res) => {

  const { id } = req.params;

    db
      .query("SELECT * FROM orders WHERE id = $1", [id])
      .then((data) => res.json(data.rows))
      .catch((error) => res.sendStatus(500));

  const getOneOrder = {
    text: "SELECT * FROM orders WHERE id = $1",
    values: [id],
  };

  db
    .query(getOneOrder)
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// CREATE ONE ORDER

app.post("/api/orders", ordersValidation, (req, res) => {

  const { id, price, date, user_id } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  const createOneOrder = {
    text: `
    INSERT INTO 
        orders
            (id, price, date, user_id)
        VALUES
            ($1, $2, $3, $4) 
        RETURNING *
        `,
    values: [id, price, date, user_id],
  };

  db
    .query(createOneOrder)
    .then((data) => res.status(201).json(data.rows[0]))
    .catch((error) => res.sendStatus(500));
});

// UPDATE ONE ORDER

app.put("/api/orders/:id", ordersValidation, (req, res) => {

  const { id } = req.params;
 
  const { price, date, user_id } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  const updateOneOrder = {
    text: `
    UPDATE orders
        SET
            price = $1, 
            date = $2, 
            user_id = $3
        WHERE
            id = $4
        RETURNING *
        `,
    values: [price, date, user_id, id],
  };

  db
    .query(updateOneOrder)
    .then((data) => res.json(data.rows))
    .catch((e) => res.status(500).send(e.message));
});

// DELETE ONE ORDER

app.delete("/api/orders/:id", (req, res) => {

  const { id } = req.params;

  const deleteOneOrder = {
    text: "DELETE FROM orders WHERE id = $1 RETURNING *",
    values: [id],
  };

  db
    .query(deleteOneOrder)
    .then((data) => res.json(data.rows))
    .catch((e) => res.status(500).send(e.message));
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
