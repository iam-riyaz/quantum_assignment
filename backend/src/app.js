const express = require("express");
const connectDb = require("./config/db");
const dotev = require("dotenv");
dotev.config();
const User = require("./schema/userSchema");
const { json } = require("body-parser");
const app = express();
const cors = require ("cors")
app.use(cors())

// const io= require("socket.io")(2000,{cors:{origin:"*"}});

const http = require("http");
const server = http.createServer(app);
// const { Server } = require("socket.io");
const io = require("socket.io")(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 2000;

app.use(json());

app.get("/", async (req, res) => {
  res.send("listening on port 2000");
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  if (users.length == 0) {
    res.status(400).send("user not found");
  } else {
    res.status(200).send(users);
  }
});

app.post("/signup", async (req, res) => {
  const { name, password } = req.body;
  const user = await new User({ name, password });
  user.save();
  res.send(user);
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name: name, password: password });

  if (!user) {
    res.status(404).send("user not found");
  } else {
    res.status(200).send("user logged in successfully");
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
