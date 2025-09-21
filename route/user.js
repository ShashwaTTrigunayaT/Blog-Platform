const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const BLOG=require("../model/blog");
const USER=require("../model/user");
router.get("/signin",(req,res)=>{
    return res.render("signin");
})
router.get("/signup",(req,res)=>{
    return res.render("signup");
})
router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})
router.get("/profile",async (req,res)=>{
    const blog= await BLOG.find({createdBy:req.user._id});
    

    const user= await USER.findById(req.user._id);


    return res.render("dashboard",{user,blog});
})
router.post("/update-dp",async(req,res)=>{
    
})
router.post("/signup",async (req,res)=>{
    
    const{fullName,email,password}=req.body;
    
    
    await USER.create({
        fullName,
        email,
        password,
    })
    return res.redirect("/");
})
router.post("/signin", async(req,res)=>{

    const{fullName,email,password}=req.body;
    try {
        const token=await USER.matchPassword(email,password);
        
        return res.cookie("token",token).redirect("/");
    
    } catch (error) {
       return res.render("signin",{error:"Incorrect email or password"}) 
    }
    
})
module.exports=router;
