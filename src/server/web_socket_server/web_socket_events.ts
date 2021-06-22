import { string } from "joi";
import IEventServer from "./models/events_server_interface";
import { IEventHandler } from "./models/event_handler_interface";
import WebSocketResponse from "./models/web_scoket_response";
import WebSocketRequest from "./models/web_socket_request";

const webSocketEvents: Array<IEventServer> = [
    {
        name: 'add-message',
        callback:async (req: WebSocketRequest, res: WebSocketResponse) => {
            
        },
    },
    {
        name: 'delete-message',
        callback:async (req: WebSocketRequest, res: WebSocketResponse) => {}
    },
];

export const configureWebSocketEventHandlers = (socketServer: IEventHandler):void=> {
    webSocketEvents.forEach((event)=>socketServer.addEventHandler(event));
}