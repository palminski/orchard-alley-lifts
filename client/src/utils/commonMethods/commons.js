export const findSelectedWorkIndex = (user,workoutid) =>{
    return user.workouts.findIndex(workout => workout._id === workoutid)
}