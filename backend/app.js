const express = require("express");
const userRouter = require("../backend/src/routes/userRoute");
const chatRouter = require("../backend/src/routes/chatroute");
const messageRouter = require("../backend/src/routes/messageRoute");
const chatMemberRouter = require("../backend/src/routes/chatMemberRoute");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "hello world",
  });
});

app.use("/v1/api/user", userRouter);
app.use("/v1/api/chat", chatRouter);
app.use("/v1/api/message", messageRouter);
app.use("/v1/api/chatMember", chatMemberRouter);
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// global error handler
app.use((error, req, res, next) => {
  res.status(500).json({
    status: "fail",
    message: error.message,
  });
});

module.exports = app;
