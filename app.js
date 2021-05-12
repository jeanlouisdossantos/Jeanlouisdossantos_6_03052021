const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const productrouter = require("./router/products")

const result = require('dotenv').config()
console.log(result.parsed)
const app = express();

mongoose
  .connect(
    process.env.DB_HOST,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(bodyparser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


app.use('/api/products', productrouter)



// app.use('/test/:id/:name' , (req,res)=>{
//   console.log(req.params)
//   res.json({message : "test 2"})
//   });

// app.use((req,res)=>{
//     res.json({message : "test ok"})
// });

module.exports = app;
