import mongoose, {model, Schema, models} from "mongoose";

const UserSchema = new Schema({
  name: {type:String, required:true},
  email: {type:String, required:true, unique:true},
  password: {type: String, required: true},
  role: {type: String, default:"Admin"},
 
//   category: {type:mongoose.Types.ObjectId, ref:'Category'},
}, {
  timestamps: true,
});

export const User = models.User || model('User', UserSchema);