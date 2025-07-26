const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { router: authRoutes, authenticateJWT } = require("./auth");
const cartRouter = require("./cart");
app.use(authRoutes);
app.use(cartRoutes);

mongoose.connect(
  "mongodb+srv://ankitaanks67:fY8vsuBKjs9Z1Bs4@cluster0.e0a7mlr.mongodb.net/eccommerce",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.get("/proucts", async (req, res) => {
  try {
    const proucts = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "There is internal srver error" });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "the items thst you were searching for does not exist",
      });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
