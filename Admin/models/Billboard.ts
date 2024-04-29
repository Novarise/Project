import mongoose, {model, Schema, models} from "mongoose";
import { boolean } from "zod";

const BillboardSchema = new Schema({
  userId: {type:String, required:true},

  storeId: {type:String, required:true},
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store', 
  },
  label: {type:String, required:true},
  imageUrl: {type:String, required:true},
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
  }],
  active_billboard: {type: Boolean, required: true}
}, {
  timestamps: true,
});

export const Billboard = models.Billboard || model('Billboard', BillboardSchema);
