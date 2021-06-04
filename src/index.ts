import HttpServer from "./server/http_server";
import WebSocketServer from './server/web_socket_server';

console.log('Hello Word');

const httpServer=new HttpServer();
const webSocketServer=new WebSocketServer({httpServer: httpServer.server});
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
    process.exit(0);
});

// sudo lsof -i :6969
// kill -9 52373