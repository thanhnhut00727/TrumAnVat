require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ServerApiVersion } = require("mongodb");
const authUser = require("./routers/auth");
const product = require("./routers/product");
const order = require("./routers//order");

const app = express();
const connectDB = async () => {
  try {
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.r8gat50.mongodb.net/?retryWrites=true&w=majority`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authUser);
app.use("/api/product", product);
app.use("/api/order", order);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
