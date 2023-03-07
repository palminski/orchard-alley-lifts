import { useQuery } from "@apollo/client";
import {QUERY_ALL_USERS, QUERY_CURRENT_USER} from "../utils/queries"
import background from "../images/background-homepage.jpeg";


const Home = () => {
    const {data:currentUser} = useQuery(QUERY_CURRENT_USER);
    const {loading, data} = useQuery(QUERY_ALL_USERS);
    const users = (data?.users)
    
    console.log(currentUser);
    return (
        <>
            <div>
                <img src={background} className="img-fluid. max-width: 100%"></img>
            </div>
            <h1>HOME</h1>
            {currentUser && 
            <>
            <h2>Me</h2>
            <p>{currentUser.currentUser.username} - {currentUser.currentUser._id}</p>
            </>
            }
            <h2>All Users</h2>
            <ul>
                {users && users.map(user => (
                    <li key={user._id}>{user.username} - {user._id}</li>
                ))}
            </ul>
        </>
    )
}

export default Home;