import mongoose, { model, Schema, models } from "mongoose";


const PropertySchema = new Schema({
  userId: { type: String, required: true },
  storeId: { type: String, required: true },
  //   store: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Store', 
  //   },
  properties: [
    {
      label: { type: String },
      values: [{
        name: { type: String },
        value: { type: String },
        }]
    },
  ]
}, {
  timestamps: true,
});

export const Property = models.Property || model('Property', PropertySchema);