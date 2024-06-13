const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    default: null,
    required: true,
  },
  username: {
    type: String,
    default: null,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    default: null,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    default: null,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  submissions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Submission", default: [] },
  ],
  photo: {
    type: String,
    default: null
},
  token: {
    type: String,
    default: "",
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("user", userSchema);
