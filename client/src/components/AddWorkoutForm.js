import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { ADD_WORKOUT } from '../utils/mutations';
import { QUERY_CURRENT_USER } from "../utils/queries";

const AddWorkoutForm = (props) => {
    //===[States]=============================================
    const [formState,setFormState] = useState({workoutName: ""});

    //===[Mutations]=============================================
    const [addWorkout] = useMutation(ADD_WORKOUT);

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
            const mutationResponse = await addWorkout({
                variables: {
                    name: formState.workoutName
                }
            });
            refetch();
        }
        catch (error) {
            console.log(error);
        }
        setFormState({workoutName: ""});
    }

    //===[Return]=============================================
    return (
       <form onSubmit={handleFormSubmit}>
            <label htmlFor="workoutName">Workout Name: </label>
            <input name="workoutName" type="workoutName" id="workoutName" onChange={handleFormChange} value={formState.workoutName}/>
            <button>Submit</button>
       </form> 
    )
}

export default AddWorkoutForm;