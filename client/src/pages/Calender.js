import { useQuery, useMutation } from "@apollo/client";
import {QUERY_CURRENT_USER} from '../utils/queries';
import {useState} from 'react';

const Calender = () => {

    //===[States]=============================================
    const [calenderState, setCalenderState] = useState({
        monday: "none",
        tuesday: "none",
        wednesday: "none",
        thursday: "none",
        friday: "none",
        saturday: "none",
        sunday: "none",
    })

    //===[Queries]=============================================
    const { loading, data, refetch } = useQuery(QUERY_CURRENT_USER);
    const user = (data?.currentUser)
    console.log(data);

    //===[Functions]=============================================
    const handleFormChange = (event) => {
        const {name, value} = event.target; 

        setCalenderState({
            ...calenderState,
            [name]:value
        })
        console.log(calenderState);

        console.log("Hello World.");
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        console.log(calenderState);

    };

    return (
        <>
        <h1>Calender</h1>
            <form onSubmit={handleFormSubmit}>
            <label htmlFor="monday">Monday: </label>
                <select name="monday" onChange={handleFormChange}>
                    <option value="none">none</option>
                    {user.workouts && user.workouts.map(workout => (
                        <option key={workout._id} value={workout._id}>{workout.name}</option>
                    ))}
                </select>
                <br></br>
                <label htmlFor="tuesday">Tuesday: </label>
                <select name="tuesday" onChange={handleFormChange}>
                    <option value="none"></option>
                    {user.workouts && user.workouts.map(workout => (
                        <option key={workout._id} value={workout._id}>{workout.name}</option>
                    ))}
                </select>
                <br></br>
                <label htmlFor="wednesday">Wednesday: </label>
                <select name="wednesday" onChange={handleFormChange}>
                    <option value="none"></option>
                    {user.workouts && user.workouts.map(workout => (
                        <option key={workout._id} value={workout._id}>{workout.name}</option>
                    ))}
                </select>
                <br></br>
                <label htmlFor="thursday">Thursday: </label>
                <select name="thursday" onChange={handleFormChange}>
                    <option value="none"></option>
                    {user.workouts && user.workouts.map(workout => (
                        <option key={workout._id} value={workout._id}>{workout.name}</option>
                    ))}
                </select>
                <br></br>
                <label htmlFor="friday">Friday: </label>
                <select name="friday" onChange={handleFormChange}>
                    <option value="none"></option>
                    {user.workouts && user.workouts.map(workout => (
                        <option key={workout._id} value={workout._id}>{workout.name}</option>
                    ))}
                </select>
                <br></br>
                <label htmlFor="saturday">Saturday: </label>
                <select name="saturday" onChange={handleFormChange}>
                    <option value="none"></option>
                    {user.workouts && user.workouts.map(workout => (
                        <option key={workout._id} value={workout._id}>{workout.name}</option>
                    ))}
                </select>
                <br></br>
                <label htmlFor="sunday">Sunday: </label>
                <select name="sunday" onChange={handleFormChange}>
                    <option value="none"></option>
                    {user.workouts && user.workouts.map(workout => (
                        <option key={workout._id} value={workout._id}>{workout.name}</option>
                    ))}
                </select>
                <br></br>
                <button>Save</button>
            </form>
        </>
    );
}

export default Calender;