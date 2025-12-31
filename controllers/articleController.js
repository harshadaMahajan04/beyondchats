const Article = require("../models/Article");

exports.getArticles = async (req, res) => {
  res.json(await Article.find());
};

exports.getArticleById = async (req, res) => {
  res.json(await Article.findById(req.params.id));
};

exports.createArticle = async (req, res) => {
  res.json(await Article.create(req.body));
};

exports.updateArticle = async (req, res) => {
  res.json(await Article.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

exports.deleteArticle = async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
