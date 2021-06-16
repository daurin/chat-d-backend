import PubSubMessage from "../../pub_sub/models/pub_sub_message";
import PubSub from "../../pub_sub/pub_sub";
import WebSocket from 'ws';

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
    readonly clients: { [key: string]: WebSocket };
    readonly clientId: string;


    constructor(params: {
        id?: string | undefined,
        event?: string | undefined,
        pubSub: PubSub,
        client: WebSocket,
        clients: { [key: string]: WebSocket },
        clientId: string
    }) {
        this.id = params.id;
        this.event = params.event;
        this.pubSub = params.pubSub;
        this.client = params.client;
        this.clientId=params.clientId;
        this.clients=params.clients;
    }

    sendJson(data: any,targets?:Array<string>): void {
        let dataFormatted:any={
            data:data
        };
        if(this.id!=undefined)dataFormatted['id']=this.id;
        if(this.event!=undefined)dataFormatted['event']=this.event;

        if(targets!=undefined){
            targets.forEach((e)=>{
                this.pubSub.publish(new PubSubMessage({
                    data: dataFormatted,
                    target: e,
                }));
            });
        }
        else this.pubSub.publish(new PubSubMessage({
            data: dataFormatted,
            target: this.clientId,
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

export default WebSocketResponse;