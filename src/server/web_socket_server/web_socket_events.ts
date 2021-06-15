import IEventServer from "./models/events_server_interface";
import { IEventHandler } from "./models/event_handler_interface";
import WebSocketRequest from "./models/web_socket_request";

const webSocketEvents: Array<IEventServer> = [
    {
        name: 'add-message',
        callback: (req: WebSocketRequest, res: any) => void {}
    },
    {
        name: 'delete-message',
        callback: (req: WebSocketRequest, res: any) => void {}
    },
];

export const configureWebSocketEventHandlers = (socketServer: IEventHandler):void=> {
    webSocketEvents.forEach((event)=>socketServer.addEventHandler(event));
}