//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

require("dotenv").config(); //makes it active and running

const db = require("./db.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",(req,res)=>{
  res.render("home");
})

app.get("/login",(req,res)=>{
  res.render("login");
})

app.get("/register",(req,res)=>{
  res.render("register");
})

app.post("/register",(req,res)=>{
  const userObj = {
    email: req.body.username,
    password: req.body.password };

  db.addUser(userObj)
    .then(newUser=>{
      res.render("secrets")
    }).catch(errors=>{
      console.log(errors);
      res.redirect("/register");  
    });
});

app.post("/login",(req,res)=>{
  const userObj = {
    email: req.body.username,
    password: req.body.password };

  db.loginUser(userObj)
    .then(newUser=>{
      res.render("secrets")
    }).catch(errors=>{
      console.log(errors);
      res.redirect("/login");  
    });
});

startServer();

async function startServer()
{
  await db.connect();
  app.listen(process.env.PORT, ()=>{
      console.log(`Node.js server is running on port ${process.env.PORT}: ${new Date(Date.now())}`);
    });    
}
