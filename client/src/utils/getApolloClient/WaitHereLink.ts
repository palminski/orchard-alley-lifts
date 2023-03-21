import { Operation, ApolloLink, NextLink, FetchResult, Observable, Observer} from '@apollo/client';

interface OperationQueueEntry  {
    operation: Operation;
    forward: NextLink;
    observer: Observer<FetchResult>;
}

export default class WaitHereLink extends ApolloLink {
    private opQueue : OperationQueueEntry[] = [];
    private isOpen = true;

    public open() {
        this.isOpen = true;
        this.opQueue.forEach(({ operation, forward, observer}) => {
            forward(operation).subscribe(observer);
        });
        this.opQueue = [];
    }
    public close() {
        this.isOpen = false
    }

    public request(operation: Operation, forward: NextLink) {
        if (this.isOpen) {
            this.isOpen =false;
            return forward(operation).map((data) => {
                this.open();
                return data;
            });
        }
        return new Observable<FetchResult>((observer: Observer<FetchResult>) => {
            const operationEntry = {operation,forward,observer};
            this.enqueue(operationEntry);
            return () => this.cancelOperation(operationEntry);
        })
    }

    private cancelOperation(entry: OperationQueueEntry) {
        console.log(`
        
        OPERATION CANCEL
        
        `)
        
        this.opQueue = this.opQueue.filter(e => e !== entry);
    }

    private enqueue(entry: OperationQueueEntry) {
        console.log(`
        
        OPERATION ADDED TO QUEUE
        
        `)
        console.log(this.opQueue);
        this.opQueue.push(entry);
    }


}

