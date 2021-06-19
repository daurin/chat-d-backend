import PubSubMessage from "../../pub_sub/models/pub_sub_message";
import PubSub from "../../pub_sub/pub_sub";
import WebSocket from 'ws';
import { IWebSocketSender } from "./web_socket_sender_interface";

interface IWebSocketResponse {
    readonly id?: string;
    readonly event: string;
    readonly headers?: JSON;
    readonly data: any;
    send<T>(data: T): void;
}

class WebSocketResponse implements IWebSocketSender{
    readonly id?: string | undefined;
    readonly event?: string | undefined;
    readonly pubSub: PubSub;
    readonly client: WebSocket;
    readonly clients: { [key: string]: WebSocket };
    readonly clientId: string;
    private sender: IWebSocketSender;


    constructor(params: {
        id?: string | undefined,
        event?: string | undefined,
        pubSub: PubSub,
        client: WebSocket,
        clients: { [key: string]: WebSocket },
        clientId: string,
        sender:IWebSocketSender
    }) {
        this.id = params.id;
        this.event = params.event;
        this.pubSub = params.pubSub;
        this.client = params.client;
        this.clientId=params.clientId;
        this.clients=params.clients;
        this.sender=params.sender;
    }
    subscribeToTopic(clientId: string, topic: string): void {
        throw new Error("Method not implemented.");
    }
    unSubscribeToTopic(clientId: string, topic: string): void {
        throw new Error("Method not implemented.");
    }

    sendToTopic(message: any, topic: string): void {
        this.sender.sendToTopic(message,topic);
    }
    sendToTarget(message: any, target: string): void {
        this.sender.sendToTarget(message,target);
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