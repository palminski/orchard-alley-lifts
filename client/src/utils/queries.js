import { gql } from '@apollo/client';

export const QUERY_ALL_USERS = gql`
query Users {
    users {
    username
    _id 
    }
  }
`

export const QUERY_CURRENT_USER = gql`
query CurrentUser {
    currentUser {
      username
      workouts{
        refId
        _id
        name
        exercises{
          _id
          refId
          name
          reps
          sets
          weight
        }
      }
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
      _id
    }
  }
`