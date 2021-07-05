import { MongoClient,Db} from 'mongodb';

export default class MongoDB {
    private static instance: MongoDB;

    private _client?: MongoClient;
    private _db?: Db;


    constructor() {
        if (MongoDB.instance == undefined)
            MongoDB.instance = this;
        return MongoDB.instance;
    }

    async connect(uri: string) {
        this._client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this._db=this._client.db(process.env.MONGO_DB_NAME);
    }
    async disconnect() {
        return this.client?.close();
    }

    get client():MongoClient|undefined{
        return this._client;
    }

    get Db():Db|undefined{
        return this._db;
    }
}