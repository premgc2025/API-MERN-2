const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    name:
    {
        type: String,
        required: [true, "Required Product Name"]
    },
    protine:
    {
        type: Number,
        required: [true, "Required protine quantity"]
    }
},{timestamps:true})

const foodModel = mongoose.model("foods", foodSchema);

module.exports = foodModel;