export default class ConfigService {
    values: {[key:string]: any};

    constructor() {
        this.values = {};
        this.init();
    }

    async init() {
        //load values from environment or a file or a http service
        this.values = {
        }
    }

    get<T>(key:string, defaultValue:T): T {
        
        if(Object.keys(this.values).indexOf(key)!=-1) {
            return this.values[key];
        }

        if(!defaultValue) throw new Error(`${key} variable not configured correctly`);

        return defaultValue;
    }
}