const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {
  getBookById,
  addBook,
  getBook,
  photo,
  removeBook,
  updateBook,
  getAllBooks,
} = require("../controllers/book");
const { route } = require("./auth");

//params
router.param("userId", getUserById);
router.param("bookId", getBookById);

//Actual Routes
//Create Routes
router.post("/book/create/:userId", isSignedIn, isAuthenticated, addBook);

// Get Books from user bookshelf
router.get("/book/:userId/:bookId", isSignedIn, isAuthenticated, getBook);
router.get("/book/:userId/photo/:bookId", photo);

//Delete Route
router.delete(
  "/book/:userId/delete/:bookId",
  isSignedIn,
  isAuthenticated,
  removeBook
);

//Update Route
router.put(
  "/book/update/:userId/:bookId",
  isSignedIn,
  isAuthenticated,
  updateBook
);

//Get All User's Books
router.get("/books/:userId", isSignedIn, isAuthenticated, getAllBooks);

module.exports = router;
