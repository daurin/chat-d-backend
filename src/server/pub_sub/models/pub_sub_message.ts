class PubSubMessage {
    readonly target?: string | undefined;
    readonly data: any;
    

    constructor(params: PubSubMessageParams) {
        this.target = params.target || undefined;
        this.data = params.data;
    }

    static fromJson(json: PubSubMessageParams): PubSubMessage {
        return new PubSubMessage(
            {
                target: json.target,
                data: json.data,
            }
        );

    }

    toJson(): Object {
        return {
            data: this.data,
            targets: this.target || undefined
        };
    }
}

interface PubSubMessageParams{
    readonly target?: string | undefined;
    readonly data: any;
}

export default PubSubMessage;