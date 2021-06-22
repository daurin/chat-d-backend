import WebSocket from 'ws';

export interface IWebSocketSender {
    subscribeToTopic(clientId:string,topic:string):void;
    unSubscribeToTopic(clientId:string,topic:string):void;
    sendToTopic(message:any,topic:string):void;
    sendToTarget(message:any,target:string):void;
    send(message:any,clientSocket:WebSocket):void;
} 