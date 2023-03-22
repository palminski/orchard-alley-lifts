import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { ADD_EXERCISE } from '../utils/mutations';
import { QUERY_CURRENT_USER } from "../utils/queries";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCircleCheck } from '@fortawesome/free-solid-svg-icons'

const AddExerciseForm = (props) => {
    //===[Props]=============================================
    const {workoutId} = props;

    //===[States]=============================================
    const [formState,setFormState] = useState({
        exerciseName: "",
        reps:0,
        sets:0,
        weight:0
    });

    //===[Mutations]=============================================
    const [addExercise] = useMutation(ADD_EXERCISE, {
        update(cache, {data: {addExercise}}) {
            try {
                
                
                const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });

                //spread the workouts into new temp holding array
                let updatedWorkouts = [...currentUser.workouts];
                //Spread exercises as well so they can be edited
                for (let i = 0; i < updatedWorkouts.length; i++) {
                    updatedWorkouts[i] = { ...updatedWorkouts[i], exercises: [...updatedWorkouts[i].exercises] }
                }

                //find indexes to replace
                let workoutIndexToReplace = updatedWorkouts.findIndex(workout => workout._id === workoutId);
                const newExercise = {
                    _id: addExercise.id,
                    name:addExercise.name,
                    reps:addExercise.reps,
                    sets:addExercise.sets,
                    weight:addExercise.weight,
                }
                console.log("<><><><><><>")
                // console.log(updatedWorkouts);
                // console.log(workoutIndexToReplace);
                if (workoutIndexToReplace <0 ) {
                    workoutIndexToReplace = updatedWorkouts.length-1
                }
                console.log("<><><><><><>")
                updatedWorkouts[workoutIndexToReplace].exercises.push(newExercise)



                cache.writeQuery({
                    query: QUERY_CURRENT_USER,
                    data: { currentUser: {...currentUser, workouts: updatedWorkouts}}
                });
                console.log(currentUser)
            }
            catch (error) {
                console.log(error);
            }
        }
    });

    //===[Queries]=============================================
    const {loading,data, refetch} = useQuery(QUERY_CURRENT_USER);

    //===[Functions]=============================================
    const handleFormChange = (event) => {
        const {name,value} = event.target;
        setFormState({
            ...formState,
            [name]:value   
        });
    };

    async function handleFormSubmit(event) {
        event.preventDefault();
        console.log(formState);
        try {
            const mutationResponse = addExercise({
                variables: {
                    workoutId: workoutId,
                    name: formState.exerciseName,
                    reps: parseInt(formState.reps),
                    sets: parseInt(formState.sets),
                    weight: parseFloat(formState.weight)
                },
                optimisticResponse: {
                    addExercise: {
                        id: `temp_id-${formState.exerciseName}-Exercise-${Date.now()}`,
                        __typename: "Exercise",
                        workoutId: workoutId,
                        name: formState.exerciseName,
                        reps: parseInt(formState.reps),
                        sets: parseInt(formState.sets),
                        weight: parseFloat(formState.weight)
                    }
                }
            });
        }
        catch (error) {
            console.log(error);
        }
        setFormState({
            exerciseName: "",
            reps:0,
            sets:0,
            weight:0
        });
    }

    //===[Return]=============================================
    return (
       <form onSubmit={handleFormSubmit}>
            <label htmlFor="exerciseName">Exercise Name: </label>
            <input required name="exerciseName" type="text" id="exerciseName" onChange={handleFormChange} value={formState.exerciseName}/>

            <label htmlFor="reps">Reps: </label>
            <input required className="small-number-input" name="reps" type="number" step={1}  id="reps" onChange={handleFormChange} value={formState.reps}/>

            <label htmlFor="sets">Sets: </label>
            <input required className="small-number-input" name="sets" type="number" step={1}  id="sets" onChange={handleFormChange} value={formState.sets}/>

            <label htmlFor="weight">Weight: </label>
            <input required className="large-number-input" name="weight" type="number" step={2.5} id="weight" onChange={handleFormChange} value={formState.weight}/>

            <button className="hidden-button"> <FontAwesomeIcon className="icon-button" icon={faCircleCheck}/></button>
       </form> 
    )
}

export default AddExerciseForm;