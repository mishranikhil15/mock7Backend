const express= require("express");

const {UserModel}=require("../models/usermodel");
const{ authenticate}=require("../middleware/authenticate")

const jwt=require('jsonwebtoken');

const fs=require("fs");

const bcrypt=require('bcrypt');


const userrouter=express.Router();

userrouter.post("/register",async(req,res)=>{
    const {name,email,password,bio,phone,picture}=req.body;
    let find_email= await UserModel.find({email:email});
    if(find_email!=0){
        return res.json({"msg":"Email Already Exists"})
    }

    try {
        bcrypt.hash(password,4,async(err,secure_password)=> {
            if(err){
                console.log(err);
            }else{
                let data= new UserModel({name,email,password:secure_password,bio,phone,picture});
                await data.save();
                res.status(201).json({"msg":"User Registered"})
            }
        });
    } catch (error) {
        res.send({"msg":"Error in registering the user"})
        console.log(error)
    }
})


userrouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    

   try {
    const find_email= await UserModel.find({email:email});
    console.log(find_email)
    const hashed_password= find_email[0].password;
    console.log(hashed_password);
    if(find_email.length>0){
        bcrypt.compare(password, hashed_password,(err, result)=> {
            if(result){
                const token = jwt.sign({userId:find_email[0]._id }, 'nikhil');
                
                res.json({"msg":"user successfully logged In","token":token,"userId":find_email[0]._id})
            }else {
                res.json({"msg":"wrong credentials"})
            }
        });
    }else{
        res.json({"msg":"wrong email address"})
    }
   } catch (error) {
    res.send({"msg":"Error in logging the user"})
    console.log(error)
   }
})

userrouter.get("/getProfile/:id",async(req,res)=>{
    const id = req.params.id;
    try {
        let data=await UserModel.find({_id:id});
        res.json(data);
    } catch (error) {
        res.json({"msg":"Error in finding the user data"})
    }
})

userrouter.patch("/edit/:id",authenticate,async(req,res)=>{
   const payload=req.body;
   const id=req.params.id;
   const user_data=await UserModel.findOne({_id:id});
   const database_user_id=user_data._id;
   const logged_in_user_id=req.body.userId;
//    console.log(database_user_id,logged_in_user_id)
   try {
     if(database_user_id==logged_in_user_id){
        await UserModel.findByIdAndUpdate({"_id":id},payload)
        res.json({"msg":"Data Updated Successfully"})
     }else{
        res.json({"msg":"You are not authorized"})
     }
   } catch (error) {
    console.log(error);
    res.json({"msg":"Somethin went wrong"})
   }
})

userrouter.get("/logout",(req,res)=>{
    const token=req.headers.authorization;
    const blacklist=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
    blacklist.push(token);
    fs.writeFileSync("./blacklist.json",JSON.stringify(blacklist));
    res.json({"msg":"Logged out successfully"})
})

module.exports={
    userrouter
}

// {
//     "name":"dev",
//     "email":"dev@gmail.com",
//     "password":"gunajn",
//     "bio":"I am groot",
//     "phone":"6282485857",
//     "picture":"https://via.placeholder.com/350x250"
//   }