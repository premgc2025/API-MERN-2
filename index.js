
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment')
require('dotenv').config();
const multer = require('multer')
const path = require('path')

app.use(express.json());
app.use(cors());

app.use("/image", express.static('./image'))

const DBMS_URL = process.env.DBMS_URL;
const PORT = process.env.PORT || 5000;

// importing Model 

const userModel = require('./Model/userModel')
const foodModel = require('./Model/foodsModel')
const verifyToken = require('./Model/verifyToken');
const trackingsModel = require('./Model/trakingsModel');




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

                        try {
                            const registerData = await userModel.create(userData)
                            res.send(registerData)

                        }
                        catch (err) {
                            res.status(500).send(err)
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
        if (userLogin !== null) {
            bcrypt.compare(userData.password, userLogin.password, (err, result) => {

                if (result === true) {
                    jwt.sign({ email: userData.email }, "myLogin", (err, token) => {
                        res.send({ token: token, id: userLogin._id, name: userLogin.name })

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

const storage = multer.diskStorage({
    destination: './image/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + path.extname(file.originalname));
    }
})

const upload = multer({ storage });

app.post('/foods', upload.single('image'), async (req, res) => {
    if (req.file !== undefined && req.body !== undefined) {
        const filename = req.file.filename;
        const { name, calories, protein, carbohydrate, fat, quantity } = req.body;


        if (!filename || !name || !calories || !protein || !carbohydrate || !fat || !quantity) {
            res.status(401).json({ status: 401, Message: "fill all data" })
        }
        else {
            const foodData = new foodModel({
                name: name,
                calories: calories,
                protein: protein,
                carbohydrate: carbohydrate,
                fat: fat,
                imagepath: filename,
                quantity: quantity,
            })


            try {
                const finalData = await foodData.save();
                res.send({ Message: "Created product successful" })

            }
            catch (err) {
                res.status(404).send({ Message: "Foods not found", err })
            }

        }
    }

    else {
        res.status(401).json({ status: 401, Message: "fill all data in form" })
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
        const foodData = await foodModel.find({ name: { $regex: name, $options: 'i' } });

        if (foodData.length !== 0) {
            res.send(foodData)
        }
        else {
            res.status(404).send({ Message: "Foods not found" })
        }


    }
    catch (err) {
        res.status(404).send({ Message: "Foods not found" })
    }
})


// Tracking adding

app.post('/trackings', verifyToken, async (req, res) => {



    const dataTrackings = req.body;

    const date = moment(new Date()).format("YYYY-MM-DD");
    dataTrackings.eatenDate = date
    if (dataTrackings.length !== 0) {

        try {
            const data = await trackingsModel.create(dataTrackings)

            res.send({ Message: "Track Successful" })

        }
        catch (err) {
            res.status(404).send({ Message: "Track item not found" })
        }


    }
    else {
        res.send({ Message: "fill all the data" })
    }



})

// Getting Tracking data from date

app.get('/trackings/:id/:date', verifyToken, async (req, res) => {
    const id = req.params.id;
    const date = req.params.date;

    try {
        const data = await trackingsModel.find({ userId: id, eatenDate: date }).populate('userId').populate('foodId')

        res.send(data)
    }
    catch (err) {
        res.status(404).send({ Message: "Not found track report of today" })
    }

})





// Server Create
app.listen(PORT, () => {
    console.log("Server Up and Running PORT:", PORT)
})
