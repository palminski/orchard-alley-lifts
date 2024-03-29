import { useQuery, useMutation } from "@apollo/client";
import { QUERY_CURRENT_USER } from '../utils/queries';
import { EDIT_EXERCISE } from "../utils/mutations";
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons'

import gainsIcon from "../images/icons/Will_Design.svg";

const Today = () => {

    //===[Queries]=======================================
    const { loading, data, refetch } = useQuery(QUERY_CURRENT_USER);

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = weekdays[new Date().getDay()];
    const todayWorkoutId = data?.currentUser.calender[today.toLowerCase()];
    const todaysWorkout = data?.currentUser.workouts.find(workout => workout.refId === todayWorkoutId);

    //===[Mutations]=======================================  
    const [editExercise] = useMutation(EDIT_EXERCISE,
        {
            update(cache, { data: { editExercise } }) {

                try {
                    console.log(editExercise)
                    const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });
                    //spread the workouts into new temp holding array
                    let updatedWorkouts = [...currentUser.workouts];
                    //Spread exercises as well so they can be edited
                    for (let i = 0; i < updatedWorkouts.length; i++) {
                        updatedWorkouts[i] = { ...updatedWorkouts[i], exercises: [...updatedWorkouts[i].exercises] }
                    }

                    //find indexes to replace
                    let workoutIndexToReplace = updatedWorkouts.findIndex(workout => workout.refId.toString() === todayWorkoutId.toString());

                    let exerciseIndexToReplace = updatedWorkouts[workoutIndexToReplace].exercises.findIndex(exercise => exercise.refId.toString() === editExercise.refId);

                    //splice exercise out of the workout
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

                }
                catch (error) {
                    console.log(error);
                }
            }
        });



    //===[Function]
    async function incrementWeight(exerciseId, name, sets, reps, weight) {

        try {
            const mutationResponse = editExercise({
                variables: {
                    workoutId: todayWorkoutId,
                    exerciseId: exerciseId,
                    name: name,
                    sets: parseInt(sets),
                    reps: parseInt(reps),
                    weight: (parseFloat(weight) + 5),
                },
                optimisticResponse: {
                    editExercise: {
                        refId: exerciseId,
                        workoutId: todayWorkoutId,
                        __typename: "Exercise",
                        name: name,
                        sets: parseInt(sets),
                        reps: parseInt(reps),
                        weight: parseFloat(weight + 5),
                    }
                }
            });

        }
        catch (error) {
            console.log(error);
        }

    }

    return (
        <>
            <>
                <div className="today-container">
                    <div className="today-exercise-container">
                        <>
                            <h1 className="today-h1">{today}'s Workout</h1>

                            {
                                todaysWorkout ?
                                    <>
                                        <h2>{todaysWorkout.name}</h2>
                                        {todaysWorkout.exercises.length > 0 ?
                                            <>
                                                <ul>
                                                    {todaysWorkout.exercises.map(exercise => (
                                                        <li className="today-li" key={exercise.refId}>
                                                            {exercise.name} - {exercise.reps} reps - {exercise.sets} sets - {exercise.weight}lbs - <button className="hidden-button" onClick={() => incrementWeight(exercise.refId, exercise.name, exercise.sets, exercise.reps, exercise.weight)}><FontAwesomeIcon className="icon-button" icon={faSquarePlus} /></button>

                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                            :
                                            <>
                                                <h2>No Exercises Added Yet!</h2>
                                            </>}
                                    </>
                                    :
                                    <>
                                        <h2>No Workout Scheduled for today!</h2>
                                    </>
                            }
                        </>
                    </div>
                </div>
            </>
            <div className="icon-containter">
                <img src={gainsIcon} className="gains-icon" alt="Master Gains icon" />
            </div>
        </>
    );
}

export default Today;