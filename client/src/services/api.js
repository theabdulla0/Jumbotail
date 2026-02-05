import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const searchProducts = async (query, options) => {
  try {
    if (!options) {
      options = {};
    }

    let urlParams = "query=" + encodeURIComponent(query);
    urlParams = urlParams + "&page=" + (options.page || 1);
    urlParams = urlParams + "&limit=" + (options.limit || 20);

    if (options.minPrice) {
      urlParams = urlParams + "&minPrice=" + options.minPrice;
    }
    if (options.maxPrice) {
      urlParams = urlParams + "&maxPrice=" + options.maxPrice;
    }
    if (options.brand) {
      urlParams = urlParams + "&brand=" + options.brand;
    }
    if (options.category) {
      urlParams = urlParams + "&category=" + options.category;
    }

    const response = await api.get("/search/product?" + urlParams);
    return response.data;
  } catch (error) {
    console.error("Search API Error:", error);
    throw error;
  }
};

export const getSuggestions = async (query) => {
  try {
    const response = await api.get("/search/suggestions?query=" + query);
    return response.data;
  } catch (error) {
    console.error("Suggestions API Error:", error);
    return { data: [] };
  }
};

export const getTrendingProducts = async (limit) => {
  try {
    if (!limit) {
      limit = 10;
    }

    const response = await api.get("/search/trending?limit=" + limit);
    return response.data;
  } catch (error) {
    console.error("Trending API Error:", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await api.get("/product/" + productId);
    return response.data;
  } catch (error) {
    console.error("Product API Error:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post("/product", productData);
    return response.data;
  } catch (error) {
    console.error("Create Product Error:", error);
    throw error;
  }
};

export const updateProductMetadata = async (productId, metaData) => {
  try {
    const data = {
      productId: productId,
      metaData: metaData,
    };

    const response = await api.put("/product/meta-data", data);
    return response.data;
  } catch (error) {
    console.error("Update Metadata Error:", error);
    throw error;
  }
};

export default api;
