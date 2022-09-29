const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const verifyToken = require("../middleware/auth");

// @router POST api/order/add
// @desc Create Order
// access prive
router.post("/create", verifyToken, async (req, res) => {
  const _order = req.body;
  //user validation
  try {
    const newOrder = new Order({
      ..._order,
    });
    // save user to mongo
    await newOrder.save();
    return res.json({
      success: true,
      message: "Order created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Add order failed",
    });
  }
});
// @router POST api/order/delete
// @desc Delete Order
// access prive

router.delete("/:id", verifyToken, async (req, res) => {
  const postDeleteCondition = { _id: req.params.id, user: req.userId };
  //user validation
  try {
    // check for existing order
    const deletedOrder = Order.findByIdAndDelete(postDeleteCondition);
    // return access token
    if (!deletedOrder)
      return res.status(401).json({
        success: false,
        message: "Order not found or user not authorised",
      });
    return res.json({
      success: true,
      order: deletedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// @route GET api/order/id
// @desc Get order by id
// @access Private
router.get("/item/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ id });
    return res.send({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// @route GET api/order/getAll
// @desc Get all order
// @access Private
router.get("/all", verifyToken, async (req, res) => {
  var orders = await Order.find({});
  return res.send({ success: true, orders });
});
module.exports = router;
