const express = require("express");
const ViteExpress = require("vite-express");
const app = express();
const PORT = 3000;
const cors = require("cors");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

//Use Cors
app.use(cors());

//Parse incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Serve Static Files
app.use(express.static(path.join(__dirname, "..", "dist")));

//Routes
app.use("/api", require("."));
app.use("/auth", require("./auth"));

//websocket
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);
  socket.on("new_submission", (data) => {
    io.emit("new_submission", data)
    console.log(data)
  })

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
  });

});

app.use((req, res, next) => {
  req.app.locals.io = io;
  next();
});




server.listen(PORT, () => {
  console.log("Server running on port" + PORT);
});
ViteExpress.bind(app, server);

// ViteExpress.listen(app, PORT, () =>
//   console.log("Server is listening on port" +PORT)
// );

app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}\nStack: ${err.stack}`);
  res.status(500).send("Internal server error.");
});

module.exports.io = io;
