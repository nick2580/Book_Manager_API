const Book = require("../models/book");
const User = require("../models/user");
const user = require("../models/user");
const Note = require("../models/note");
const note = require("../models/note");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const book = require("../models/book");
const { parse } = require("path");
const { sortBy } = require("lodash");

//Search for book which has same userid of user
exports.getNoteById = (req, res, next, id) => {
  // TODO: Think if user: req.profile._id is necessary, as we are checking if user is authenticated or not. As each note has separate ID, its not necessary to recheck if 'Requested Note' is from "Same user" or not.
  Note.find({ _id: id, user: req.profile._id }).exec((err, note) => {
    if (err) {
      return res.status(400).json({
        error: "Note not found in DB",
      });
    }
    if (note.length == 0) {
      return res.status(400).json({
        error: "Note not found in user's book",
      });
    }
    req.note = note;
    next();
  });
};

// CREATE Note
exports.addNote = (req, res) => {
  const note = new Note(req.body);
  note.user = req.profile._id;
  note.book = req.book[0]._id;
  note.save((err, note) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save Note in DB",
      });
    }
    res.json({ note });
  });
};

//Find one exact Note
exports.getNote = (req, res) => {
  return res.json(req.note);
};

//DELETE: Note from book
exports.removeNote = (req, res) => {
  // TODO: For some reason req.note is passing an object inside an array, look into it
  const note = req.note[0];
  note.remove((err, removedNote) => {
    if (err) {
      res.status(400).json({
        error: "Failed to delete product",
      });
    }
    res.json({
      message: `Note was deleted successfully`,
    });
  });
};

// UPDATE Note
exports.updateNote = (req, res) => {
  //Updation Code
  const note = req.note[0];
  note.note = req.body.note;
  note.user = req.profile._id;
  note.book = req.book[0]._id;

  note.save((err, updatedNote) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to update Note in DB",
      });
    }
    res.json(updatedNote);
  });
};

// GET: All Notes
exports.getAllNotes = (req, res) => {
  Note.find({ user: req.profile._id }).exec((err, note) => {
    if (err) {
      return res.status(400).json({
        error: "No Note found",
      });
    }
    res.json({ note });
  });
};
