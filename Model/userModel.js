const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "Name is required"]
    },
    email:{
        type:String,
        required:[true, "Email is required"]
    },
    password:{
        type:String,
        required:[true, "Password is required"]
    },
    age:{
        type:Number,
        required:[true, "age is required"]
    }
},{timestamps:true})

const userModel =  mongoose.model("users",userSchema)

module.exports = userModel;