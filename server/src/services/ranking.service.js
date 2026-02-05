const WEIGHTS = require('../constants/weights');

const rankProducts = (products, parsedQuery) => {
    if (!products || products.length === 0) {
        return [];
    }
    
    let maxPrice = 0;
    let minPrice = 999999;  
    let maxSales = 0;
    let maxReviews = 0;
    
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        
        if (product.price && product.price > maxPrice) {
            maxPrice = product.price;
        }
        if (product.price && product.price < minPrice) {
            minPrice = product.price;
        }
        if (product.salesCount && product.salesCount > maxSales) {
            maxSales = product.salesCount;
        }
        if (product.reviewCount && product.reviewCount > maxReviews) {
            maxReviews = product.reviewCount;
        }
    }
    
    const scoredProducts = [];
    
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        
        const textScore = getTextScore(product, parsedQuery);
        const ratingScore = getRatingScore(product);
        const popularityScore = getPopularityScore(product, maxSales);
        const priceScore = getPriceScore(product, parsedQuery, maxPrice, minPrice);
        const stockScore = getStockScore(product);
        const recencyScore = getRecencyScore(product);
        const promoScore = getPromoScore(product);
        
        let weights = WEIGHTS.DEFAULT;
        
        if (parsedQuery.isBudgetQuery) {
            weights = WEIGHTS.BUDGET;
        }
        
        if (parsedQuery.isPremiumQuery) {
            weights = WEIGHTS.PREMIUM;
        }
        
        if (parsedQuery.isPriceQuery) {
            weights.price = 0.25;
            weights.textMatch = 0.30;
        }
        
        const totalScore = 
            textScore * weights.textMatch +
            ratingScore * weights.rating +
            popularityScore * weights.popularity +
            priceScore * weights.price +
            stockScore * weights.stock +
            recencyScore * weights.recency +
            promoScore * weights.promotion;
        
        scoredProducts.push({
            ...product,
            relevanceScore: Number(totalScore.toFixed(4))
        });
    }
    
    scoredProducts.sort((a, b) => {
        return b.relevanceScore - a.relevanceScore;
    });
    
    return scoredProducts;
};

const getTextScore = (product, parsedQuery) => {
    if (product.searchScore !== undefined) {
        return product.searchScore;
    }
    
    const tokens = parsedQuery.tokens || [];
    if (tokens.length === 0) {
        return 0.5;
    }
    
    const searchText = (product.title + ' ' + product.brand + ' ' + product.description).toLowerCase();
    
    let matchCount = 0;
    let bonusScore = 0;
    
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        
        if (searchText.includes(token)) {
            matchCount = matchCount + 1;
            
            if (product.title.toLowerCase().includes(token)) {
                bonusScore = bonusScore + 0.1;
            }
        }
    }
    
    const baseScore = matchCount / tokens.length;
    const finalScore = baseScore + bonusScore;
    
    if (finalScore > 1) {
        return 1;
    }
    return finalScore;
};

const getRatingScore = (product) => {
    const rating = product.rating || 0;
    const reviewCount = product.reviewCount || 0;
    
    const normalizedRating = rating / 5;
    
    let confidence = reviewCount / 100;
    if (confidence > 1) {
        confidence = 1;
    }
    
    const confidenceWeight = 0.3;
    
    const score = normalizedRating * (1 - confidenceWeight) + normalizedRating * confidence * confidenceWeight;
    
    return score;
};

const getPopularityScore = (product, maxSales) => {
    const salesCount = product.salesCount || 0;
    
    if (maxSales === 0) {
        return 0.5;
    }
    
    const logSales = Math.log10(salesCount + 1);
    const logMax = Math.log10(maxSales + 1);
    
    return logSales / logMax;
};

const getPriceScore = (product, parsedQuery, maxPrice, minPrice) => {
    const price = product.price || 0;
    
    if (maxPrice === minPrice) {
        return 0.5;
    }
    
    const normalizedPrice = (price - minPrice) / (maxPrice - minPrice);
    
    if (parsedQuery.isBudgetQuery) {
        return 1 - normalizedPrice;
    }
    
    if (parsedQuery.isPremiumQuery) {
        return normalizedPrice;
    }
    
    if (parsedQuery.priceRange) {
        const minRange = parsedQuery.priceRange.min;
        const maxRange = parsedQuery.priceRange.max;
        const targetPrice = (minRange + maxRange) / 2;
        const distance = Math.abs(price - targetPrice);
        const maxDistance = maxRange - minRange;
        
        const score = 1 - Math.min(1, distance / maxDistance);
        return score;
    }
    
    return 1 - Math.abs(normalizedPrice - 0.4);
};

const getStockScore = (product) => {
    const stock = product.stock || 0;
    
    if (stock === 0) {
        return 0;
    }
    if (stock < 5) {
        return 0.5;
    }
    if (stock < 20) {
        return 0.8;
    }
    return 1;
};

const getRecencyScore = (product) => {
    if (!product.createdAt) {
        return 0.5;
    }
    
    const now = new Date();
    const created = new Date(product.createdAt);
    const diff = now - created;
    const daysDiff = diff / (1000 * 60 * 60 * 24);
    
    if (daysDiff < 7) {
        return 1;
    }
    if (daysDiff < 30) {
        return 0.9;
    }
    if (daysDiff < 90) {
        return 0.7;
    }
    if (daysDiff < 180) {
        return 0.5;
    }
    
    return 0.3;
};

const getPromoScore = (product) => {
    if (product.isPromoted) {
        return 1;
    }
    return 0;
};

module.exports = {
    rankProducts: rankProducts
};