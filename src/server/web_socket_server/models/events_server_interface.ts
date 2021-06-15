import WebSocketRequest from "./web_socket_request";

export type IEventCallback = (req: WebSocketRequest, res: any) => void

interface IEventServer{
    readonly name:string;
    readonly callback: IEventCallback;
    readonly middlewares?: Array<(req: WebSocketRequest, res: any) => boolean> | undefined;
}

export default IEventServer;