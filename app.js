const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);

mongoose.connect("mongodb://localhost:27017/todolistDB2", {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
  name: String
})


const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todolist"
})

const item2 = new Item({
  name: "Hit the + button to add a new item"
})


const item3 = new Item({
  name: "<-- Hit this to delete and item"
})

const defaultItem = [item1,item2,item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
  })
  const List = mongoose.model("List",listSchema);



app.get("/",function(req,res){
  Item.find({},function(err,foundItem){
      if(foundItem.length === 0){
	Item.insertMany(defaultItem,function(e){
	  if(e){ console.log(e)}
	  else{ console.log("items passed!")} 
	})
	 res.redirect("/");      
      }else{
	 res.render("list",{listTitle: "Today", itemsOutput: foundItem, formPathInsert: "/", formPathDelete: "/delete"});       }
     
    })

})

app.get("/lists/:param",function(req,res){
  const listTitle = req.params.param;


    List.findOne({name: listTitle},function(err,foundList){
       if(err) console.log(err);
       else {
         if(!foundList){
	   const list = new List({
             name: listTitle,
             items: defaultItem	
           }) 
 
	   console.log("List not found");
           list.save();
           res.redirect("/lists/"+ list.name);
	 }else{
           console.log("List found " + defaultItem);
	   res.render("list",{listTitle: foundList.name, itemsOutput: foundList.items, formPathInsert: "/lists/"+foundList.name, formPathDelete: "/lists/"+foundList.name+"/delete"}); 
	 }
       }
     
   })
     
})



app.post("/lists/:param/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  List.findByIdAndRemove(checkedItemId,function(err){
    if(err) console.log(err);
    else console.log("successfully deleted!");
  })
  res.redirect("/lists/"+req.params.param)	
})
app.post("/lists/:param",function(req,res){
    const userPost = new List({
      name: req.body.item
    })
    userPost.save()

    res.redirect("/lists/"+req.params.param);
})


app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(err) console.log(err);
    else console.log("successfully deleted!");
  })
  res.redirect("/")	
})
app.post("/",function(req,res){
    const userPost = new Item({
      name: req.body.item
    })
    userPost.save()

    res.redirect("/");
})

app.get("/about",function(req,res){
  res.render("about")
})

app.listen(3000,function(){
  console.log("Running on port 3000");
})

