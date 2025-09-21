require('dotenv').config()
const path=require("path");
const express=require("express");
const mongoose=require("mongoose");
const cookieparser=require("cookie-parser");
const blogRoute=require("./route/blog")
const userRoute=require("./route/user");
const heroRoute=require("./route/hero");
const { checkforAuthcookie } = require("./middleware/auth");
const Blog = require("./model/blog");
const app=express();
const port=process.env.PORT||5000;
mongoose.connect(process.env.MONGO_URL).then((e)=>console.log("mongoDB connected"));
app.set("view engine","ejs");
app.set("views",path.resolve("./view"));
app.use(express.static(path.resolve("./public")));
app.use(express.urlencoded({extended:false}));
app.use(cookieparser());
app.use(checkforAuthcookie("token"));
app.use("/user",userRoute);
app.use("/blog",blogRoute);
app.use("/hero",heroRoute);
app.get("/",async(req,res)=>{
    const allBlogs=await Blog.find({});
    res.render("home",{user:req.user,blog:allBlogs});
})
app.listen(port,()=>console.log(`Server is started at Port:${port}`));