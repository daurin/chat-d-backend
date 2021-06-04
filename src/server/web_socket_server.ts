import Http from 'http';
import WebSocket from 'ws';

class WebSocketServer {
    private webSocketServer: WebSocket.Server;

    constructor(options: {
        httpServer: Http.Server
    }) {
        this.onConnection = this.onConnection.bind(this)

        this.webSocketServer = new WebSocket.Server({
            server: options.httpServer,
            path: '/chat'
        });
    }

    init() {
        this.webSocketServer.on('connection', this.onConnection);
        this.webSocketServer.on('close', this.onClose);
    }

    close():void{
        this.webSocketServer.close();
    }

    private onConnection(webSocket: WebSocket): void {
        webSocket.on('message', (data) => this.onMessage(webSocket, data));
    }

    private onMessage(webSocket: WebSocket, data: WebSocket.Data): void {
        console.log(data.toString());
        this.webSocketServer.clients.forEach((client) => {
            if (client.readyState == WebSocket.OPEN) {
                client.send(`Message receibed: ${data}`);
            }
        });
    }

    private onClose(): void {

    }
}

export default WebSocketServer;