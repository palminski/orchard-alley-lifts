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
mutation AddUser($username: String!, $password: String!) {
  addUser(username: $username, password: $password) {
  user {
    username
  }
  token
  }
}
`

export const ADD_WORKOUT = gql`
mutation AddWorkout($name: String!) {
  addWorkout(name: $name) {
  username
  workouts {
    name
  }  
  }
}
`

export const ADD_EXERCISE = gql`
mutation AddExercise($workoutId: ID!, $name: String!, $sets: Int!, $reps: Int!, $weight: Float!) {
  addExercise(workoutId: $workoutId, name: $name, sets: $sets, reps: $reps, weight: $weight) {
    username
    workouts {
      name
      exercises {
        name
      }
   }
  }
}
`
export const DELETE_EXERCISE = gql`
mutation DeleteExercise($workoutId: ID!, $exerciseId: ID!) {
  deleteExercise(workoutId: $workoutId, exerciseId: $exerciseId) {
    username
    workouts {
      name
      exercises {
        name
      }
   }
  }
}
`
export const DELETE_WORKOUT = gql`
mutation DeleteWorkout($workoutId: ID!) {
  deleteWorkout(workoutId: $workoutId) {
    username
    workouts {
      name
   }
  }
}
`