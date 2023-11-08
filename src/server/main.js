const express = require("express");
const ViteExpress = require("vite-express");
const app = express();
const PORT = 3000;
const cors = require("cors");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

//Use Cors
app.use(
  cors({
    origin: ["http://localhost:3000", "https://voti.onrender.com"],
    methods: ["GET", "POST"],
  })
);

//Parse incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Serve Static Files
app.use(express.static(path.join(__dirname, "..", "dist")));

//Routes
app.use("/api", require("."));
app.use("/auth", require("./auth"));
app.use("/oauth", require("./oauth"))

//websocket
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://voti.onrender.com"],
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  //
  socket.on("new_submission", (data) => {
    io.emit("new_submission", data)
   
  })
  socket.on("new_vote", (data) => {
    io.emit("new_vote", data)
   
  })

  socket.on("disconnect", () => {
    //
  });

});

app.use((req, res, next) => {
  req.app.locals.io = io;
  next();
});




server.listen(PORT, () => {
 
});
ViteExpress.bind(app, server);


app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}\nStack: ${err.stack}`);
  res.status(500).send("Internal server error.");
});

module.exports.io = io;
