import EventEmitter from "events";
import IPubSub, { PubSubRedisOptions } from "./models/pub_sub_interface";
import PubSubMessage from "./models/pub_sub_message";
import PubSubRedis from './repositories/pub_sub_redis';

class PubSub implements IPubSub{

    private repository:IPubSub;

    constructor( options: PubSubRedisOptions = {
        host: 'localhost',
        port: 6379,
        channel: 'chat-message',
    }){
        this.repository=new PubSubRedis(options);
    }

    get eventEmitter():EventEmitter{
        return this.repository.eventEmitter;
    }

    get channel():string{
        return this.repository.channel;
    }

    subscribe(): EventEmitter {
        return this.repository.subscribe();
    }
    publish(value:PubSubMessage){
        return this.repository.publish(value);
    }

}

export default PubSub;