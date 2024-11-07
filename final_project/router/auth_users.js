const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let filtered = users.filter((user) => user.username === username);
  return filtered.length === 0;
};

const authenticatedUser = (username, password) => {
  let filtered = users.filter(
    (user) => user.username === username && user.password === password
  );
  return filtered.length !== 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(404)
      .json({ message: "Please enter username and password" });
  }
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      {
        data: username,
      },
      "access",
      {
        expiresIn: 60 * 60,
      }
    );
    req.session.authorization = { accessToken, username };
    return res.status(200).json("Login successful");
  } else {
    return res.status(404).json("Invalid username or password");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const { username } = req.session.authorization;
  const book = books[isbn];
  if (book) {
    const reviews = book.reviews;
    const existingReview = reviews[username];
    reviews[username] = review;
    if (existingReview) {
      return res.status(200).json("Review updated successfully");
    } else {
      return res.status(200).json("Review added successfully");
    }
  } else {
    return res.status(404).json("Book not found");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
