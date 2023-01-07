const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();


const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

mongoose.set('strictQuery', true);

mongoose.connect(`mongodb+srv://admin-federico:${process.env.PASSWORD}@cluster0.ytf9jji.mongodb.net/todolistDB`,{useNewUrlParser: true});

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
  const listTitle =  _.kebabCase(req.params.list);
  List.findOne({name: listTitle},function(err,foundItem){
    if(err)console.log(err);
    else{
      if(!foundItem){
        const list = new List({
          name: listTitle,
          items: defaultItems
        })
        list.save()
        res.redirect("/lists/"+listTitle)
      }else{
        res.render("list",{listTitle: _.startCase(foundItem.name), itemsOutput: foundItem.items, formPathDelete: "/lists/"+foundItem.name+"/delete", formPathInsert: "/lists/"+foundItem.name});
      }
      
    }
  })

})

app.post("/lists/:list",function(req,res){
  const listTitle =  req.params.list;
  const listNew = req.body.item;
  List.findOne({name: listTitle},function(err,foundItem){
    if(err)console.log(err);
    else{
      const itemNew = new Item({
        name: listNew
      })
      foundItem.items.push(itemNew);
      foundItem.save()
      res.redirect("/lists/"+listTitle)
    }
  })
})

app.post("/lists/:list/delete",function(req,res){
  const listTitle = req.params.list;
  const checkBoxId = req.body.checkbox;
  List.findOneAndUpdate({name: listTitle},{$pull: {items: {_id: checkBoxId}}},function(err,foundItem){
    if(err) console.log(err);
    else{
      res.redirect("/lists/"+listTitle)
    }
  })
})

app.get("/about",function(req,res){
  res.render("about")
})

app.listen(process.env.PORT,function(){
  console.log("Running on port 3000");
})

