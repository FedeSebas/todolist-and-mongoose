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
        res.render("list",{listTitle: "Today", itemsOutput: foundItems, formPathDelete: "/delete", formPathInsert: "/"});
      }
    }
  })
})

app.post("/",function(req,res){
  const item = req.body.item;
  const itemNew = new Item({
    name: item
  })
  itemNew.save()
  res.redirect("/")
})

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  console.log(checkedItemId)
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(err)console.log(err);
    else console.log("Deleted successfully!")
  })
  res.redirect("/");
})

app.get("/lists/:list",function(req,res){
  const listTitle = req.params.list;
  List.findOne({name: listTitle},function(err,foundItem){
    if(err)console.log(err);
    else{
      if(!foundItem){
        const list = new List({
          naame: listTitle,
          items: defaultItems
        })
        list.save()
        res.redirect("/lists/"+listTitle)
      }else{
        res.render("list",{listTitle: foundItem.name, itemsOutput: foundItem.items, formPathDelete: "/lists/"+listTitle+"/delete", formPathInsert: "/lists/"+listTitle});
      }
      
    }
  })

})

app.post("/lists/:list",function(req,res){
  const listTitle = req.params.list;
  const listNew = req.body.item;
  List.findOne({name: listTitle},function(err,foundItem){
    if(err)console.log(err);
    else{
      
    }
  })
})

app.post("/lists/:list/delete",function(req,res){
  const listTitle = req.params.list;
  const checkBoxId = req.body.checkbox;
  List.findByIdAndDelete({itmes:[{_id: checkBoxId}],function(err){
    if(err)cnsole.log(err);
    else console.log("Succesfully deleted!");
  }})
  res.redirect("/lists/"+listTitle);
})

app.get("/about",function(req,res){
  res.render("about")
})

app.listen(3000,function(){
  console.log("Running on port 3000");
})

