import { useQuery, useMutation } from "@apollo/client";
import {QUERY_CURRENT_USER} from '../utils/queries';
import { DELETE_EXERCISE, DELETE_WORKOUT } from "../utils/mutations";
import {useState} from 'react';

import AddWorkoutForm from "../components/AddWorkoutForm";
import AddExerciseForm from "../components/AddExerciseForm";

const Workouts = () => {
    
    
    //===[States]=============================================
    const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState("none")
    const [mode,setMode] = useState("select");
    const [exerciseForm, setExerciseForm] = useState({name:"",reps:0,sets:0,weight:0});

    //===[Queries]=============================================
    const {loading,data,refetch} = useQuery(QUERY_CURRENT_USER);
    const user = (data?.currentUser)

    //===[Mutations]=============================================
    const [deleteExercise] = useMutation(DELETE_EXERCISE);
    const [deleteWorkout] = useMutation(DELETE_WORKOUT);

    //===[Functions]=============================================
    const handleSelectChange = (e) => {
        console.log(e.target.value);
        if (e.target.value === "none") {
            setSelectedWorkoutIndex("none");
        }
        else {
            let workoutIndex = user.workouts.findIndex(workout => workout._id === e.target.value);
            setSelectedWorkoutIndex(workoutIndex);
        }
    }

    async function handleDeleteWorkout(workoutId){
        setSelectedWorkoutIndex("none");
        try {
            const mutationResponse = await deleteWorkout({
                variables: {
                    workoutId: workoutId,
                }
            });
            refetch();
        }
        catch (error) {
            console.log(error);
        }
    }

    async function handleDeleteExercise(workoutId, exerciseId){
        try {
            const mutationResponse = await deleteExercise({
                variables: {
                    workoutId: workoutId,
                    exerciseId: exerciseId,
                }
            });
            refetch();
        }
        catch (error) {
            console.log(error);
        }
    }

    //===[Return]=============================================
    return (
        <>
            <h1>Workouts</h1>
            {
                loading ?
                    <>
                        <h2>Loading...</h2>
                    </>
                    :
                    <>
                        {user.workouts.length ?
                            <>
                                {mode === "select" ?
                                    <>
                                        <button onClick={() => setMode("add")}>New Workout</button>
                                        <br></br>
                                        <label htmlFor="workouts">Select a Workout: </label>
                                        <select name="workouts" onChange={handleSelectChange}>
                                            <option value="none"></option>
                                            {user.workouts && user.workouts.map(workout => (
                                                <option key={workout._id} value={workout._id}>{workout.name}</option>
                                            ))}
                                        </select>
                                        <hr></hr>
                                        {selectedWorkoutIndex !== "none" ?
                                            <>
                                                <h3>{user.workouts[selectedWorkoutIndex].name} - <button onClick={() => {handleDeleteWorkout(user.workouts[selectedWorkoutIndex]._id)}}>Delete Workout</button></h3>

                                                {user.workouts[selectedWorkoutIndex].exercises &&
                                                    <ul>
                                                        {user.workouts[selectedWorkoutIndex].exercises.map(exercise => (
                                                            <li key={exercise._id}>
                                                                <p >{exercise.name} - {exercise.reps} x {exercise.sets} - {exercise.weight}lbs</p>
                                                                <button onClick={()=>{handleDeleteExercise(user.workouts[selectedWorkoutIndex]._id,exercise._id)}}>Delete</button>
                                                            </li>

                                                        ))}
                                                    </ul>
                                                }
                                                <AddExerciseForm workoutId={user.workouts[selectedWorkoutIndex]._id}></AddExerciseForm>
                                            </>
                                            :
                                            <>
                                                <h3>Select a workout above!</h3>
                                            </>
                                        }
                                    </>
                                    :
                                    <>
                                    <button onClick={() => setMode("select")}>Select a Workout</button>
                                    <AddWorkoutForm></AddWorkoutForm>
                                    </>
                                }
                            </>
                            :
                            <>
                            <h2>Add your first workout!</h2>
                            <AddWorkoutForm></AddWorkoutForm>
                            </>
                        }
                    </>
            }
        </>
    );
}

export default Workouts;