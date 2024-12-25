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
  upload.array('img', 4),  // Sử dụng middleware upload để xử lý ảnh (nhiều ảnh)
  body("company", "Please enter a company name").not().isEmpty(),
  body("title", "Please enter a title").not().isEmpty(),
  body("desc", "Please enter a description").not().isEmpty(),
  body("price", "Please enter a price").isFloat({ gt: 0 }),
  body("discountPrice", "Please enter a discountPrice").isFloat({ gt: 0 }),
  body("alt", "Please enter a alt").not().isEmpty(),
  body("categories", "Please enter categories").isArray().not().isEmpty(),
  body("categories.*.color", "Please specify colors").isArray().not().isEmpty(),
  body("categories.*.gender", "Please specify gender").isArray().not().isEmpty(),
  body("size", "Please enter sizes").isArray().not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Kiểm tra xem có ảnh không
      let imgUrls = [];
      if (req.files) {
        imgUrls = req.files.map(file => file.path);  // Lấy đường dẫn các ảnh vừa tải lên
      }

      // Tạo sản phẩm mới
      const productData = {
        company: req.body.company,
        title: req.body.title,
        desc: req.body.desc,
        img: imgUrls,  // Lưu đường dẫn ảnh vào cơ sở dữ liệu
        price: req.body.price,
        discountPrice: req.body.discountPrice,
        alt: req.body.alt,
        categories: req.body.categories,  // Lưu thông tin về categories, color, gender
        size: req.body.size,  // Lưu các size
      };

      let product = new Product(productData);

      let newProduct = await product.save();

      res.status(201).json(newProduct);  // Trả về sản phẩm vừa tạo
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
