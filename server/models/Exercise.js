const {Schema, model} = require('mongoose');

const exerciseSchema = new Schema(
    {
        workoutId:{
            type: String,
            required: true,
            trim: true
        },
        refId:{
            type: String,
            required: true,
            trim: true,
            unique:true 
        },
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
const Exercise = model('Exercise', exerciseSchema);
module.exports = Exercise;