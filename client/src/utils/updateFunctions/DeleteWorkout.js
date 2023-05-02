import { QUERY_CURRENT_USER } from "../queries";

const DeleteWorkout = (cache, { data: { deleteWorkout } }) => {
  
    const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });
    let updatedWorkouts = [...currentUser.workouts]

    let workoutIndexToReplace = updatedWorkouts.findIndex(workout => workout.refId === deleteWorkout.refId);

    updatedWorkouts.splice(workoutIndexToReplace, 1);

    cache.writeQuery({
        query: QUERY_CURRENT_USER,
        data: { currentUser: { ...currentUser, workouts: updatedWorkouts } }
    });
        console.log("++++++==========++++++++++")
        console.log(cache.readQuery({ query: QUERY_CURRENT_USER }))

}

export default DeleteWorkout