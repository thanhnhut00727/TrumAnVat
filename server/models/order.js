const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  totalPrice: {
    type: Number,
    required: true,
  },
  orderBy: {
    type: String,
  },
  orderFor: {
    type: String,
  },
  products: [
    {
      productName: {
        type: String,
        require: true,
      },
      productType: {
        type: String,
        default: "",
      },
      productCode: String,
      productStatus: String,
      unit: String,
      price: {
        type: Number,
      },
      price1: {
        type: Number,
      },
      price2: {
        type: Number,
      },
      price3: {
        type: Number,
      },
      donvitinh: {
        type: String,
        default: "",
      },
      barcode: {
        type: String,
      },
      mahang: {
        type: String,
      },
      notes: {
        type: String,
      },
      photo: String,
      giahangxa: Number,
      quantityOrder: Number,
      totalPriceOrder: Number,
    },
  ],

  CreateAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Orders", orderSchema);
