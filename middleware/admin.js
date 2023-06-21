const jwt=require("jsonwebtoken")

const admin= (req,res,next)=>{
    const token=req.header("x-auth-token");
    if(!token){
        return res.status(400).send("Access denied! no token provided");
    }
     jwt.verify(token,process.env.JWT_PRIVATE_KEY,(error,validToken)=>{
        if(error){
            res.status(400).send({message:"Invalid Token"});
        }
        else{
            if(!validToken.isAdmin){
                return res.status(403).send({message:"You don't have access to this content"})
            }
            req.client=validToken;
            next();
        }
     })
}
module.exports=admin
