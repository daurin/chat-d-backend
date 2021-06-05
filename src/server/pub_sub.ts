import EventEmitter from "events";
import { ClientOpts, RedisClient } from "redis";
import { PubMessage } from "../data_definitions/pub_sub";
import { ConfigService } from "./config_service";

export class PubSub  {

    private pub: RedisClient;
    private sub: RedisClient;
    private eventEmitter: EventEmitter;

    constructor(config: ConfigService, private channel: string = 'chat-message') {
        const clientOptions: ClientOpts = {
            host: config.get('redis_host', 'localhost'),
            port: config.get('redis_port', 6379)
        };

        this.pub = new RedisClient(clientOptions);
        this.sub = new RedisClient(clientOptions);
        this.eventEmitter = new EventEmitter();

    }

    subscribe(): EventEmitter {

        this.sub.on('message',  (channel, data) => {
            

            if (channel!=this.channel) return;

            try {

                let parsedData = PubMessage.fromJson(data)

                this.eventEmitter.emit('data', parsedData);

            } catch (err) {
                
                console.error(err);
                this.eventEmitter.emit('error', err)
            }

        })

        this.sub.subscribe(this.channel);

        return this.eventEmitter;
    }

    publish(value: PubMessage) {
        this.pub.publish(this.channel, value.toJSON());
    }

}