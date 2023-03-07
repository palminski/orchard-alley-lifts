import { useQuery, useMutation } from "@apollo/client";
import {QUERY_CURRENT_USER} from '../utils/queries';
import {useState} from 'react';

const Today = () => {

    //===[Queries]=======================================
    const {loading,data,refetch} = useQuery(QUERY_CURRENT_USER);
    const user = (data?.currentUser)

    const weekdays = ["Sunday","Monday","Tuesday","Wednesday", "Thursday", "Friday", "Saturday"];
    const today = weekdays[new Date().getDay()];
    
    const todayWorkoutId = user.calender[today.toLowerCase()];
    

    const todaysWorkout = user.workouts.find(workout => workout._id === todayWorkoutId);
    


    //===[Function]
    async function incrementWeight() {
        console.log("Hello World");
    }

    return (
        <>
        <h1>{today}'s Workout</h1>

        {
            todaysWorkout ? 
            <>
                <h2>{todaysWorkout.name}</h2>
                {todaysWorkout.exercises.length > 0 ?
                <>
                <ul>
                    {todaysWorkout.exercises.map( exercise => (
                        <li key={exercise._id}>
                            {exercise.name} - {exercise.reps} -{exercise.sets} - {exercise.weight}lbs - <button onClick={() => incrementWeight()}>Increment</button>
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
    );
}

export default Today;