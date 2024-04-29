import mongoose, {model, Schema, models} from "mongoose";

const CategorySchema = new Schema({
  billboardId: {type:String, required:true},

  storeId: {type:String, required:true},
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store', 
  },
  billboard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Billboard', 
  },
  name: {type:String, required:true},
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
  }],
 
}, {
  timestamps: true,
});

export const Category = models.Category || model('Category', CategorySchema);

