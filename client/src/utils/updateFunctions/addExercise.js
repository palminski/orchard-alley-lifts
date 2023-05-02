import { QUERY_CURRENT_USER } from "../queries";

const AddExercise = (cache, { data: { addExercise } }) => {
    console.log("ADDED EXERCISE===================================");
    const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });

    // spread the workouts into new temp holding array
    let updatedWorkouts = [...currentUser.workouts];
    //Spread exercises as well so they can be edited
    for (let i = 0; i < updatedWorkouts.length; i++) {
        updatedWorkouts[i] = { ...updatedWorkouts[i], exercises: [...updatedWorkouts[i].exercises] }
    }
    //find indexes to replace
    let workoutIndexToReplace = updatedWorkouts.findIndex(workout => workout.refId === addExercise.workoutId);
    //New Exercise
    const newExercise = {
        _id: addExercise._id,
        refId: addExercise.refId,
        name: addExercise.name,
        reps: addExercise.reps,
        sets: addExercise.sets,
        weight: addExercise.weight,
    }
    //push to updated workouts
    updatedWorkouts[workoutIndexToReplace].exercises.push(newExercise)

    console.log(updatedWorkouts);

    //write to cache
    cache.writeQuery({
        query: QUERY_CURRENT_USER,
        data: { currentUser: { ...currentUser, workouts: updatedWorkouts } }
    });
    console.log(cache.readQuery({ query: QUERY_CURRENT_USER }));

    console.log("ADDED EXERCISE===================================");
}

// const addExercise = (cache, { data: { addExercise } }) => {
//     console.log("ADDEXERCISE")
//     const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });
//     // spread the workouts into new temp holding array
//     let updatedWorkouts = [...currentUser.workouts];
//     //Spread exercises as well so they can be edited
//     for (let i = 0; i < updatedWorkouts.length; i++) {
//         updatedWorkouts[i] = { ...updatedWorkouts[i], exercises: [...updatedWorkouts[i].exercises] }
//     }
//     //find indexes to replace
//     let workoutIndexToReplace = updatedWorkouts.findIndex(workout => workout.refId === workoutId);
//     const newExercise = {
//         _id: addExercise._id,
//         refId: addExercise.refId,
//         name: addExercise.name,
//         reps: addExercise.reps,
//         sets: addExercise.sets,
//         weight: addExercise.weight,
//     }
//     updatedWorkouts[workoutIndexToReplace].exercises.push(newExercise)
//     cache.writeQuery({
//                     query: QUERY_CURRENT_USER,
//                     data: { currentUser: { ...currentUser, workouts: updatedWorkouts } }
//                 });

// }
export default AddExercise
// // update(cache, { data: { addExercise } }) {
// //     try {


// //         const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });

// //         //spread the workouts into new temp holding array
// //         let updatedWorkouts = [...currentUser.workouts];
// //         //Spread exercises as well so they can be edited
// //         for (let i = 0; i < updatedWorkouts.length; i++) {
// //             updatedWorkouts[i] = { ...updatedWorkouts[i], exercises: [...updatedWorkouts[i].exercises] }
// //         }

// //         console.log("<><><><><><>")
// //         console.log('these are the workouts of the current user')
// //         console.log(updatedWorkouts);
// //         console.log(`workout Id to search for: ${workoutId}`)
// //         //find indexes to replace
// //         let workoutIndexToReplace = updatedWorkouts.findIndex(workout => workout.refId === workoutId);
// //         console.log(`Workout index to replace: ${workoutIndexToReplace}`);
// //         const newExercise = {
// //             _id: addExercise._id,
// //             refId: addExercise.refId,
// //             name: addExercise.name,
// //             reps: addExercise.reps,
// //             sets: addExercise.sets,
// //             weight: addExercise.weight,
// //         }






// //         updatedWorkouts[workoutIndexToReplace].exercises.push(newExercise)
// //         console.log(updatedWorkouts);
// //         console.log("<><><><><><>")




// //         cache.writeQuery({
// //             query: QUERY_CURRENT_USER,
// //             data: { currentUser: { ...currentUser, workouts: updatedWorkouts } }
// //         });
// //         console.log(currentUser)
// //     }
// //     catch (error) {
// //         setSelectedWorkoutIndex("none");
// //         refetch();
// //         console.log(error);
// //     }
// // }
// // });