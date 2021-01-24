const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const noteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      trim: true,
      maxlength: 10000,
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
    book: {
      type: ObjectId,
      ref: "Book",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
