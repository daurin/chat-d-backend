import WebSocket from 'ws';
import PubSub from '../../pub_sub/pub_sub';

interface IWebSocketRequest {
    readonly id?: string;
    readonly event: string;
    readonly headers?: JSON;
    readonly client: WebSocket;
    readonly PubSub: PubSub;
    readonly data: any;
}


class WebSocketRequest {

    readonly id?: string | undefined;
    readonly event: string;
    readonly clientOwner: WebSocket;
    readonly data: any;

    constructor(params: {
        id?: string,
        event: string,
        headers?: JSON,
        client: WebSocket,
        data: any,
    }) {
        this.id=params.id;
        this.event=params.event;
        this.clientOwner=params.client;
        this.data=params.data;
    }
}

export default WebSocketRequest;