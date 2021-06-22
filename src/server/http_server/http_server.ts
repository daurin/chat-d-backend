import Express, { Application } from 'express';
import Http, { IncomingMessage } from 'http';
import { Socket } from 'net';

class HttpServer {
    // httpServer: Http.Server;
    readonly appExpress: Application;
    private httpServer: Http.Server;
    private port:number;

    constructor(options?:{
        port?: number,
    }) {
        this.appExpress = Express();
        this.httpServer = Http.createServer(this.appExpress);
        this.port=options?.port ?? 6969;
    }

    get server(): Http.Server {
        return this.httpServer;
    }

    init(): void {
        this.httpServer.listen(this.port, () => {
            console.log(`Server is listening on ${this.port}!`);
        });

        this.httpServer.on('upgrade',this.onUpgrade);
        this.appExpress.use(Express.json());
        this.appExpress.use(Express.urlencoded({extended:true}));
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