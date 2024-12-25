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
router.get("/",  async (req, res) => {
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
  upload.single('img'),  // Sử dụng middleware upload để xử lý ảnh
  body("company", "Please enter a company name").not().isEmpty(),
  body("title", "Please enter a title").not().isEmpty(),
  body("desc", "Please enter a description").not().isEmpty(),
  body("price", "Please enter a price").not().isEmpty(),
  body("discountPrice", "Please enter a discountPrice").not().isEmpty(),
  body("alt", "Please enter a alt").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Kiểm tra xem có ảnh không
      let imgUrl = "";
      if (req.file) {
        imgUrl = req.file.path;  // Lấy đường dẫn tới file ảnh vừa tải lên
      }

      // Tạo sản phẩm mới
      const productData = {
        company: req.body.company,
        title: req.body.title,
        desc: req.body.desc,
        img: imgUrl,  // Lưu đường dẫn ảnh vào cơ sở dữ liệu
        price: req.body.price,
        discountPrice: req.body.discountPrice,
        alt: req.body.alt
      };

      let product = new Product(productData);

      let newProduct = await product.save();

      res.status(200).json(newProduct);
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
