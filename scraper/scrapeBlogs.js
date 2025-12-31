const axios = require("axios");
const cheerio = require("cheerio");
const Article = require("../models/Article");

const BASE_URL = "https://beyondchats.com";

async function scrapeOldestBlogs() {
  try {
    console.log("Scraping started...");

    // Step 1: get blogs page
    const { data } = await axios.get(`${BASE_URL}/blogs`);
    const $ = cheerio.load(data);

    // Step 2: get last page URL
    let lastPageUrl = null;
    $("a").each((i, el) => {
      const href = $(el).attr("href");
      if (href && href.includes("page")) {
        lastPageUrl = href.startsWith("http") ? href : BASE_URL + href;
      }
    });

    if (!lastPageUrl) {
      lastPageUrl = `${BASE_URL}/blogs`;
    }

    console.log("Last page:", lastPageUrl);

    // Step 3: scrape last page
    const lastPage = await axios.get(lastPageUrl);
    const $$ = cheerio.load(lastPage.data);

    const articleLinks = [];

    $$("a").each((i, el) => {
      let href = $$(el).attr("href");

      if (!href) return;

      // Ignore tag pages
      if (href.includes("/blogs/tag")) return;

      // Only blog posts
      if (href.startsWith("/blogs/") || href.startsWith("https://beyondchats.com/blogs/")) {
        if (!href.startsWith("http")) {
          href = BASE_URL + href;
        }

        if (!articleLinks.includes(href)) {
          articleLinks.push(href);
        }
      }
    });

    console.log("Article links found:", articleLinks);

    // Step 4: fetch up to 5 oldest
    const oldestFive = articleLinks.slice(-5);

    for (const url of oldestFive) {
      try {
        const page = await axios.get(url);
        const $$$ = cheerio.load(page.data);

        const title = $$$("h1").first().text().trim();
        const content = $$$("article").text().trim();

        if (!title || !content) {
          console.log("Skipping empty article:", url);
          continue;
        }

        await Article.create({ title, url, content });
        console.log("Saved:", title);

      } catch (err) {
        console.error("Article error:", err.message);
      }
    }

    console.log("Scraping completed");

  } catch (error) {
    console.error("Scraping failed:", error.message);
  }
}

module.exports = scrapeOldestBlogs;
