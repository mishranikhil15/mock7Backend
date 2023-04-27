const express = require("express");
const { Connection } = require("./config/db");
const{userrouter}=require("./routes/userroute")
const cors=require('cors')
const app = express();
app.use(cors({
    origin:"*"
}))
require("dotenv").config();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcomw");
});
app.use("/users",userrouter)

app.listen(process.env.port, async () => {
  try {
    await Connection;
    console.log("Connected to Database");
  } catch (error) {
    console.log("Trouble while connecting to Database");
    console.log(error);
  }
  console.log(`Server is running on ${process.env.port}`)
});
