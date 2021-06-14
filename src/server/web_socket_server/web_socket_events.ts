import IEventServer from "./models/events_server_interface";
import WebSocketRequest from "./models/web_socket_request";

const webSocketEvents: Array<IEventServer> = [
    {
        event: 'add-message',
        callback: (req: WebSocketRequest, res: any) => void {}
    },
    {
        event: 'delete-message',
        callback: (req: WebSocketRequest, res: any) => void {}
    },
];

export default webSocketEvents;