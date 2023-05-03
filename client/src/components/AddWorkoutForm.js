import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { ADD_WORKOUT } from '../utils/mutations';
import { QUERY_CURRENT_USER } from "../utils/queries";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

import {nanoid} from 'nanoid'


const AddWorkoutForm = (props) => {
    const {setMode, setSelectedWorkoutIndex} = props;

    // let workoutIndex = user.workouts.findIndex(workout => workout._id === e.target.value);
    // setSelectedWorkoutIndex(workoutIndex);

    //===[States]=============================================
    const [formState,setFormState] = useState({workoutName: ""});

    //===[Mutations]=============================================
    const [addWorkout] = useMutation(ADD_WORKOUT,{
        update(cache, {data: {addWorkout}}) {
            try {
                
                let newWorkout = {
                    _id:addWorkout._id,
                    refId:addWorkout.refId,
                    name: addWorkout.name,
                    exercises: []
                } 
                const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });
                cache.writeQuery({
                    query: QUERY_CURRENT_USER,
                    data: { currentUser: {...currentUser, workouts: [...currentUser.workouts, newWorkout]}}
                });
                setSelectedWorkoutIndex(currentUser.workouts.length);
                
            }
            catch (error) {
                console.log(error);
            }
        }
    });

    //===[Queries]=============================================
    const {loading,data} = useQuery(QUERY_CURRENT_USER);
    const user = (data?.currentUser)

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
        const myId = `${nanoid()}`;
        try {
            const mutationResponse = addWorkout({
                variables: {
                    refId: myId,
                    name: formState.workoutName
                },
                optimisticResponse: {
                    addWorkout: {
                        _id:-1,
                        refId: myId,
                        __typename: "Workout",
                        name: formState.workoutName
                    }
                }
            });
        }
        catch (error) {
            console.log(error);
        }
        setFormState({workoutName: ""});
        setMode("select");
    }

    //===[Return]=============================================
    return (
       <form onSubmit={handleFormSubmit}>
            <label htmlFor="workoutName">New Workout Name: </label>
            <br></br>
            <input required className="title-edit" name="workoutName" type="workoutName" id="workoutName" onChange={handleFormChange} value={formState.workoutName}/>
            <button className="hidden-button"> <FontAwesomeIcon className="icon-button" icon={faFloppyDisk}/></button>
       </form> 
    )
}

export default AddWorkoutForm;