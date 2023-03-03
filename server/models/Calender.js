const {Schema} = require('mongoose');
const workoutSchema = require('./Workout.js')

const calenderSchema = new Schema(
    {
        monday: {
            type: String,
            default:"none",
            unique: false,
        },
        tuesday: {
            type: String,
            default:"none",
            unique: false,
        },
        wednesday: {
            type: String,
            default:"none",
            unique: false,
        },
        thursday: {
            type: String,
            default:"none",
            unique: false,
        },
        friday: {
            type: String,
            default:"none",
            unique: false,
        },
        saturday: {
            type: String,
            default:"none",
            unique: false,
        },
        sunday: {
            type: String,
            default:"none",
            unique: false,
        },
    }
)

module.exports = calenderSchema;