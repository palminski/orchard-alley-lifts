import { useEffect, useState } from 'react';
import getApolloClient from "./utils/getApolloClient/client";
//import 'bootstrap/dist/css/bootstrap.min.css';
import AppHome from './components/AppHome';

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

  return (
    <>
      {!loading && <AppHome client={client}/>}
    </>
  );
}

export default App;
