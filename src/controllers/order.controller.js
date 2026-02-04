const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentInfo } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await Order.createFromCart({
      userId: req.user.id,
      cart,
      shippingAddress,
      paymentInfo
    });

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product) await product.decreaseStock(item.quantity);
    }

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) { next(error); }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product"
    );

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "email")
      .populate("items.product");

    res.json(orders);
  } catch (error) {
    next(error);
  }
};
