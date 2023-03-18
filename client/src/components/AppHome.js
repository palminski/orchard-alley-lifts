import React,{useState} from "react"
import Auth from "../utils/auth";
import { ApolloProvider } from '@apollo/client';
//------[Components]------------------
import Nav from './Nav';

//------[Pages]-----------------------
import Home from '../pages/Home';
import Workouts from '../pages/Workouts';
import Calender from '../pages/Calender';
import Today from '../pages/Today';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import MyPage from '../pages/MyPage';

const AppHome = ({client}) => {

    const [pageSelected, setPageSelected] = useState('Home');

    return <ApolloProvider client={client}>
        <div className="App">
            <Nav pageSelected={pageSelected} setPageSelected={setPageSelected} />

            {pageSelected === 'Home' && <Home />}
            {pageSelected === 'Login' && <Login setPageSelected={setPageSelected} />}
            {pageSelected === 'Signup' && <Signup setPageSelected={setPageSelected} />}
            

            {Auth.loggedIn() &&
                <>
                    {pageSelected === 'Workouts' && <Workouts />}
                    {pageSelected === 'Today' && <Today />}
                    {pageSelected === 'Calender' && <Calender />}
                    {pageSelected === 'MyPage' && <MyPage/>}
                </>
            }
        </div>
    </ApolloProvider>
}

export default AppHome;

