import { useState } from "react";

const AddWorkoutForm = (props) => {
    
    const [formState,setFormState] = useState({workoutName: ""});

    const handleFormChange = (event) => {
        const {name,value} = event.target;
        setFormState({
            ...formState,
            [name]:value   
        });
        
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        console.log(formState);
    }


    return (
       <form onSubmit={handleFormSubmit}>
            <label htmlFor="workoutName">Workout Name: </label>
            <input name="workoutName" type="workoutName" id="workoutName" onChange={handleFormChange}/>
            <button>Submit</button>
       </form> 
    )
}

export default AddWorkoutForm;