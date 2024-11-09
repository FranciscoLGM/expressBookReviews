const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Please enter username and password!" });
    }
    if (!isValid(username)) {
      return res.status(400).json({ error: "Username already exists!" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const books = await getBooks();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching books" });
  }
});

async function getBooks() {
  return books;
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const { isbn } = req.params;
    const book = await getBookByISBN(isbn);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching book details" });
  }
});

async function getBookByISBN(isbn) {
  return books[isbn];
}

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const { author } = req.params;
    const filtered_author = await getBookByAuthor(author);

    if (!filtered_author) {
      res.status(404).json({ error: "Book not found" });
    } else {
      res.json(filtered_author);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getBookByAuthor(author) {
  return Object.values(books).find((book) => book.author === author);
}

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const { title } = req.params;
    const filtered_title = await getBookByTitle(title);

    if (!filtered_title) {
      res.status(404).json({ error: "Book not found" });
    } else {
      res.json(filtered_title);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getBookByTitle(title) {
  return Object.values(books).find((book) => book.title === title);
}

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
  try {
    const { isbn } = req.params;
    const book = await getBookByISBN(isbn);
    if (book) {
      res.json(book.reviews);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching book details" });
  }
});

async function getBookByISBN(isbn) {
  return books[isbn];
}

module.exports.general = public_users;
