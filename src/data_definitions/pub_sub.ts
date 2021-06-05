export class PubMessage {
    target?: string;
    data: any;
    broadcast: boolean;

    constructor(params: { target?: string, data: any, broadcast?: boolean }) {
        this.target = params.target;
        this.data = params.data;
        this.broadcast = params.broadcast == null ? false : params.broadcast;
    }

    static fromJson(json: string): PubMessage {

        const parsedJson = JSON.parse(json);

        return new PubMessage(
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