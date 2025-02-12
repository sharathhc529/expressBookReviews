const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Function to check if the username and password match
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  
  if (!user) {
      console.log("User not found:", username);
      return false;
  }
  
  if (user.password !== password) {
      console.log("Incorrect password for user:", username);
      return false;
  }
  
  return true;
};


// Login a registered user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Validate user credentials
  if (authenticatedUser(username, password)) {
      // Generate JWT token
      const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

      // Save token in session
      req.session.authorization = { token, username };

      return res.status(200).json({ message: "Login successful", token });
  } else {
      return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Extract ISBN from request parameters
  const review = req.body.review; // Get review from request body

  // Check if the user is logged in
  if (!req.session.authorization) {
      return res.status(403).json({ message: "User not logged in" });
  }

  const username = req.session.authorization.username; // Retrieve username from session

  // Check if the book exists
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Check if review is provided
  if (!review) {
      return res.status(400).json({ message: "Review text is required" });
  }

  // Add or update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  // Check if the user is logged in
  if (!req.session.authorization) {
      return res.status(403).json({ message: "User not logged in" });
  }

  const username = req.session.authorization.username;

  // Check if the book exists
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Check if the review exists for this user
  if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this user" });
  }

  // Delete the review
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
