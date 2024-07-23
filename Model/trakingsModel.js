const mongoose = require('mongoose');

const trackingSchema = mongoose.Schema({
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required:true,
       
    },
    foodId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foods",
        required:true,
       
    },
    details:
    {
        calories:
        {
            type:Number,
            required:true,
        },
        protein:
        {
            type:Number,
            required:true,
        },
        carbohydrate:
        {
            type:Number,
            required:true,
        },
        fat:
        {
            type:Number,
            required:true,
        },
    },
    eatenDate:
    {
        type:String
        
       
    },
    quantity:
    {
        type:Number,
        required:true,
    }
},{timestamps:true})

const trackingsModel = mongoose.model("trackings", trackingSchema);

module.exports = trackingsModel;