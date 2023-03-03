const {Schema} = require('mongoose');

const exerciseSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },
        reps:{
            type: Number,
            required:true,
        },
        sets:{
            type: Number,
            required:true,
        },
        weight:{
            type: Number,
            required:true,
        }
    }
)
module.exports = exerciseSchema;