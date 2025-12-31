const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  url: { type: String, unique: true },
  publishedDate: String,
  content: String
}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);
