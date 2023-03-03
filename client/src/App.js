import {useState} from 'react';
import './App.css';
import {setContext} from '@apollo/client/link/context'
import { ApolloProvider, InMemoryCache, ApolloClient, createHttpLink } from '@apollo/client';
import Auth from "./utils/auth";

//------[Components]------------------
import Nav from './components/Nav';

//------[Pages]-----------------------
import Home from './pages/Home';
import Workouts from './pages/Workouts';
import Calender from './pages/Calender';
import Today from './pages/Today';
import Login from './pages/Login';
import Signup from './pages/Signup';

//------[Set Up Apollo]---------------
const httpLink = createHttpLink({
  //This can be changed to '/graphql' if using proxy in package.json
  uri: 'http://localhost:3001/graphql'
});

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {

  const [pageSelected, setPageSelected] = useState('Home')

  return (
    <ApolloProvider client={client}>
    <div className="App">
      <Nav pageSelected={pageSelected} setPageSelected={setPageSelected}/>

      {pageSelected === 'Home' && <Home/>}
      {pageSelected === 'Login' && <Login setPageSelected={setPageSelected}/>}
      {pageSelected === 'Signup' && <Signup setPageSelected={setPageSelected}/>}

      {Auth.loggedIn() && 
        <>
        {pageSelected === 'Workouts' && <Workouts/>}
        {pageSelected === 'Today' && <Today/>}
        {pageSelected === 'Calender' && <Calender/>}
        </>
      }

      

    </div>
    </ApolloProvider>
  );
}

export default App;
