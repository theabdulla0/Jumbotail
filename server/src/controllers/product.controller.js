const Product = require("../models/Product");
const { v4: uuidv4 } = require("uuid");

exports.createProduct = async (req, res, next) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const stock = req.body.stock;
    const category = req.body.category;
    const brand = req.body.brand;
    const specs = req.body.specs;
    const images = req.body.images;
    const rating = req.body.rating;

    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and Price are required",
      });
    }

    let productId = req.body.productId;
    if (!productId) {
      productId = uuidv4();
    }

    const product = await Product.create({
      productId: productId,
      title: title,
      description: description || "",
      price: price,
      stock: stock || 0,
      category: category || "Electronics",
      brand: brand || "Generic",
      specs: specs || {},
      images: images || [],
      rating: rating || 0,
    });

    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      data: {
        productId: product.productId,
        title: product.title,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
    console.log("error:", error.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.body.productId;
    const metaData = req.body.metaData;

    if (!productId || typeof metaData !== "object") {
      return res.status(400).json({
        success: false,
        message: "productId and metaData object required",
      });
    }

    const allowedFields = [
      "ram",
      "storage",
      "display",
      "processor",
      "camera",
      "battery",
      "os",
      "color",
    ];

    const updateData = {};

    for (let i = 0; i < allowedFields.length; i++) {
      const field = allowedFields[i];
      if (metaData[field] !== undefined) {
        const key = "specs." + field;
        updateData[key] = metaData[field];
      }
    }

    const product = await Product.findOneAndUpdate(
      { productId: productId },
      { $set: updateData },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product metadata updated",
      data: {
        productId: productId,
        metadata: product.specs,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getProductByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ productId: id });

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not Find",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
