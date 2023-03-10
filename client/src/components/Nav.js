import Auth from "../utils/auth";
import { useApolloClient } from "@apollo/client";



const Nav = (props) => {
    const {pageSelected, setPageSelected} = props;
    const client = useApolloClient();
    return (
        <nav>
        <ul>
            <a>
                <li href='#Home' onClick={() => setPageSelected('Home')}>Home</li>
            </a>
            {!Auth.loggedIn() && 
            <a>
                <li href='#Login' onClick={() => setPageSelected('Login')}>Login</li>
            </a>}
            {!Auth.loggedIn() && 
            <a>
                <li href='#SignUp' onClick={() => setPageSelected('Signup')}>Sign Up</li>
            </a>}
            {Auth.loggedIn() && 
            <>
            <a>
                <li href='#Workouts' onClick={() => setPageSelected('Workouts')}>Workouts</li>
            </a>
            <a>
                <li href='#Today' onClick={() => setPageSelected('Today')}>Today</li>
            </a>
            <a>
                <li href='#Calender' onClick={() => setPageSelected('Calender')}>Calender</li>
            </a>
                <a>
                <li href='/' onClick={() => {
                    Auth.logout();
                    client.clearStore();
                    setPageSelected('Home');
                    }}>Logout</li>
            </a>
            </>
            }
        </ul>
        </nav>
    )
}

export default Nav;