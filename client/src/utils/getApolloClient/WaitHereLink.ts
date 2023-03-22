import { Operation, ApolloLink, NextLink, FetchResult, Observable, Observer} from '@apollo/client';

interface OperationQueueEntry  {
    operation: Operation;
    forward: NextLink;
    observer: Observer<FetchResult>;
}

export default class WaitHereLink extends ApolloLink {
    private opQueue : OperationQueueEntry[] = [];
    private trackedIds: {};
    private isOpen = true;

    public open(idToSwap, newId) {
        
        this.opQueue.forEach(({ operation, forward, observer}) => {
            if (operation.variables.exerciseId === idToSwap){
                console.log("Start")
                operation.variables.exerciseId = newId
            forward(operation).subscribe(observer);
            console.log("Stop")
            }
            
        });
        this.opQueue = [];
    }
    public close() {
        this.isOpen = false
    }

    public request(operation: Operation, forward: NextLink) {

        this.isOpen = false;
        console.log("START===========================================")


        console.log(operation.variables);
        if (operation.variables.exerciseId !== undefined) {
            if (operation.variables.exerciseId.startsWith('temp_id')) {
                console.log("This is a mutation refering to a temporary exercise ID")
                return new Observable<FetchResult>((observer: Observer<FetchResult>) => {
                    const operationEntry = { operation, forward, observer };
                    this.enqueue(operationEntry);
                    return () => this.cancelOperation(operationEntry);
                })
            }
        }
        // Checks if Exercise is being added
        const optimisticResponse = operation.getContext().optimisticResponse;
        console.log(optimisticResponse);
        if (optimisticResponse?.addExercise) {
            //adds optimistic responses id to the tracker
            let tempId = optimisticResponse.addExercise.id;
        }

        return forward(operation).map((data) => {
            const optimisticResponse = operation.getContext().optimisticResponse;
            
            let newId = data.data?.addExercise?.id
            if (optimisticResponse?.addExercise) {
                //adds optimistic responses id to the tracker
                let tempId = optimisticResponse.addExercise.id;
                this.open(tempId, newId)
            }
            
            console.log("STOP===========================================")
            return data;
        });

        // return new Observable<FetchResult>((observer: Observer<FetchResult>) => {
        //     const operationEntry = {operation,forward,observer};
        //     this.enqueue(operationEntry);

        //     return () => this.cancelOperation(operationEntry);
        // })
    }

    private cancelOperation(entry: OperationQueueEntry) {
        
        
        this.opQueue = this.opQueue.filter(e => e !== entry);
    }

    private enqueue(entry: OperationQueueEntry) {
        
        console.log(this.opQueue);
        this.opQueue.push(entry);
    }


}

