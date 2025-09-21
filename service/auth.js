const jwt=require("jsonwebtoken");
const secret="RavanaSHURA";
function createTokenforUser(user) {
    const payload={
        _id:user._id,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role,


    }
    const token=jwt.sign(payload,secret);
    return token;
}
function validateUsertoken(token) {
    const payload=jwt.verify(token,secret);
    return payload;
}
module.exports={
   createTokenforUser,
   validateUsertoken, 
}