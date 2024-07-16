
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment')
require('dotenv').config();

app.use(express.json());
app.use(cors());

const DBMS_URL = process.env.DBMS_URL;
const PORT = process.env.PORT || 5000;

// importing Model 

const userModel = require('./Model/userModel')
const foodModel = require('./Model/foodsModel')
const verifyToken = require('./Model/verifyToken');
const trackingModel = require('./Model/trakingsModel');


// MongoDB Connection
mongoose.connect(`${DBMS_URL}/userlogin`)
    .then((res) => {
        console.log("DataBase is connected successfully")
    })
    .catch((err) => {
        console.log(err)
    })



//user Registration

app.post('/register', (req, res) => {

    const userData = req.body;
    if (userData !== null) {
        bcrypt.genSalt(10, (err, salt) => {
            if (!err) {
                bcrypt.hash(userData.password, salt, async (err, phash) => {
                    if (!err) {
                        userData.password = phash;
                        console.log(userData.password)

                        try {
                            const registerData = await userModel.create(userData)
                            res.send(registerData)

                        }
                        catch (err) {
                            res.status(500).send({ Message: "Filed to create user" })
                        }
                    }
                    else {
                        res.status(500).send({ Message: "Failed to hashing password" })

                    }
                })
            }
            else {
                res.status(500).send({ Message: "Failed to create password" })
            }
        })
    }
    else {
        res.status(500).send({ Message: "Filed to create user" })
    }

})

// User Login EndPoint

app.post('/login', async (req, res) => {

    const userData = req.body;

    try {
        const userLogin = await userModel.findOne({ email: userData.email })
        console.log("UserLogin", userLogin)
        if (userLogin !== null) {
            bcrypt.compare(userData.password, userLogin.password, (err, result) => {

                if (result === true) {
                    jwt.sign({ email: userData.email }, "myLogin", (err, token) => {
                        res.send({ token: token })

                    })
                }
                else {
                    res.status(401).send({ Message: "Wrong Password" })
                }

            })
        }
        else {

            res.status(404).send({ Message: "Email is not found" })

        }
    }
    catch (err) {
        res.status(404).send({ Message: "User not found" })
    }
})


// Product item Creation

app.post('/foods', async (req, res) => {

    const foodData = req.body;

    try {
        const data = await foodModel.create(foodData)
        res.send({ Message: "Created product successful" })

    }
    catch (err) {
        res.status(404).send({ Message: "Foods not found" })
    }
})


// Getting Products
app.get('/foods', verifyToken, async (req, res) => {
    try {
        const foodData = await foodModel.find();
        res.send(foodData)

    }
    catch (err) {
        res.status(404).send({ Message: "foods not found" })
    }
})


// Getting only one Product

app.get('/foods/:name', verifyToken, async (req, res) => {

    const name = req.params.name
    try {
        const foodData = await foodModel.find({name:{$regex:name,$options:'i'}});
       
        if(foodData.length!==0)
        {
            res.send(foodData)
        }
        else{
            res.status(404).send({Message:"Foods not found"})
        }
       

    }
    catch (err) {
        res.status(404).send({ Message: "Foods not found" })
    }
})


// Tracking adding

app.post('/trackings',async(req,res)=>{
  

    const dataTrackings = req.body;
    
   const date = moment(new Date()).format("YYYY-MM-DD");
    dataTrackings.eatenDate = date
  
    try{
        const data = await trackingModel.create(dataTrackings)     
       
       res.send({Message:"Added Item"})

    }
    catch(err){
        res.status(404).send({Message:"Tracking item not found"})
    }  
    
})

 // Getting Tracking data from date

 app.get('/trackings/:id/:date',async(req,res)=>{
    const id = req.params.id;
    const date = req.params.date;

    try{
        const data = await trackingModel.find({userId:id,eatenDate:date}).populate('userId').populate('foodId')
     
        res.send(data)
    }
    catch(err){
        res.status(404).send({Message:"Not found track report of today"})
    }

})





// Server Create
app.listen(PORT, () => {
    console.log("Server Up and Running PORT:", PORT)
})
