const mongoose = require("mongoose");
const imageSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  quantity: { type: Number, default: 1 },
  fileUrl: { type: String, required: true },
});

module.exports = mongoose.model("image", imageSchema);
