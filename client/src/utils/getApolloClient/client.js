import { InMemoryCache, ApolloClient, createHttpLink, ApolloLink, NextLink} from '@apollo/client';
import { CachePersistor } from 'apollo3-cache-persist';
import {RetryLink} from 'apollo-link-retry';
import QueueLink from 'apollo-link-queue';
import {onError} from 'apollo-link-error';
import SerializingLink from 'apollo-link-serialize';

import { setContext } from '@apollo/client/link/context'

import WaitHereLink from './WaitHereLink.ts';


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

    const pauseLink = new WaitHereLink();

    const thirdLink = new ApolloLink((operation,forward) => {
        queueLink.close();
        const context = operation.getContext();
        console.log(forward);
        
        
        let outgoingTempId;

        if (context.optimisticResponse?.addExercise !== undefined) {
            console.log("Adding exercise!")
            console.log(context.optimisticResponse.addExercise.id);
            outgoingTempId = context.optimisticResponse.addExercise.id
        }
        if (context.optimisticResponse?.addWorkout !== undefined) {
            console.log("Adding Workout!")
            console.log(context.optimisticResponse.addWorkout.id);
            outgoingTempId = context.optimisticResponse.addWorkout.id
        }
        
        //Swap Variables here if neccecary!

        
        
        // operation.variables = {exerciseId: "TEST ID"}
        
        console.log("<><><>")
        console.log("}}}}}}}}}}}}}START OF MUTATION}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}")
        const trackedTempIds = JSON.parse(window.localStorage.getItem('trackedTempIds') || null) || {};
        console.log("Tracked temp IDs")
        console.log(trackedTempIds)
        console.log("Exercise ID for this mutation")
        console.log(operation.variables?.exerciseId)
        console.log("Value at that key")
        console.log(trackedTempIds[operation.variables?.exerciseId])
        
        if (trackedTempIds[operation.variables?.exerciseId] !== undefined) {
            console.log("<><><><><><><><><><><><><><>")
            console.log("temp id in tracked IDs!")
            operation.variables.exerciseId = trackedTempIds[operation.variables?.exerciseId]
            console.log("Updated Exercise ID in variables!")
            console.log("<><><><><><><><><><><><><><>")
        }
        if (trackedTempIds[operation.variables?.workoutId] !== undefined) {
            console.log("<><><><><><><><><><><><><><>")
            console.log("temp id in tracked IDs!")
            operation.variables.workoutId = trackedTempIds[operation.variables?.workoutId]
            console.log("Updated Workout ID in variables!")
            console.log("<><><><><><><><><><><><><><>")
        }
        
        
        return forward(operation).map((data)=> {
            
            const returningData = data.data
            //Sets item in local storage if sent with an outgoing temporary ID
            if (outgoingTempId) {
                //get tracked temp IDs
                

                //Update Temp Tracked IDs
                if (returningData.addExercise) {
                    const newTrackedTempIds = {...trackedTempIds, [outgoingTempId] : returningData.addExercise.id}
                    window.localStorage.setItem("trackedTempIds", JSON.stringify(newTrackedTempIds));
                    console.log("UPDATED LOCAL STORAGE VALUES!")
                    window.localStorage.setItem("trackedTempIds", JSON.stringify(newTrackedTempIds));
                }
                if (returningData.addWorkout) {
                    console.log(`Real Id => ${returningData.addWorkout.id}`);
                    const newTrackedTempIds = {...trackedTempIds, [outgoingTempId] : returningData.addWorkout.id}
                    window.localStorage.setItem("trackedTempIds", JSON.stringify(newTrackedTempIds));
                }
                
            }
            console.log("UPDATED TRACKED TEMP IDS")
            console.log(JSON.parse(window.localStorage.getItem('trackedTempIds')))
            console.log("{{{{{{{{{END OF MUTATION{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{")
            console.log("<><><>")
            queueLink.open();
            return(data);
        })
    })
    


    const link = ApolloLink.from([
        trackerLink,
        queueLink,
        serializingLink,
        pauseLink,
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