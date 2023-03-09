import { useQuery, useMutation } from "@apollo/client";
import {QUERY_CURRENT_USER} from '../utils/queries';
import { EDIT_CALENDER } from "../utils/mutations";
import {useState, useEffect} from 'react';

const Calender = () => {

    

    //===[Queries]=============================================
    const { loading, data, refetch } = useQuery(QUERY_CURRENT_USER);
    const user = (data?.currentUser)
    console.log(user);

    //===[Mutations]=============================================
    const [editCalender] = useMutation(EDIT_CALENDER);

    
    //===[States]=============================================
    const [calenderState, setCalenderState] = useState(user?.calender);

    //===[Effects]==============================================
    useEffect(() => {
        setCalenderState(user?.calender);
    })

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

    async function handleFormSubmit(event) {
        event.preventDefault();
        console.log(calenderState);
        try {
            const mutationResponse = await editCalender({
                variables: calenderState
            });
            refetch();
        }
        catch (error) {
            console.log(error);
        }


    };

    return (

        <>
            {loading ?
                <>
                    <h1>Loading...</h1>
                </>
                :
                <>
                    <h1>Calender</h1>
                    {calenderState && 
                    <form onSubmit={handleFormSubmit}>
                        <label htmlFor="monday">Monday: </label>
                        <select name="monday" value={calenderState.monday} onChange={handleFormChange}>
                            <option value="none">none</option>
                            {user.workouts && user.workouts.map(workout => (
                                <option key={workout._id} value={workout._id}>{workout.name}</option>
                            ))}
                        </select>
                        <br></br>
                        <label htmlFor="tuesday">Tuesday: </label>
                        <select name="tuesday" value={calenderState.tuesday} onChange={handleFormChange}>
                            <option value="none">none</option>
                            {user.workouts && user.workouts.map(workout => (
                                <option key={workout._id} value={workout._id}>{workout.name}</option>
                            ))}
                        </select>
                        <br></br>
                        <label htmlFor="wednesday">Wednesday: </label>
                        <select name="wednesday" value={calenderState.wednesday} onChange={handleFormChange}>
                            <option value="none">none</option>
                            {user.workouts && user.workouts.map(workout => (
                                <option key={workout._id} value={workout._id}>{workout.name}</option>
                            ))}
                        </select>
                        <br></br>
                        <label htmlFor="thursday">Thursday: </label>
                        <select name="thursday" value={calenderState.thursday} onChange={handleFormChange}>
                            <option value="none">none</option>
                            {user.workouts && user.workouts.map(workout => (
                                <option key={workout._id} value={workout._id}>{workout.name}</option>
                            ))}
                        </select>
                        <br></br>
                        <label htmlFor="friday">Friday: </label>
                        <select name="friday" value={calenderState.friday} onChange={handleFormChange}>
                            <option value="none">none</option>
                            {user.workouts && user.workouts.map(workout => (
                                <option key={workout._id} value={workout._id}>{workout.name}</option>
                            ))}
                        </select>
                        <br></br>
                        <label htmlFor="saturday">Saturday: </label>
                        <select name="saturday" value={calenderState.saturday} onChange={handleFormChange}>
                            <option value="none">none</option>
                            {user.workouts && user.workouts.map(workout => (
                                <option key={workout._id} value={workout._id}>{workout.name}</option>
                            ))}
                        </select>
                        <br></br>
                        <label htmlFor="sunday">Sunday: </label>
                        <select name="sunday" value={calenderState.sunday} onChange={handleFormChange}>
                            <option value="none">none</option>
                            {user.workouts && user.workouts.map(workout => (
                                <option key={workout._id} value={workout._id}>{workout.name}</option>
                            ))}
                        </select>
                        <br></br>
                        <button>Save</button>
                    </form>}
                    
                </>
            }
        </>

        
    );
}

export default Calender;