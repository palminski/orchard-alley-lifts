import { useEffect, useState } from 'react';

import {setContext} from '@apollo/client/link/context'
import { ApolloProvider, InMemoryCache, ApolloClient, createHttpLink, useQuery} from '@apollo/client';
import { QUERY_CURRENT_USER } from './utils/queries';

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
import getApolloClient from "./utils/getApolloClient/client";
//import 'bootstrap/dist/css/bootstrap.min.css';
import AppHome from './components/AppHome';




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

  
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getApolloClient().then((client) => {
      setClient(client)
      console.log("Client ==>", client);
      setLoading(false)
    })
  }, []);

  useEffect(() => {
    if (!client) return;

    const execute = async () => {
      console.log("Checking for stored mutations in local storage...");
    
    
      let trackedMutations = JSON.parse(window.localStorage.getItem('trackedMutations') || null) || [];
      console.log(trackedMutations);

      const promises = trackedMutations.map(({variables, query, optimisticResponse, operationName}) => client.mutate({
        variables,
        mutation: query,
        optimisticResponse
      }));

      try {
        await Promise.all(promises)
      }
      catch(error) {
        console.log('error occured')
      }

      window.localStorage.removeItem('trackedMutations');
    }

    
    execute();


  }, [client])

  return (
    <>
      {!loading && <AppHome client={client}/>}
    </>
  );
}

export default App;
