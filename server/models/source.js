import mongoose from "mongoose";
const {Schema}  = mongoose;


const SourceSchema = new Schema({
  index: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  unique_id: {
    type: String,
    required: true
  },
  
});
export default mongoose.model('SourceDB', SourceSchema);