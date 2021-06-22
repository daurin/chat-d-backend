import PubSub from "../../pub_sub/pub_sub";
import WebSocket from 'ws';
import { IWebSocketSender } from "./web_socket_sender_interface";

class WebSocketResponse{
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
       this.sender.subscribeToTopic(clientId,topic);
    }
    unSubscribeToTopic(clientId: string, topic: string): void {
        this.sender.unSubscribeToTopic(clientId,topic);
    }

    sendToTopic(message: any, topic: string): void {
        this.sender.sendToTopic(message,topic);
    }
    sendToTarget(message: any, target: string): void {
        this.sender.sendToTarget(message,target);
    }
    send(message: any): void {
        this.sender.send(message,this.client);
    }
}

export default WebSocketResponse;