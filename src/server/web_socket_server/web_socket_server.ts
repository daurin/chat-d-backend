import { randomUUID } from 'crypto';
import Http, { IncomingMessage } from 'http';
import WebSocket from 'ws';
import PubSubMessage from '../pub_sub/models/pub_sub_message';
import { v1 as generateUuid } from 'uuid'
import PubSub from '../pub_sub/pub_sub';
import WebSocketRequest from './models/web_socket_request';
import requestStructureMiddleware from './middlewares/request_structure_middleware';
import IEventServer from './models/events_server_interface';
import webSocketEvents from './web_socket_events';

class WebSocketServer {
    private webSocketServer: WebSocket.Server;
    private clients: { [key: string]: WebSocket };
    private pubSub: PubSub;
    private events: Array<IEventServer>;

    constructor(options: {
        pubSub: PubSub,
        httpServer: Http.Server,
        path?: string,
    }) {
        this.onConnection = this.onConnection.bind(this)

        this.webSocketServer = new WebSocket.Server({
            server: options.httpServer,
            path: options.path || '/chat'
        });

        this.pubSub = options.pubSub;

        this.clients = {};
        this.events = [];
    }

    get clientCount(): number {
        return Object.keys(this.clients).length;
    }

    init() {
        this.webSocketServer.on('connection', this.onConnection);
        this.webSocketServer.on('close', this.onClose);
        this.pubSub.subscribe().on('data', this.onPubMessage.bind(this)).on('error', console.log);

        this.events.push(...webSocketEvents);
    }

    close(): void {
        this.webSocketServer.close();
    }

    private onConnection(webSocket: WebSocket, req: IncomingMessage): void {
        const clientId: string = generateUuid();
        this.clients[generateUuid()] = webSocket;
        webSocket.on('message', (data) => this.onMessage(data, webSocket, clientId));
        webSocket.on('close', (data) => this.onClose(webSocket));
        console.log(`Clients connected: ${this.clientCount}`);
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

    private onMessage(data: WebSocket.Data, client: WebSocket, clienId: string): void {
        if (!requestStructureMiddleware(data, client, this.events.map(e=>e.event))) return;

        let dataParsed: any = JSON.parse(data.toString());

        const req: WebSocketRequest = new WebSocketRequest({
            id: dataParsed['id'],
            event: dataParsed['event'],
            client: client,
            data: dataParsed['data'],
            headers: dataParsed['headers'],
        });
        
        const event: IEventServer | undefined = this.events.find((e) => e.event == req.event);
        if (event == undefined) return;
        if ((event.middlewares?.length || 0) > 0) {
            for (const middleware of (event.middlewares || [])) {
                const next: boolean = middleware(req, undefined);
                if (!next) break;
            }
        }
        else event.callback(req,undefined);

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
        else if (message.target != undefined) {
            const webSocket: WebSocket = this.clients[message.target];
            if (webSocket == null) return;
            if (webSocket.readyState != WebSocket.OPEN) return;
            webSocket.send(message.data);
        }

    }

    private addEvent(name: string, callback: (req: WebSocketRequest, res: any) => void, moreOptions?: {
        middlewares: Array<(req: WebSocketRequest, res: any,) => boolean>
    }): void {
        if (moreOptions?.middlewares == undefined) this.events.push({
            event: name,
            callback: callback,
            middlewares: []
        });
        else this.events.push({
            event: name,
            callback: callback,
            middlewares: moreOptions.middlewares
        });
    }
}

export default WebSocketServer;