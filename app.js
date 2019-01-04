var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/BlogApp', { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var blogSchema  = new mongoose.Schema({
    title: String,
    image: String,
    body : String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "first blog",
//     image: "https://images.unsplash.com/photo-1546539782-6fc531453083?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
//     body: "This is my first blog"
// });

//RESTful routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});
//index route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error");
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

//new route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//create route
app.post("/blogs", function(req, res){
   //create blog
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new");
       }else{
              //then redirect to index
           res.redirect("/blogs");
       }
   });
});

//show route
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           //console.log(err);
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started.");
});