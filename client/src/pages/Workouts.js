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

import gainsIcon from "../images/icons/Will_Design.svg";

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
    console.log(selectedWorkoutIndex);
    //===[Queries]=============================================
    const { loading, data, refetch } = useQuery(QUERY_CURRENT_USER);
    const user = (data?.currentUser)

    //===[Mutations]=============================================
    const [deleteExercise] = useMutation(DELETE_EXERCISE, {
        update(cache, { data: { deleteExercise } }) {
            try {
                const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });
                //spread the workouts into new temp holding array
                let updatedWorkouts = [...currentUser.workouts];
                //Spread exercises as well so they can be edited
                for (let i = 0; i < updatedWorkouts.length; i++) {
                    updatedWorkouts[i] = { ...updatedWorkouts[i], exercises: [...updatedWorkouts[i].exercises] }
                }

                //find indexes to replace
                let workoutIndexToReplace = selectedWorkoutIndex;
                let exerciseIndexToReplace = updatedWorkouts[workoutIndexToReplace].exercises.findIndex(exercise => exercise.refId.toString() === deleteExercise.refId);

                //splice exercise out of the workout
                updatedWorkouts[workoutIndexToReplace].exercises.splice(exerciseIndexToReplace, 1);

                cache.writeQuery({
                    query: QUERY_CURRENT_USER,
                    data: { currentUser: { ...currentUser, workouts: updatedWorkouts } }
                });
            }
            catch (error) {
                console.log(error);
            }
        },
    });

    const [deleteWorkout] = useMutation(DELETE_WORKOUT, {
        update(cache, { data: { deleteWorkout } }) {
            try {
                const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });
                let updatedWorkouts = [...currentUser.workouts]
                updatedWorkouts.splice(selectedWorkoutIndex, 1);

                setSelectedWorkoutIndex('none');
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

    const [editExercise] = useMutation(EDIT_EXERCISE, {
        update(cache, { data: { editExercise } }) {
            try {
                console.log(editExercise);
                const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });

                //spread the workouts into new temp holding array
                let updatedWorkouts = [...currentUser.workouts];
                //Spread exercises as well so they can be edited
                for (let i = 0; i < updatedWorkouts.length; i++) {
                    updatedWorkouts[i] = { ...updatedWorkouts[i], exercises: [...updatedWorkouts[i].exercises] }
                }

                //find indexes to replace
                let workoutIndexToReplace = selectedWorkoutIndex;
                let exerciseIndexToReplace = updatedWorkouts[workoutIndexToReplace].exercises.findIndex(exercise => exercise.refId.toString() === editExercise.refId);

                //splice exercise out of the workout
                updatedWorkouts[workoutIndexToReplace].exercises[exerciseIndexToReplace] = {
                    ...updatedWorkouts[workoutIndexToReplace].exercises[exerciseIndexToReplace],
                    name: editExercise.name,
                    reps: editExercise.reps,
                    sets: editExercise.sets,
                    weight: editExercise.weight,
                };
                console.log(editExercise);
                cache.writeQuery({
                    query: QUERY_CURRENT_USER,
                    data: { currentUser: { ...currentUser, workouts: updatedWorkouts } }
                });
                console.log("<><><><><><><>")
                console.log(currentUser.workouts[selectedWorkoutIndex].exercises[exerciseIndexToReplace].name);
            }
            catch (error) {
                console.log(error);
            }
        }
    });
    const [editWorkout] = useMutation(EDIT_WORKOUT, {
        update(cache, { data: { editWorkout } }) {
            try {
                const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });
                console.log(data);
                let updatedWorkouts = [...currentUser.workouts]
                updatedWorkouts[selectedWorkoutIndex] = { ...updatedWorkouts[selectedWorkoutIndex], name: editWorkout.name };

                cache.writeQuery({
                    query: QUERY_CURRENT_USER,
                    data: { currentUser: { ...currentUser, workouts: updatedWorkouts } }
                });
                console.log(currentUser.workouts[selectedWorkoutIndex].name)
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
            let workoutIndex = user.workouts.findIndex(workout => workout.refId === e.target.value);
            console.log(user.workouts[selectedWorkoutIndex])
            setSelectedWorkoutIndex(workoutIndex);
        }
    }
    //====[DELETING]================================================================
    async function handleDeleteWorkout(workoutId) {
        setSelectedWorkoutIndex("none");
        try {
            const mutationResponse = await deleteWorkout({
                variables: {
                    workoutId: workoutId,
                },
                optimisticResponse: {
                    deleteWorkout: {
                        refId: workoutId
                    }
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    async function handleDeleteExercise(exerciseId) {
        try {

            console.log(exerciseId)
            const mutationResponse = await deleteExercise({
                variables: {
                    exerciseId: exerciseId,
                },
                optimisticResponse: {
                    deleteExercise: {
                        refId: exerciseId
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

    //====[EDITING]=============================================================================================
    async function handleWorkoutFormSubmit(event) {
        event.preventDefault();
        try {
            editWorkout({
                variables: {
                    workoutId: user.workouts[selectedWorkoutIndex].refId,
                    name: workoutEditState.workoutName,
                },
                optimisticResponse: {
                    editWorkout: {
                        refId: user.workouts[selectedWorkoutIndex].refId,
                        name: workoutEditState.workoutName,
                        __typename: 'Workout'
                    }
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
            const mutationResponse = editExercise({
                variables: {
                    exerciseId: currentlyEditing,
                    name: exerciseEditState.exerciseName,
                    sets: parseInt(exerciseEditState.sets),
                    reps: parseInt(exerciseEditState.reps),
                    weight: parseFloat(exerciseEditState.weight),
                },
                optimisticResponse: {
                    editExercise: {
                        refId: currentlyEditing,
                        __typename: "Exercise",
                        name: exerciseEditState.exerciseName,
                        sets: parseInt(exerciseEditState.sets),
                        reps: parseInt(exerciseEditState.reps),
                        weight: parseFloat(exerciseEditState.weight),
                    }
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
            <h1 className="workouts-h1">Workouts</h1>
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
                                                    <select className="selected-workout" name="workouts" onChange={handleSelectChange} value={user.workouts[selectedWorkoutIndex]?.refId}>
                                                        <option value="none"></option>
                                                        {user.workouts && user.workouts.map(workout => (
                                                            <option key={workout.refId} value={workout.refId}>{workout.name}</option>
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
                                                            <FontAwesomeIcon className="icon-button icon-button-danger" icon={faTrashCan} onClick={() => { handleDeleteWorkout(user.workouts[selectedWorkoutIndex].refId) }} />
                                                        </>}
                                                </>
                                                // Currently Editing Title
                                                //form to change workout name
                                                :
                                                <>
                                                    <form className="first-workout-form" onSubmit={handleWorkoutFormSubmit}>
                                                        <label htmlFor="workoutName">Workout Name: </label>
                                                        <br></br>
                                                        <input required autoFocus={true} className="title-edit" name="workoutName" type="text" id="workoutName" onFocus={(e) => e.target.select()} onChange={handleWorkoutFormChange} value={workoutEditState.workoutName} />
                                                        <button className="hidden-button"> <FontAwesomeIcon className="icon-button" icon={faFloppyDisk} /></button>

                                                    </form>
                                                </>}
                                        </div>
                                        {selectedWorkoutIndex !== "none" ?
                                            //If there is a workout that has been selected
                                            //List of exercises contained in that workout
                                            <>
                                                {user.workouts[selectedWorkoutIndex]?.exercises.length > 0 &&
                                                    <ul>
                                                        {user.workouts[selectedWorkoutIndex].exercises.map(exercise => (
                                                            <li className="exercise-li" key={exercise.refId}>
                                                                {currentlyEditing === exercise.refId ?
                                                                    // If currently editing this exercise
                                                                    //li becomes a form where values can be changed
                                                                    <form className="handle-exercise-form" onSubmit={handleExerciseFormSubmit}>
                                                                        <div className="exercise-name">
                                                                            <label htmlFor="exerciseName"><span className="exercise-name">Exercise Name: </span></label>
                                                                            <input required name="exerciseName" type="text" id="exerciseName" onChange={handleExerciseFormChange} value={exerciseEditState.exerciseName} />
                                                                        </div>
                                                                        <div className="exercise-name">
                                                                            <label htmlFor="reps">Reps: </label>
                                                                            <input required className="small-number-input" name="reps" type="number" step={1} id="reps" onChange={handleExerciseFormChange} value={exerciseEditState.reps} />
                                                                        </div>
                                                                        <div className="exercise-name">
                                                                            <label htmlFor="sets">Sets: </label>
                                                                            <input required className="small-number-input" name="sets" type="number" step={1} id="sets" onChange={handleExerciseFormChange} value={exerciseEditState.sets} />
                                                                        </div>
                                                                        <div className="exercise-name">
                                                                            <label htmlFor="weight">Weight: </label>
                                                                            <input required className="large-number-input" name="weight" type="number" step={2.5} id="weight" onChange={handleExerciseFormChange} value={exerciseEditState.weight} />
                                                                        </div>
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
                                                                                setCurrentlyEditing(exercise.refId)
                                                                            }} />
                                                                            <FontAwesomeIcon className="icon-button icon-button-danger" icon={faTrashCan} onClick={() => { handleDeleteExercise(exercise.refId) }} />
                                                                        </p>
                                                                    </>
                                                                }
                                                            </li>
                                                        ))}
                                                    </ul>
                                                }
                                                {/* //Form at bottom where exercises are added */}
                                                <div className="add-exercise-section">
                                                    <h3>Add {user.workouts[selectedWorkoutIndex]?.exercises.length > 0 ? "more exercises" : "your fisrt exercise"} to this workout here</h3>
                                                    <AddExerciseForm workoutId={user.workouts[selectedWorkoutIndex]?.refId} setSelectedWorkoutIndex={setSelectedWorkoutIndex}></AddExerciseForm>
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
                                    <h2 className="workout-title">Add your first workout!</h2>
                                    <AddWorkoutForm setMode={setMode} setSelectedWorkoutIndex={setSelectedWorkoutIndex}></AddWorkoutForm>
                                </div>
                            </>
                        }
                    </div>
            }
            <div className="icon-containter">
                <img src={gainsIcon} className="gains-icon" alt="Master Gains icon" />
            </div>
        </>
    );
}

export default Workouts;