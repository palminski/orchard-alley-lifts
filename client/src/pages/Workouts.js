//===[Imports]================================================
//react and apollo
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_CURRENT_USER } from '../utils/queries';
import { DELETE_EXERCISE, DELETE_WORKOUT, EDIT_EXERCISE, EDIT_WORKOUT } from "../utils/mutations";
import { useState } from 'react';

//components
import AddWorkoutForm from "../components/AddWorkoutForm";
import AddExerciseForm from "../components/AddExerciseForm";
//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan, faFloppyDisk, } from '@fortawesome/free-solid-svg-icons'


const Workouts = () => {

    //===[States]=============================================
    const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState("none")
    const [mode, setMode] = useState("select");
    const [currentlyEditing, setCurrentlyEditing] = useState('none');
    const [exerciseEditState, setExerciseEditState] = useState({
        exerciseName: "",
        sets: 0,
        reps: 0,
        weight: 0
    });
    const [workoutEditState, setWorkoutEditState] = useState({
        workoutName: "",
    });

    //===[Queries]=============================================
    const { loading, data, refetch } = useQuery(QUERY_CURRENT_USER);
    const user = (data?.currentUser)

    //===[Mutations]=============================================
    const [deleteExercise] = useMutation(DELETE_EXERCISE, {
        update(cache, {data: {deleteExercise}}) {
            try {
                const {currentUser} = cache.readQuery({query: QUERY_CURRENT_USER});
                cache.writeQuery({
                    query: QUERY_CURRENT_USER,
                    data: {currentUser: {...currentUser, workouts: deleteExercise.workouts}}
                });
                console.log("test")
            }
            catch (error) {
                console.log(error);
            }
        },
        
          
        
    });

    const [deleteWorkout] = useMutation(DELETE_WORKOUT, {
        update(cache, {data: {deleteWorkout}}) {
            try {
                const {currentUser} = cache.readQuery({query: QUERY_CURRENT_USER});
                cache.writeQuery({
                    query: QUERY_CURRENT_USER,
                    data: {currentUser: {...currentUser, workouts: deleteWorkout.workouts}}
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    });

    const [editExercise] = useMutation(EDIT_EXERCISE, {
        update(cache, {data: {editExercise}}) {
            try {
                const {currentUser} = cache.readQuery({query: QUERY_CURRENT_USER});
                cache.writeQuery({
                    query: QUERY_CURRENT_USER,
                    data: {currentUser: {...currentUser, workouts: editExercise.workouts}}
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    });
    const [editWorkout] = useMutation(EDIT_WORKOUT, {
        update(cache, {data: {editWorkout}}) {
            try {
                const {currentUser} = cache.readQuery({query: QUERY_CURRENT_USER});
                cache.writeQuery({
                    query: QUERY_CURRENT_USER,
                    data: {currentUser: {...currentUser, workouts: editWorkout.workouts}}
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    });

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

    async function handleDeleteWorkout(workoutId) {
        setSelectedWorkoutIndex("none");
        try {
            const mutationResponse = await deleteWorkout({
                variables: {
                    workoutId: workoutId,
                }
            });
            
        }
        catch (error) {
            console.log(error);
        }
    }

    async function handleDeleteExercise(workoutId, exerciseId) {
        try {
            let optimisticWorkouts = [...user.workouts];
            for (let i = 0; i < optimisticWorkouts.length; i++) {
                optimisticWorkouts[i] = {...optimisticWorkouts[i],exercises:[...optimisticWorkouts[i].exercises]}
            }
            console.log('===================')
            console.log(optimisticWorkouts)
            console.log('===================')
            let workoutIndexToReplace = optimisticWorkouts.findIndex(workout => workout._id.toString() === workoutId);
            let exerciseIndexToReplace = optimisticWorkouts[workoutIndexToReplace].exercises.findIndex(exercise => exercise._id.toString() === exerciseId);

            console.log(workoutIndexToReplace);
            console.log(exerciseIndexToReplace);

            
            console.log('===================')
            console.log(optimisticWorkouts[workoutIndexToReplace].exercises)
            optimisticWorkouts[workoutIndexToReplace].exercises.splice(exerciseIndexToReplace,1);
            console.log(optimisticWorkouts[workoutIndexToReplace].exercises)
            console.log('===================')


            // optimisticWorkouts.map(workout => {
            //     console.log(workout);
            //     if (workout._id.toString() === workoutId) {
            //         let indexToDelete = workout.exercises.findIndex(exercise => exercise._id.toString() === exerciseId);
            //         console.log(indexToDelete);
            //         console.log(workout.exercises[indexToDelete]);
            //         workout.exercises.splice(indexToDelete,1);
            //     }
            //     console.log(workout);
            //     return workout
            //   })

            const mutationResponse = await deleteExercise({
                variables: {
                    workoutId: workoutId,
                    exerciseId: exerciseId,
                },
                optimisticResponse:{
            
                    deleteExercise: {
                      username: user.username,
                      workouts: optimisticWorkouts
                    }
                  }
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleWorkoutFormChange = (event) => {
        const { name, value } = event.target;
        setWorkoutEditState({
            ...workoutEditState,
            [name]: value
        });
    };

    async function handleWorkoutFormSubmit(event) {
        event.preventDefault();
        try {
            const mutationResponse = await editWorkout({
                variables: {
                    workoutId: user.workouts[selectedWorkoutIndex]._id,
                    name: workoutEditState.workoutName,
                }
            });
        }
        catch (error) {
            console.log(error);
        }
        setCurrentlyEditing('none');
    }

    const handleExerciseFormChange = (event) => {
        const { name, value } = event.target;
        setExerciseEditState({
            ...exerciseEditState,
            [name]: value
        });
    };

    async function handleExerciseFormSubmit(event) {
        event.preventDefault();
        console.log(exerciseEditState);
        try {
            const mutationResponse = await editExercise({
                variables: {
                    workoutId: user.workouts[selectedWorkoutIndex]._id,
                    exerciseId: currentlyEditing,
                    name: exerciseEditState.exerciseName,
                    sets: parseInt(exerciseEditState.sets),
                    reps: parseInt(exerciseEditState.reps),
                    weight: parseFloat(exerciseEditState.weight),
                }
            });
        }
        catch (error) {
            console.log(error);
        }
        setCurrentlyEditing('none');
    };

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
                    <div className="workout-container">
                        {user.workouts.length ?
                        //If the user has some workouts associated witht their account
                            <>
                                {mode === "select" ?
                                    //Toggle Tabs at top of form
                                    <>
                                        <button className="current-tab">Edit Workouts</button>
                                        <button className="swap-tab" onClick={() => setMode("add")}>New Workout</button>
                                        <br></br>
                                        <div className="select-workout-form">
                                            {currentlyEditing !== "title" ?
                                                // Not Editing Title
                                                // Drop down list for choosing a workout to edit
                                                <>
                                                    <label htmlFor="workouts">Selected Workout: </label>
                                                    <br></br>
                                                    <select className="selected-workout" name="workouts" onChange={handleSelectChange} value={user.workouts[selectedWorkoutIndex]?._id}>
                                                        <option value="none"></option>
                                                        {user.workouts && user.workouts.map(workout => (
                                                            <option key={workout._id} value={workout._id}>{workout.name}</option>
                                                        ))}
                                                    </select>
                                                    {selectedWorkoutIndex !== "none" &&
                                                        <>
                                                            <FontAwesomeIcon className="icon-button" icon={faPenToSquare} onClick={() => {
                                                                setCurrentlyEditing('title');
                                                                setWorkoutEditState({
                                                                    workoutName: user.workouts[selectedWorkoutIndex].name,
                                                                })
                                                            }} />
                                                            <FontAwesomeIcon className="icon-button icon-button-danger" icon={faTrashCan} onClick={() => { handleDeleteWorkout(user.workouts[selectedWorkoutIndex]._id) }} />
                                                        </>}
                                                </>
                                                // Currently Editing Title
                                                //form to change workout name
                                                :
                                                <>
                                                    <form onSubmit={handleWorkoutFormSubmit}>
                                                        <label htmlFor="workoutName">Workout Name: </label>
                                                        <br></br>
                                                        <input autoFocus="true" className="title-edit" name="workoutName" type="text" id="workoutName" onFocus={(e) => e.target.select()} onChange={handleWorkoutFormChange} value={workoutEditState.workoutName} />
                                                        <button className="hidden-button"> <FontAwesomeIcon className="icon-button" icon={faFloppyDisk} /></button>

                                                    </form>
                                                </>}
                                        </div>
                                        {selectedWorkoutIndex !== "none" ?
                                        //If there is a workout that has been selected
                                        //List of exercises contained in that workout
                                            <>
                                                {user.workouts[selectedWorkoutIndex].exercises.length > 0 &&
                                                    <ul>
                                                        {user.workouts[selectedWorkoutIndex].exercises.map(exercise => (
                                                            <li className="exercise-li" key={exercise._id}>
                                                                {currentlyEditing === exercise._id ?
                                                                    // If currently editing this exercise
                                                                    //li becomes a form where values can be changed
                                                                    <form className="edit-exercise-form" onSubmit={handleExerciseFormSubmit}>
                                                                        <label htmlFor="exerciseName"><span className="exercise-name">Exercise Name: </span></label>
                                                                        <input name="exerciseName" type="text" id="exerciseName" onChange={handleExerciseFormChange} value={exerciseEditState.exerciseName} />

                                                                        <label htmlFor="reps">Reps: </label>
                                                                        <input className="small-number-input" name="reps" type="number" step={1} id="reps" onChange={handleExerciseFormChange} value={exerciseEditState.reps} />

                                                                        <label htmlFor="sets">Sets: </label>
                                                                        <input className="small-number-input" name="sets" type="number" step={1} id="sets" onChange={handleExerciseFormChange} value={exerciseEditState.sets} />

                                                                        <label htmlFor="weight">Weight: </label>
                                                                        <input className="large-number-input" name="weight" type="number" step={2.5} id="weight" onChange={handleExerciseFormChange} value={exerciseEditState.weight} />

                                                                        <button className="hidden-button"> <FontAwesomeIcon className="icon-button" icon={faFloppyDisk} /></button>
                                                                    </form>
                                                                    :
                                                                    // Otherwise
                                                                    //Display the information regarding this exercise
                                                                    <>
                                                                        <p > <span className="exercise-name exercise-info">{exercise.name}</span> - <span className="exercise-info">{exercise.reps} x {exercise.sets}</span> - <span className="exercise-info">{exercise.weight}lbs</span>

                                                                            <FontAwesomeIcon className="icon-button" icon={faPenToSquare} onClick={() => {
                                                                                setExerciseEditState({
                                                                                    exerciseName: exercise.name,
                                                                                    sets: exercise.sets,
                                                                                    reps: exercise.reps,
                                                                                    weight: exercise.weight
                                                                                });
                                                                                setCurrentlyEditing(exercise._id)
                                                                            }} />
                                                                            <FontAwesomeIcon className="icon-button icon-button-danger" icon={faTrashCan} onClick={() => { handleDeleteExercise(user.workouts[selectedWorkoutIndex]._id, exercise._id) }} />
                                                                        </p>
                                                                    </>
                                                                }
                                                            </li>
                                                        ))}
                                                    </ul>
                                                }
                                                {/* //Form at bottom where exercises are added */}
                                                <div className="add-exercise-section">
                                                    <h3>Add {user.workouts[selectedWorkoutIndex].exercises.length > 0 ? "more exercises" : "your fisrt exercise"} to this workout here</h3>
                                                    <AddExerciseForm workoutId={user.workouts[selectedWorkoutIndex]._id}></AddExerciseForm>
                                                </div>
                                            </>
                                            :
                                            //If a workout has yet to be selected 
                                            //user is prompted to select one
                                            <>
                                                <div className="add-exercise-section">
                                                    <h3>Select a workout above to edit!</h3>
                                                </div>
                                            </>
                                        }
                                    </>
                                    :
                                    //If mode is toggled to New workout
                                    //Form to create new workout is presented
                                    <>
                                        <button className="swap-tab" onClick={() => setMode("select")}>Edit Workouts</button>
                                        <button className="current-tab" >New Workout</button>
                                        <div className="add-workout-form-container">
                                            <AddWorkoutForm setMode={setMode} setSelectedWorkoutIndex={setSelectedWorkoutIndex}></AddWorkoutForm>
                                        </div>
                                    </>
                                }
                            </>
                            :
                            //If the user has yet to create a workout
                            //A form will be displayed along with a prompt to create a workout
                            <>
                                <div className="first-workout-container">
                                    <h2>Add your first workout!</h2>
                                    <AddWorkoutForm setMode={setMode} setSelectedWorkoutIndex={setSelectedWorkoutIndex}></AddWorkoutForm>
                                </div>
                            </>
                        }
                    </div>
            }
        </>
    );
}

export default Workouts;