import EventEmitter from "events";
import { ClientOpts, RedisClient } from "redis";
import PubSubMessage from "../models/pub_sub_message";
import ConfigService from "../../config_service";
import { PubSubRedisOptions } from "../models/pub_sub_interface";
import IPubSub from '../models/pub_sub_interface';

class PubSubRedis implements IPubSub{

    private pub: RedisClient;
    private sub: RedisClient;
    readonly eventEmitter: EventEmitter;
    readonly channel: string;

    constructor(
        // config: ConfigService, 
        // private channel: string = 'chat-message',
        options: PubSubRedisOptions = {
            host: 'localhost',
            port: 6379,
            channel: 'chat-message',
        }
    ) {
        this.channel = 'options.channel';
        const clientOptions: ClientOpts = {
            host: options.host,
            port: options.port
        };

        this.pub = new RedisClient(clientOptions);
        this.sub = new RedisClient(clientOptions);
        this.eventEmitter = new EventEmitter();

    }

    subscribe(): EventEmitter {

        this.sub.on('message', (channel, data) => {

            if (channel != this.channel) return;

            try {

                let parsedData = PubSubMessage.fromJson(JSON.parse(data))

                this.eventEmitter.emit('data',parsedData);

            } catch (err) {

                console.error(err);
                this.eventEmitter.emit('error', err)
            }

        })

        this.sub.subscribe(this.channel);

        return this.eventEmitter;
    }

    publish(value: PubSubMessage):void{
        this.pub.publish(this.channel, JSON.stringify(value.toJson()));
    }

}

export default PubSubRedis;