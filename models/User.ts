import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  skills: [String],
  resume: String
})

export default mongoose.models.User || mongoose.model("User", UserSchema)