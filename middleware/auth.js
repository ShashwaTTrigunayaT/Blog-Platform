const { validateUsertoken } = require("../service/auth");

function checkforAuthcookie(cookieName) {
   return (req,res,next)=>{
    const cookietokenValue=req.cookies[cookieName];
    if(!cookietokenValue) return next();
    try {
        const userPayload=validateUsertoken(cookietokenValue);
        req.user=userPayload;
    } catch (error) {}
       return next(); 
   } 
}
module.exports={
    checkforAuthcookie,
}