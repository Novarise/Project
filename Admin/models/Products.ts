import mongoose, {model, Schema, models} from "mongoose";
const dynamicPropertiesSchema = new mongoose.Schema({}, { strict: false });

  const ProductSchema = new Schema({
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store'
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    name: String,
    detail: [{
      price: Number,
      in_stock: Number,
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
    images: [String]
  },{
        timestamps: true,
      });

  export const Product = models.Product || model('Product', ProductSchema);

