import WebSocketResponse from "./web_scoket_response";
import WebSocketRequest from "./web_socket_request";

export type IEventCallback = (req: WebSocketRequest, res:WebSocketResponse) => Promise<void>;
export type IEventMiddleware = (req: WebSocketRequest, res: any) => Promise<boolean>;

interface IEventServer{
    readonly name:string;
    readonly callback: IEventCallback;
    readonly middlewares?: Array<IEventMiddleware>;
    readonly dispatch?: IEventCallback;
}

export default IEventServer;