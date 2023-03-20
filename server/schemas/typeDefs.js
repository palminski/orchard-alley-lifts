const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        workouts: [Workout]
        calender: Calender
    }

    type Workout {
        _id: ID
        id: ID
        userId: String
        name: String
        exercises: [Exercise]
    }

    type Exercise {
        _id: ID
        workoutId: String
        name: String
        sets: Int
        reps: Int
        weight: Float
    }

    type Calender {
        _id: ID
        monday: String
        tuesday: String
        wednesday: String
        thursday: String
        friday: String
        saturday: String
        sunday: String

    }

    type Auth {
        token: ID
        user: User
    }


    type Query {
        users: [User]
        currentUser: User
    }


    type Mutation {

        addWorkout(name: String!): Workout
        deleteWorkout(workoutId: ID!): Workout
        editWorkout(workoutId: ID!, name:String!): Workout

        addExercise(workoutId: ID!, name: String!, sets: Int!, reps: Int!, weight: Float!): Exercise
        deleteExercise(exerciseId:ID!): Exercise
        editExercise(exerciseId:ID!, name: String!, sets: Int!, reps: Int!, weight: Float!): Exercise

        editCalender(monday: String!, tuesday:String!, wednesday:String!, thursday: String!, friday: String!, saturday: String!, sunday: String!): User

        addUser(username: String!, email: String!, password: String!): Auth
        loginUser(username: String!, password: String!): Auth
        updatePassword(password: String!, newPassword: String!): Auth
        resetPassword(username: String!, email: String!): User


    }
`

module.exports = typeDefs;