const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collections: "users" } // you can use users to specified the collection instead of userSchema
);
// converting schema to model
const model = mongoose.model("userSchema", userSchema);
module.exports = model;
