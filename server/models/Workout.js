const {Schema} = require('mongoose');
const exerciseSchema = require('./Exercise.js')

const workoutSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            
        },
        exercises: [exerciseSchema],

    }
)

module.exports = workoutSchema;