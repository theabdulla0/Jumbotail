const express = require("express");
const router = express.Router();

const searchController = require("../controllers/search.controller");

router.get("/product", searchController.searchProducts);

router.get("/suggestions", searchController.getSuggestions);

router.get("/trending", searchController.getTrendingProducts);

module.exports = router;
