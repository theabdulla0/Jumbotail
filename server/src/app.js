const express = require("express");
const cors = require("cors");

// Routes
const productRoutes = require("./routes/product.routes");
const searchRoutes = require("./routes/search.routes");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - v1
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/search", searchRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

module.exports = app;
