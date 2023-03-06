import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { ADD_EXERCISE } from '../utils/mutations';
import { QUERY_CURRENT_USER } from "../utils/queries";

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
    const [addExercise] = useMutation(ADD_EXERCISE);

    //===[Queries]=============================================
    const {refetch} = useQuery(QUERY_CURRENT_USER);

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
            const mutationResponse = await addExercise({
                variables: {
                    workoutId: workoutId,
                    name: formState.exerciseName,
                    reps: parseInt(formState.reps),
                    sets: parseInt(formState.sets),
                    weight: parseFloat(formState.weight)
                }
            });
            refetch();
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
        <h1>{workoutId}</h1>
            <label htmlFor="exerciseName">Exercise Name: </label>
            <input name="exerciseName" type="text" id="exerciseName" onChange={handleFormChange} value={formState.exerciseName}/>

            <label htmlFor="reps">Reps: </label>
            <input name="reps" type="number" step={1}  id="reps" onChange={handleFormChange} value={formState.reps}/>

            <label htmlFor="sets">Sets: </label>
            <input name="sets" type="number" step={1}  id="sets" onChange={handleFormChange} value={formState.sets}/>

            <label htmlFor="weight">Weight: </label>
            <input name="weight" type="number" step={2.5} id="weight" onChange={handleFormChange} value={formState.weight}/>

            <button>Submit</button>
       </form> 
    )
}

export default AddExerciseForm;