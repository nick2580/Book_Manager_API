const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getBookById } = require("../controllers/book");
const {
  addNote,
  getNoteById,
  getNote,
  removeNote,
  updateNote,
  getAllNotes,
} = require("../controllers/note");
const { route } = require("./auth");

//params
router.param("userId", getUserById);
router.param("bookId", getBookById);
router.param("noteId", getNoteById);

//Actual Routes
//Create Routes
router.post(
  "/note/create/:userId/:bookId",
  isSignedIn,
  isAuthenticated,
  addNote
);

// Get Note from user's book
router.get(
  "/note/:userId/read/:noteId/:bookId",
  isSignedIn,
  isAuthenticated,
  getNote
);

//Delete Route
router.delete(
  "/note/:userId/delete/:noteId/:bookId",
  isSignedIn,
  isAuthenticated,
  removeNote
);

//Update Route
router.put(
  "/note/:userId/update/:bookId/:noteId",
  isSignedIn,
  isAuthenticated,
  updateNote
);

//Get All User's Notes
router.get("/note/readall/:userId", isSignedIn, isAuthenticated, getAllNotes);

module.exports = router;
