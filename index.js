
const express = require('express')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config();

app.use(express.json())
app.use(cors())

const DBMS_URL = process.env.DBMS_URL;
const PORT = process.env.PORT || 5000;

// importing Model 

const userModel = require('./Model/userModel')


// MongoDB Connection
mongoose.connect(`${DBMS_URL}/userlogin`)
.then((res)=>{
    console.log("DataBase is connected successfully")
})
.catch((err)=>{
    console.log(err)
})

// Register User
app.post('/user',(req,res)=>{
    const userinfo = req.body
    console.log(userinfo)

    const saltRounds = 10;

    bcrypt.genSalt(saltRounds,(err,salt)=>{
        if(!err){
            bcrypt.hash(userinfo.password,salt,async(err,phash)=>{
                if(!err){
                    userinfo.password = phash;

                    try{
                        const response = await  userModel.create(userinfo)
                           
                        res.send({Message:"User Created Successful"})
                       }
                       catch(err){
                           res.status(400).send({Message:err.message})
                   
                       }
                      


                }
            })
        }
    })

   
   
})


// Server Create
app.listen(PORT,()=>{
    console.log("Server Up and Running PORT:",PORT)
})
