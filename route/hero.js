const express=require("express");
const router=express.Router();
router.get("/",(req,res)=>{
    return res.render("hero");
});
module.exports=router;
