const jwt=require("jsonwebtoken")

const auth= (req,res,next)=>{
    const token=req.header("x-auth-token");
    if(!token){
        return res.status(400).send("Access denied! no token provided");
    }
     jwt.verify(token,process.env.JWT_PRIVATE_KEY,(error,validToken)=>{
        if(error){
            res.status(400).send({message:"Invalid Token"});
        }
        else{
            req.user=validToken
            next()
        }
     })
}

module.exports=auth