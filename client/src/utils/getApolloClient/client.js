import { InMemoryCache, ApolloClient, createHttpLink, ApolloLink, NextLink} from '@apollo/client';
import { persistCache, LocalStorageWrapper} from 'apollo3-cache-persist';
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
        if (forward === undefined) return null;

        const context = operation.getContext();
        console.log(context);
        const trackedMutations = JSON.parse(window.localStorage.getItem('trackedMutations') || null) || []
        

        const {operationName,query, variables} = operation;

        const newMutation = {
            query,
            optimisticResponse: context.optimisticResponse,
            variables,
            operationName
        }

        const mutation = {...context.optimisticResponse};
        window.localStorage.setItem('trackedMutations', JSON.stringify([...trackedMutations, newMutation]))
        return forward(operation).map((data) => {
            window.localStorage.removeItem('trackedMutations');
            return data;
        });
    })

    const infoLink = new ApolloLink((operation, forward) => {
        console.log(`${operation.operationName} => going`);
        return forward(operation).map((data) => {
            console.log(`${operation.operationName} => returning`)
            return data;
        });
    })

    const link = ApolloLink.from([
        trackerLink,
        infoLink,
        queueLink,
        serializingLink,
        retryLink,
        errorLink,
        authLink,
        httpLink
    ])

    const cache = new InMemoryCache()

    await persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
    });

    const currentVersion = window.localStorage.getItem(SCHEMA_VERSION_KEY)


    const client = new ApolloClient({
        link,
        cache,
    })

    return client
}

export default getApolloClient;