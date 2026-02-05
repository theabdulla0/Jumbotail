const searchService = require("../services/search.service");
const rankingService = require("../services/ranking.service");
const queryParser = require("../utils/queryParser");

exports.searchProducts = async (req, res, next) => {
  try {
    const startTime = Date.now();

    const query = req.query.query;
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const sortBy = req.query.sortBy;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const brand = req.query.brand;
    const category = req.query.category;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
        example: "/api/v1/search/product?query=iphone 16",
      });
    }

    const parsedQuery = queryParser.parse(query);

    const filters = {
      minPrice: parsedQuery.priceRange?.min || minPrice,
      maxPrice: parsedQuery.priceRange?.max || maxPrice,
      brand: brand || parsedQuery.brand,
      category: category || parsedQuery.category,
      color: parsedQuery.color,
      storage: parsedQuery.storage,
    };

    const searchResults = await searchService.search(
      parsedQuery.cleanedQuery,
      parsedQuery,
      filters
    );

    const rankedResults = rankingService.rankProducts(
      searchResults,
      parsedQuery
    );

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;

    const paginatedResults = [];
    for (let i = startIndex; i < endIndex && i < rankedResults.length; i++) {
      paginatedResults.push(rankedResults[i]);
    }

    const responseTime = Date.now() - startTime;
    const totalPages = Math.ceil(rankedResults.length / limitNumber);

    res.status(200).json({
      success: true,
      message: "Found " + rankedResults.length + " products",
      meta: {
        query: query,
        parsedIntent: {
          cleanedQuery: parsedQuery.cleanedQuery,
          isBudgetQuery: parsedQuery.isBudgetQuery,
          isPremiumQuery: parsedQuery.isPremiumQuery,
          priceRange: parsedQuery.priceRange,
          detectedFilters: {
            brand: parsedQuery.brand,
            color: parsedQuery.color,
            storage: parsedQuery.storage,
          },
        },
        pagination: {
          currentPage: pageNumber,
          totalPages: totalPages,
          totalResults: rankedResults.length,
          resultsPerPage: limitNumber,
        },
        responseTime: responseTime + "ms",
      },
      data: paginatedResults,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSuggestions = async (req, res, next) => {
  try {
    const query = req.query.query;

    if (!query || query.length < 2) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const suggestions = await searchService.getSuggestions(query);

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrendingProducts = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const category = req.query.category;

    const trending = await searchService.getTrending(limit, category);

    res.status(200).json({
      success: true,
      message: "Top " + trending.length + " trending products",
      data: trending,
    });
  } catch (error) {
    next(error);
  }
};
