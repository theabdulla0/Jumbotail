const Product = require("../models/Product");
const { v4: uuidv4 } = require("uuid");

exports.createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      category,
      brand,
      specs,
      images,
      rating,
    } = req.body;
    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and Price are required",
      });
    }
    const productId = req.body.productId || uuidv4();
    const product = await Product.create({
      productId,
      title,
      description: description || "",
      price,
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
    const { productId, metaData } = req.body;

    if (!productId || typeof metaData !== "object") {
      return res.status(400).json({
        success: false,
        message: "productId and metaData object required",
      });
    }

    const updateData = {};
    for (let i in metaData) {
      updateData[`specs.${i}`] = metaData[i];
    }
    const product = await Product.findOneAndUpdate(
      { productId },
      { $set: updateData },
      { new: true },
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
        productId,
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
    const { id } = req.params;
    const product = await Product.findOne({ productId: id });
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not Find",
      });
    }
    res.status(200).json({
      success: false,
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
