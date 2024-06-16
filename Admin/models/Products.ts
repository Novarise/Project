import mongoose, { model, Schema, models } from "mongoose";

// Define a schema for dynamic properties with strict mode disabled
const dynamicPropertiesSchema = new Schema({}, { strict: false });

// Define the Product schema with necessary fields and references
const ProductSchema = new Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  detail: [{
    price: {
      type: Number,
      required: true
    },
    inStock: {
      type: Number,
      required: true
    },
    dynamicProperties: dynamicPropertiesSchema,
  }],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  images: [String],
}, {
  timestamps: true,
});

// Export the Product model, creating it if it doesn't already exist
export const Product = models.Product || model('Product', ProductSchema);
