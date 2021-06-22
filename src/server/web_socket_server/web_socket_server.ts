import { randomUUID, timingSafeEqual } from 'crypto';
import Http, { IncomingMessage } from 'http';
import WebSocket from 'ws';
import PubSubMessage, { PubSubMessageType } from '../pub_sub/models/pub_sub_message';
import { v1 as generateUuid } from 'uuid'
import PubSub from '../pub_sub/pub_sub';
import WebSocketRequest from './models/web_socket_request';
import requestStructureMiddleware from './middlewares/request_structure_middleware';
import IEventServer, { IEventCallback, IEventMiddleware } from './models/events_server_interface';
// import webSocketEvents from './web_socket_events';
import { IEventHandler } from './models/event_handler_interface';
import WebSocketResponse from './models/web_scoket_response';
import { IWebSocketSender } from './models/web_socket_sender_interface';

class WebSocketServer implements IEventHandler, IWebSocketSender {
    private webSocketServer: WebSocket.Server;
    private clients: { [key: string]: WebSocket };
    private topics: { [key: string]: Array<string> };
    private pubSub: PubSub;
    private events: Array<IEventServer>;

    constructor(options: {
        pubSub: PubSub,
        httpServer: Http.Server,
        path?: string,
    }) {

        this.webSocketServer = new WebSocket.Server({
            server: options.httpServer,
            path: options.path || '/chat'
        });

        this.pubSub = options.pubSub;
        this.events = [];
        this.clients = {};
        this.topics = {};
    }

    get clientCount(): number {
        return Object.keys(this.clients).length;
    }

    init() {
        this.webSocketServer.on('connection', this.onConnection.bind(this));
        this.webSocketServer.on('close', this.onClose);
        this.pubSub.subscribe().on('data', this.onPubMessage.bind(this)).on('error', console.log);
    }

    close(): void {
        this.webSocketServer.close();
    }

    private onConnection(webSocket: WebSocket, req: IncomingMessage): void {
        const clientId: string = generateUuid();
        this.clients[clientId] = webSocket;
        webSocket.on('message', (data) => this.onMessage(data, webSocket, clientId));
        webSocket.on('close', (data) => this.onClose(webSocket));
        console.log(`Clients connected: ${this.clientCount}`);

        // Test topics
        this.subscribeToTopic(clientId, 'room21');
        this.subscribeToTopic(clientId, 'room46');
        this.subscribeToTopic(clientId, 'room367');
    }

    private onClose(webSocket: WebSocket): void {
        Object.keys(this.clients).every((key, index) => {
            if (this.clients[key] == webSocket) {
                delete this.clients[key];
                return true;
            }
            return true;
        });
        console.log(`Clients connected: ${this.clientCount}`);
    }

    private async onMessage(data: WebSocket.Data, client: WebSocket, clienId: string): Promise<void> {
        if (!requestStructureMiddleware({
            client: client,
            data:data,
            events: this.events.map(e => e.name),
            sender: this,
        })) return;

        let dataParsed: any = JSON.parse(data.toString());

        const req: WebSocketRequest = new WebSocketRequest({
            id: dataParsed['id'],
            event: dataParsed['event'],
            client: client,
            data: dataParsed['data'],
            headers: dataParsed['headers'],
        });

        const res: WebSocketResponse = new WebSocketResponse({
            id: dataParsed['id'],
            event: dataParsed['event'],
            pubSub: this.pubSub,
            client: client,
            clientId: clienId,
            clients: this.clients,
            sender: this,
        });

        const event: IEventServer | undefined = this.events.find((e) => e.name == req.event);
        if (event == undefined) return;
        if ((event.middlewares?.length || 0) > 0) {
            let allMiddlewaresPassed: boolean = true;
            for (const middleware of (event.middlewares || [])) {
                const next: boolean = await middleware(req, res);
                if (!next) {
                    allMiddlewaresPassed = false;
                    break;
                };
            }
            if (allMiddlewaresPassed) {
                await event.callback(req, res);
                if (event.dispatch != undefined) event.dispatch(req, res);
            }
        }
        else {
            await event.callback(req, res);
            if (event.dispatch != undefined) event.dispatch(req, res);
        }

    }

    private onBroadCast(message: PubSubMessage) {
        Object.values(this.clients).forEach((webSocket) => {
            if (webSocket == null) return;
            if (webSocket.readyState != WebSocket.OPEN) return;
            webSocket.send(message.data);
        });
    }

    private onPubMessage(message: PubSubMessage) {
        if (message.target == undefined) return this.onBroadCast(message);
        else if (message.target != undefined && message.type == PubSubMessageType.User) {
            const webSocket: WebSocket = this.clients[message.target];
            if (webSocket == null) return;
            if (webSocket.readyState != WebSocket.OPEN) return;
            webSocket.send(message.data);
        } else if(message.target && message.type == PubSubMessageType.Topic) {
            if(this.topics[message.target]) {
                let clientIds:Array<string> =  this.topics[message.target];

                clientIds.forEach((clientKey) => {
                    if (!this.clients.hasOwnProperty(clientKey)) return;
                    this.clients[clientKey].send(message);
                });
            }
        }

    }



    public addEventHandler(event: IEventServer): void {
        this.events.push(event)
    }

    public addEvent(name: string, callback: IEventCallback, options?: {
        middlewares: Array<IEventMiddleware>,
        dispatch: IEventCallback,
    }) {
        this.events.push({
            name: name,
            callback: callback,
            middlewares: options?.middlewares,
            dispatch: options?.dispatch,
        });
    }

    subscribeToTopic(clientId: string, topic: string): void {
        if (!this.topics.hasOwnProperty(topic)) this.topics[topic] = [];
        this.topics[topic].push(clientId);
    }
    unSubscribeToTopic(clientId: string, topic: string): void {
        if (!this.topics.hasOwnProperty(topic)) return;
        if (this.topics[topic].length> 0){
            const index: number = this.topics[topic].indexOf(clientId);
            if (index !== -1) this.topics[topic].splice(index, 1);
        }
        if (this.topics[topic].length == 0) delete this.topics[topic];
    }

    public sendToTopic(message: any, topic: string): void {
        if (!this.topics.hasOwnProperty(topic)) return;

        this.pubSub.publish(new PubSubMessage({
            data: message,
            target: topic,
            type: PubSubMessageType.Topic,
        }));

    }
    public sendToTarget(message: any, target: string): void {
        
        if (!this.clients.hasOwnProperty(target)) return;

        this.pubSub.publish(new PubSubMessage(
            {
                data: message,
                target,
                type: PubSubMessageType.User
            }
        ));
    }

    public send(message:any,clientSocket:WebSocket):void{
        clientSocket.send(JSON.stringify(message));
    }
}

export default WebSocketServer;