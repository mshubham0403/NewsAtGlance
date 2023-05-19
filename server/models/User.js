import mongoose from "mongoose"
const {Schema }= mongoose

// Create Schema
const UserSchema = new Schema({
  first_name: {
    type: String,
    required:true
  },
  last_name: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  suscribed:[{
      type:String,
  }],
  bookmarked:[{
      type:mongoose.SchemaTypes.ObjectId,
      ref:"Article"
  }],
  date: {
    type: Date,
    default: Date.now
  }
})
export default mongoose.model('UserDB', UserSchema)