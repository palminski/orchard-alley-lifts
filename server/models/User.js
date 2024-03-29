const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');

calenderSchema = require('./Calender');
workoutSchema = require('./Workout');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim:true,
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'You must enter a valid email adress']
        },
        password: {
            type: String,
            required: true,
            minlength:8,
            trim: true
        },
        // workouts:[workoutSchema],
        calender: {
            type: calenderSchema,
            default: {
                

            }
        },
    },

)

UserSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

UserSchema.methods.passwordCheck = async function(password) {
    return bcrypt.compare(password, this.password);
}

const User = model('User', UserSchema);

module.exports = User;