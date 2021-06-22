class PubSubMessage {
    readonly target?: string | undefined;
    readonly data: any;
    readonly type?: PubSubMessageType;
    

    constructor(params: PubSubMessageParams) {
        this.target = params.target || undefined;
        this.data = params.data;
        this.type = params.type ?? PubSubMessageType.User;
    }

    static fromJson(json: PubSubMessageParams): PubSubMessage {
        return new PubSubMessage(
            {
                target: json.target,
                data: json.data,
                type: json.type
            }
        );

    }

    toJson(): Object {
        return {
            data: this.data,
            targets: this.target || undefined,
            type: this.type
        };
    }
}

interface PubSubMessageParams{
    readonly target?: string | undefined;
    readonly data: any;
    readonly type?: PubSubMessageType;
}

export enum PubSubMessageType{
    User,
    Topic
}

export default PubSubMessage;