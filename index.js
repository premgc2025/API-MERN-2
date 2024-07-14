
const express = require('express')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();

app.use(express.json())
app.use(cors())

const DBMS_URL = process.env.DBMS_URL;
const PORT = process.env.PORT || 5000;

// importing Model 

const userModel = require('./Model/userModel')


// MongoDB Connection
mongoose.connect(`${DBMS_URL}/userlogin`)
    .then((res) => {
        console.log("DataBase is connected successfully")
    })
    .catch((err) => {
        console.log(err)
    })

// Register User
app.post('/register', (req, res) => {
    const userinfo = req.body
    console.log(userinfo)

    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (!err) {
            bcrypt.hash(userinfo.password, salt, async (err, phash) => {
                if (!err) {
                    userinfo.password = phash;

                    try {
                        const response = await userModel.create(userinfo)

                        res.send({ Message: "User Created Successful" })
                    }
                    catch (err) {
                        res.status(400).send({ Message: err.message })

                    }
                }
            })
        }
    })
})

// Login User

app.post('/login',(req,res)=>{
    console.log(req.body)
    const userData = req.body
   

    userModel.findOne({email:userData.email})
    .then((response)=>{
        if(response!==null)
        {
            bcrypt.compare(userData.password, response.password,(err,result)=>{
                if(result===true)
                {

                    jwt.sign({email:userData.email},"mylogin",(err,token)=>{
                        if(!err)
                        {
                            res.send({token:token})
                            console.log(token)
                          
                        }
                        else{
                            res.status(500).send({Message:"Some Problem with token, try again"})
                        }

                    })
                   
                  
                }
                else{
                    res.status(401).send({Message: "Password is wrong"})
        
                   }

            })
           
        }
        else{
            res.status(400).send({Message: "Email is wrong ,  not found email"})
        }

        
       
    })
    .catch((err)=>{
        res.send({Message:err})
    })
})


// get EndPoint

app.get('/users',verifytoken,(req,res)=>{

    userModel.find()
    .then((userData)=>{
        res.send({Message:"User all Data",userData})
    })
    .catch((err)=>{
        res.status(404).send({Message:"Not found User Data "})
    })

    
})

// Getting only one data

app.get('/users/:id',(req,res)=>{

    const userId = req.params.id


    userModel.findOne({_id:userId})
    .then((userData)=>{
        res.send({Message:"Single Data",userData})
    })
    .catch((err)=>{
       res.status(404).send({message:"Not found Data user",error:err.message})
    })
    


})

// Middleware for verify Token

function verifytoken(req,res,next){

   const token = req.headers.authorization.split(" ")[1];
   jwt.verify(token,"mylogin",(err,data)=>{
    if(!err){
       
        next()
    }
    else{
        res.status(401).send({Message:"Invalid Token, login again"})
    }
   })
    
}

// Server Create
app.listen(PORT, () => {
    console.log("Server Up and Running PORT:", PORT)
})
