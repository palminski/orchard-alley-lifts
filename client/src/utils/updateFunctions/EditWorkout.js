import { QUERY_CURRENT_USER } from "../queries";

const EditWorkout = (cache, { data: { editWorkout } }) => {
  
    const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });
    let updatedWorkouts = [...currentUser.workouts]

    let workoutIndexToReplace = updatedWorkouts.findIndex(workout => workout.refId === editWorkout.refId);

    
    updatedWorkouts[workoutIndexToReplace] = { ...updatedWorkouts[workoutIndexToReplace], name: editWorkout.name };

    cache.writeQuery({
        query: QUERY_CURRENT_USER,
        data: { currentUser: { ...currentUser, workouts: updatedWorkouts } }
    });
        console.log("++++++==========++++++++++")
        console.log(cache.readQuery({ query: QUERY_CURRENT_USER }))

}

export default EditWorkout