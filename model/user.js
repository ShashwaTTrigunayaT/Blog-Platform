const {Schema,model}=require("mongoose");
const{createHmac,randomBytes}=require("crypto");
const { timeStamp, error } = require("console");
const { createTokenforUser } = require("../service/auth");
const userSchema=new Schema({
    fullName:{
       type:String,
       required:true,
    },
    email:{
       type:String,
       required:true,
       unique:true,
    },
    salt:{
       type:String,
       
    },
    password:{
       type:String,
       required:true,
    },
    profileImageURL:{
       type:String,
       default:"/images/default.jpg",
    },
    role:{
       type:String,
       enum:["Admin","user"],
       default:"user",
    },
},{timestamps:true})
userSchema.pre("save",function(next){
   const user=this;
   if(!user.isModified("password")) return next();
   const salt=randomBytes(16).toString("hex");
   const hashpass=createHmac("sha256",salt)
   .update(user.password)
   .digest("hex");
   this.salt=salt,
   this.password=hashpass;
   next();

})
userSchema.static("matchPassword",async function(email,password){
   const user=await this.findOne({email});
   if(!user) {
      throw new Error("User is not found!");
   }
   const salt=user.salt;
   const hashpass=user.password;
   const userhashpass=createHmac("sha256",salt)
   .update(password)
   .digest("hex");
   if(hashpass!==userhashpass) throw new Error("Incorrect Password!");
   const token=createTokenforUser(user);
   return (token);
   //return {...user._doc,password:undefined,salt:undefined};

})

const user=model("user",userSchema);
module.exports=user;