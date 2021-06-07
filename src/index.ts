import HttpServer from "./server/http_server";
import WebSocketServer from './server/web_socket_server';
import ConfigService from './server/config_service';
import PubSubRedis from './server/pub_sub_redis';

const httpServer = new HttpServer();
const pubSubServer = new PubSubRedis();
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

// sudo lsof -i :6969
// kill -9 52373