import { useQuery, useMutation } from "@apollo/client";
import {QUERY_CURRENT_USER} from '../utils/queries';
import {EDIT_EXERCISE} from "../utils/mutations";
import {useState} from 'react';

const Today = () => {

    //===[Queries]=======================================
    const {loading,data,refetch} = useQuery(QUERY_CURRENT_USER);
    
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday", "Thursday", "Friday", "Saturday"];
    const today = weekdays[new Date().getDay()];
    const todayWorkoutId = data?.currentUser.calender[today.toLowerCase()];
    const todaysWorkout = data?.currentUser.workouts.find(workout => workout._id === todayWorkoutId);

    //===[Mutations]=======================================  
    const [editExercise] = useMutation(EDIT_EXERCISE);
    


    //===[Function]
    async function incrementWeight(exerciseId,name,sets,reps,weight) {
        console.log("Hello World");

        try {
            const mutationResponse = await editExercise({
                variables: {
                    workoutId: todayWorkoutId,
                    exerciseId: exerciseId,
                    name: name,
                    sets: parseInt(sets),
                    reps: parseInt(reps),
                    weight: (parseFloat(weight) + 2.5),
                }
            });
            refetch();
        }
        catch (error) {
            console.log(error);
        }

    }

    return (
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
                    {todaysWorkout.exercises.map( exercise => (
                        <li key={exercise._id}>
                            {exercise.name} - {exercise.reps} -{exercise.sets} - {exercise.weight}lbs - <button onClick={() => incrementWeight(exercise._id,exercise.name,exercise.sets,exercise.reps,exercise.weight)}>Increment</button>
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
    );
}

export default Today;