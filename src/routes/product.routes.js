const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth");
const roleMiddleware = require("../middlewares/role.middleware");

// public
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// admin
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  productController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  productController.deleteProduct
);

module.exports = router;
