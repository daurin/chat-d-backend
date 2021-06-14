import { send } from "process";
import PubSubMessage from "../../pub_sub/models/pub_sub_message";
import PubSub from "../../pub_sub/pub_sub";

interface IWebSocketResponse {
    readonly id?: string;
    readonly event: string;
    readonly headers?: JSON;
    readonly data: any;
    send<T>(data: T): void;
}

class WebSocketResponse {
    readonly id?: string | undefined;
    readonly event?: string | undefined;
    readonly pubSub: PubSub;
    readonly client: WebSocket;
    readonly clientId: string;


    constructor(params: {
        id?: string,
        event?: string,
        pubSub: PubSub,
        client: WebSocket
        clientId: string
    }) {
        this.id = params.id;
        this.event = params.event;
        this.pubSub = params.pubSub;
        this.client = params.client;
        this.clientId = params.clientId;
    }

    sendSuccess(data: any): void {
        let dataFormatted:any={
            data:data
        };
        if(this.id!=undefined)dataFormatted['id']=this.id;
        if(this.event!=undefined)dataFormatted['event']=this.event;

        this.pubSub.publish(new PubSubMessage({
            target: this.clientId,
            data: dataFormatted
        }));
    }

    sendError(error:any):void{
        let dataFormatted:any={
            error:error
        };
        if(this.id!=undefined)dataFormatted['id']=this.id;
        if(this.event!=undefined)dataFormatted['event']=this.event;

        this.pubSub.publish(new PubSubMessage({
            target: this.clientId,
            data: dataFormatted
        }));
    }
}

export default IWebSocketResponse;