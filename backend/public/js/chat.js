const socket = io("http://127.0.0.1:8000"); // Ensure this matches your server URL

// Handle message sending
document
  .getElementById("sendMessageForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const chatId = document.getElementById("chatId").value;
    const content = document.getElementById("messageContent").value;

    console.log(content);
    socket.emit("joinChat", { chatId });
    socket.emit("sendMessage", { chatId, content });
    document.getElementById("messageContent").value = "";
  });

// Handle receiving messages
socket.on("receiveMessage", (message) => {
  console.log(message);
  const messagesContainer = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.textContent = `${message.sender_id}: ${message.content}`;
  messagesContainer.appendChild(messageElement);
});
