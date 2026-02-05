const Fuse = require('fuse.js');
const Product = require('../models/Product');

const search = async (query, parsedQuery, filters) => {
  try {
    let dbQuery = {};
    
    if (filters.minPrice || filters.maxPrice) {
      dbQuery.price = {};
      if (filters.minPrice) {
        dbQuery.price.$gte = Number(filters.minPrice);
      }
      if (filters.maxPrice) {
        dbQuery.price.$lte = Number(filters.maxPrice);
      }
    }
    
    if (filters.brand) {
      dbQuery.brand = new RegExp(filters.brand, 'i');
    }
    
    if (filters.category) {
      dbQuery.category = new RegExp(filters.category, 'i');
    }
    
    if (filters.color) {
      dbQuery['specs.color'] = new RegExp(filters.color, 'i');
    }
    
    if (filters.storage) {
      dbQuery['specs.storage'] = new RegExp(filters.storage, 'i');
    }

    const products = await Product.find(dbQuery).lean();
    
    if (products.length === 0) {
      return [];
    }
    
    if (!query || query.trim() === '') {
      const productsWithScore = [];
      for (let i = 0; i < products.length; i++) {
        productsWithScore.push({
          ...products[i],
          searchScore: 0.5
        });
      }
      return productsWithScore;
    }
    
    const options = {
      keys: [
        { name: 'title', weight: 0.6 },
        { name: 'brand', weight: 0.2 },
        { name: 'description', weight: 0.1 },
        { name: 'category', weight: 0.1 }
      ],
      threshold: 0.4,
      distance: 100,
      includeScore: true,
      useExtendedSearch: true,
      ignoreLocation: true
    };
    
    const fuse = new Fuse(products, options);
    const searchResults = fuse.search(query);
    
    const finalResults = [];
    for (let i = 0; i < searchResults.length; i++) {
      const result = searchResults[i];
      finalResults.push({
        ...result.item,
        searchScore: 1 - result.score
      });
    }
    
    return finalResults;
    
  } catch (error) {
    console.error('Search Error:', error);
    throw error;
  }
};

const getSuggestions = async (query) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }
    
    const pattern = new RegExp(query, 'i');
    
    const products = await Product.find({
      $or: [
        { title: pattern },
        { brand: pattern },
        { category: pattern }
      ]
    })
    .limit(10)
    .select('title brand')
    .lean();
    
    const allSuggestions = [];
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const lowerQuery = query.toLowerCase();
      
      if (product.title.toLowerCase().includes(lowerQuery)) {
        if (!allSuggestions.includes(product.title)) {
          allSuggestions.push(product.title);
        }
      }
      
      if (product.brand.toLowerCase().includes(lowerQuery)) {
        if (!allSuggestions.includes(product.brand)) {
          allSuggestions.push(product.brand);
        }
      }
    }
    
    return allSuggestions.slice(0, 10);
    
  } catch (error) {
    console.error('Suggestions Error:', error);
    return [];
  }
};

const getTrending = async (limit, category) => {
  try {
    let searchQuery = {};
    
    if (category) {
      searchQuery.category = category;
    }
    
    const maxLimit = Number(limit) || 10;
    
    const products = await Product.find(searchQuery)
      .sort({ salesCount: -1, rating: -1, createdAt: -1 })
      .limit(maxLimit)
      .lean();
    
    return products;
    
  } catch (error) {
    console.error('Trending Error:', error);
    throw error;
  }
};

module.exports = {
  search: search,
  getSuggestions: getSuggestions,
  getTrending: getTrending
};
