const Chat = require("../models/chatModel.js");
const Message = require("../models/messageModel.js");
const mongoose = require("mongoose");

exports.findOrCreateChat = async (user1Id, user2Id) => {
  // check if chat exits for user1id and user2Id // direct chat between two

  let chat = await Chat.findOne({
    chatType: "direct",
    members: { $all: [user1Id, user2Id] },
  });
  if (!chat) {
    chat = await Chat.create({
      chatType: "direct",
      members: [{ user1Id }, { user2Id }],
    });
  }

  return chat;
};
exports.sendMessage = async (senderId, recipientId, content, chatId = null) => {
  let chat;
  if (chatId) {
    chat = Chat.findById(chatId);
    if (!chat) {
      throw new Error("Something went wrong");
    }
  } else {
    chat = await findOrCreateChat(senderId, recipientId);
  }

  // now create and save message
  const message = Message.create({
    chatId: chat._id,
    senderId: senderId,
    content: content,
  });

  return message;
};

exports.createChat = async (req, res, next) => {
  const user1 = req.body.user1;
  const user2 = req.body.user2;
  try {
    const chat = await Chat.create({
      chatType: "direct",
      members: [user1, user2],
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      status: "fail",
      message: "couldn't create chat",
    });
  }
};
exports.getAllChat = async (req, res, next) => {
  try {
    const chats = await Chat.find();
    res.status(200).json({
      status: "success",
      data: {
        chats,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        chat,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
