<<<<<<< HEAD
import { useQuery } from "@apollo/client";
import {QUERY_ALL_USERS, QUERY_CURRENT_USER} from "../utils/queries"
import background from "../images/background-homepage.jpeg";

=======
import './Home.css';
import photo from '../img/background.jpeg'
>>>>>>> eb6fd98ac41250849ac29d35aea8c5c4e6fb4c64

const Home = () => {
    return (
<<<<<<< HEAD
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
=======
       <div className="jumbotron">
        <img src={photo} alt="man lifting weights"/>
            <h1>Get Jacked!</h1>
            <p>What are you waiting for??</p>
       </div>
>>>>>>> eb6fd98ac41250849ac29d35aea8c5c4e6fb4c64
    )
}

export default Home;