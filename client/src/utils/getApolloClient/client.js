import { InMemoryCache, ApolloClient, createHttpLink, ApolloLink} from '@apollo/client';
import { CachePersistor } from 'apollo3-cache-persist';
import {RetryLink} from 'apollo-link-retry';
import QueueLink from 'apollo-link-queue';
import {onError} from 'apollo-link-error';
import SerializingLink from 'apollo-link-serialize';

import { setContext } from '@apollo/client/link/context'
const API_HOST = 'http://localhost:3001/graphql';
const SCHEMA_VERSION = '1';
const SCHEMA_VERSION_KEY = 'apollo-schema-version';



const getApolloClient = async () => {
    const httpLink = new createHttpLink({ uri: API_HOST })
    const retryLink = new RetryLink({attempts: {max:Infinity}})

    const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('id_token');
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            },
        };
    });

    const errorLink = onError(({ networkError}) => {
        if (networkError && networkError.statusCode === 401) {
            localStorage.removeItem('id_token');
            window.location.replace('/login');
        }
    })

    const queueLink = new QueueLink();
    window.addEventListener("offline", () => queueLink.close());
    window.addEventListener('online', () => queueLink.open());

    const serializingLink = new SerializingLink();

    const trackerLink = new ApolloLink((operation, forward) => {
        console.log(`Tracker Link ===> ${operation.getContext()}`);
        
        if (forward === undefined) return null;

        const context = operation.getContext();
        console.log(context)
        const trackedQueries = JSON.parse(window.localStorage.getItem('trackedQueries') || null) || [];

        if (context.tracked) {
            const {operationName, query, variables} = operation;

            const newTrackedQuery = {
                query,
                context,
                variables,
                operationName,
            }

            window.localStorage.setItem('trackedQueries', JSON.stringify([...trackedQueries, newTrackedQuery]))
        }
        return forward(operation).map((data) => {
            if (context.tracked) {
                window.localStorage.setItem('trackedQueries', JSON.stringify(trackedQueries))
            }
            return data
        })
    })

    const firstLink = new ApolloLink((operation,forward) => {
        const context = operation.getContext();
        console.log("1=========================");
        console.log(context);
        return forward(operation)
    })
    const secondLink = new ApolloLink((operation,forward) => {
        const context = operation.getContext();
        console.log("2=======================");
        console.log(context);
        return forward(operation)
    })
    const thirdLink = new ApolloLink((operation,forward) => {
        const context = operation.getContext();
        console.log("3=======================");
        console.log(context);
        return forward(operation)
    })
    


    const link = ApolloLink.from([
        trackerLink,
        firstLink,
        secondLink,
        queueLink,
        serializingLink,
        thirdLink,
        retryLink,
        errorLink,
        authLink,
        httpLink
    ])

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

    //I think we can make client this way
    // return new ApolloClient({ link: authLink.concat(httpLink), cache })

    const client = new ApolloClient({
        link,
        cache,
    })

    return client
}

export default getApolloClient;