import {gql} from '@apollo/client';

export const LOGIN_USER = gql`
mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      user {
        username
        _id
      }
      token
    }
  }
`

export const ADD_USER = gql`
mutation AddUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
  user {
    username
  }
  token
  }
}
`
export const UPDATE_PASSWORD = gql`
mutation UpdatePassword($password: String!, $newPassword: String!) {
  updatePassword(password: $password, newPassword: $newPassword) {
  token  
  }
}
`

export const RESET_PASSWORD = gql`
mutation ResetPassword($username: String!, $email: String!) {
  resetPassword(username: $username, email: $email) {
  username  
  }
}
`

export const ADD_WORKOUT = gql`
mutation AddWorkout($name: String!) {
  addWorkout(name: $name) {
    userId
    name
    _id
  }
}
`

export const ADD_EXERCISE = gql`
mutation AddExercise($workoutId: ID!, $name: String!, $sets: Int!, $reps: Int!, $weight: Float!) {
  addExercise(workoutId: $workoutId, name: $name, sets: $sets, reps: $reps, weight: $weight) {
    _id
    workoutId
    name
    reps
    sets
    weight  
  }
}
`

export const EDIT_WORKOUT = gql`
mutation EditWorkout($workoutId: ID!, $name: String!) {
  editWorkout(workoutId: $workoutId, name: $name) {
    username
    workouts{
      _id
      name
      exercises{
        _id
        name
        reps
        sets
        weight
      }
    }
  }
}
`

export const EDIT_EXERCISE = gql`
mutation EditExercise($workoutId: ID!, $exerciseId: ID!, $name: String!, $sets: Int!, $reps: Int!, $weight: Float!) {
  editExercise(workoutId: $workoutId, exerciseId: $exerciseId, name: $name, sets: $sets, reps: $reps, weight: $weight) {
    username
    workouts{
      _id
      name
      exercises{
        _id
        name
        reps
        sets
        weight
      }
    }
  }
}
`

export const EDIT_CALENDER = gql`
mutation EditCalender($monday: String!, $tuesday: String!, $wednesday: String!, $thursday: String!, $friday: String!, $saturday: String!, $sunday: String!) {
  editCalender(monday: $monday, tuesday: $tuesday, wednesday: $wednesday, thursday: $thursday, friday: $friday, saturday: $saturday, sunday: $sunday) {
    username
    calender {
      _id
      monday
      tuesday
      wednesday
      thursday
      friday
      saturday
      sunday
    }
  }
}
`

export const DELETE_EXERCISE = gql`
mutation DeleteExercise($exerciseId: ID!) {
  deleteExercise(exerciseId: $exerciseId) {
    _id
  }
}
`
export const DELETE_WORKOUT = gql`
mutation DeleteWorkout($workoutId: ID!) {
  deleteWorkout(workoutId: $workoutId) {
    _id
  }
}
`