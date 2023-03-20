import { InMemoryCache, ApolloClient, createHttpLink, ApolloLink } from '@apollo/client';
import { CachePersistor } from 'apollo3-cache-persist';
import { setContext } from '@apollo/client/link/context'
import QueueLink from 'apollo-link-queue'
import { RetryLink } from 'apollo-link-retry'
import SerializingLink from 'apollo-link-serialize'
import { trackerLink } from './trackerLink'
const API_HOST = 'http://localhost:3001/graphql';
const SCHEMA_VERSION = '1.0';
const SCHEMA_VERSION_KEY = 'apollo-schema-version';

const getApolloClient = async () => {
    const httpLink = new createHttpLink({ uri: API_HOST })
    const cache = new InMemoryCache()
    const retryLink = new RetryLink({ attempts: { max: Infinity } })

    const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('id_token');
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            },
        };
    });

    const queueLink = new QueueLink()

    window.addEventListener('offline', () => queueLink.close())
    window.addEventListener('online', () => queueLink.open())

    const serializingLink = new SerializingLink()

    const link = ApolloLink.from([
        trackerLink,
        queueLink,
        serializingLink,
        retryLink,
        authLink,
        httpLink
    ])

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

    return new ApolloClient({ link, cache })
}

export default getApolloClient;