const {Schema, model} = require('mongoose');
const exerciseSchema = require('./Exercise.js')

const workoutSchema = new Schema(
    {
        userId :{
            type: String,
            required: true,
            trim: true,
            
        },
        name: {
            type: String,
            required: true,
            trim: true,
            
        },
        // exercises: [exerciseSchema],

    }
)

const Workout = model('Workout', workoutSchema);

module.exports = Workout;