const { server } = require("./socket.js");
const connectDB = require("./db.js");
const cors = require("cors");

require("dotenv").config();

const port = process.env.PORT || 8000;

connectDB();

server.listen(port, () => {
  console.log(`Server started at PORT : ${port}`);
});
