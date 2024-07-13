
const express = require('express')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();


const DBMS_URL = process.env.DBMS_URL;
const PORT = process.env.PORT || 5000;


mongoose.connect(`${DBMS_URL}/userlogin`)
.then((res)=>{
    console.log("DataBase is connected successfully")
})
.catch((err)=>{
    console.log(err)
})



app.listen(PORT,()=>{
    console.log("Server Up and Running PORT:",PORT)
})
