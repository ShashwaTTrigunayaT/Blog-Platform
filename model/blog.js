const {Schema,model}=require("mongoose");
const userSchema=new Schema({
    title:{
       type:String,
       required:true,
    },
    body:{
       type:String,
       required:true,
    },
    coverImageURL:{
       type:String,
       
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
    }
    
},{timestamps:true})
const blog=model("blog",userSchema);
module.exports=blog;
