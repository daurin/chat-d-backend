import HttpServer from "./server/http_server/http_server";
import WebSocketServer from './server/web_socket_server/web_socket_server';
import PubSub from './server/pub_sub/pub_sub';
import { configureWebSocketEventHandlers } from "./server/web_socket_server/web_socket_events";
import configureRouterServer from "./server/http_server/configure_routes";
import dotenv from 'dotenv';

// Config envarioment
const NODE_ENV=process.env.NODE_ENV || 'development';
dotenv.config({
    path: __dirname+`/config/envarioment/.env.${NODE_ENV}`
});

// Config server
const httpServer = new HttpServer({
    port: Number(process.env.SERVER_PORT||5645)
});
const pubSubServer = new PubSub();
const webSocketServer = new WebSocketServer({
    httpServer: httpServer.server,
    pubSub: pubSubServer,
});
httpServer.init();
webSocketServer.init();

configureWebSocketEventHandlers(webSocketServer);
configureRouterServer(httpServer.appExpress);


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