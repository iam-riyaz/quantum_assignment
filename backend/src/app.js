const express = require("express");
const connectDb = require("./config/db");
const dotev = require("dotenv");
dotev.config();
const User = require("./schema/userSchema");
const { json } = require("body-parser");
const app = express();
const cors = require("cors");
app.use(cors());
const tokenVerifier = require("./tokenVerifier");

// const io= require("socket.io")(2000,{cors:{origin:"*"}});

const http = require("http");
const generateJwtToken  = require("./generateToken");
const server = http.createServer(app);
// const { Server } = require("socket.io");
const io = require("socket.io")(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 2000;

app.use(json());

app.get("/", async (req, res) => {
  res.send("listening on port 2000");
});

app.get("/sendMessage", tokenVerifier, async (req, res) => {
  const users = await User.find();
  if (users.length == 0) {
    res.status(400).send("user not found");
  } else {
    res.status(200).send(`now you are authenticated as username: ${users[0].username}, now you can send messages`); 
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const user = await new User({ username, password });
  user.save();
  res.send(user);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username, password: password });
  if (!user) {
    res.status(404).send("user not found");
  } else {
    const token = generateJwtToken(user);
    res.status(200).send({
      success: true,
      status: 200,
      message: "Login Successfully",
      data: { user, token },
    });
  }
});


connectDb().then(() => {
  server.listen(PORT, () => {
    console.log("listening on port 2000");
  });
});
// socket connection-------------------

const users = {};

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("check", (name) => {
    // console.log(name)
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("sendMessage", (message) => {
    socket.broadcast.emit("sendMsg", message);
  });
});
