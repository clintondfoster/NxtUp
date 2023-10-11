const express = require("express");
const ViteExpress = require("vite-express");
const app = express();
const PORT = 3000;
const cors = require('cors');

//Use Cors
app.use(cors());


app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

app.get("/sauce", (req, res) => {
  res.send("This class is the sauce");
});


//Routes
app.use("/api", require("./api"));
app.use("./auth", require("./auth"));


ViteExpress.listen(app, PORT, () =>
  console.log("Server is listening on port" +PORT)
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.")
})