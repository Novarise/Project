import mongoose from "mongoose";
const { Schema, model, models, Types } = mongoose;

// Define OrderItemSchema
const OrderItemSchema = new Schema({
  _id: {
    type: String,
    default: () => new Types.ObjectId().toString(),
  },
  orderId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  detailId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Define OrderSchema
const OrderSchema = new Schema({
  _id: {
    type: String,
    default: () => new Types.ObjectId().toString(),
  },
  storeId: {
    type: String,
    required: true,
  },
  orderItems: [OrderItemSchema],
  isPaid: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

// Export models
export const OrderItem = models.OrderItem || model('OrderItem', OrderItemSchema);
export const Order = models.Order || model('Order', OrderSchema);
