const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatType: {
    type: String,
  },
  createAt: {
    type: Date,
    select: false,
    default: Date.now,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
