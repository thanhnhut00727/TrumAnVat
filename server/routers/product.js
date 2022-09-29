const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const verifyToken = require("../middleware/auth");

router.get("/all", verifyToken, async (req, res) => {
  const products = await Product.find({});
  return res.send({ success: true, products });
});
// @router POST api/product/addList
// @desc Create Product
// access Public
router.post("/addList", verifyToken, async (req, res) => {
  const _products = req.body;
  //user validation
  try {
    if (!_products.length)
      return res.status(400).json({
        success: false,
        message: "Add product failed",
      });
    Product.deleteMany({}, () => {
      _products.forEach(async (product) => {
        const newProduct = new Product({
          ...product,
        });
        await newProduct.save();
      });
    });
    return res.json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Add product failed",
    });
  }
});
// @router POST api/product/add
// @desc Create Product
// access Public
router.post("/add", verifyToken, async (req, res) => {
  const _product = req.body;
  //user validation
  try {
    const newProduct = new Product({
      ..._product,
    });

    // save user to mongo
    await newProduct.save();
    return res.json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Add product failed",
    });
  }
});
// @router POST api/product/add
// @desc Create Product
// access Public

router.post("/delete", verifyToken, async (req, res) => {
  const { _id } = req.body;
  //user validation
  try {
    // check for existing product
    const existingPro = Product.findByIdAndDelete(_id);
    // return access token
    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/update", verifyToken, async (req, res) => {
  const _product = req.body;
  //user validation
  try {
    // check for existing product
    const existingPro = Product.findById(_product._id);

    if (!existingPro) {
      return res
        .status(400)
        .json({ success: false, message: "Product can not font" });
    }

    // save user to mongo
    await existingPro.update(_product);
    // return access token
    return res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ id });
    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });

    return res.send({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
