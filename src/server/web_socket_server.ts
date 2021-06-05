import { randomUUID } from 'crypto';
import Http from 'http';
import WebSocket from 'ws';
import { PubMessage } from '../data_definitions/pub_sub';
import {PubSub} from './pub_sub'
import {v1 as generateUuid} from 'uuid'

class WebSocketServer {
    private webSocketServer: WebSocket.Server;
    private sockets: {[key: string]: WebSocket};

    constructor(private readonly pubSub: PubSub,options: {
        httpServer: Http.Server,
    }) {
        this.onConnection = this.onConnection.bind(this)

        this.webSocketServer = new WebSocket.Server({
            server: options.httpServer,
            path: '/chat'
        });

        this.sockets = {}
    }

    init() {
        this.webSocketServer.on('connection', this.onConnection);
        this.webSocketServer.on('close', this.onClose);
        this.pubSub.subscribe().on('data', this.onPubMessage.bind(this)).on('error', console.log);
    }

    close():void{
        this.webSocketServer.close();
    }

    private onBroadCast(message:PubMessage) {
        Object.values(this.sockets).forEach((webSocket)=>{
            if(webSocket==null) return;

            if(webSocket.readyState != WebSocket.OPEN) return;
    
            webSocket.send(JSON.stringify(message.data));
        })
    }

    private onPubMessage(message:PubMessage) {
        if(message.target == null && message.broadcast==false) return;

        if(message.broadcast) return this.onBroadCast(message);

        if(message.target!=null){
        
            const webSocket = this.sockets[message.target];

            if(webSocket==null) return;
    
            if(webSocket.readyState != WebSocket.OPEN) return;
    
            webSocket.send(JSON.stringify(message.data));
        }

    }

    private onConnection(webSocket: WebSocket): void {
        webSocket.on('message', (data) => this.onMessage(webSocket, data));
        this.sockets[generateUuid()] = webSocket;
    }

    private onMessage(webSocket: WebSocket, data: WebSocket.Data): void {
        console.log(data.toString());
        this.pubSub.publish(new PubMessage(
            {
                data:data,
                broadcast: true
            }
        ))
    }

    private onClose(): void {

    }
}

export default WebSocketServer;