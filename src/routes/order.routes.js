const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth");
const roleMiddleware = require("../middlewares/role.middleware");

router.use(authMiddleware);

// user
router.post("/", orderController.createOrder);
router.get("/my", orderController.getMyOrders);

// admin
router.get(
  "/",
  roleMiddleware("admin"),
  orderController.getAllOrders
);

module.exports = router;
