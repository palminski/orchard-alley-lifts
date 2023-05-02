import { QUERY_CURRENT_USER } from "../queries";

const EditExercise = (cache, { data: { editExercise } }) => {
    console.log("++++++==========++++++++++")
    const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });
    //spread the workouts into new temp holding array
    let updatedWorkouts = [...currentUser.workouts];
    //Spread exercises as well so they can be edited
    for (let i = 0; i < updatedWorkouts.length; i++) {
        updatedWorkouts[i] = { ...updatedWorkouts[i], exercises: [...updatedWorkouts[i].exercises] }
    }

    //find indexes to replace
    console.log(editExercise);
    let workoutIndexToReplace = updatedWorkouts.findIndex(workout => workout.refId === editExercise.workoutId);
    console.log(updatedWorkouts[workoutIndexToReplace])
    let exerciseIndexToReplace = updatedWorkouts[workoutIndexToReplace].exercises.findIndex(exercise => exercise.refId.toString() === editExercise.refId);

    updatedWorkouts[workoutIndexToReplace].exercises[exerciseIndexToReplace] = {
        ...updatedWorkouts[workoutIndexToReplace].exercises[exerciseIndexToReplace],
        name: editExercise.name,
        reps: editExercise.reps,
        sets: editExercise.sets,
        weight: editExercise.weight,
    };

    cache.writeQuery({
        query: QUERY_CURRENT_USER,
        data: { currentUser: { ...currentUser, workouts: updatedWorkouts } }
    });
    
    console.log(cache.readQuery({ query: QUERY_CURRENT_USER }))

}

export default EditExercise