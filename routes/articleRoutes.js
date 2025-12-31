const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/articleController");

router.get("/", ctrl.getArticles);
router.get("/:id", ctrl.getArticleById);
router.post("/", ctrl.createArticle);
router.put("/:id", ctrl.updateArticle);
router.delete("/:id", ctrl.deleteArticle);

module.exports = router;
