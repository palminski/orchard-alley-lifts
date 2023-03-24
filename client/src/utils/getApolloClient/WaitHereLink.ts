import { Operation, ApolloLink, NextLink, FetchResult, Observable, Observer} from '@apollo/client';

interface OperationQueueEntry  {
    operation: Operation;
    forward: NextLink;
    observer: Observer<FetchResult>;
}

export default class WaitHereLink extends ApolloLink {
    private opQueue : OperationQueueEntry[] = [];
    private isOpen = true;

    public updateWorkoutIds(tempId, actualId) {
        
        this.opQueue.forEach(({ operation}) => {
            if (operation.variables?.workoutId === tempId) {
                operation.variables.workoutId = actualId
            }
        });
    }
    public updateExerciseIds(tempId, actualId) {
        
        this.opQueue.forEach(({ operation}) => {
            if (operation.variables?.exerciseId === tempId) {
                operation.variables.exerciseId = actualId
            }
        });
    }

    public next() {
        // console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{")
        // console.log("Next Called");
        // console.log("OpQue at begining")
        // console.log(this.opQueue);
        if (this.opQueue.length <= 0) {
            // console.log("set to open");
            this.isOpen = true;
        }
        else
        {
            const entry = this.opQueue.shift()
            entry?.forward(entry?.operation).subscribe(entry?.observer);
        }
        // console.log("new OpQue");
        // console.log(this.opQueue);
        // console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}")
        
    }
    public request(operation: Operation, forward: NextLink) {
        if (this.isOpen) {
            this.isOpen =false;
            // console.log("setting this to closed");
            return forward(operation);
        }
        return new Observable<FetchResult>((observer: Observer<FetchResult>) => {
            const operationEntry = {operation,forward,observer};
            this.enqueue(operationEntry);
            return () => this.cancelOperation(operationEntry);
        })
    }

    private cancelOperation(entry: OperationQueueEntry) {
        this.opQueue = this.opQueue.filter(e => e !== entry);
    }

    private enqueue(entry: OperationQueueEntry) {
        // console.log(this.opQueue);
        this.opQueue.push(entry);
    }


}

