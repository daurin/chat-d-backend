import WebSocketRequest from "./web_socket_request";

interface IEventServer{
    readonly event:string;
    readonly callback: (req: WebSocketRequest, res: any) => void;
    readonly middlewares?: Array<(req: WebSocketRequest, res: any) => boolean> | undefined;
}

export default IEventServer;