import { QUERY_CURRENT_USER } from "../queries";

const AddWorkout = (cache, { data: { addWorkout } }) => {
  
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
        console.log("++++++==========++++++++++")
        console.log(cache.readQuery({ query: QUERY_CURRENT_USER }))

}

export default AddWorkout