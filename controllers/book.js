const Book = require("../models/book");
const User = require("../models/user");
const user = require("../models/user");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const book = require("../models/book");
const { parse } = require("path");
const { sortBy } = require("lodash");

//Search for book which has same userid of user
exports.getBookById = (req, res, next, id) => {
  Book.find({ _id: id, user: req.profile._id }).exec((err, book) => {
    if (err) {
      return res.status(400).json({
        error: "Book not found in DB",
      });
    }
    if (book.length == 0) {
      return res.status(400).json({
        error: "Book not found in user's bookshelf",
      });
    }
    req.book = book;
    next();
  });
};
// POST - Add Book to DB
exports.addBook = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with photo",
      });
    }
    //Destructuring the fields
    const { title, description, author, category, status } = fields;

    if (!title || !description || !author || !category || !status) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let book = new Book(fields);
    //Register this book with user's id
    book.user = req.profile;

    //Handle File here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      book.photo.data = fs.readFileSync(file.photo.path);
      book.photo.contentType = file.photo.type;
    }

    //Save to DB
    book.save((err, book) => {
      if (err) {
        return res.status(400).json({
          error: "Saving Book in DB failed",
        });
      }
      res.json(book);
    });
  });
};

//Find one exact book
exports.getBook = (req, res) => {
  req.book.photo = undefined;
  return res.json(req.book);
};

//Middleware
exports.photo = (req, res, next) => {
  if (req.book.photo.data) {
    res.set("Content-Type", req.book.photo.contentType);
    return res.send(req.book.photo.data);
  }
  next();
};

//Delete
exports.removeBook = (req, res) => {
  // TODO: For some reason req.book is passing an object inside an array, look into it
  const book = req.book[0];
  book.remove((err, removedBook) => {
    if (err) {
      res.status(400).json({
        error: "Failed to delete product",
      });
    }
    res.json({
      message: `${removedBook.title} was deleted successfully`,
    });
  });
};

// Update Book
exports.updateBook = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with photo",
      });
    }
    //Updation Code
    let book = req.book[0];
    book = _.extend(book, fields);

    //Handle File here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      book.photo.data = fs.readFileSync(file.photo.path);
      book.photo.contentType = file.photo.type;
    }

    //Save to DB
    book.save((err, book) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of book failed",
        });
      }
      res.json(book);
    });
  });
};

//GET All User Books Listing
exports.getAllBooks = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 20;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Book.find({ user: req.profile._id })
    .select("-photo")
    .sort([[sortBy, "asc"]])
    .populate("notes")
    .limit(limit)
    .exec((err, books) => {
      if (err) {
        return res.status(400).json({
          error: "No books found",
        });
      }
      res.json(books);
    });
};
