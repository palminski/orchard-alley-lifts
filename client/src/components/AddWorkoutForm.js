import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_WORKOUT } from '../utils/mutations'

const AddWorkoutForm = (props) => {
    //===[States]=============================================
    const [formState,setFormState] = useState({workoutName: ""});

    //===[Mutations]=============================================
    const [addWorkout] = useMutation(ADD_WORKOUT);

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
            <input name="workoutName" type="workoutName" id="workoutName" onChange={handleFormChange}/>
            <button>Submit</button>
       </form> 
    )
}

export default AddWorkoutForm;