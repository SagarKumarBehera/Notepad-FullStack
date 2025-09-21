const express = require('express')
const bcrypt = require('bcrypt')
const UserModel = require('../Models/User')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../Config/db')

const userController = express.Router()

//Signup

userController.post('/signup', async (req,res)=>{
    const {name,country,email,password} = req.body;
    if(!name || !country || !email || !password){
        return res.send({msg:'Please fill all the details!!'})
    }
    try {
        const emailexist = await UserModel.findOne({email})
        if(emailexist){
            return res.send({msg:'User Already exist!! Please login'})
        }
        bcrypt.hash(password,5, async (err,hash)=>{
            if(err){
                return res.send({msg:'Something went wrong'})
            }
            try {
                const user = await UserModel.create({
                    name:name,
                    country:country,
                    email:email,
                    password:hash
                })
                res.send({msg:'User Created!!'})
                console.log(user)
            } catch (error) {
                console.log(error)
                res.send({msg:'Something went wrong'})
            }
        })
    } catch (error) {
        console.log(error)
    }
});


//login

userController.post('/login', async (req,res)=>{
    const {email , password} = req.body;
    if(!email || !password){
        return res.send({msg:'Please fill all the details'})
    }
    try {
        const user = await UserModel.findOne({email})
        if(!email){
            return res.send({msg:'Please Signup first!!'})
        }
        bcrypt.compare(password,user.password, function (err,result){
                if(result){
                    const token = jwt.sign({userId: user._id},JWT_SECRET)
                    return res.send({
                        msg: "login succcessful",
                        userData: {
                          token: token,
                          name: user.name,
                        },
                      });
                }
                else{
                    res.send({msg:'Wrong Credentials!!'})
                }
        })
    } catch (error) {
        console.log(error)
        res.send({msg:'Something went wrong'})
    }
});

module.exports = userController