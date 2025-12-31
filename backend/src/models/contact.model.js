const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
   OwnerOfAccount: {          // new field for storing creator's name
    type: String,
    required: true
  },
});

module.exports = mongoose.model("Contact", contactSchema);
