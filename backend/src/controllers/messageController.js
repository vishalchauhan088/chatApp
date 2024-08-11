const Chat = require("../models/chatModel");
const User = require("../models/userModel");

async function findOrCreateChat(user1Id, user2Id) {
  // Check if a direct chat already exists between the two users
  let chat = await Chat.findOne({
    chat_type: "direct",
    "members.user_id": { $all: [user1Id, user2Id] },
  });

  if (!chat) {
    // Create a new chat if it doesn't exist
    chat = new Chat({
      chat_type: "direct",
      members: [{ user_id: user1Id }, { user_id: user2Id }],
    });
    await chat.save();
  }

  return chat;
}
