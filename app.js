const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);

mongoose.connect("mongodb://192.168.0.110:27017/todolistDB2",{useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
  name: String
})

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
  name: "<--- Click the check button to deletem an item"
})

const item2 = new Item({
  name: "Add content in the input"
})

const item3 = new Item({
  name: "Add an item clicking the + symbol"
})

const defaultItems = [item1,item2,item3]

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
})

const List = mongoose.model("List",listSchema);



app.get("/",function(req,res){
  Item.find({},function(err,foundItems){
    if(err)console.log(err);
    else{
      if(foundItems.length === 0){
        Item.insertMany(defaultItems,function(err){
          if(err)console.log();
          else console.log("Successfully saved in the collection!");
        })
        res.redirect("/")
      }else{
        console.log(foundItems)
        res.render("list",{listTitle: "Today", itemsOutput: foundItems});
      }
    }
  })
})

app.get("/work",function(req,res){
  res.render("list",{listTitle: "Work List",itemsOutput: ["hi","dont touch that"]});
})

app.post("/",function(req,res){
  
})

app.get("/about",function(req,res){
  res.render("about")
})

app.listen(3000,function(){
  console.log("Running on port 3000");
})

