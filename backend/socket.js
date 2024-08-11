const http = require("http");
const app = require("./app.js");
const socket = require("socket.io");
const { sendMessage } = require("./src/controllers/chatController.js");

const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on(
    "sendMessage",
    async ({ senderId, recipientId, content, chatId }) => {
      try {
        // const message = await sendMessage(
        //   senderId,
        //   recipientId,
        //   content,
        //   chatId
        // );
        // console.log(message);
        console.log(content);
        io.emit("receiveMessage", content);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  );

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);

    console.log(`User joined chat room: ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = io;

module.exports = { io, server };
