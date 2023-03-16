import { InMemoryCache, ApolloClient, createHttpLink } from '@apollo/client';
import { CachePersistor } from 'apollo3-cache-persist';
import { setContext } from '@apollo/client/link/context'
const API_HOST = 'http://localhost:3001/graphql';
const SCHEMA_VERSION = '1';
const SCHEMA_VERSION_KEY = 'apollo-schema-version';

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const getApolloClient = async () => {
    const httpLink = new createHttpLink({ uri: API_HOST })
    const cache = new InMemoryCache()

    const persistor = new CachePersistor({
        cache,
        storage: window.localStorage,
    })

    const currentVersion = window.localStorage.getItem(SCHEMA_VERSION_KEY)

    if (currentVersion === SCHEMA_VERSION) {
        await persistor.restore()
    } else {
        await persistor.purge()
        window.localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION)
    }

    return new ApolloClient({ link: authLink.concat(httpLink), cache })
}

export default getApolloClient;