import EventEmitter from "events";
import PubSubMessage from "./pub_sub_message";

interface IPubSub{
    readonly eventEmitter: EventEmitter;
    readonly channel: string;
    subscribe: ()=>EventEmitter;
    publish: (value: PubSubMessage)=>void;
}

interface PubSubRedisOptions {
    host: string,
    port: number,
    channel:string,
}

export default IPubSub;
export {PubSubRedisOptions};