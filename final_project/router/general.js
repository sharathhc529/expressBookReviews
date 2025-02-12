const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// Get the book based on isbn using async await
const axios = require('axios');


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    return res.status(300).json(book);
  } else {
    return res.status(404).json({'message': "Book not found"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author; // Extract author from request parameters
    const matchingBooks = [];

    // Iterate over the books object
    for (const key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push(books[key]); // Add matching books to the list
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks); // Return matching books
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title.toLowerCase(); // Convert title to lowercase for case-insensitive search
  let matchingBooks = [];

  // Iterate over the books object
  for (let key in books) {
      if (books[key].title.toLowerCase() === title) {
          matchingBooks.push(books[key]);
      }
  }

  // Check if any books were found
  if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
  } else {
      return res.status(404).json({ message: "No book found with this title" });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  return res.status(300).json(book);
});


// Get the book list using async-await with Axios
public_users.get('/', function (req, res) {
  axios.get('http://localhost:5000/books') // Fetch books from the server
      .then(response => {
          res.status(200).json(response.data); // Send the response back to the client
      })
      .catch(error => {
          res.status(500).json({ message: "Error fetching book list", error: error.message });
      });
});

public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn; // Extract ISBN from URL

    try {
        // Simulating an API call using Axios
        const response = await axios.get(`http://localhost:5000/books/${isbn}`);

        // Return book details
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});


// Get the author based on isbn using async await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author; // Extract author from URL

  try {
      // Simulating an API call using Axios
      const response = await axios.get(`http://localhost:5000/books/${author}`);

      // Return book details
      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

// Get the book based on isbn using async await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title; // Extract title from URL

  try {
      // Simulating an API call using Axios
      const response = await axios.get(`http://localhost:5000/books/${title}`);

      // Return book details
      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});



// Handle books based on axios
// Get the book list available in the shop
public_users.get('/books/',function (req, res) {
  //Write your code here
  return res.status(300).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/books/isbn/:isbn',function (req, res) {
  
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    return res.status(300).json(book);
  } else {
    return res.status(404).json({'message': "Book not found"})
  }
 });
  
// Get book details based on author
public_users.get('/books/author/:author',function (req, res) {
  const author = req.params.author; // Extract author from request parameters
    const matchingBooks = [];

    // Iterate over the books object
    for (const key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push(books[key]); // Add matching books to the list
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks); // Return matching books
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/books/title/:title',function (req, res) {
  let title = req.params.title;
  let book = books[title];
  return res.status(300).json(book);
});

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});


module.exports.general = public_users;
