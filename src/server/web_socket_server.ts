import { randomUUID } from 'crypto';
import Http from 'http';
import WebSocket from 'ws';
import PubSubMessage from './pub_sub/models/pub_sub_message';
import {v1 as generateUuid} from 'uuid'
import PubSub from './pub_sub/pub_sub';

class WebSocketServer {
    private webSocketServer: WebSocket.Server;
    private sockets: {[key: string]: WebSocket};
    private pubSub:PubSub;

    constructor(options: {
        pubSub: PubSub,
        httpServer: Http.Server,
    }) {
        this.onConnection = this.onConnection.bind(this)
        
        this.webSocketServer = new WebSocket.Server({
            server: options.httpServer,
            path: '/chat'
        });

        this.pubSub=options.pubSub;

        this.sockets = {};
    }

    init() {
        this.webSocketServer.on('connection', this.onConnection);
        this.webSocketServer.on('close', this.onClose);
        this.pubSub.subscribe().on('data', this.onPubMessage.bind(this)).on('error', console.log);
    }

    close():void{
        this.webSocketServer.close();
    }

    private onConnection(webSocket: WebSocket): void {
        webSocket.on('message', (data) => this.onMessage(webSocket, data));
        webSocket.on('close', (data) => this.onClose(webSocket));
        this.sockets[generateUuid()] = webSocket;
        console.log(`Clients connected: ${Object.keys(this.sockets).length}`);
    }

    private onClose(webSocket:WebSocket): void {
        Object.keys(this.sockets).every((key,index)=>{
            if(this.sockets[key]==webSocket){
                delete this.sockets[key];
                return true;
            }
            return true;
        });
        console.log(`Clients connected: ${Object.keys(this.sockets).length}`);
    }

    private onMessage(webSocket: WebSocket, data: WebSocket.Data): void {
        console.log(data.toString());
        this.pubSub.publish(new PubSubMessage(
            {
                data:data,
                broadcast: true
            }
        ));
    }

    private onBroadCast(message:PubSubMessage) {
        Object.values(this.sockets).forEach((webSocket)=>{
            if(webSocket==null) return;

            if(webSocket.readyState != WebSocket.OPEN) return;
    
            webSocket.send(JSON.stringify(message.data));
        })
    }

    private onPubMessage(message:PubSubMessage) {
        if(message.target == null && message.broadcast==false) return;

        if(message.broadcast) return this.onBroadCast(message);

        if(message.target!=null){
        
            const webSocket:WebSocket = this.sockets[message.target];

            if(webSocket==null) return;
    
            if(webSocket.readyState != WebSocket.OPEN) return;
    
            webSocket.send(JSON.stringify(message.data));
        }

    }
}

export default WebSocketServer;