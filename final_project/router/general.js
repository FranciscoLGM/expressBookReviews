const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      return res.send("User registered successfully!");
    } else {
      return res.send("Username already exists!");
    }
  } else {
    return res.send("Please enter username and password!");
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const books = await getBooks();
    res.send(JSON.stringify(books, null, 2));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching books");
  }
});

async function getBooks() {
  try {
    return books;
  } catch (error) {
    throw new Error("Error fetching books");
  }
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const { isbn } = req.params;
    const book = await getBookByISBN(isbn);
    if (book) {
      res.send(JSON.stringify(book, null, 2));
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching book details");
  }
});

async function getBookByISBN(isbn) {
  try {
    return books[isbn];
  } catch (error) {
    throw new Error("Error fetching book details");
  }
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let filtered_author = Object.keys(books).find(
    (key) => books[key].author === author
  );
  res.send(JSON.stringify(books[filtered_author], null, 2));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let filtered_title = Object.keys(books).find(
    (key) => books[key].title === title
  );
  res.send(JSON.stringify(books[filtered_title], null, 2));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 2));
});

module.exports.general = public_users;
