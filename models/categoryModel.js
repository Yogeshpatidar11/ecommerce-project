import mongoose from "mongoose";
import slugify from "slugify";
const cateegorySchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});
export default mongoose.model("Category", cateegorySchema);
