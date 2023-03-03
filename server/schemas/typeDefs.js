const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        workouts: [Workout]
        calender: Calender
    }

    type Workout {
        _id: ID
        name: String
        exercises: [Exercise]
    }

    type Exercise {
        _id: ID
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

        addWorkout(name: String!): User
        deleteWorkout(workoutId: ID!): User
        editWorkout(workoutId: ID!, name:String!): User

        addExercise(workoutId: ID!, name: String!, sets: Int!, reps: Int!, weight: Float!): User
        deleteExercise(workoutId: ID!, exerciseId:ID!): User
        editExercise(workoutId: ID!, exerciseId:ID!, name: String!, sets: Int!, reps: Int!, weight: Float!): User

        editCalender(monday: String!, tuesday:String!, wednesday:String!, thursday: String!, friday: String!, saturday: String!, sunday: String!): User

        addUser(username: String!, password: String!): Auth
        loginUser(username: String!, password: String!): Auth
    }
`

module.exports = typeDefs;