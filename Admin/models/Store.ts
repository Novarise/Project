import mongoose, {model, Schema, models} from "mongoose";

const StoreSchema = new Schema({
  name: {type:String, required:true},
  userId: {type:String, required:true},
  billboards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Billboard' }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  properties: { type: mongoose.Schema.Types.ObjectId, ref: 'Properties' },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  activeBillboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Billboard' }

  // billboards      Billboard[] @relation("StoreToBillboard")
  // categories      Category[] @relation("StoreToCategory")
  // products        Product[]  @relation("StoreToProduct")
  // properties      Properties  @relation("StoreToProperties")
  // orders          Order[]     @relation("StoreToOrder")
  // activeBillboard Billboard  @relation("StoreToBillboard")
 
}, {
  timestamps: true,
});

export const Store = models.Store || model('Store', StoreSchema);