const express=require("express");
const router=express.Router();
const Blog=require("../model/blog");  
const USER=require("../model/user");
const multer=require("multer");
const path=require("path");
const { Console, profile } = require("console");
const Comment = require("../model/comment");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,path.resolve(`./public/uploads`))
  },
  filename: function (req, file, cb) {
   const fileName=`${Date.now()}-${file.originalname}`
   cb(null,fileName);
  }
})

const upload = multer({ storage: storage })
router.get("/add-new",(req,res)=>{
  
    return res.render("addblog",{user:req.user});
});
router.post("/comment/:blogId",async(req,res)=>{

const comment= await Comment.create({
  content:req.body.content,
  blogId:req.params.blogId,
  createdBy:req.user._id,

})
return res.redirect(`/blog/${req.params.blogId}`);
})
router.get("/:id",async(req,res)=>{
   
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    const comment=await Comment.find({blogId:req.params.id}).populate("createdBy");
    const admin=blog.createdBy._id;

    return res.render("blog",{user:req.user,blog,comment,admin});


});
router.get("/delete/:id",async(req,res)=>{
  const blog=await Blog.findByIdAndDelete(req.params.id);

  return res.redirect("/");
});

router.get("/edit/:id",async(req,res)=>{
  const blog=await Blog.findById(req.params.id);
  console.log(blog);
  return res.render("editblog",{user:req.user,blog});
  
});

router.post("/",upload.single("coverImage"),async(req,res)=>{
   const{title,body}=req.body;
   const blog=await Blog.create({
    body,
    title,
    createdBy:req.user._id,
    coverImageURL:`/uploads/${req.file.filename}`,


   })
   return res.redirect("/");
});
router.post("/update-dp", upload.single("dp"), async (req, res) => {
  
  try {
    if (!req.file) {
  console.log("No file uploaded");
  return res.redirect("/dashboard");
}

    const dpPath = "/uploads/" + req.file.filename; // URL for EJS
    console.log(dpPath);
    console.log(req.user);

    // Update user document
    await USER.findByIdAndUpdate(req.user._id, { profileImageURL: dpPath });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    
    res.redirect("/");
  }
});

module.exports=router;