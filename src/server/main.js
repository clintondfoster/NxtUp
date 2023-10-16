const express = require("express");
const ViteExpress = require("vite-express");
const app = express();
const PORT = 3000;
const cors = require('cors');
const path = require("path");


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


app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

app.get("/sauce", (req, res) => {
  res.send("This class is the sauce");
});


const server = app.listen(PORT, ()=>{
  console.log('Server running on port'+PORT)
})
ViteExpress.bind(app,server)

// ViteExpress.listen(app, PORT, () =>
//   console.log("Server is listening on port" +PORT)
// );

app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}\nStack: ${err.stack}`);
  res.status(500).send("Internal server error.")
})