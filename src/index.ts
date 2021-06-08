import HttpServer from "./server/http_server";
import WebSocketServer from './server/web_socket_server';
import PubSub from './server/pub_sub/pub_sub';

const httpServer = new HttpServer();
const pubSubServer = new PubSub();
const webSocketServer = new WebSocketServer({
    httpServer: httpServer.server,
    pubSub: pubSubServer,
});
httpServer.init();
webSocketServer.init();


process.on('SIGTERM', () => {
    console.log('Closing http server.');
    httpServer.close();
    webSocketServer.close();
    process.exit(0);
});
process.on('uncaughtException', (err) => {
    console.error(err);
    httpServer.close();
    webSocketServer.close();
    process.exit(1);
});
process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
    process.exit();
});

// sudo lsof -i :6969
// kill -9 52373