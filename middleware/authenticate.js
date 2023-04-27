const jwt=require('jsonwebtoken');

const authenticate=(req,res,next)=>{
    const token=req.headers.authorization;
    console.log(token);
try {
    
    if(token){
        const decode=jwt.verify(token,"nikhil");
        const userId=decode.userId
       if(decode){
           req.body.userId=userId;
           next();
       }else{
        res.json({"msg":"Login First"})
       }
    }else{
        res.json({"msg":"Please Login First,token not present"})
    }
} catch (error) {
    console.log(error);
    res.json({"msg":"error while authorization"})
}
}

module.exports={
    authenticate
}