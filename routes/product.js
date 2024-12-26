const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload")
const Product = require("../models/Product");
const { verifyTokenAndAdmin, verifyToken } = require("../middleware/auth");
const dotenv = require("dotenv");
dotenv.config({ path: "../config/config.env" });

// @ route GET api/products
// @ desc  Get all products
// @ access Private
router.get("/", async (req, res) => {
  const queryNew = req.query.new;
  const queryCollections = req.query.collection;
  try {
    let products;
    if (queryNew) {
      products = await Product.find().sort({ _id: -1 }).limit(5);
    }
    if (queryCollections) {
      products = await Product.find({ company: { $in: [queryCollections] } });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @ route GET api/products
// @ desc  Get product
// @ access Private
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "product doesn't exist" });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/products
// @desc Create new product
// @access Private
router.post(
  "/",
  verifyTokenAndAdmin,
  upload.array("img", 4), // Xử lý upload ảnh
  async (req, res, next) => {
    try {
      // Parse các trường JSON từ form-data
      if (req.body.categories) {
        req.body.categories = JSON.parse(req.body.categories);
      }
      if (req.body.size) {
        req.body.size = JSON.parse(req.body.size);
      }

      next(); // Chuyển sang middleware tiếp theo
    } catch (err) {
      return res.status(400).json({ errors: [{ msg: "Invalid JSON format in categories or size" }] });
    }
  },
  body("company", "Please enter a company name").not().isEmpty(),
  body("title", "Please enter a title").not().isEmpty(),
  body("desc", "Please enter a description").not().isEmpty(),
  body("price", "Please enter a price").isFloat({ gt: 0 }),
  body("discountPrice", "Please enter a discountPrice").isFloat({ gt: 0 }),
  body("alt", "Please enter a alt").not().isEmpty(),
  body("categories", "Please enter categories").isArray().notEmpty(),
  body("categories.*.color", "Please specify colors").isArray().notEmpty(),
  body("categories.*.gender", "Please specify gender").isArray().notEmpty(),
  body("size", "Please enter sizes").isArray().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Xử lý lưu sản phẩm
      let imgUrls = [];
      if (req.files) {
        imgUrls = req.files.map((file) => file.path); // Lấy đường dẫn các ảnh
      }

      const productData = {
        company: req.body.company,
        title: req.body.title,
        desc: req.body.desc,
        img: imgUrls,
        price: req.body.price,
        discountPrice: req.body.discountPrice,
        alt: req.body.alt,
        categories: req.body.categories,
        size: req.body.size,
      };

      const product = new Product(productData);
      const newProduct = await product.save();
      res.status(201).json(newProduct);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);




// @ route    PUT api/product
// @desc      Update product
// @ access   Private
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "product doesn't exist" });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @ route    DELETE api/auth
// @ desc     Delete product
// @ access   Private
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(400).json({ msg: "product doesn't exist" });
    res.status(200).json({ msg: "Product is successfully deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "product doesn't exist" });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
