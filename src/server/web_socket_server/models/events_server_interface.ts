import WebSocketResponse from "./web_scoket_response";
import WebSocketRequest from "./web_socket_request";

export type IEventCallback = (req: WebSocketRequest, res:WebSocketResponse) => void
export type IEventMiddleware = (req: WebSocketRequest, res: any) => boolean;

interface IEventServer{
    readonly name:string;
    readonly callback: IEventCallback;
    readonly middlewares?: Array<IEventMiddleware>;
}

export default IEventServer;