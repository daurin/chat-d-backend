import Express, { Application } from 'express';
import Http, { IncomingMessage } from 'http';
import { Socket } from 'net';

class HttpServer {
    // httpServer: Http.Server;
    private appExpress: Application;
    private httpServer: Http.Server;

    constructor() {
        this.appExpress = Express();
        this.httpServer = Http.createServer(this.appExpress);
    }

    get server(): Http.Server {
        return this.httpServer;
    }

    init(): void {
        let port: Number = 6969;
        this.httpServer.listen(port, () => {
            console.log(`Server is listening on ${port}!`);
        });

        this.httpServer.on('upgrade',this.onUpgrade);
    }

    private onUpgrade(req:IncomingMessage, socket:Socket, head:Buffer):void{
        let validationResult: Boolean = true;
        if (validationResult) {
            
        } else {
            socket.write('HTTP/1.1 401 Web Socket Protocol Handshake\r\n' +
                'Upgrade: WebSocket\r\n' +
                'Connection: Upgrade\r\n' +
                '\r\n');
            socket.destroy();
            return;
        }
    }

    close(): void {
        this.httpServer.close();
    }
}

export default HttpServer;