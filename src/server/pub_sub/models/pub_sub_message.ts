class PubSubMessage {
    target?: string | null;
    data: any;
    broadcast: boolean;

    constructor(params: { target?: string, data: any, broadcast?: boolean }) {
        this.target = params.target || null;
        this.data = params.data;
        this.broadcast = params.broadcast || false;
    }

    static fromJson(json: string): PubSubMessage {

        const parsedJson = JSON.parse(json);

        return new PubSubMessage(
            {
                target: parsedJson.target,
                data: parsedJson.data,
                broadcast: parsedJson.broadcast
            }
        );

    }

    toJSON(): string {
        return JSON.stringify({
            data: this.data,
            target: this.target,
            broadcast: this.broadcast
        });
    }
}

export default PubSubMessage;