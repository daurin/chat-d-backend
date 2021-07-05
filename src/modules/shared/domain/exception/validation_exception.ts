export class ValidationException extends Error{
    param:ValidationParam;

    constructor(param:ValidationParam){
        super('Bad param error');
        this.param=param;
        Object.setPrototypeOf(this, ValidationException.prototype);
    }
}

export class ValidationGroupException extends Error{
    params:Array<ValidationParam>;

    constructor(params:Array<ValidationParam>){
        super('Bad params error');
        this.params=params;
        Object.setPrototypeOf(this, ValidationGroupException.prototype);
    }
}

export interface ValidationParam{
    name:string;
    message?:string;
    type:string;
}