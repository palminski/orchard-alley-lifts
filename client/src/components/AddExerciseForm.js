import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_EXERCISE } from '../utils/mutations';
import { QUERY_CURRENT_USER } from "../utils/queries";
import {findSelectedWorkIndex} from "../utils/commonMethods/commons";


const AddExerciseForm = (props) => {
    //===[Props]=============================================
    const { currentuserinfo,selectedworkout } = props;

    //===[States]=============================================
    const [formState, setFormState] = useState({
        exerciseName: "",
        reps: 0,
        sets: 0,
        weight: 0
    });

    //===[Mutations]=============================================
    const [addExercise] = useMutation(ADD_EXERCISE);

    //===[Queries]=============================================
    const { refetch } = useQuery(QUERY_CURRENT_USER);

    //===[Functions]=============================================
    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    async function handleFormSubmit(event) {
        event.preventDefault();
        console.log(formState);
        try {
            console.log("HELLLO",currentuserinfo,selectedworkout);
            const mutationResponse = await addExercise({
                variables: {
                    workoutId: selectedworkout._id,
                    name: formState.exerciseName,
                    reps: parseInt(formState.reps),
                    sets: parseInt(formState.sets),
                    weight: parseFloat(formState.weight)
                },
                update: (cache, mutationresult) => {
                    //console.log("cache, mutationresult ===>",cache, mutationresult.data.exercises);
                    let data = cache.readQuery({query: QUERY_CURRENT_USER});
                    console.log("Exisitng Data ==>",data);
                    const NewUserData = JSON.parse(JSON.stringify(data));
                    const selectedWorkOutIndex = findSelectedWorkIndex(NewUserData.currentUser,selectedworkout._id);
                    const modifiedExerciseList = [...NewUserData.currentUser.workouts[selectedWorkOutIndex].exercises,mutationresult.data.addExercise.workouts.exercises];
                    NewUserData.currentUser.workouts[selectedWorkOutIndex].exercises = modifiedExerciseList;
                    console.log("mutationresult ==>",mutationresult,NewUserData);
                    cache.writeQuery({ query: QUERY_CURRENT_USER, data: NewUserData });
                },
                optimisticResponse: () => {
                    return {
                        addExercise: {
                            username: currentuserinfo.username,
                            workouts: {
                                name: selectedworkout.name,
                                exercises: {
                                    _id: `test-${Math.random()}-${new Date().toISOString()}`,
                                    __typename: 'Exercise',
                                    name: formState.exerciseName,
                                    reps: parseInt(formState.reps),
                                    sets: parseInt(formState.sets),
                                    weight: parseFloat(formState.weight) 
                                }
                            }
                        }
                    }
                }
            });
        }
        catch (error) {
            console.log(error);
        }
        refetch();
        setFormState({
            exerciseName: "",
            reps: 0,
            sets: 0,
            weight: 0
        });
    }

    //===[Return]=============================================
    return (
        <form onSubmit={handleFormSubmit}>
            <label htmlFor="exerciseName">Exercise Name: </label>
            <input name="exerciseName" type="text" id="exerciseName" onChange={handleFormChange} value={formState.exerciseName} />

            <label htmlFor="reps">Reps: </label>
            <input name="reps" type="number" step={1} id="reps" onChange={handleFormChange} value={formState.reps} />

            <label htmlFor="sets">Sets: </label>
            <input name="sets" type="number" step={1} id="sets" onChange={handleFormChange} value={formState.sets} />

            <label htmlFor="weight">Weight: </label>
            <input name="weight" type="number" step={2.5} id="weight" onChange={handleFormChange} value={formState.weight} />

            <button>Submit</button>
        </form>
    )
}

export default AddExerciseForm;