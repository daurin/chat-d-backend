import HttpServer from "./server/http_server";
import { PubSub } from "./server/pub_sub";
import WebSocketServer from './server/web_socket_server';
import {ConfigService} from './server/config_service';

console.log('Hello Word');

const httpServer=new HttpServer();
const pubSubServer = new PubSub(new ConfigService());
const webSocketServer= new WebSocketServer(pubSubServer, {httpServer: httpServer.server});
httpServer.init();
webSocketServer.init();


process.on('SIGTERM', () => {
    console.log('Closing http server.');
    httpServer.close();
    webSocketServer.close();
    process.exit(0);
});
process.on('uncaughtException', (err)=>{
    console.error(err);
    httpServer.close();
    webSocketServer.close();
    process.exit(1);
});

// sudo lsof -i :6969
// kill -9 52373