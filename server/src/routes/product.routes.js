const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");

router.post("/", productController.createProduct);
router.get("/:id", productController.getProductByID);
router.put("/meta-data", productController.updateProduct);

module.exports = router;
