const { AuthenticationError } = require('apollo-server-express');
const {User, Workout, Exercise} = require('../models');
const {signToken} = require('../utils/auth.js');
const nodemailer = require('nodemailer');
require('dotenv').config();
const db = require('../config/connection');



const resolvers = {
    Query: {
        users: async() => {
            return User.find()
        },
        currentUser: async(parent,args, context) => {
            console.log('Searching for current user');
            if(context.user){
                console.log(`current user ID ${context.user._id}`)
                const userData = await User.findOne({_id: context.user._id});
                console.log(`user data ${userData}`)
                return userData;
            }
            throw new AuthenticationError('Not Logged In');
        },
        
    },
    Mutation: {
        //Workout Mutations--------------------------------------------------------------------------------

        addWorkout: async(parent, {name}, context) => {
            if (context.user) {
                const workout = await Workout.create({userId: context.user._id, name});
                return workout;
            }
            throw new AuthenticationError('Must be logged in to perform this action');
        },
        deleteWorkout:async(parent, {workoutId}, context) => {
            if (context.user) {
                const deletedWorkout = await Workout.deleteOne({_id: workoutId});
                return deletedWorkout;
            }
            throw new AuthenticationError('Must be logged in to perform this action');
        },
        editWorkout:async(parent, {workoutId, name}, context) => {
            if (context.user) {
                

                const updatedWorkout = await Workout.findOneAndUpdate(
                    {_id: workoutId},
                    {name: name}
                );
                return updatedWorkout
                
            }
            throw new AuthenticationError('Must be logged in to perform this action');
        },

        //Excersize Mutations----------------------------------------------------------------------
        addExercise: async(parent, {workoutId, name, reps, sets, weight}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id, "workouts._id":workoutId},
                    {$push: {"workouts.$.exercises": {name:name,  sets:sets, reps:reps, weight:weight}}},
                    {new:true, runValidators:true}
                );
                console.log(updatedUser);
                return updatedUser;
                
            }
            throw new AuthenticationError('Must be logged in to perform this action');
        },
        deleteExercise:async(parent, {workoutId, exerciseId}, context) => {
            if (context.user) {
                console.log(exerciseId);
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id, "workouts._id":workoutId},
                    {$pull: {"workouts.$.exercises": {_id:exerciseId}}},
                    {new:true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('Must be logged in to perform this action');
        },
        editExercise: async(parent, {workoutId, exerciseId, name, reps, sets, weight}, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id);
                const index = user.workouts[user.workouts.findIndex(workout => workout._id.toString() === workoutId)].exercises.findIndex(exercise => exercise._id.toString() === exerciseId);
                const replacer = {_id: exerciseId, name, reps,sets,weight};
                user.workouts[user.workouts.findIndex(workout => workout._id.toString() === workoutId)].exercises.splice(index,1,replacer);
                await user.save();
                return user;
            }
            throw new AuthenticationError('Must be logged in to perform this action');
        },

         //Calender Mutations
         editCalender: async(parent, {monday, tuesday,wednesday,thursday,friday,saturday,sunday }, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id);
                console.log(user.calender);
                console.log(monday);
                user.calender = {_id:user.calender._id,monday:monday,tuesday:tuesday,wednesday:wednesday,thursday:thursday,friday:friday,saturday:saturday,sunday:sunday};
                // console.log(args);
                console.log(user.calender);
                await user.save();
                return user;
            }
        },

        //User Mutations--------------------------------------------------------------------------
        addUser: async (parent, args) => {
            
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        loginUser: async (parent, {username, password}) => {
            const user = await User.findOne({username});
            if (!user) {
                throw new AuthenticationError('User not found');
            }
            const correctPassword = await user.passwordCheck(password);
            if (!correctPassword) {
                throw new AuthenticationError('Password Incorrect');
            }
            const token = signToken(user);
            return{token,user}
        },
        updatePassword: async (parent, {password, newPassword}, context) => {
            const user = await User.findById(context.user._id);
            if (!user) {
                throw new AuthenticationError('User not found');
            }
            const correctPassword = await user.passwordCheck(password);
            if (!correctPassword) {
                throw new AuthenticationError('Password Incorrect');
            }
            
            user.password = newPassword
            await user.save();
            
            const token = signToken(user);
            return{token,user}
        },
        resetPassword: async (parent, {username, email}) => {
            const user = await User.findOne({username});
            //Make sure user is found and email is correct
            if (!user) {
                throw new AuthenticationError('User not found');
            }
            if (user.email !== email) {
                throw new AuthenticationError('Email Incorrect');
            }
            //Create new temp password
            //Note- This is temporary and not super secure. Replace in final version.
            let tempPassword = "TempPass_";
            const alp = "NoOpPqQrRsStTuUvVwWxXyYzZaAbBcCdDeEfFgGhHiIjJkKlLmMn1234567890"
            for (i = 0; i < 10; i++) {
                tempPassword += alp[Math.floor(Math.random() * alp.length)]

            }

            user.password = tempPassword;
            await user.save();

            //Send Email
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_ADRESS,
                    pass: process.env.APP_PASSWORD
                }
            });
            
            let mailOptions = {
                from: process.env.EMAIL_ADRESS,
                to: email,
                subject: "Temporary Password",
                html: `
                <h1>Password Reset!</h1>
                <p>Your Password has been temporarily set to <span style="font-weight: bold; background-color: cornsilk; border-radius: 15px; padding: 5px;">${tempPassword}</span>. Make sure to change it to something more secure next time you log in!</p>
                <p>Thank you for using our app!</P>
                <p>Note that this is an automated response. We can not respond to emails sent to this email adress.</p>
                `
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log("=============================")

                    console.log(error)
                    console.log("=============================")
                }
                else
                {
                    console.log("=============================")

                    console.log("Email Sent! " + info.response);
                    console.log("=============================")
                }
            });

        },

    },
    //Field Resolvers
    User: {
        workouts: async (root) => {
            try{
                return await Workout.find({userId: root._id})
            }
            catch (error) {
                throw new Error(error);
            }
        }
    },
    Workout: {
        exercises: async (root) => {
            try{
                return await Exercise.find({workoutId: root._id})
            }
            catch (error) {
                throw new Error(error);
            }
        }
    }
};

module.exports = resolvers