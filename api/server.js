// BUILD YOUR SERVER HERE
const express = require("express");
const server = express();
const User = require("./users/model");

server.use(express.json());

server.post("/api/users", (req, res) => {
  const newUser = req.body;
  User.insert(newUser)
    .then((user) => {
      if (!newUser.name || !newUser.bio) {
        res
          .status(400)
          .json({ message: "Please provide name and bio for the user" });
      } else {
        res.status(201).json(user);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "There was an error while saving the user to the database",
        err: err.message,
      });
    });
});

server.get("/api/users", (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        message: "The users information could not be retrieved",
        err: err.message,
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "The user information could not be retrieved",
        err: err.message,
      });
    });
});

server.delete("/api/users/:id", (req, res) => {
  User.remove(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The user could not be removed", err: err.message });
    });
});

server.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  console.log(id, changes);
  try {
    if (changes.name && changes.bio) {
      const result = await User.update(id, changes);
      if (result) {
        res.status(200).json(result);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      }
    } else {
      res
        .status(400)
        .json({ message: "Please provide name and bio for the user" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "The user information could not be modified" });
  }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
