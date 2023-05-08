import { QUERY_CURRENT_USER } from "../queries";

const DeleteExercise = (cache, { data: { deleteExercise } }) => {
    console.log("++++++==========++++++++++")
    const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });
    //spread the workouts into new temp holding array
    let updatedWorkouts = [...currentUser.workouts];
    //Spread exercises as well so they can be edited
    for (let i = 0; i < updatedWorkouts.length; i++) {
        updatedWorkouts[i] = { ...updatedWorkouts[i], exercises: [...updatedWorkouts[i].exercises] }
    }

    //find indexes to replace
    console.log(deleteExercise);
    let workoutIndexToReplace = updatedWorkouts.findIndex(workout => workout.refId === deleteExercise.workoutId);
    console.log(updatedWorkouts[workoutIndexToReplace])
    let exerciseIndexToReplace = updatedWorkouts[workoutIndexToReplace].exercises.findIndex(exercise => exercise.refId.toString() === deleteExercise.refId);

    //splice exercise out of the workout
    updatedWorkouts[workoutIndexToReplace].exercises.splice(exerciseIndexToReplace, 1);

    cache.writeQuery({
        query: QUERY_CURRENT_USER,
        data: { currentUser: { ...currentUser, workouts: updatedWorkouts } }
    });
    
    console.log(cache.readQuery({ query: QUERY_CURRENT_USER }))

}

export default DeleteExercise