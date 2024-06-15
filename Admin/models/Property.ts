import mongoose, { model, Schema, models } from "mongoose";

// Define the Property schema with necessary fields and references
const PropertySchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  storeId: {
    type: String,
    required: true,
  },
  // If the store reference is needed in the future, uncomment the following:
  // store: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Store',
  // },
  properties: [
    {
      label: {
        type: String,
        required: true,
      },
      values: [
        {
          name: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
}, {
  timestamps: true,
});

// Export the Property model, creating it if it doesn't already exist
export const Property = models.Property || model('Property', PropertySchema);
