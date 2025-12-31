require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const scrapeBlogs = require("./scraper/scrapeBlogs");

connectDB();

const app = express();
app.use(express.json());

app.use("/api/articles", require("./routes/articleRoutes"));

scrapeBlogs(); // run once on startup

app.listen(5000, () => console.log("Server running on port 5000"));
