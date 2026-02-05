
module.exports = {
    // Default weights (balanced search)
    DEFAULT: {
        textMatch: 0.35,      // Query relevance
        rating: 0.20,         // Product rating
        popularity: 0.15,     // Sales count
        price: 0.10,          // Price positioning
        stock: 0.10,          // Availability
        recency: 0.05,        // New products boost
        promotion: 0.05       // Sponsored boost
    },
    
    // Budget-conscious search weights
    BUDGET: {
        textMatch: 0.30,
        rating: 0.15,
        popularity: 0.10,
        price: 0.30,          // Higher weight for cheap products
        stock: 0.10,
        recency: 0.03,
        promotion: 0.02
    },
    
    // Premium/flagship search weights
    PREMIUM: {
        textMatch: 0.30,
        rating: 0.25,         // Quality matters more
        popularity: 0.15,
        price: 0.10,          // Price less important
        stock: 0.10,
        recency: 0.07,        // Latest models
        promotion: 0.03
    }
};