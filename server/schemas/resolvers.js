const { AuthenticationError } = require('apollo-server-express');
const {User} = require('../models');
const {signToken} = require('../utils/auth.js');

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
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$push: {workouts: {name:name}}},
                    {new:true, runValidators:true}
                );
                console.log(updatedUser)
                return updatedUser;
            }
            throw new AuthenticationError('Must be logged in to perform this action');
        },
        deleteWorkout:async(parent, {workoutId}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {workouts: {_id:workoutId}}},
                    {new:true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('Must be logged in to perform this action');
        },
        editWorkout:async(parent, {workoutId, name}, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id);
                const index = user.workouts.findIndex(workout => workout._id.toString() === workoutId);
                const exercises = user.workouts[index].exercises;
                const editedWorkout = {_id: workoutId, name, exercises};
                user.workouts.splice(index, 1, editedWorkout);
                await user.save();
                return user;
                
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
        }
    }
};

module.exports = resolvers