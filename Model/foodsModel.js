const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    name:
    {
        type: String,
        required: [true, "Required Product Name"]
    },
    calories:
    {
        type: Number,
        required: [true, "Required calories quantity"]
    },
   
    protein:
    {
        type: Number,
        required: [true, "Required protine quantity"]
    },
  
    carbohydrate:
    {
        type: Number,
        required: [true, "Required carbohydrate quantity"]
    },
    fat:
    {
        type: Number,
        required: [true, "Required fat quantity"]
    },
    imagepath:
    {
        type: String,
        required: [true, "Required imagepath quantity"]
    },
    quantity:
    {
        type: Number,
        required: [true, "Required  quantity"]
    },
},{timestamps:true})

const foodModel = mongoose.model("foods", foodSchema);

module.exports = foodModel;