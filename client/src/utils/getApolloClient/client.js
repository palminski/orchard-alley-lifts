import { InMemoryCache, ApolloClient, createHttpLink, ApolloLink, NextLink} from '@apollo/client';
import { CachePersistor } from 'apollo3-cache-persist';
import {RetryLink} from 'apollo-link-retry';
import QueueLink from 'apollo-link-queue';
import {onError} from 'apollo-link-error';
import SerializingLink from 'apollo-link-serialize';
import { ADD_EXERCISE,ADD_WORKOUT,DELETE_EXERCISE,DELETE_WORKOUT,EDIT_EXERCISE,EDIT_WORKOUT,EDIT_CALENDER } from '../mutations';
import { setContext } from '@apollo/client/link/context'

import WaitHereLink from './WaitHereLink.ts';


const API_HOST = '/graphql';
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

    const pauseLink = new WaitHereLink();

    // const trackerLink = new ApolloLink((operation, forward) => {
    //     if (forward === undefined) return null
    //     const context = operation.getContext();

    //     const trackedOperations = JSON.parse(window.localStorage.getItem('trackedOperations') || null) || []

    //     console.log(context);
    //     console.log(operation)

    //     //check if it is a mutation that needs to be tracked
    //     if (context.optimisticResponse) {

            
    //         console.log(context.optimisticResponse)
    //         const opVariables = operation.variables
    //         let opMutation = "none";
    //         if (context.optimisticResponse.editCalender) 
    //         {
    //             console.log("Editing Calender")
    //             opMutation = EDIT_CALENDER;
    //         }
    //         else if (context.optimisticResponse.addWorkout) 
    //         {
    //             console.log("Adding Workout")
    //             opMutation = ADD_WORKOUT;
    //         }
    //         else if (context.optimisticResponse.addExercise) 
    //         {
    //             console.log("Adding Exercise")
    //             opMutation = ADD_EXERCISE;
    //         }
    //         else if (context.optimisticResponse.editWorkout) 
    //         {
    //             console.log("Editing workout")
    //             opMutation = EDIT_WORKOUT;
    //         }
    //         else if (context.optimisticResponse.editExercise) 
    //         {
    //             console.log("EditingExercise")
    //             opMutation = EDIT_EXERCISE
    //         }
    //         else if (context.optimisticResponse.deleteWorkout) 
    //         {
    //             console.log("Deleting Workout")
    //             opMutation = DELETE_WORKOUT
    //         }
    //         else if (context.optimisticResponse.deleteExercise) 
    //         {
    //             console.log("Deleting Exercise")
    //             opMutation = DELETE_EXERCISE
    //         }
    //         const newTrackedOperation = {
    //             variables: opVariables,
    //             mutation: opMutation,
    //             optimisticResponse: context.optimisticResponse
    //         }
    //         console.log("{{{{{{{{{{{{{{{{{{")
    //         window.localStorage.setItem('trackedOperations', JSON.stringify([...trackedOperations,newTrackedOperation]));
    //         console.log(JSON.parse(window.localStorage.getItem('trackedOperations')))
    //         console.log("{{{{{{{{{{{{{{{{{{")
    //     }

    //     console.log(operation.variables)
    //     console.log(context.optimisticResponse)

    //     // window.localStorage.setItem("trackedOperations", JSON.stringify([...trackedOperations, newTrackedOperation]))
    //     // console.log(JSON.parse(window.localStorage.getItem('trackedOperations')))
        

    //     return forward(operation).map((data) => {
            
    //             window.localStorage.setItem('trackedOperations', [])
                
    //             return data;
            
    //     });
    // })

    const nextInLineLink = new ApolloLink((operation, forward) => {
        return forward(operation).map((data) => {
            
            let context = operation.getContext()
            
            let returningData = data.data;
            

            if (context.optimisticResponse?.addWorkout?.id !== undefined) {
                pauseLink.updateWorkoutIds(context.optimisticResponse.addWorkout.id, returningData.addWorkout.id)
            }
            if (context.optimisticResponse?.addExercise?.id !== undefined) {
                pauseLink.updateExerciseIds(context.optimisticResponse.addExercise.id, returningData.addExercise.id)
            }

            pauseLink.next();
            return data;
        })
    }) 

    const link = ApolloLink.from([
        // trackerLink,
        queueLink,
        nextInLineLink,
        pauseLink,
        serializingLink,
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