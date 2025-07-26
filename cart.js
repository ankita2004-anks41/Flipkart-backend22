const mongoose = require("mongoose");
const express = require("express");
const { errorMonitor } = require("events");
const router = express.Router();

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    userId: String,
    items: [
      {
        productId: String,
        quantity: Number,
      },
    ],
  })
);

router.post("/cart/add", async (req, res) => {
  try {
    const { productId, quantity = 1, user } = req.body;

    if (!productId || !user) {
      return res.status(400).json({ message: "productIdan user is required" });
    }

    let cart = await Cart.findOne({ useerId: user, status: "active" });

    if (!cart) {
      cart = new Cart({ userId: user, items: [], status: "active" });
    }

    const existingItemsIndex = cart.items.findIndex(
      (items) => items.productId === productId
    );

    if (existingItemsIndex > -1) {
      cart.items[existingItemsIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({
        productId,
        quantity: parseInt(quantity),
      });
    }
    cart.updateAt = new Date();
    await cart.save();
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error,items has not neen added" });
  }
});

router.get("/cart", async (req, res) => {
  try {
    const carts = await Cart.find({});

    res.status(200).json({
      success: true,
      count: carts.length,
      data: carts,
    });
  } catch (error) {
    console.log("Error fetching the cart", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data",
      error: error.message,
    });
  }
});

//delete route
// router.delete("/cart/:id",async(req,res)=>{

// })

module.exports = router;
